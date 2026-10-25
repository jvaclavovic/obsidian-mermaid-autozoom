/* Mermaid Autozoom – fits wide Mermaid diagrams to the page; click opens the diagram
   at 100 % in an overlay over the current window. Click or Esc closes it. */
const { Plugin } = require("obsidian");

const ZOOM_STEP = 1.2;

function naturalSize(svg) {
  const vb = svg.viewBox && svg.viewBox.baseVal;
  if (vb && vb.width > 0 && vb.height > 0) return { w: vb.width, h: vb.height };
  const r = svg.getBoundingClientRect();
  return { w: r.width || 800, h: r.height || 600 };
}

module.exports = class MermaidAutozoomPlugin extends Plugin {
  async onload() {
    this.overlays = new Set();
    this.attachTo(document);
    this.registerEvent(this.app.workspace.on("window-open", (win) => this.attachTo(win.doc)));
  }

  attachTo(doc) {
    // stop mousedown so Live Preview does not switch the block into source editing
    this.registerDomEvent(doc, "mousedown", (e) => {
      if (this.diagramFromEvent(e)) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    this.registerDomEvent(doc, "click", (e) => {
      const svg = this.diagramFromEvent(e);
      if (!svg) return;
      e.preventDefault();
      e.stopPropagation();
      this.openOverlay(doc, svg);
    }, true);
  }

  diagramFromEvent(e) {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return null;
    const t = e.target;
    if (!(t instanceof Element)) return null;
    if (t.closest(".mermaid-autozoom-overlay")) return null;   // already inside the overlay
    if (t.closest("button, .clickable-icon, .edit-block-button, .mermaid-zoom-inline-controls")) return null;
    const box = t.closest(".mermaid");
    if (!box || box.classList.contains("mermaid-zoom-scaled")) return null;
    return box.querySelector(":scope > svg");
  }

  openOverlay(doc, sourceSvg) {
    const size = naturalSize(sourceSvg);
    let zoom = 1;

    const overlay = doc.body.createDiv({ cls: "mermaid-autozoom-overlay" });
    const frame = overlay.createDiv({ cls: "mermaid-autozoom-frame" });
    const box = frame.createDiv({ cls: "mermaid" });
    const svg = sourceSvg.cloneNode(true);
    box.appendChild(svg);

    const applyZoom = () => {
      svg.setAttribute("width", String(Math.round(size.w * zoom)));
      svg.setAttribute("height", String(Math.round(size.h * zoom)));
    };
    applyZoom();

    const close = () => {
      overlay.remove();
      doc.removeEventListener("keydown", onKey, true);
      this.overlays.delete(close);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    };

    // pinch with two fingers = zoom (touch devices)
    let pinch = null;
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    overlay.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) pinch = { d: dist(e.touches), z: zoom };
    }, { passive: true });
    overlay.addEventListener("touchmove", (e) => {
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      zoom = Math.min(8, Math.max(0.1, pinch.z * dist(e.touches) / pinch.d));
      applyZoom();
    }, { passive: false });
    overlay.addEventListener("touchend", (e) => {
      if (e.touches.length < 2) pinch = null;
    }, { passive: true });

    overlay.addEventListener("click", close);
    overlay.addEventListener("wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;     // plain wheel scrolls a large diagram
      e.preventDefault();
      zoom = Math.min(8, Math.max(0.1, zoom * (e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP)));
      applyZoom();
    }, { passive: false });
    doc.addEventListener("keydown", onKey, true);
    this.overlays.add(close);
  }

  onunload() {
    for (const close of Array.from(this.overlays)) close();
  }
};
