export const itemImages = {
  60: "/images/blade.svg",
  61: "/images/orb.svg",
  62: "/images/armor.svg",
  63: "/images/wings.svg",
  64: "/images/boost.svg",
};

export function getItemImage(itemId) {
  return itemImages[itemId] ?? null;
}