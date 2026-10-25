# Mermaid Autozoom

An [Obsidian](https://obsidian.md) plugin that keeps wide Mermaid diagrams readable.

- **Fits to the page** – a Mermaid diagram wider than the note shrinks to the page width. Smaller diagrams keep their natural size (they are never enlarged).
- **Click to view at 100 %** – click a diagram to open it at its natural size in an overlay over the current window.
  - Large diagrams can be scrolled with the mouse wheel / trackpad.
  - <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + wheel zooms in and out; on touch devices pinch with two fingers.
  - Click / tap anywhere or press <kbd>Esc</kbd> to close.

Works in Reading view and Live Preview. In Live Preview, clicking the diagram opens the overlay instead of switching the block to source editing – use the code block's edit button (`</>`) to edit the diagram source.

Clicks with a modifier key (<kbd>Cmd</kbd>, <kbd>Ctrl</kbd>, <kbd>Alt</kbd>, <kbd>Shift</kbd>) are ignored, so they keep their default behaviour.

## Compatibility

- Desktop and mobile.

## Installation

### From Community plugins

1. Open **Settings → Community plugins → Browse**.
2. Search for **Mermaid Autozoom**, select **Install**, then **Enable**.

### Manually

1. Download `main.js`, `manifest.json` and `styles.css` from the [latest release](../../releases/latest).
2. Copy them to `<your vault>/.obsidian/plugins/mermaid-autozoom/`.
3. Reload Obsidian and enable **Mermaid Autozoom** in **Settings → Community plugins**.

## License

[MIT](LICENSE)
