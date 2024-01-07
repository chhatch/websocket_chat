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
const pewterMug = buildItem("pewter mug", "A pewter mug. It's empty.");

export const items = [canteen].reduce((acc, item) => {
  acc[item.id] = item;
  acc[item.name] = item;
  return acc;
}, {});
