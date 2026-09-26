import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { products } from "./catalog";
function readBasket(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("gvg-basket") || "[]",
    );
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string =>
                typeof id === "string" && products.some((p) => p.id === id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
const BasketContext = createContext<{
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}>({
  ids: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  isOpen: false,
  open: () => {},
  close: () => {},
});
export function BasketProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(readBasket);
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  useEffect(() => {
    try {
      localStorage.setItem("gvg-basket", JSON.stringify(ids));
    } catch {
      /* The basket still works when storage is unavailable. */
    }
  }, [ids]);
  return (
    <BasketContext
      value={{
        ids,
        isOpen,
        open: () => setIsOpen(true),
        close,
        add: (id) => {
          setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
          setIsOpen(true);
        },
        remove: (id) => setIds((prev) => prev.filter((value) => value !== id)),
        clear: () => setIds([]),
      }}
    >
      {children}
    </BasketContext>
  );
}
export const useBasket = () => useContext(BasketContext);
