export type Variant = {
  id: string;
  label: string;
  priceCents: number;
  priceOriginal: string;
  codes: string[];
};
export type Dish = {
  id: string;
  number: string;
  name: string;
  description: string;
  category: string;
  priceCents: number;
  priceOriginal: string;
  codes: string[];
  variants: Variant[];
  size?: string;
  spicy?: string | null;
  dietary: string[];
  categoryNote?: string;
  optionGroups?: { id: string; label: string; options: string[] }[];
  group?: string;
  alcohol?: boolean;
  sourcePage: number;
  sourceText: string;
};
export type Selection = {
  itemId: string;
  variantId?: string;
  extras: string[];
  options: Record<string, string>;
  quantity: number;
};
export type CartLine = Selection & { key: string };
