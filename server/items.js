let itemId = 0;
const buildItem = (name, description) => ({
  id: itemId++,
  name,
  description,
});

const canteen = buildItem(
  "canteen",
  "A canteen filled with water. It's heavy."
);
const key = buildItem("key", "A small iron key.");
const pewterMug = buildItem("mug", "A pewter mug. It's empty.");
const scepter = buildItem("scepter", "A golden scepter with a red gem.");
const silverCoin = buildItem("coin", "A silver coin.");

export const items = [canteen, key, pewterMug, scepter, silverCoin].reduce(
  (acc, item) => {
    acc[item.id] = item;
    acc[item.name] = item;
    return acc;
  },
  {}
);
