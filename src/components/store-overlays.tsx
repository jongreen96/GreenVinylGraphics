import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ShoppingBag,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { products, money, type Product } from "../catalog";
import { useBasket } from "../store";
import { Button } from "./ui/button";
import { Modal } from "./modal";

export function BasketDrawer() {
  const { ids, remove, isOpen, close } = useBasket();
  const location = useRouterState({ select: (state) => state.location.href });
  useEffect(() => {
    close();
  }, [location, close]);
  const items = products.filter((product) => ids.includes(product.id));
  const total =
    items.reduce((sum, product) => sum + Math.round(product.price * 100), 0) /
    100;
  return (
    <Modal
      open={isOpen}
      onClose={close}
      labelledBy="bag-title"
      className="bag-drawer"
    >
      <div className="modal-heading">
        <div>
          <p className="eyebrow">A FEW GOOD IDEAS</p>
          <h2 id="bag-title">
            Your bag <span>({items.length})</span>
          </h2>
        </div>
        <Button
          autoFocus
          variant="ghost"
          size="icon"
          onClick={close}
          aria-label="Close bag"
        >
          <X />
        </Button>
      </div>
      {items.length ? (
        <>
          <div className="drawer-items">
            {items.map((product) => (
              <article className="drawer-item" key={product.id}>
                <Link
                  to="/products/$id"
                  params={{ id: product.id }}
                  onClick={close}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={product.image.replace(".webp", "-small.webp")}
                    alt=""
                    width="88"
                    height="88"
                  />
                </Link>
                <div>
                  <Link
                    to="/products/$id"
                    params={{ id: product.id }}
                    onClick={close}
                  >
                    {product.name}
                  </Link>
                  <p>Digital template</p>
                  <button
                    className="remove-item"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
                <span>{money(product.price)}</span>
              </article>
            ))}
          </div>
          <div className="drawer-summary">
            <div aria-live="polite">
              <span>
                Subtotal · {items.length}{" "}
                {items.length === 1 ? "template" : "templates"}
              </span>
              <strong>{money(total)}</strong>
            </div>
            <Button asChild className="w-full">
              <Link to="/basket" onClick={close}>
                Review & checkout <ArrowRight />
              </Link>
            </Button>
            <p>Portfolio demo. No real payments.</p>
            <button className="continue-shopping" onClick={close}>
              Continue browsing
            </button>
          </div>
        </>
      ) : (
        <div className="drawer-empty">
          <ShoppingBag size={36} />
          <h3>Room for your next idea.</h3>
          <p>Your bag is empty. Find something to make your own.</p>
          <Button asChild>
            <Link to="/products" onClick={close}>
              Explore templates <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </Modal>
  );
}

export function ProductPreview({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <button
        className="preview-trigger"
        onClick={() => {
          setZoomed(false);
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-label={`Enlarge ${product.name} preview`}
      >
        {children}
        <span className="preview-hint">
          <ZoomIn size={16} /> Enlarge preview
        </span>
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="preview-title"
        className="preview-modal"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">TEMPLATE PREVIEW</p>
            <h2 id="preview-title">{product.name}</h2>
          </div>
          <Button
            autoFocus
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close preview"
          >
            <X />
          </Button>
        </div>
        <div
          className="preview-stage"
          key={`${open}-${zoomed}`}
          tabIndex={0}
          role="region"
          aria-label="Product artwork. Scroll to explore when zoomed."
        >
          {open && (
            <div className={`preview-canvas${zoomed ? " is-zoomed" : ""}`}>
              <img
                src={product.image}
                alt={`${product.name} enlarged template artwork`}
                width="960"
                height="960"
                draggable={false}
              />
            </div>
          )}
        </div>
        <div className="preview-toolbar">
          <span aria-live="polite">
            {zoomed ? "Scroll or swipe to explore" : "Take a closer look"}
          </span>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={zoomed}
            onClick={() => setZoomed((value) => !value)}
          >
            {zoomed ? <ZoomOut /> : <ZoomIn />}
            {zoomed ? "Fit to screen" : "Zoom in"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
