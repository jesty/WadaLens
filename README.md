# Wada Lens

**Wada Lens** is a mobile-first, English-language progressive web app (PWA) for finding colors from fabric photos, choosing a Sanzo Wada color directly, exploring historical color combinations, and trying the palettes on editable fashion croquis in **Dress Me**.

**Created by Davide Cerbo (aka Jesty).**  
Source: https://github.com/jesty/WadaLens  
License: **MIT** (see [LICENSE](LICENSE)); historical color-data credits: [CREDITS.md](CREDITS.md).

## Features

- Take a photo or choose an image of fabric, optionally calibrating with a photographic gray card.
- Choose a historical Sanzo Wada color directly from the color picker.
- Find a closest Wada color, then browse Volume 1 historical combinations (159 color shades and 348 combinations).
- Use Dress Me to recolor selected men’s and women’s outfits, with stripes, checks, polka dots, and free drawing.
- Export the illustration to PNG.
- Mobile-friendly PWA with a service worker for app assets.

> **Accuracy note:** Screen colors and photographic color matching are approximate and are not a replacement for calibrated textile measurement. The historical combination metadata is fetched online and may require an internet connection on the first visit.

## Run locally

No Node.js, package installation, or build step is required. You need a modern browser and a small local HTTP server.

1. Clone or download this repository, keeping `index.html`, `app.js`, `sw.js`, `manifest.webmanifest`, and the `assets/` directory together.
2. Open a terminal **in the repository root** (the directory containing `index.html`).
3. Start a local server:

   ```bash
   python3 -m http.server 8000
   ```

4. Open **http://localhost:8000/** in Chrome, Safari, or another current browser.
5. To stop the server, press **Ctrl+C** in the terminal.

Do **not** open `index.html` directly with a `file://` URL. Browser security restrictions can prevent images, canvas operations, and PWA features from working correctly that way. If port 8000 is occupied, run `python3 -m http.server 8080` and visit `http://localhost:8080/` instead.

## Publish to GitHub Pages

The repository is already structured for GitHub Pages: **`index.html` is in the repository root** and static assets use relative paths. No build step or GitHub Actions workflow is needed.

1. Create the repository **`jesty/WadaLens`** on GitHub (or use the one you already created).
2. Place **the contents of this folder** in the repository root — **not** inside an additional `wada-v30/` subfolder.
3. Commit and push your project to the `main` branch, for example:

   ```bash
   git init
   git add .
   git commit -m "Publish Wada Lens under MIT license"
   git branch -M main
   git remote add origin https://github.com/jesty/WadaLens.git
   git push -u origin main
   ```

   If the repository is **already cloned and has a remote**, skip `git init` and `git remote add`, then simply `git add .`, `git commit ...`, and `git push`.

4. On GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Choose branch **`main`**, directory **`/(root)`**, and **Save**.
7. Once GitHub finishes deploying, open **https://jesty.github.io/WadaLens/**.

> If the Pages website shows an older version, hard-refresh it and, if needed, clear the site’s cached data/service worker from browser settings. Camera capture and PWA installation typically require HTTPS or localhost, both of which are covered by the two options above.

## Project structure

```text
WadaLens/
├── index.html              # Main UI
├── app.js                  # App logic
├── sw.js                   # Service worker
├── manifest.webmanifest    # Installable PWA metadata
├── assets/                 # Illustration and mask assets
├── development/            # Illustration/mask-generation scripts
├── icon.svg                # Branding and icons
├── icon-192.png
├── icon-512.png
├── apple-touch-icon.png
├── LICENSE                 # MIT license for Wada Lens
├── CREDITS.md              # Historical color-data attribution
├── .nojekyll               # Serve static files directly on GitHub Pages
└── README.md               # Instructions and documentation
```

## Data sources & licenses

This app uses digitized color data that originates with Sanzo Wada’s *A Dictionary of Color Combinations*. See [CREDITS.md](CREDITS.md) for attribution to Dain M. Blodorn Kim and Matt DesLauriers and links to their respective MIT licenses. Wada Lens is an independent project, not an official publication of the historical book.

The color dataset is loaded from external public URLs at runtime; if those sources are offline or block cross-origin requests, the historical combination list may not load. This is separate from GitHub Pages hosting.

## Limitations

- Photography and canvas editing need to be tested in the browsers/devices you target.
- A few illustrated outfit variants may still differ in fidelity; source files and masks are shipped as-is.
- The app does not include the second volume’s dataset.
- GitHub Pages serves static files; it cannot process private data server-side. Fabric photos are processed locally on the device.

## License

MIT — Copyright (c) 2026 Davide Cerbo (Jesty). See [`LICENSE`](LICENSE). Separate third-party attributions are documented in [`CREDITS.md`](CREDITS.md).
