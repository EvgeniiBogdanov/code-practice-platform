const categories = [
  {
    "title": "Приготовление напитков",
    "parent": "Техника для кухни"
  },
  {
    "title": "Техника для дома",
    "parent": "Бытовая техника"
  },
  {
    "title": "Варочные панели",
    "parent": "Встраиваемая техника"
  },
  {
    "title": "Бытовая техника",
    "parent": null
  },
  {
    "title": "Встраиваемая техника",
    "parent": "Бытовая техника"
  },
  {
    "title": "Духовые шкафы",
    "parent": "Встраиваемая техника"
  },
  {
    "title": "Продукты питания",
    "parent": null
  },
  {
    "title": "Электрочайники и термопоты",
    "parent": "Техника для кухни"
  },
  {
    "title": "Вытяжки",
    "parent": "Встраиваемая техника"
  },
  {
    "title": "Техника для кухни",
    "parent": "Бытовая техника"
  }
];

const createCategoryTree = (list) => {
  const nodeMap = new Map();

  // 1. Создаём узел для каждого элемента (пока без children)
  list.forEach(({ title }) => {
    nodeMap.set(title, { title });
  });

  const roots = [];

  // 2. Расставляем связи parent -> children
  list.forEach(({ title, parent }) => {
    const node = nodeMap.get(title);

    if (parent === null) {
      // корневые узлы всегда получают children (даже пустой массив)
      node.children = node.children || [];
      roots.push(node);
      return;
    }

    const parentNode = nodeMap.get(parent);
    if (!parentNode) return; // защита от "битых" parent, которых нет в списке

    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push(node);
  });

  return roots;
};

console.log(JSON.stringify(createCategoryTree(categories), null, 2));
