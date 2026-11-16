# WadaLens — Photographic garment layers (v2)

**Experimental branch:** `experiment/photorealistic-asset-layers-v2`, created from the merged `main`. The approved illustrated renderer is unchanged.

## Try in the browser

Open `index.html?photoLayers=1` from this branch. Select any Wada combination and click **Dress Me**. The **Photographic view / Illustrated view** button is positioned at the bottom-right corner of the actual figurine preview. Switch views without losing garment colors, textures or options.

The view choice is included in the shareable outfit URL; refresh restores it.

## Photographic assets

All assets live in `assets/photorealistic-layers/`, independently from the original illustrated assets. There are exactly **eight WebP files with a genuine alpha channel**:

| File | Source |
|---|---|
| `tee.webp` | User-provided peach T-shirt, white converted to transparent |
| `jacket.webp` | User-provided orange blazer, original transparent PNG converted to WebP |
| `trousers.webp` | User-provided yellow trousers, white converted to transparent |
| `tie.webp` | User-provided yellow tie, white converted to transparent |
| `shirt.webp` | Existing photographic shirt reference (upscaled) |
| `skirt.webp` | Existing photographic skirt reference (upscaled) |
| `shoes.webp` | Existing photographic sneaker reference (upscaled) |
| `scarf.webp` | Photo-textured draped silk study using fabric from the T-shirt example |

No all-in-one full-body photograph is used in this renderer.

## The overlapping layers

`photo-layered.js` renders each garment photograph separately. For each piece it:
1. Loads the standalone WebP photograph;
2. Loads its corresponding existing, already registered 1086×1448 SVG garment silhouette for the current man or woman model;
3. Maps the photograph's fabric details to that silhouette;
4. Applies the selected Wada color while retaining photographic folds, light and shadow;
5. Clips the result **to the original SVG alpha**; and
6. Draws it with the existing layering/registration rules, so jacket, top, trousers, accessories and shoes can overlap.

The original illustrated renderer and interaction handlers still handle garment selection, Wada palette, skin/hair colors, denim and other fabric patterns.

## Known limitation

This is the first working **photographic clothing** experiment, not a fully photorealistic human. The existing illustrated body, facial features, hands, skin and hair remain visible behind the photo-textured garment layers. Mapping independent source photos into the illustration's precise silhouettes preserves overlap but does not produce physically correct folds around every seam; this is the part to refine after browser testing.

Only this experimental branch is modified. No PR or merge into `main` is included.
