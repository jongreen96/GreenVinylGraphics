import { useEffect, useRef, type ReactNode } from "react";

// Native dialogs supply focus trapping, Escape dismissal and focus restoration.
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    dialog.showModal();
    Object.assign(body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      width: "100%",
      overflow: "hidden",
    });
    return () => {
      dialog.close();
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`store-modal ${className}`}
      aria-labelledby={labelledBy}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const targets = [...event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]',
        )].filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
        const first = targets[0];
        const last = targets.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      {children}
    </dialog>
  );
}
