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


## v43 — Denim texture cleanup

All eight denim textures have been cropped to the fabric itself, removing leftover white UI margins and labels from the source screenshot. The images are opaque JPEG files and are still tiled within the selected garment masks. Existing patterns, custom colors, and AI provider options remain unchanged.

## v43 — Woman jacket / neckline adjustments

- Woman T-shirt + jacket (trousers and skirt): the shirt collar is replaced with the matching T-shirt's round neckline.
- Woman shirt + jacket + trousers: the jacket mask is shared with the corrected T-shirt + jacket + trousers model.
- Jacket masks preserve the neck opening so garment color does not spill over the collar.
- The established trouser/skirt masks are unchanged.
- Retains all eight denim texture crops from v42.


## Garment-first Dress Me editor (v44)

Tap an item on the croquis (or use the accessible garment shortcuts above it) to open a drawer / mobile bottom sheet with color, denim, patterns, Free Draw and custom colors for **that item only**. Shoes are editable from the same drawer. Close with ×, tapping outside or Escape. The original palette, outfit export, social sharing and AI providers remain available.


## Experimental male precolored layers (branch only)

The branch \`experiment/man-precolored-layers\` uses a separate renderer for male T-shirt, shirt, jacket and trouser outfits. All 159 original Wada colors have pre-generated transparent SVG files for trousers, tee, shirt, jacket, tie and scarf (954 solid-color assets); these are aligned to a common 1086×1448 canvas. The new renderer composites the already colored garment files rather than painting large colored rectangles over the editorial model.

Polka dots, stripes, checks, animal prints, floral, paisley, houndstooth, denim and freehand strokes are applied as dynamic overlays clipped by the corresponding exact same garment layer alpha. Custom and imported Volume 2 colors use a fallback generated from the identical vector silhouette. The original women's renderer and all other features are unchanged. Set \`USE_LAYERED_MAN_RENDER\` to \`false\` in \`man-layered.js\` to compare with the existing male renderer.

SVG was chosen instead of duplicate PNGs to keep all 954 precolored assets small, transparent and sharp; the file is still a precolored, independently composited garment layer. These extra 954 images are fetched and cached on demand (not all precached on PWA install). This is experimental: detailed visual alignment, torso/jacket masking and device testing are still required before merging.

### Approved shirt and jacket designs (experiment 2)
The first approved single-breasted blazer and second approved classic shirt have been rebuilt as aligned transparent, precolored SVG garment layers for all 159 Wada colors. The new blazer includes shaped notch lapels, chest welt pocket, two front flap pockets, seam details, and two unfilled button outlines; the shirt includes a pointed collar, button placket and six unfilled button outlines. Their source silhouettes were traced and simplified from the approved artwork and aligned to the 1086×1448 male canvas. The original approved concept PNGs are not embedded; this is an SVG adaptation for compositing. Detail drawings are separate from color fills. Skin and hair recoloring now happens behind the garment layers. Review the alignment on the branch before merging.

### Experiment 3: registration and shoes
Male shirt and jacket layers now use per-garment registration transforms, the shirt's upper neck fill is cut away so skin is visible, and old garment outlines on the baked-in editorial base are neutralized before compositing independent layers. The hand regions are restored above cuff layers. Shoe color and patterns now use a full two-shoe vector clipping path with original lace/outline texture applied on top, replacing the old toe-only shoes mask. The tee SVG is unchanged. Check edge alignment and footwear silhouettes on real devices before merging.

### Experiment 4 — consistent male body, hands and complete shoes
All four male looks now align to one canonical `man-tee-trousers` body, avoiding the previous shirt/jacket template offset. The approved T-shirt SVG and T-shirt-only base draw remain unchanged. For shirt/jacket combinations, an offscreen alpha-isolated body and skin/hair tint are rendered before the independently colored garments, so old white garment outlines no longer double the new drawings. The problematic second hand pass above jacket sleeves has been removed. Full-shoe clipped paths are traced to the canonical source footwear (including the full toe and outsole), and the original lace/sole art is multiplied within their bounds. This remains an experimental branch: verify final silhouette and pattern masks visually before merging.

### Experiment 6 — user-calibrated registration and footwear crop
Applied user-confirmed alignment: shirt (dx=3,dy=-29,sx=.99,sy=1), jacket (dx=9,dy=-17,sx=1,sy=1.005), tie (dx=0,dy=-35,sx=1,sy=1), scarf (dx=6,dy=-12,sx=1,sy=1), shoes (identity). Male experimental renderer uses a dedicated lower mask at y=1280 instead of the generic y=1238 swatch crop, exposing the shoe toes and soles while preserving the legacy renderer unchanged for women.


## Experiment 46: female modular precolored garments
Eight independent female garment shapes (tee, shirt, jacket, trousers, knee skirt, shoes, tie, scarf) are now stored as 159 transparent, precolored SVGs each: 1,272 new colored layers plus separate detail files. They use canonical women tee/trouser or tee/skirt illustrations for skin, hair and visible limbs, without any baked-in original garments. Existing polka dots, stripes, denim, free-draw strokes and other patterns remain dynamic and are masked by the corresponding colored layer's alpha. Each garment has independent dx/dy/sx/sy values in \`woman-layered.js\`; use Chrome DevTools for visual calibration. The existing male renderer, woman legacy image assets and \`main\` are untouched. This is an experiment: detailed alignment is not yet user-calibrated.


## Woman test outfit (?womanDemo=1)
The experiment now includes one deliberately selected female look with a redesigned classic pointed-collar shirt (Fawn \`#D1B0B3\`), fitted single-button blazer with notched lapels (Vinaceous Cinnamon \`#F59994\`), trousers (Ivory Buff \`#EBD999\`) and white shoes (\`#FFFFFF\`). The chosen Wada SVG fills and matching demonstration-specific detail overlays are enabled only when loading the experimental app with \`?womanDemo=1\`. All other 159-color variants keep their existing detail layers. Visual alignment should be checked in a browser and calibrated using \`development/woman-alignment-console.js\`.


## Experiment 46-exp3: repaired woman jacket (all Wada colors)
All 159 precolored female jacket SVGs now derive from the SAME two continuous, opaque blazer panels. The open V neck remains transparent to show the shirt. The collar/notched lapels and pocket flaps use a single shared detail file with very thin (1.45 SVG unit) ivory-white lapel accents, instead of transparent gaps. The active female demo jacket is now Dusky Madder Violet (#2D0060) over Fawn (#D1B0B3) shirt, with Ivory Buff trousers and white shoes. The prior demo-specific jacket details are no longer used. Female garments other than jacket are unchanged. This is still an experimental, browser-alignment-test branch.


### Experiment 46-exp4 — real folded lapels on women’s jackets
Every one of the 159 women's jacket color SVGs now contains **two separately filled, tonal folded notched lapel surfaces** rather than strokes placed directly on the body. The fabric fold is highlighted or shaded automatically depending on the Wada color, while the open V remains truly transparent. Shared dark construction outlines and 1px pale seams show the lapel edges. Only the woman's jacket SVG set and its detail file changed; men's jacket assets, all shirts, and other garments were not touched. Review in the experimental woman demo before merging.


### Experiment 46-exp5 — complete female jacket front from visual reference
The women’s jacket has been restructured after review of the user’s jacket reference. The neckline remains open at the top, while the colored fabric now meets at the front button line and closes the former hole in the chest/waist. Folded, notched lapels are full independent colored fabric polygons, with clearly defined dark outlines and fine ivory decorative strokes; buttons remain hollow circles. Minor joining fabric behind the collar notches prevents unwanted transparent triangles. All 159 Wada-colored female jacket SVGs were rebuilt from the identical template. No changes to the male garment SVGs or other female garments.


### Experiment 46-exp6 — approved single-color female blazer
All 159 female blazer variants use a shared, fitted, single-color silhouette (including the approved #2D0060 violet); the only transparent body region is the upper V neckline, with the front closed beneath. Proper notched lapels are indicated by very thin shared white line art, not a second fabric color. Hollow outlined buttons, flap pockets and rounded hems follow the reference. All 159 color SVGs plus the single shared details.svg were regenerated; male garments and other female assets were not changed.


### Experiment 46-exp7: approved woman blazer directly traced, not redesigned
The 159 female blazer SVG fills now share the exact polygon outline traced from the approved violet preview (source width 1194×1317), uniformly scaled/registered into the 1086×1448 woman figurine canvas. The notched lapels are separate outline paths from the same approved image, not tinted triangles; deep V neckline is transparent, fabric is one solid color, and the two button circles are unfilled. Male SVG assets are unchanged. This is a geometric trace of the approved preview, not a new invented jacket shape.
