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
- Export or share the illustrated outfit as a PNG.
- Optional **AI Fashion Preview**: generate a photorealistic image from the current illustrated outfit through Puter.js (image-to-image), then save or share it. No Wada Lens backend or API key is required.
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
2. Place **the contents of this folder** in the repository root — **not** inside an additional `wada-v31/` subfolder.
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


## Custom colors and denim textures (v32)

In Dress Me, choose a custom color with the native color picker and press **Add color**. It becomes an additional palette choice for garments and remains until a different Wada combination is selected.

Use the **Colors** / **Denim** tabs to choose either a solid color or one of eight denim samples for each garment. Denim samples were cropped from the image supplied by the project author; actual image texture is repeated within the garment mask. The assets are located in `assets/denim/`.


## Sharing outfits (v33)

In **Dress Me**, select **Share outfit** to send the current outfit PNG through the phone's native share sheet (WhatsApp, Messages and other compatible apps). The app does not upload the image to a server. On browsers without native file sharing, the PNG is downloaded for manual attachment. **Save outfit as PNG** remains available separately. Native sharing typically requires HTTPS (GitHub Pages provides it) or localhost. Sharing targets depend on the user's device and installed applications.


## Optional AI Fashion Preview (Puter.js)

The AI image generation feature is optional and is **not** part of local fabric color analysis. After selecting a Wada combination and configuring an outfit, open **AI Fashion Preview** in Dress Me. The application then loads the Puter.js SDK from `https://js.puter.com/v2/`. Connect your Puter account, approve the consent checkbox, and select **Generate realistic look**.

Wada Lens sends the current outfit PNG and a text description of the clothes/colors to Puter and its selected AI model provider. This may consume the user's AI allowance or incur charges on their Puter account; no billing is handled by Wada Lens. No developer API key, proxy, or Wada Lens server is necessary. The model tries to preserve clothing categories, colors and fabric textures, but generated output is **not an exact replica**.

**Requirements:** Internet connection, Puter authentication and usage allowance/credits, modern browser, and `https://` (GitHub Pages) or `http://localhost` origin. AI is not available through `file://`. Generated images are shown inside the app; if the provider returns a remote image URL with cross-origin restrictions, use **Open image** to save or share it manually. The optional AI provider is external and is not covered by Wada Lens's offline PWA guarantee.

Puter.js API reference: https://docs.puter.com/AI/txt2img/
Puter user-pays model: https://docs.puter.com/user-pays-model/


## AI Fashion Preview providers (v41)

The default option is **ChatGPT**: an external tab opens with the outfit description in the URL. The user manually attaches the exported outfit PNG. This URL prefill is undocumented and may stop working; **Copy prompt** and **Download outfit PNG** are reliable fallbacks.

**Gemini** opens at `gemini.google.com/app`. A reliable native URL-prefill is not documented, so Wada Lens attempts to copy the prompt to the clipboard; the user pastes it and attaches the PNG manually.

**Puter** remains an optional in-app image generator, using the user's Puter account and AI credits after their explicit consent. Neither ChatGPT nor Gemini requires Wada Lens to store API keys or receive generated images.


## v41 notes

- Restored the illustrated renderer for jacket-based looks.
- This fixes the oversized trouser/skirt shapes introduced by the modular fallback.
- Small jacket/collar mask imperfections may still remain and can be refined in a later pass.

- v41: the male `T-shirt + jacket + trousers` figurine now reuses the stable `Shirt + jacket + trousers` illustrated base, changing only the inner top layer so trousers and jacket stay aligned.

- v41: fixed the woman `T-shirt + jacket` figurines by reusing the stable `shirt + jacket` bases and swapping only the inner tee layer, so sleeves and arms no longer drift outside the body.

- v41: aligned `woman → shirt + jacket → trousers` to the same trouser silhouette used by the other woman trouser looks by reusing the stable bottom mask.

- v41: tightened the woman `T-shirt + jacket + trousers` jacket mask so sleeves stay on the arms, and reused the stable woman trouser mask to remove the distorted side fill.
