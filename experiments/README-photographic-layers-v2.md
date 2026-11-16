# WadaLens · Photographic garment layers v2

This branch starts from `main` and keeps the existing WadaLens illustrated renderer and its exact layer registrations intact.

## Browser test
Open `index.html?photoLayers=1` on the experimental branch, then choose any original Wada color combination and click **Dress Me**. A button at the **bottom right of the figurine** switches between *Photographic view* and *Illustrated view*.

The button is part of the existing Dress Me UI, not a separate gallery or pre-rendered full outfit. The selected view is recorded in the shareable outfit URL.

## Native photographic sources
All photo-mode input assets are in `assets/photorealistic-layers/`:
- `tee.svg` · separate photo cutout
- `shirt.svg` · separate photo cutout
- `jacket.svg` · separate photo cutout
- `trousers.svg` · separate photo cutout
- `skirt.svg` · separate photo cutout
- `shoes.svg` · separate shoe photo cutout
- `tie.svg` · transparent satin weave study
- `scarf.svg` · transparent silk weave study
- `manifest.json`

These assets have **transparent backgrounds**. Six were extracted from the previously generated photographic garment study and are now completely self-contained (embedded WebP). The tie/scarf photos are synthetic material studies rather than user-supplied photographs.

The renderer loads the appropriate per-garment source and the matching independent 1086×1448 SVG silhouette from the illustrated model, scales the photographic fabric into that silhouette, re-colors it to the currently selected Wada hex preserving highlights and shadows, and clips it to the **original exact alpha mask**. Existing shirt/jacket registration, color controls, pattern tooling, and outfit PNG exports are preserved.

## Scope and honest limitations
- **This is an initial photographic-fabric renderer**, not yet a fully photorealistic human model. Face, visible arms, skin and hair remain from the accepted illustrated croquis.
- The supplied high-resolution example photos were used as visual direction. The first commit uses small self-contained photographic source cutouts already available within the GitHub experiment, **not copies of the uploaded photos**. Therefore textile resolution and seam registration still require a later quality pass.
- The source photographs are scaled into precise SVG silhouettes, so their **alpha, overlap and registration** match the existing garment geometry, even when the original photographed object's fit differs from the illustrator.
- The original SVG illustration remains the fallback. No main-branch changes are made here.

No generated full-body look is used in this renderer. Each garment is composited independently by Canvas.
