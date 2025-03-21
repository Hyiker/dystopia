# `Dystopia` - Yet another dynamic range image viewer for Vscode

Dystopia is an alternative to [VERIV](https://github.com/mcrescas/veriv) for previewing dynamic range image in your Visual Studio Code.

![Teaser](https://github.com/Hyiker/dystopia/raw/master/images/teaser.png)

<p align="center" style="color:grey">Staircase rendered image by Benedikt Bitterli</p>

This extension utilize [HDRView](https://github.com/wkjarosz/hdrview) wasm build as the image viewer, minor [modifications](https://github.com/Hyiker/hdrview/tree/dystopia) were made for this VSCode port. Theoretically, Dystopia support all functionalities of HDRView.

## Additional features

- Right click a image `Dystopia: Add to viewer` with existing preview panel to add a image to existing panel.
- Show metrics(L1, L2, MSE, PSNR, ...) between two images.

## Usage

Install the extension in your Visual Studio Code, then both HDR and LDR images can be viewed smoothly.

Supported file formats list as follow:

- HDR
  - `.exr`
  - `.hdr`
  - `.pfm`
  - `.jpg` (Ultra HDR JPEG)
- LDR
  - `.png`
  - `.tga`
  - `.bmp`
  - `.jpg`
  - `.gif`
  - `.pnm`
  - `.psd`

## Credits

- VERIV
- HDRView
