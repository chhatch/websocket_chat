let itemId = 0;
const buildItem = (name, description) => ({
  id: itemId++,
  name,
  description,
});

export const canteen = buildItem(
  "canteen",
  "A canteen filled with water. It's heavy."
);

export const items = [canteen].reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
