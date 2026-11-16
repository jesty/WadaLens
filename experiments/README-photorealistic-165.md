# Photorealistic WadaLens — Combination #165

A browser-testable **photographic proof of concept**, isolated from `main`.

## Try it inside Dress Me

Open the experimental branch in a browser that serves its HTML and assets (for example, the raw.githack.com development preview) with:

`index.html?photo165=1`

Alternatively select a color from Volume I **Combination #165**, click **Dress Me**, then choose **Try photorealistic #165**. Switch **Model** between man and woman to see both generated looks. Use **Back to illustration** to return to the original editable renderer.

## Exact WadaLens palette

| Color | HEX | Preset garment |
|---|---|---|
| Cameo Pink | `#E6ADCF` | T-shirt |
| Spinel Red | `#FF4DC9` | Blazer |
| Vistoris Lake | `#5C2C45` | Trousers |

White sneakers and medium skin/dark-brown hair are used in the fixed full-body photo look.

## Native repository assets

- `assets/photorealistic/combination-165/man-look.webp` — pre-rendered photographic full-body male look.
- `assets/photorealistic/combination-165/woman-look.webp` — pre-rendered photographic full-body female look.
- `assets/photorealistic/combination-165/garments-165.webp` — six native alpha-channel garment images as a sprite, visible in the Dress Me photo experiment.
- `assets/photorealistic/combination-165/manifest.json` — colors and dimensions.
- `experiments/photorealistic-165.html` — independent asset gallery.

## Scope

The new photo preview is **not an editable photographic layering engine**. It is a fixed native full-body photograph per model for the one supported outfit. Other garment choices, patterns, hair colors and shoe colors continue to render with the existing illustrated engine; clicking the photo button restores the photographic preset. Garment sprite cells are individually photographic but are not accurately registered to the body pose. This avoids pretending that a still photo changes when only a user control changes.

No other combinations or the stable `main` branch were modified. Browser-level rendering should be visually checked before opening or merging a PR.

## Browser-ready prototype (native assets)

- **Standalone interactive photo studio:** [experiments/photorealistic-165-live.html](photorealistic-165-live.html), with man/woman switching, photo download and shareable preview URLs.
- **Full WadaLens experiment:** [index.html?photo165=1](../index.html?photo165=1). Open this directly to select Combination #165 and its photo preset in Dress Me without manually choosing a Wada color. Use `?photo165=1&gender=woman` to begin with the female model.
- The experimental home page also includes a **Try Photo #165 in Dress Me** shortcut.
- All photo files are bundled under `assets/photorealistic/combination-165/`; no image-generation service is needed at runtime.
- The photo mode is a **fixed photographic preset** for each model. Recoloring clothes, changing the hairstyle, or combining items independently is still handled by the original illustrated renderer; the photographic garment sprite is a reference catalogue and not yet registered to the model's pose.

You can preview branch pages through a static branch-hosting service such as raw.githack, since GitHub Pages normally publishes its configured deployment branch rather than this experimental branch. Never merge this experiment into `main` before checking both models in a browser.
