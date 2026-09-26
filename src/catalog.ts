import catalogue from "./products.json";
export const products = catalogue;
export type Product = (typeof products)[number];
export const categories = [
  "All templates",
  "iPhone",
  "iPad",
  "AirPods",
  "Accessories",
  "Bundles",
] as const;
const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
export const money = (value: number) => currency.format(value);
export const featured = [
  "iPhone 14 Pro",
  "iPad Air M1 5th Gen (2022)",
  "Airpod Pro 1st Gen (2019)",
  "iPhone 14 Bundle",
].map((name) => products.find((p) => p.name === name)!);
