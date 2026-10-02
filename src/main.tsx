import {
  StrictMode,
  createContext,
  useContext,
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

const ProductTransitionContext = createContext(false);

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
  const animate = useContext(ProductTransitionContext);
  return (
    <ViewTransition name={`image-${product.id}`} default={animate ? undefined : "none"}>
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
  const animate = useContext(ProductTransitionContext);
  return (
    <ViewTransition name={`title-${product.id}`} default={animate ? undefined : "none"}>
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
          <img className="brand-logo" src="/images/gvg-logo.png" alt="Green Vinyl Graphics" width="471" height="195" />
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }}>Home</Link>
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
            start with a template
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
  const bundle = products.find((p) => p.name === "All iPhone Bundle")!;
  const picks = [...featured, ...products.filter((p) =>
    ["iPhone 14 Pro Max", "MagSafe Charger", "iPhone 13 Mini", "iPad Mini 6th Gen (2021)"].includes(p.name))];
  return (
    <div className="storefront">
      <section className="store-hero">
        <div className="wrap store-hero-inner">
          <div className="store-hero-copy">
            <span className="store-kicker"><span /> Made for your next creation</span>
            <h1>A fresh look.<br />A perfect fit.</h1>
            <p>Make it yours with precision-cut skin templates for the devices you love.</p>
            <Button asChild><Link to="/products">Shop templates <ArrowRight /></Link></Button>
            <div className="store-hero-note"><Download size={16} /> Digital files. Ready when you are.</div>
          </div>
          <Link to="/products/$id" params={{ id: hero.id }} className="store-hero-art" aria-label={`View ${hero.name}`}>
            <div className="store-orbit" />
            <ProductImage product={hero} priority large />
            <span className="store-price-bubble">Template only<strong>{money(hero.price)}</strong></span>
            <div className="store-hero-caption"><span>IN THE SPOTLIGHT</span><ProductTitle product={hero} /><ArrowUpRight size={20} /></div>
          </Link>
        </div>
      </section>
      <section className="store-categories wrap">
        <div className="section-heading"><div><p className="eyebrow">Find your device</p><h2>Shop by category</h2></div><Link to="/products" className="text-link">Browse all <ArrowRight size={16} /></Link></div>
        <div className="category-grid">
          {categories.filter((c) => c !== "All templates").map((category) => {
            const items = products.filter((p) => p.category === category);
            return <Link key={category} to="/products" search={{ category }} className="category-tile">
              <img src={items[0].image.replace(".webp", "-small.webp")} alt="" width="120" height="120" loading="lazy" />
              <strong>{category}</strong><span>{items.length} templates</span>
            </Link>;
          })}
        </div>
      </section>
      <section className="store-promo wrap">
        <div><p className="eyebrow">More devices. More possibilities.</p><h2>Your whole collection.<br />One handy bundle.</h2><p>More iPhone templates, together in one collection.</p><Button asChild><Link to="/products/$id" params={{ id: bundle.id }}>Explore the bundle <ArrowRight /></Link></Button></div>
        <Link to="/products/$id" params={{ id: bundle.id }} className="store-promo-art" aria-label="View All iPhone Bundle"><ProductImage product={bundle} /><span className="bundle-price">All iPhone Bundle <strong>{money(bundle.price)}</strong></span></Link>
      </section>
      <section className="store-products wrap">
        <div className="section-heading"><div><p className="eyebrow">A little inspiration</p><h2>Find your next template</h2></div><Link to="/products" className="text-link">View all templates <ArrowRight size={16} /></Link></div>
        <div className="product-grid">{picks.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      </section>
      <div className="store-services wrap">
        <div><Download /><span><strong>Digital downloads</strong><small>Get straight to creating</small></span></div>
        <div><Layers /><span><strong>Five file formats</strong><small>SVG · AI · PSD · DXF · PNG</small></span></div>
        <div><Check /><span><strong>Designed to fit</strong><small>Made for your device</small></span></div>
        <Link to="/about"><ArrowUpRight /><span><strong>Made in Sheffield</strong><small>Get to know GVG</small></span></Link>
      </div>
    </div>
  );
}

// TanStack's external store publishes synchronously. Defer the presented match
// so React can capture the old page before animating its shared elements.
function PageContent() {
  const matches = useRouterState({ select: (state) => state.matches });
  const currentMatch = matches.at(-1);
  const previousMatch = useRef(currentMatch);
  const deferredId = useDeferredValue(currentMatch?.id);
  const isProductNavigation =
    previousMatch.current?.routeId === "/products/$id" ||
    currentMatch?.routeId === "/products/$id";
  // Fade regular page changes; share images and titles only for product navigation.
  // Keep typing and filters immediate; only page changes need a snapshot.
  const match =
    currentMatch?.id === deferredId ? currentMatch : previousMatch.current;
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
  return (
    <ProductTransitionContext.Provider value={isProductNavigation}>
      {(() => {
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
      })()}
    </ProductTransitionContext.Provider>
  );
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
            {product.summary}
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
      <div className="about-story">
        <div>
          <p className="eyebrow">GREEN VINYL GRAPHICS · SHEFFIELD, ENGLAND</p>
          <h2>Built around the details.</h2>
          <p>Green Vinyl Graphics brings a background in graphic design and signage to digital skin templates. Our templates are designed in-house, with attention to the shapes, cutouts and dimensions that make each device different.</p>
          <p>The idea is simple: give you a useful starting point for your own artwork. Whether you’re personalising a phone, planning a vinyl project or putting together a mock-up, you can spend more time on the design and less time drawing the outlines.</p>
        </div>
        <aside className="about-at-glance" aria-label="The collection at a glance">
          <Layers size={28} />
          <h3>A template for your next idea</h3>
          <dl>
            <div><dt>In the collection</dt><dd>{products.length} templates</dd></div>
            <div><dt>Devices & collections</dt><dd>iPhone, iPad, AirPods & more</dd></div>
            <div><dt>File formats</dt><dd>SVG, AI, PSD, DXF & PNG</dd></div>
            <div><dt>Product type</dt><dd>Digital files, not physical skins</dd></div>
          </dl>
        </aside>
      </div>
      <div className="about-section-heading"><p className="eyebrow">FROM FILE TO FINISHED DESIGN</p><h2>How it comes together</h2></div>
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
      <section className="about-formats" aria-labelledby="formats-heading">
        <div className="about-section-heading"><p className="eyebrow">WORK WITH YOUR FAVOURITE TOOLS</p><h2 id="formats-heading">The right file for your workflow</h2><p>The catalogue includes five file formats, plus a dimensions file to help you check your setup. Choose the format your software supports.</p></div>
        <div className="format-grid">
          {[
            ["SVG", "Scalable outlines", "Vector artwork for compatible design and cutting software. Keep the supplied dimensions when importing."],
            ["AI", "Illustrator artwork", "Work with the template in Adobe Illustrator and build your artwork around the device outline."],
            ["PSD", "Photoshop projects", "Use Photoshop to explore colours, textures and artwork in a pixel-based workflow."],
            ["DXF", "Cutting workflows", "An option for software that accepts DXF. Check your application’s import settings and scale."],
            ["PNG", "Image previews", "Useful for visual layouts and mock-ups. PNG is a raster image, rather than a vector cutting path."],
          ].map(([format, title, description]) => <article key={format}><span>{format}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>
      <section className="about-preparation" aria-labelledby="preparation-heading">
        <div><p className="eyebrow">A LITTLE PREPARATION GOES A LONG WAY</p><h2 id="preparation-heading">Before your first cut</h2><p>A good result starts with the right model, the right scale and a small test.</p></div>
        <ul>
          <li><Check size={18} /><div><h3>Match the exact device</h3><p>Check the model, size and generation. Devices with similar names can have different dimensions and camera layouts.</p></div></li>
          <li><Check size={18} /><div><h3>Check the imported dimensions</h3><p>Use the dimensions file as your reference. Design software can change the scale when it opens or imports a file.</p></div></li>
          <li><Check size={18} /><div><h3>Test your material and settings</h3><p>Make a test cut before committing to your final vinyl. Thin, high-quality vinyl can help with curved surfaces; blade and material settings depend on your equipment.</p></div></li>
        </ul>
      </section>
      <section className="about-faq" aria-labelledby="faq-heading">
        <div className="about-section-heading"><p className="eyebrow">GOOD TO KNOW</p><h2 id="faq-heading">A few common questions</h2></div>
        {[
          ["Am I buying a physical skin?", "No. These are digital templates for creating your own designs and skins. A device, vinyl, cutting equipment and a finished physical skin are not included."],
          ["Will the files work with my software?", "Check which formats your software and edition can import before choosing a template. The catalogue offers SVG, AI, PSD, DXF and PNG, but support and import behaviour vary between applications."],
          ["What are the bundles?", "Bundles group multiple templates into one product. Check the product’s listed models and preview to make sure the bundle covers the devices you need."],
          ["Can I share or resell the template files?", "Redistributing or reselling the Green Vinyl Graphics template files is not permitted. Keep the source files for your own use and check the applicable licence before any other use."],
          ["Can I purchase and download files on this site?", "This version of the shop is a portfolio demo. You can browse templates, add them to your bag and try the demo checkout. No payment is taken and no template files are delivered."],
        ].map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} /></summary><p>{answer}</p></details>)}
      </section>
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
