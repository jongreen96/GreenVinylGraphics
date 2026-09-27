import {
  StrictMode,
  ViewTransition,
  startTransition,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Link,
  useRouterState,
  notFound,
} from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  Layers,
  Search,
  ShoppingBag,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { products, featured, categories, money, type Product } from "./catalog";
import { BasketProvider, useBasket } from "./store";
import { BasketDrawer, ProductPreview } from "./components/store-overlays";
import "./styles.css";

function ProductImage({
  product,
  priority = false,
  large = false,
  thumbnail = false,
}: {
  product: Product;
  priority?: boolean;
  large?: boolean;
  thumbnail?: boolean;
}) {
  return (
    <ViewTransition name={`image-${product.id}`}>
      <div className="product-image">
        <img
          src={product.image}
          srcSet={`${product.image.replace(".webp", "-small.webp")} 480w, ${product.image} 960w`}
          sizes={
            thumbnail
              ? "(max-width: 760px) 80px, 105px"
              : large
                ? "(max-width: 760px) calc(100vw - 40px), (max-width: 1552px) 50vw, 760px"
                : "(max-width: 760px) calc((100vw - 56px) / 2), (max-width: 1100px) calc((100vw - 108px) / 3), (max-width: 1552px) calc((100vw - 178px) / 4), 344px"
          }
          alt={`${product.name} skin template preview`}
          width="960"
          height="960"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority && large ? "high" : "auto"}
          decoding="async"
        />
      </div>
    </ViewTransition>
  );
}
function ProductTitle({
  product,
  detail = false,
}: {
  product: Product;
  detail?: boolean;
}) {
  return (
    <ViewTransition name={`title-${product.id}`}>
      {detail ? (
        <h1 className="product-title">{product.name}</h1>
      ) : (
        <h3>{product.name}</h3>
      )}
    </ViewTransition>
  );
}
function ProductCard({
  product,
  index = 5,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <article className="product-card">
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        aria-label={`View ${product.name}`}
      >
        <div className="card-visual">
          <ProductImage product={product} priority={index < 4} />
          <span className="card-arrow">
            <ArrowUpRight size={19} />
          </span>
          {product.category === "Bundles" && (
            <span className="bundle-label">Bundle</span>
          )}
        </div>
        <div className="card-details">
          <div>
            <p className="eyebrow">{product.category} / Digital template</p>
            <ProductTitle product={product} />
          </div>
          <span className="price">{money(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}
function Layout() {
  const { ids, open } = useBasket();
  const path = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    const name = products.find((p) => path === `/products/${p.id}`)?.name;
    document.title = `${name || (path === "/products" ? "The collection" : path === "/basket" ? "Your bag" : path === "/about" ? "The details" : "A template for your next idea")} — Green Vinyl Graphics`;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [path]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        Digital templates. Unlimited possibilities.{" "}
        <span>Portfolio edition</span>
      </div>
      <header className="site-header wrap">
        <Link to="/" className="brand" aria-label="Green Vinyl Graphics home">
          <span className="brand-mark">
            gvg<span>®</span>
          </span>
          <span className="brand-name">
            GREEN VINYL
            <br />
            GRAPHICS
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/products" activeProps={{ className: "active" }}>
            Templates
          </Link>
          <Link to="/about" activeProps={{ className: "active" }}>
            The details
          </Link>
        </nav>
        <button
          onClick={open}
          aria-haspopup="dialog"
          className="bag-link"
          aria-label={`Shopping bag, ${ids.length} items`}
        >
          <ShoppingBag size={18} />
          <span>Bag</span>
          <span className="bag-count">{ids.length}</span>
        </button>
      </header>
      <BasketDrawer />
      <main id="main" tabIndex={-1}>
        <ViewTransition>
          <PageContent />
        </ViewTransition>
      </main>
      <footer className="wrap">
        <div className="footer-top">
          <Link to="/" className="footer-wordmark">
            Good things
            <br />
            start with a template<span>↗</span>
          </Link>
          <div>
            <p className="eyebrow">GREEN VINYL GRAPHICS</p>
            <p>
              A little precision.
              <br />A lot of possibility.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/products">
              Explore templates <ArrowUpRight size={14} />
            </Link>
            <Link to="/about">
              How it works <ArrowUpRight size={14} />
            </Link>
            <Link to="/basket">
              Your bag <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Green Vinyl Graphics</span>
          <span>Portfolio demo · No real purchases</span>
          <span>Designed for making.</span>
        </div>
      </footer>
    </>
  );
}
function Home() {
  const hero = products.find((p) => p.name === "iPhone 13 Pro")!;
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> DIGITAL SKIN TEMPLATES
          </p>
          <h1>
            Your device.
            <br />
            Your design.
            <br />
            <span>Your next idea.</span>
          </h1>
          <p className="hero-description">
            The starting point for something uniquely yours.
            <br className="desktop-break" /> Precise digital templates. Ready to
            make your mark.
          </p>
          <Button asChild>
            <Link to="/products">
              Explore the collection <ArrowUpRight />
            </Link>
          </Button>
          <div className="hero-footnote">
            <span>01 — DESIGNED TO FIT</span>
            <span>02 — MADE TO CREATE</span>
          </div>
        </div>
        <Link
          to="/products/$id"
          params={{ id: hero.id }}
          className="hero-art"
          aria-label={`Explore ${hero.name}`}
        >
          <div className="art-top">
            <span>THE EVERYDAY, REIMAGINED</span>
            <Plus size={20} />
          </div>
          <div className="hero-product">
            <ProductImage product={hero} priority large />
          </div>
          <div className="art-bottom">
            <div>
              <p className="eyebrow">A BLANK CANVAS FOR YOUR IDEAS</p>
              <ProductTitle product={hero} />
            </div>
            <span className="round-arrow">
              <ArrowUpRight />
            </span>
          </div>
        </Link>
      </section>
      <div className="benefits wrap">
        <span>
          <Download /> Digital files, ready to create
        </span>
        <span>
          <Layers /> SVG · AI · PSD · DXF · PNG
        </span>
        <span>
          <Check /> Made for your favourite tools
        </span>
      </div>
      <section className="collection wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE EDIT</p>
            <h2>A few good starting points.</h2>
          </div>
          <Link to="/products" className="text-link">
            All {products.length} templates <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="product-grid featured">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
      <section className="make-banner wrap">
        <span className="outline-star" aria-hidden="true">
          ✳
        </span>
        <div>
          <p className="eyebrow">LESS SETUP. MORE MAKING.</p>
          <h2>
            We did the outlines.
            <br />
            You do the original.
          </h2>
        </div>
        <Button asChild variant="outline">
          <Link to="/about">
            How it works <ArrowUpRight />
          </Link>
        </Button>
      </section>
    </>
  );
}

// TanStack's external store publishes synchronously. Defer the presented match
// so React can capture the old page before animating its shared elements.
function PageContent() {
  const matches = useRouterState({ select: (state) => state.matches });
  const currentMatch = matches.at(-1);
  const previousMatch = useRef(currentMatch);
  const deferredId = useDeferredValue(currentMatch?.id);
  const isHomeTemplatesSwap =
    (previousMatch.current?.routeId === "/" &&
      currentMatch?.routeId === "/products") ||
    (previousMatch.current?.routeId === "/products" &&
      currentMatch?.routeId === "/");
  // Commit Home ↔ Templates immediately, without a transition snapshot.
  // Product navigation still defers so its shared images and titles animate.
  // Keep typing and filters immediate; only page changes need a snapshot.
  const match =
    isHomeTemplatesSwap || currentMatch?.id === deferredId
      ? currentMatch
      : previousMatch.current;
  useLayoutEffect(() => { previousMatch.current = match; }, [match]);
  const positions = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  // Restore during React's commit, after the old view has been captured.
  // Restoring on the router's earlier store update hides the clicked card.
  useLayoutEffect(() => {
    const key = router.state.location.state.__TSR_key!;
    window.scrollTo({ top: positions.current.get(key) ?? 0, behavior: "instant" });
    const save = () => positions.current.set(key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [match?.id]);
  if (!match || match.status !== "success") return <NotFound />;
  switch (match.routeId) {
    case "/":
      return <Home />;
    case "/products":
      return <Collection search={match.search} />;
    case "/products/$id":
      return match.loaderData ? (
        <ProductPage key={match.id} product={match.loaderData} />
      ) : <NotFound />;
    case "/basket":
      return <Basket />;
    case "/about":
      return <About />;
    default:
      return <NotFound />;
  }
}

type CollectionSearch = { category?: string; q?: string; sort?: string };
function Collection({ search }: { search: CollectionSearch }) {
  const navigate = collectionRoute.useNavigate();
  const category = search.category || "All templates";
  const [query, setQuery] = useState(search.q || "");
  const update = (value: CollectionSearch) =>
    navigate({
      search: (previous) => ({ ...previous, ...value }),
      replace: true,
      resetScroll: false,
    });
  const filtered = products.filter(
    (p) =>
      (category === "All templates" || p.category === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  if (search.sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (search.sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (search.sort === "name")
    filtered.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true }),
    );
  return (
    <section className="wrap catalogue">
      <div className="page-heading">
        <p className="eyebrow">FIND YOUR NEXT PROJECT</p>
        <h1>
          The collection<span>.</span>
        </h1>
        <p>Pick your device. Make it your own.</p>
      </div>
      <div className="catalogue-tools">
        <div className="filters" aria-label="Filter by device">
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? "selected" : ""}
              aria-pressed={category === c}
              onClick={() =>
                update({ category: c === "All templates" ? undefined : c })
              }
            >
              {c}
            </button>
          ))}
        </div>
        <form
          className="search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            update({ q: query.trim() || undefined });
          }}
        >
          <Search size={17} />
          <input
            aria-label="Search templates"
            placeholder="Find your device…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              update({ q: event.target.value || undefined });
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                update({ q: undefined });
              }}
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>
      <div className="results-bar">
        <span aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "template" : "templates"}
        </span>
        <label>
          Sort by{" "}
          <select
            aria-label="Sort templates"
            value={search.sort || "featured"}
            onChange={(event) => update({ sort: event.target.value })}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} />
          <h2>No templates found.</h2>
          <p>Try another device or browse the whole collection.</p>
          <Button
            onClick={() => {
              setQuery("");
              navigate({ search: {}, replace: true });
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </section>
  );
}
function ProductPage({ product }: { product: Product }) {
  const { ids, add, open } = useBasket();
  const inBag = ids.includes(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  return (
    <div className="wrap product-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to templates
      </Link>
      <section className="product-layout">
        <div className="detail-art">
          <ProductPreview product={product}>
            <ProductImage product={product} priority large />
          </ProductPreview>
          <span className="image-caption">
            {product.category.toUpperCase()} / TEMPLATE PREVIEW
          </span>
        </div>
        <div className="product-info">
          <p className="eyebrow">
            DIGITAL DOWNLOAD / {product.category.toUpperCase()}
          </p>
          <ProductTitle product={product} detail />
          <p className="detail-price">
            {money(product.price)} <span>GBP</span>
          </p>
          <p className="product-intro">
            A precise starting point for your{" "}
            {product.name.replace(" Bundle", "")}. Add your artwork, choose your
            finish, and make something that's entirely yours.
          </p>
          <div className="format-tags">
            {["SVG", "AI", "PSD", "DXF", "PNG"].map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          {inBag ? (
            <Button className="w-full" onClick={open}>
              <Check /> Added to bag — view bag <ArrowRight />
            </Button>
          ) : (
            <Button className="w-full" onClick={() => add(product.id)}>
              Add to bag <Plus />
            </Button>
          )}
          <p className="purchase-note" aria-live="polite">
            {inBag
              ? "Your template is in the bag."
              : "Digital product. No physical item."}{" "}
            Portfolio demo.
          </p>
          <div className="product-accordions">
            <details open>
              <summary>
                About this template <Plus size={16} />
              </summary>
              <p className="original-description">{product.description}</p>
            </details>
            <details>
              <summary>
                What’s included <Plus size={16} />
              </summary>
              <p>
                The original collection includes SVG, AI, PSD, DXF and PNG
                files, plus sizing information. This portfolio demo lets you
                explore the shopping experience; template files are not
                delivered.
              </p>
            </details>
            <details>
              <summary>
                Compatibility & sizing <Plus size={16} />
              </summary>
              <p>
                Choose the exact device model shown in the title. Use SVG or DXF
                in compatible cutting software, or edit the artwork in your
                preferred design app. Always confirm dimensions and make a test
                cut before applying vinyl.
              </p>
            </details>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="collection related">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP THE IDEAS COMING</p>
              <h2>More to make your own.</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
function Basket() {
  const { ids, remove, clear } = useBasket();
  const [receipt, setReceipt] = useState<Product[] | null>(null);
  useEffect(() => {
    if (receipt) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document
        .getElementById("confirmation-title")
        ?.focus({ preventScroll: true });
    }
  }, [receipt]);
  const items = ids
    .map((id) => products.find((p) => p.id === id)!)
    .filter(Boolean);
  const total =
    items.reduce((sum, p) => sum + Math.round(p.price * 100), 0) / 100;
  if (receipt)
    return (
      <section className="wrap confirmation">
        <div className="confirmation-icon">
          <Check size={32} />
        </div>
        <p className="eyebrow">ALL SET, IN DEMO LAND</p>
        <h1 id="confirmation-title" tabIndex={-1}>
          A little closer
          <br />
          to your next idea.
        </h1>
        <p>Your demo order is complete. No payment was taken.</p>
        <div className="receipt">
          {receipt.map((p) => (
            <div key={p.id}>
              <span>{p.name}</span>
              <span>{money(p.price)}</span>
            </div>
          ))}
          <div>
            <strong>Demo total</strong>
            <strong>
              {money(
                receipt.reduce((sum, p) => sum + Math.round(p.price * 100), 0) /
                  100,
              )}
            </strong>
          </div>
        </div>
        <p className="muted">
          This is a portfolio storefront. No files or emails will be sent.
        </p>
        <Button asChild>
          <Link to="/products">
            Keep exploring <ArrowUpRight />
          </Link>
        </Button>
      </section>
    );
  return (
    <section className="wrap basket-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR NEXT PROJECT STARTS HERE</p>
        <h1>
          Your bag<span>.</span>
        </h1>
        <p>
          {items.length
            ? `${items.length} ${items.length === 1 ? "template" : "templates"}. Plenty of possibilities.`
            : "A little room for your next idea."}
        </p>
      </div>
      {!items.length ? (
        <div className="empty-state">
          <ShoppingBag size={36} />
          <h2>Something good goes here.</h2>
          <p>Find a template and make it yours.</p>
          <Button asChild>
            <Link to="/products">
              Explore templates <ArrowUpRight />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="basket-layout">
          <div>
            {items.map((p) => (
              <article className="basket-item" key={p.id}>
                <Link to="/products/$id" params={{ id: p.id }}>
                  <ProductImage product={p} thumbnail />
                </Link>
                <div>
                  <Link to="/products/$id" params={{ id: p.id }}>
                    <ProductTitle product={p} />
                  </Link>
                  <p>Digital template · 1 licence</p>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
                <span>{money(p.price)}</span>
              </article>
            ))}
            <Link to="/products" className="back-link">
              <ArrowLeft size={16} /> Continue exploring
            </Link>
          </div>
          <aside className="order-summary">
            <p className="eyebrow">THE SUMMARY</p>
            <h2>Good choices.</h2>
            <div>
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>Digital</span>
            </div>
            <div className="total">
              <strong>Total</strong>
              <strong>{money(total)}</strong>
            </div>
            <Button
              className="w-full"
              onClick={() =>
                startTransition(() => {
                  setReceipt(items);
                  clear();
                })
              }
            >
              Complete demo order <ArrowRight />
            </Button>
            <p>
              No payment details needed.
              <br />
              This checkout is just for the demo.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
function About() {
  return (
    <section className="wrap about-page">
      <div className="page-heading">
        <p className="eyebrow">FROM OUTLINE TO ORIGINAL</p>
        <h1>
          A simple start.
          <br />
          An original finish.
        </h1>
        <p>
          Good design begins with a good foundation.
          <br />
          We make the templates. You bring the ideas.
        </p>
      </div>
      <div className="steps">
        {[
          {
            n: "01",
            title: "Find your fit.",
            text: "Browse the collection and choose your exact device model. From the phone in your pocket to the tablet on your desk.",
          },
          {
            n: "02",
            title: "Make your mark.",
            text: "Work with familiar formats: SVG, AI, PSD, DXF and PNG. Bring your own colours, patterns and personality.",
          },
          {
            n: "03",
            title: "Bring it to life.",
            text: "Confirm your dimensions, test your cut, and turn your design into something you can hold.",
          },
        ].map((step) => (
          <article key={step.n}>
            <span>{step.n}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
      <div className="about-note">
        <Layers size={30} />
        <div>
          <h2>A small shop, reimagined.</h2>
          <p>
            Green Vinyl Graphics is a collection of digital device-skin
            templates. This edition is a portfolio demo of the shop: browse the
            original catalogue, build a bag, and try the checkout. No money
            changes hands and no template files are delivered.
          </p>
          <Button asChild>
            <Link to="/products">
              Find your starting point <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
function NotFound() {
  return (
    <div className="wrap empty-state">
      <p className="eyebrow">404 / OUTSIDE THE OUTLINES</p>
      <h1>This page isn’t in the collection.</h1>
      <p>Let’s get you back to something good.</p>
      <Button asChild>
        <Link to="/products">
          Explore templates <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
  errorComponent: () => (
    <div className="wrap empty-state">
      <h1>Something went wrong.</h1>
      <Button onClick={() => window.location.reload()}>Try again</Button>
    </div>
  ),
});
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
});
const collectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  validateSearch: (search: Record<string, unknown>): CollectionSearch => ({
    category:
      typeof search.category === "string" &&
      categories.some((c) => c === search.category)
        ? search.category
        : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    sort:
      typeof search.sort === "string" &&
      ["featured", "price-low", "price-high", "name"].includes(search.sort)
        ? search.sort
        : undefined,
  }),
});
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return product;
  },
});
const basketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/basket",
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
});
const router = createRouter({
  routeTree: rootRoute.addChildren([
    homeRoute,
    collectionRoute,
    productRoute,
    basketRoute,
    aboutRoute,
  ]),
  defaultPreload: "intent",
  // PageContent restores scroll inside the React transition instead.
  scrollRestoration: () => false,
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BasketProvider>
      <RouterProvider router={router} />
    </BasketProvider>
  </StrictMode>,
);
