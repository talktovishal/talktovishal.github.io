const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const [url, outputPath, chromePath] = process.argv.slice(2);
if (!url || !outputPath || !chromePath) {
  console.error("Usage: node chapter-4-pdf-build.cjs <url> <output-path> <chrome-path>");
  process.exit(2);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function fetchJson(urlToFetch, options) {
  const response = await fetch(urlToFetch, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${urlToFetch}`);
  return response.json();
}

async function waitForEndpoint(port, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      return await fetchJson(`http://127.0.0.1:${port}/json/version`);
    } catch (error) {
      await delay(100);
    }
  }
  throw new Error("Chrome DevTools did not become ready in time.");
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function waitForPrintReady(cdp, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { result, exceptionDetails } = await cdp.send("Runtime.evaluate", {
      expression: `(() => ({
        ready: document.documentElement.dataset.printReady === "true",
        title: document.title,
        href: location.href,
        outputChildren: document.getElementById("printContent")?.children.length || 0,
        states: document.querySelectorAll(".print-state").length,
        worksheet: document.querySelectorAll(".print-worksheet-step").length,
        failure: document.querySelector(".print-failure")?.innerText || ""
      }))()`,
      returnByValue: true
    });
    if (exceptionDetails) throw new Error(exceptionDetails.text || "Print readiness evaluation failed.");
    const status = result.value;
    if (status.failure) throw new Error(status.failure);
    if (status.ready) {
      if (status.states !== 13 || status.worksheet !== 13) {
        throw new Error(`Print companion at ${status.href} was marked ready with ${status.outputChildren} output children, ${status.states} transition states, and ${status.worksheet} worksheet steps; expected 3, 13, and 13.`);
      }
      return status;
    }
    await delay(250);
  }
  throw new Error("The print companion did not signal readiness in time.");
}

async function main() {
  const port = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "chapter-4-pdf-"));
  let chrome;
  let cdp;

  try {
    chrome = spawn(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "about:blank"
    ], { stdio: ["ignore", "ignore", "pipe"] });

    let chromeErrors = "";
    chrome.stderr.on("data", (chunk) => { chromeErrors += chunk.toString(); });
    chrome.on("exit", (code) => {
      if (code && !cdp) console.error(chromeErrors.trim());
    });

    await waitForEndpoint(port);
    const target = await fetchJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
    cdp = new CdpClient(target.webSocketDebuggerUrl);
    await cdp.open();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setEmulatedMedia", { media: "print" });

    const status = await waitForPrintReady(cdp);
    const { data } = await cdp.send("Page.printToPDF", {
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      generateTaggedPDF: true,
      generateDocumentOutline: true
    });

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(data, "base64"));
    const size = fs.statSync(outputPath).size;
    console.log(`Printed ${status.states} transition states and ${status.worksheet} worksheet solutions to ${outputPath} (${(size / 1048576).toFixed(2)} MB).`);
  } finally {
    try {
      if (cdp) await cdp.send("Browser.close");
    } catch (error) {
      // Chrome may close the socket before acknowledging Browser.close.
    }
    cdp?.close();
    if (chrome && !chrome.killed) chrome.kill();
    try {
      fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch (error) {
      // Chrome can hold profile files briefly after Browser.close on Windows.
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
