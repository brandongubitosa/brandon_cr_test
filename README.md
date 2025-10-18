# Apple Shop (local preview)

This folder contains a small demo storefront. Files were modularized so styles and JS are external.

Preview locally with Python's simple HTTP server (from the project root):

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000/ in your browser
```

Files of interest:
- `index.html` — main HTML file
- `css/styles.css` — externalized CSS
- `js/app.js` — externalized JS

The original duplicate file with a trailing `!` was removed to avoid confusion.
