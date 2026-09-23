const formatter = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });

export function formatRinggit(amount: number): string {
  return `RM${formatter.format(Math.round(amount))}`;
}

export function parseRinggit(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}
