from manim import *


config.background_color = "#fffefa"
config.frame_width = 16
config.frame_height = 9
config.pixel_width = 1280
config.pixel_height = 720


INK = "#111111"
MUTED = "#68635d"
LINE = "#ded9d0"
SURFACE = "#fffefa"
SURFACE_2 = "#f6f5f2"
TEAL = "#c65f1e"
TEAL_SOFT = "#fff0e4"
CORAL = "#b03d28"
GOLD = "#9c5a00"
GOLD_SOFT = "#fff4d6"
GREEN = "#27664a"
GREEN_SOFT = "#eaf5ee"
HIDDEN = "#e8f4ed"


def label(text, size=28, color=INK, weight=BOLD, **kwargs):
    return Text(text, font="Segoe UI", font_size=size, color=color, weight=weight, **kwargs)


def caption(text):
    return label(text, size=23, color=MUTED, weight=MEDIUM).to_edge(DOWN, buff=0.35)


def pill(text, color=TEAL, fill=TEAL_SOFT, size=22):
    t = label(text, size=size, color=color, weight=BOLD)
    box = RoundedRectangle(
        corner_radius=0.16,
        width=t.width + 0.5,
        height=t.height + 0.25,
        stroke_color=color,
        stroke_width=2,
        fill_color=fill,
        fill_opacity=1,
    )
    return VGroup(box, t)


def formula_box(*lines, color=INK, fill=SURFACE_2, stroke=LINE, font_size=25, min_width=6.8):
    texts = VGroup(*[label(line, size=font_size, color=color, weight=MEDIUM) for line in lines])
    texts.arrange(DOWN, aligned_edge=LEFT, buff=0.16)
    box = RoundedRectangle(
        corner_radius=0.18,
        width=max(min_width, texts.width + 0.6),
        height=texts.height + 0.45,
        stroke_color=stroke,
        stroke_width=2,
        fill_color=fill,
        fill_opacity=1,
    )
    texts.move_to(box).align_to(box, LEFT).shift(RIGHT * 0.3)
    return VGroup(box, texts)


def node(text, kind="input", radius=0.42, width=None):
    fills = {
        "input": TEAL_SOFT,
        "hidden": HIDDEN,
        "output": GOLD_SOFT,
        "loss": SURFACE_2,
    }
    strokes = {
        "input": TEAL,
        "hidden": GREEN,
        "output": GOLD,
        "loss": MUTED,
    }
    if width:
        shape = RoundedRectangle(
            corner_radius=0.18,
            width=width,
            height=0.78,
            stroke_color=strokes.get(kind, INK),
            stroke_width=2.5,
            fill_color=fills.get(kind, SURFACE),
            fill_opacity=1,
        )
    else:
        shape = Circle(
            radius=radius,
            stroke_color=strokes.get(kind, INK),
            stroke_width=2.5,
            fill_color=fills.get(kind, SURFACE),
            fill_opacity=1,
        )
    text_mob = label(text, size=23 if len(text) < 5 else 20)
    return VGroup(shape, text_mob)


def edge(start, end, color=LINE, width=4, buff=0.42, dashed=False):
    klass = DashedLine if dashed else Line
    return klass(start, end, color=color, stroke_width=width, buff=buff)


def arrow_between(a, b, color=TEAL, buff=0.42):
    return Arrow(a.get_center(), b.get_center(), color=color, stroke_width=5, buff=buff, max_tip_length_to_length_ratio=0.12)


def pulse_on(line, dot_color=TEAL):
    dot = Dot(radius=0.07, color=dot_color)
    return dot, MoveAlongPath(dot, line, rate_func=smooth)


def tiny_network(include_loss=True):
    x = node("x=0.5", "input", radius=0.46).move_to(LEFT * 5.7 + UP * 0.15)
    h = node("h=0.2", "hidden", radius=0.46).move_to(LEFT * 2.3 + UP * 0.15)
    z1 = node("z1=0.12", "hidden", radius=0.46).move_to(RIGHT * 1.1 + UP * 1.25)
    z2 = node("z2=-0.10", "hidden", radius=0.46).move_to(RIGHT * 1.1 + DOWN * 0.95)
    loss = node("L=0.589", "output", width=1.75).move_to(RIGHT * 5.0 + UP * 0.15)
    edges = VGroup(
        edge(x.get_center(), h.get_center(), TEAL, 4),
        edge(h.get_center(), z1.get_center(), TEAL, 4),
        edge(h.get_center(), z2.get_center(), CORAL, 4),
        edge(z1.get_center(), loss.get_center(), LINE, 3),
        edge(z2.get_center(), loss.get_center(), LINE, 3),
    )
    values = VGroup(
        label("w1=0.4", size=21, color=MUTED).move_to((x.get_center() + h.get_center()) / 2 + UP * 0.38),
        label("w2=0.6", size=21, color=MUTED).move_to((h.get_center() + z1.get_center()) / 2 + UP * 0.38),
        label("w3=-0.5", size=21, color=MUTED).move_to((h.get_center() + z2.get_center()) / 2 + DOWN * 0.38),
        label("softmax + target", size=20, color=MUTED).next_to(loss, DOWN, buff=0.28),
    )
    parts = [edges, values, x, h, z1, z2]
    if include_loss:
        parts.append(loss)
    return VGroup(*parts), {"x": x, "h": h, "z1": z1, "z2": z2, "loss": loss, "edges": edges}


