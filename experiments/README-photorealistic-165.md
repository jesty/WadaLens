# Photorealistic WadaLens — Combination #165

This branch is an **isolated photorealistic asset experiment**, forked from the merged `main`. The existing Dress Me renderer remains untouched.

## Exact WadaLens palette
| Color | HEX | Test garment |
|---|---|---|
| Cameo Pink | `#E6ADCF` | T-shirt, shirt |
| Spinel Red | `#FF4DC9` | Blazer |
| Vistoris Lake | `#5C2C45` | Trousers, skirt |

The photographic textures preserve shading and cloth folds, so sampled photo pixels do not all equal the flat target hex.

## Included in the GitHub branch
- `assets/photorealistic/combination-165/garments-165.webp`: transparent-background photographic garment sprite (6 cells).
- `assets/photorealistic/combination-165/manifest.json`: mapping of colors and sprite cells.
- `experiments/photorealistic-165.html`: simple isolated gallery showing all six pre-generated items.

## Scope and limitation
This is **not yet a replacement for the old model renderer**. The generated clothes and body are not pixel-registered on a single common pose, so overlaying these cutouts over the existing illustrated model would look misaligned. The separate 12-file concept asset bundle is supplied alongside the conversation for closer inspection. Aligning/segmentation of assets is the next step before a PR.

## Validation
Review texture, model identity consistency, color correspondence, and whether a common pose can support transparent independent layers. Only after satisfactory registration should the experimental renderer replace anything.
