# Green Vinyl Graphics

A grayscale portfolio storefront rebuilt with React 19.3, TanStack Router, shadcn/ui and Tailwind CSS, served by Cloudflare Workers Static Assets.

```sh
npm install
npm run dev
```

`npm run build` creates the production bundle. `npm run preview` previews it locally. `npm run deploy` builds and deploys it to your Cloudflare account using Wrangler.

The original 52-product catalogue from https://gvg.jongreen.dev is stored in `src/products.json`. Original preview artwork is served locally as responsive WebP images. Product IDs and prices are preserved. Edit the JSON to update the collection.

React ViewTransition boundaries pair each product image and title between routes. TanStack Router handles navigation; a deferred route view lets React animate page changes while keeping search and filters immediate. Scroll restoration happens inside the transition. Reduced-motion preferences are respected.

The basket persists locally. Checkout creates an in-memory demo confirmation only: there are no payments, accounts, email services, databases or product-file deliveries.
