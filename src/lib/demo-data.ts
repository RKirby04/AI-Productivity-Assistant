const d = new Date().toISOString().slice(0, 10);

const items = ["Croissants", "Sourdough loaf", "Blueberry muffins", "Red velvet cupcakes", "Birthday cake", "Cinnamon rolls"];
const names = ["Thandi M.", "James K.", "Aisha P.", "Lerato N.", "Pieter V.", "Naledi S.", "Ravi G.", "Zanele D."];
const statuses = ["Baking", "Ready", "Pending", "Collected"] as const;

export const DEMO_ORDERS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  customer: names[i % names.length],
  item: items[i % items.length],
  qty: [6, 2, 4, 3, 1, 5][i % 6] + (i % 3 === 0 ? 1 : 0),
  date: d,
  time: `${8 + (i % 9)}:${i % 2 ? "30" : "00"}`,
  status: i < 7 ? "Ready" : statuses[(i % 3) + (i % 3 === 1 ? 1 : 0)] === "Ready" ? "Pending" : statuses[(i % 3) === 1 ? 2 : i % 2 ? 0 : 3],
}));

export const DEMO_STOCK = [
  { name: "Butter", qty: 2, min: 5, unit: "kg" },
  { name: "Cake flour", qty: 18, min: 10, unit: "kg" },
  { name: "Eggs", qty: 30, min: 60, unit: "eggs" },
  { name: "Cocoa powder", qty: 0.5, min: 2, unit: "kg" },
  { name: "Sugar", qty: 12, min: 8, unit: "kg" },
];