class Chapter4Scene(Scene):
    def title(self, text, kicker="Chapter 4 animation"):
        k = pill(kicker, color=GOLD, fill=GOLD_SOFT, size=18).to_corner(UL, buff=0.42)
        h = label(text, size=38, color=INK, weight=BOLD).next_to(k, DOWN, aligned_edge=LEFT, buff=0.24)
        self.play(FadeIn(k, shift=DOWN * 0.12), Write(h), run_time=0.9)
        return VGroup(k, h)

    def step_caption(self, old_caption, text):
        new_caption = caption(text)
        if old_caption is None:
            self.play(FadeIn(new_caption, shift=UP * 0.12), run_time=0.35)
        else:
            self.play(Transform(old_caption, new_caption), run_time=0.35)
            return old_caption
        return new_caption


class ForwardPassScene(Chapter4Scene):
    def construct(self):
        title = self.title("Forward pass: make one next-word guess")
        net, parts = tiny_network()
        net.shift(DOWN * 0.1)
        self.play(FadeIn(net, lag_ratio=0.08), run_time=1.0)

        cap = self.step_caption(None, "The signal only moves left to right: input -> hidden neuron -> word scores -> loss.")

        box = formula_box("1) Hidden value", "h = ReLU(x * w1)", "h = ReLU(0.5 * 0.4) = 0.2", font_size=24)
        box.to_edge(RIGHT, buff=0.62).shift(UP * 2.15)
        self.play(FadeIn(box, shift=LEFT * 0.2), Indicate(parts["h"], color=GREEN), run_time=0.9)
        dot, move = pulse_on(parts["edges"][0], TEAL)
        self.add(dot)
        self.play(move, run_time=1.0)
        self.play(FadeOut(dot), run_time=0.15)

        box2 = formula_box("2) Word scores", "z1 = h * w2 = 0.12", "z2 = h * w3 = -0.10", font_size=24)
        box2.move_to(box)
        self.play(Transform(box, box2), run_time=0.45)
        for line, color in [(parts["edges"][1], TEAL), (parts["edges"][2], CORAL)]:
            dot, move = pulse_on(line, color)
            self.add(dot)
            self.play(move, run_time=0.85)
            self.play(FadeOut(dot), run_time=0.1)
        self.play(Indicate(parts["z1"], color=TEAL), Indicate(parts["z2"], color=CORAL), run_time=0.7)

        box3 = formula_box("3) Softmax + loss", "q1 = 55.5%, q2 = 44.5%", "L = -ln(q1) = 0.589", font_size=24)
        box3.move_to(box)
        self.play(Transform(box, box3), run_time=0.45)
        for line in [parts["edges"][3], parts["edges"][4]]:
            dot, move = pulse_on(line, GOLD)
            self.add(dot)
            self.play(move, run_time=0.75)
            self.play(FadeOut(dot), run_time=0.1)
        self.play(Indicate(parts["loss"], color=GOLD), run_time=0.7)

        self.step_caption(cap, "Forward propagation is bookkeeping: every layer computes its number, then hands it to the next layer.")
        self.wait(1.2)


