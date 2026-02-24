# Specification

## Summary
**Goal:** Build a client-side photo editing web app (PixelCraft Editor) with a professional dark-mode UI, core image editing tools, filter presets, adjustment sliders, and PNG export — all processed entirely in the browser.

**Planned changes:**
- Image upload supporting JPG, PNG, and WebP with a central canvas preview
- Transformation tools: crop (draggable handles), rotate (90° increments), and flip (horizontal/vertical)
- One-click filter presets (at least 7: Vivid, B&W, Sepia, Warm, Cool, Fade, Sharpen + None) shown as thumbnail strip below the canvas
- Adjustment sliders for brightness, contrast, saturation, and sharpness (-100 to +100), with a Reset button
- High-quality PNG export that bakes all edits at original resolution using the Canvas API
- Dark-mode UI layout: top toolbar, central canvas, left/right side panels for tools and adjustments, bottom filter strip; deep charcoal background with teal/amber accent highlights and crisp white typography

**User-visible outcome:** Users can upload a photo, apply transformations, one-click filters, and fine-tune adjustments with sliders, then download the fully edited image as a high-resolution PNG — all without leaving the browser.
