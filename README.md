<p align="center">
  <img src="public/images/gvg-logo.png" alt="Green Vinyl Graphics" width="240" />
</p>

<h1 align="center">Green Vinyl Graphics</h1>

<p align="center">A custom storefront for digital device-skin templates.</p>

<p align="center">
  <a href="https://gvg.jongreen.dev"><strong>Explore the live website →</strong></a>
</p>

## The project

Green Vinyl Graphics is a Sheffield-based graphic design and signage brand. I previously ran it as an online store selling digital device-skin templates, generating over £60,000 in sales during its time trading.

This portfolio version revisits that store with a new design, using its original catalogue of 52 templates for iPhone, iPad, AirPods and accessories.

The design takes its teal accent from the V in the GVG logo. Product artwork leads the homepage, followed by category browsing, a bundle feature and a selection of templates. The same styling carries through the collection, product pages, basket and About page.

## Take a look around

- **Browse the collection.** Filter by device, search for a model and sort by name or price. Search and filter selections are reflected in the URL, so a collection view can be shared directly.
- **Open a template.** The product image and title animate from the catalogue into the detail page. Regular page changes use a quieter fade.
- **Inspect the artwork.** Enlarge a product preview and read model-specific descriptions, file-format information and sizing guidance.
- **Build a basket.** Add templates, review them in the bag drawer or basket page, and return later with your selections saved locally.
- **Try the checkout.** Complete a demo order to see the confirmation flow.
- **Read about GVG.** The About page covers the brand, supported formats, preparation advice and common questions.

This is a portfolio demo: checkout does not take payment or deliver template files.

## Design details

The layout adapts from desktop product grids to a compact mobile shop. Responsive WebP artwork keeps product images sized for their placement, with priority loading for the main preview and lazy loading further down the page.

Keyboard navigation, visible focus states, a skip link and reduced-motion support are included. Returning from a product page restores the browsing position, keeping the collection easy to explore.

## Built with

**React · TypeScript · TanStack Router · Tailwind CSS · shadcn/ui · Vite**

Hosted on **Cloudflare Workers Static Assets** at [gvg.jongreen.dev](https://gvg.jongreen.dev). The catalogue and product artwork live in the repository; the basket uses local storage.