class SoftmaxLossScene(Chapter4Scene):
    def construct(self):
        self.title("Softmax and loss: turn scores into blame")
        logits = VGroup(
            pill("z1 = 0.12", color=TEAL, fill=TEAL_SOFT, size=24),
            pill("z2 = -0.10", color=CORAL, fill="#fff0eb", size=24),
        ).arrange(DOWN, buff=0.35).move_to(LEFT * 6.2 + UP * 0.65)

        exp_box = formula_box("Exponentiate", "e^0.12 = 1.127", "e^-0.10 = 0.905", font_size=23, min_width=3.7).move_to(LEFT * 3.0 + UP * 0.65)
        probs = VGroup(
            pill("q1 = 1.127 / 2.032 = 55.5%", color=GREEN, fill=GREEN_SOFT, size=22),
            pill("q2 = 0.905 / 2.032 = 44.5%", color=GOLD, fill=GOLD_SOFT, size=22),
        ).arrange(DOWN, buff=0.35).move_to(RIGHT * 1.25 + UP * 0.65)
        loss = formula_box("True word is word 1", "L = -ln(q1)", "L = -ln(0.555) = 0.589", font_size=23, min_width=3.8).move_to(RIGHT * 5.7 + UP * 0.65)

        flow = VGroup(
            Arrow(logits.get_right(), exp_box.get_left(), color=TEAL, stroke_width=5, buff=0.2),
            Arrow(exp_box.get_right(), probs.get_left(), color=TEAL, stroke_width=5, buff=0.2),
            Arrow(probs.get_right(), loss.get_left(), color=GOLD, stroke_width=5, buff=0.2),
        )

        cap = self.step_caption(None, "Softmax makes raw logits positive and normalizes them into probabilities.")
        self.play(FadeIn(logits, shift=UP * 0.1), run_time=0.55)
        self.play(GrowArrow(flow[0]), FadeIn(exp_box, shift=RIGHT * 0.15), run_time=0.8)
        self.play(GrowArrow(flow[1]), FadeIn(probs, shift=RIGHT * 0.15), run_time=0.8)
        self.step_caption(cap, "Cross-entropy looks only at the probability assigned to the true word.")
        self.play(GrowArrow(flow[2]), FadeIn(loss, shift=RIGHT * 0.15), run_time=0.8)

        blame = VGroup(
            formula_box("Blame = probability - target", "word 1: 0.555 - 1 = -0.445", "word 2: 0.445 - 0 = +0.445", font_size=25),
            label("Negative means: raise this score.", size=22, color=GREEN, weight=BOLD),
            label("Positive means: lower this score.", size=22, color=CORAL, weight=BOLD),
        ).arrange(DOWN, buff=0.22).to_edge(DOWN, buff=1.0)
        self.step_caption(cap, "That probability gap becomes the error signal backprop will send backward.")
        self.play(FadeIn(blame, shift=UP * 0.2), run_time=0.8)
        self.play(Indicate(blame[0], color=GOLD), run_time=0.8)
        self.wait(1.2)


class BackpropBlameScene(Chapter4Scene):
    def construct(self):
        self.title("Backpropagation: pass the blame backward")
        net, parts = tiny_network()
        net.shift(DOWN * 0.05)
        self.play(FadeIn(net, lag_ratio=0.06), run_time=0.9)

        cap = self.step_caption(None, "Start at the end: softmax gave word 1 too little confidence and word 2 too much.")

        back_edges = VGroup(
            Arrow(parts["loss"].get_center(), parts["z1"].get_center(), color=GOLD, stroke_width=5, buff=0.55, max_tip_length_to_length_ratio=0.12),
            Arrow(parts["loss"].get_center(), parts["z2"].get_center(), color=GOLD, stroke_width=5, buff=0.55, max_tip_length_to_length_ratio=0.12),
            Arrow(parts["z1"].get_center(), parts["h"].get_center(), color=GOLD, stroke_width=5, buff=0.55, max_tip_length_to_length_ratio=0.12),
            Arrow(parts["z2"].get_center(), parts["h"].get_center(), color=GOLD, stroke_width=5, buff=0.55, max_tip_length_to_length_ratio=0.12),
            Arrow(parts["h"].get_center(), parts["x"].get_center(), color=GOLD, stroke_width=5, buff=0.55, max_tip_length_to_length_ratio=0.12),
        )

        output_blame = formula_box("Output blame", "delta1 = q1 - y1 = -0.445", "delta2 = q2 - y2 = +0.445", color=GOLD, fill=GOLD_SOFT, stroke=GOLD, font_size=22, min_width=5.4)
        output_blame.to_edge(RIGHT, buff=0.55).shift(UP * 2.25)
        self.play(FadeIn(output_blame, shift=LEFT * 0.2), GrowArrow(back_edges[0]), GrowArrow(back_edges[1]), run_time=1.0)
        self.play(Indicate(parts["z1"], color=GOLD), Indicate(parts["z2"], color=GOLD), run_time=0.7)

        output_grad = formula_box("Output weight gradient", "dL/dw2 = delta1 * h", "dL/dw2 = -0.445 * 0.2 = -0.089", color=INK, fill=SURFACE_2, font_size=22, min_width=5.4)
        output_grad.move_to(output_blame)
        self.step_caption(cap, "For an output weight, multiply the arriving blame by the signal that fed the weight.")
        self.play(Transform(output_blame, output_grad), GrowArrow(back_edges[2]), run_time=0.8)

        hidden_blame = formula_box("Hidden blame gathers both paths", "(-0.445 * 0.6) + (0.445 * -0.5)", "= -0.4895", color=GOLD, fill=GOLD_SOFT, stroke=GOLD, font_size=22, min_width=5.4)
        hidden_blame.move_to(output_blame)
        self.step_caption(cap, "A hidden neuron is connected to both outputs, so it must add the blame from both paths.")
        self.play(Transform(output_blame, hidden_blame), GrowArrow(back_edges[3]), Indicate(parts["h"], color=GOLD), run_time=0.9)

        input_grad = formula_box("Hidden weight gradient", "ReLU gate = 1 because h input is positive", "dL/dw1 = -0.4895 * 1 * 0.5 = -0.245", color=INK, fill=SURFACE_2, font_size=21, min_width=5.4)
        input_grad.move_to(output_blame)
        self.step_caption(cap, "Then the activation gate and original input turn hidden blame into the gradient for w1.")
        self.play(Transform(output_blame, input_grad), GrowArrow(back_edges[4]), run_time=0.9)
        self.play(Indicate(parts["x"], color=TEAL), run_time=0.55)

        self.step_caption(cap, "Backprop is the chain rule in motion: local slope times arriving blame, one layer at a time.")
        self.wait(1.2)


