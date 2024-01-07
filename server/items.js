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
const pewterMug = buildItem("mug", "A pewter mug. It's empty.");

export const items = [canteen, pewterMug].reduce((acc, item) => {
  acc[item.id] = item;
  acc[item.name] = item;
  return acc;
}, {});