class GradientUpdateScene(Chapter4Scene):
    def construct(self):
        self.title("Gradient descent: use the blame to move weights")

        rule = formula_box("Update rule", "new weight = old weight - eta * gradient", "eta = 0.1", font_size=27)
        rule.to_edge(UP, buff=1.55)

        w1_old = pill("w1: 0.4000", color=TEAL, fill=TEAL_SOFT, size=24).move_to(LEFT * 4.3 + UP * 0.25)
        w1_new = pill("w1 -> 0.4245", color=GREEN, fill=GREEN_SOFT, size=24).move_to(RIGHT * 4.3 + UP * 0.25)
        w1_grad = label("gradient dL/dw1 = -0.245", size=22, color=MUTED, weight=MEDIUM).move_to(UP * -0.25)
        w1 = VGroup(w1_old, w1_grad, w1_new)

        w2_old = pill("w2: 0.6000", color=TEAL, fill=TEAL_SOFT, size=24).move_to(LEFT * 4.3 + DOWN * 1.25)
        w2_new = pill("w2 -> 0.6089", color=GREEN, fill=GREEN_SOFT, size=24).move_to(RIGHT * 4.3 + DOWN * 1.25)
        w2_grad = label("gradient dL/dw2 = -0.089", size=22, color=MUTED, weight=MEDIUM).move_to(DOWN * 1.75)
        w2 = VGroup(w2_old, w2_grad, w2_new)

        arrows = VGroup(
            Arrow(w1_old.get_right(), w1_new.get_left(), color=GREEN, stroke_width=5, buff=0.18, max_tip_length_to_length_ratio=0.08),
            Arrow(w2_old.get_right(), w2_new.get_left(), color=GREEN, stroke_width=5, buff=0.18, max_tip_length_to_length_ratio=0.08),
        )

        cap = self.step_caption(None, "The gradient points uphill. Gradient descent subtracts it to step downhill.")
        self.play(FadeIn(rule, shift=DOWN * 0.12), run_time=0.7)
        self.play(FadeIn(w1[0], w1[1], shift=RIGHT * 0.15), run_time=0.5)
        self.play(GrowArrow(arrows[0]), FadeIn(w1[2], shift=RIGHT * 0.15), run_time=0.65)
        self.play(FadeIn(w2[0], w2[1], shift=RIGHT * 0.15), run_time=0.5)
        self.play(GrowArrow(arrows[1]), FadeIn(w2[2], shift=RIGHT * 0.15), run_time=0.65)

        before = VGroup(
            label("Before step", size=22, color=MUTED, weight=BOLD),
            pill("q(true word) = 55.5%", color=GOLD, fill=GOLD_SOFT, size=23),
            pill("loss = 0.589", color=CORAL, fill="#fff0eb", size=23),
        ).arrange(DOWN, buff=0.2).move_to(LEFT * 3.5 + DOWN * 2.55)
        after = VGroup(
            label("After one tiny step", size=22, color=MUTED, weight=BOLD),
            pill("true-word score nudges up", color=GREEN, fill=GREEN_SOFT, size=23),
            pill("loss nudges down", color=GREEN, fill=GREEN_SOFT, size=23),
        ).arrange(DOWN, buff=0.2).move_to(RIGHT * 3.5 + DOWN * 2.55)
        self.step_caption(cap, "A negative gradient increases the weight, so the correct word gets a stronger path next time.")
        self.play(FadeIn(before, shift=UP * 0.15), run_time=0.45)
        self.play(TransformFromCopy(before, after), run_time=0.9)
        self.play(Indicate(after, color=GREEN), run_time=0.75)
        self.step_caption(cap, "Training repeats this same tiny move for many examples until the model's guesses improve.")
        self.wait(1.2)
