const userNames = [
  "Aisha Patel",
  "Marcus Chen",
  "Elena Rodriguez",
  "Noah Williams",
  "Priya Shah",
  "Daniel Okafor",
  "Sofia Rossi",
  "Maya Johnson",
  "Liam Carter",
  "Fatima Hassan",
  "Jonas Meyer",
  "Amara Lewis",
];

const productNames = [
  "Wireless Keyboard",
  "Cotton Hoodie",
  "Database Design Book",
  "Ceramic Desk Lamp",
  "Noise Cancelling Earbuds",
  "Running Sneakers",
  "JavaScript Handbook",
  "Storage Basket",
  "Mechanical Mouse",
  "Denim Jacket",
  "Data Structures Guide",
  "Standing Desk Mat",
];

const userStatuses = ["active", "inactive", "pending"];
const paymentStatuses = ["paid", "pending", "failed"];
const productCategories = ["electronics", "fashion", "books", "home"];

const pad = (value: number, width = 2) => String(value).padStart(width, "0");

const createDate = (year: number, offset: number) => {
  const month = (offset % 12) + 1;
  const day = (offset % 27) + 1;

  return `${year}-${pad(month)}-${pad(day)}`;
};

export const mockData = {
  users: Array.from({ length: 120 }, (_, index) => {
    const name = userNames[index % userNames.length];
    const emailName = name.toLowerCase().replaceAll(" ", ".");
    const status = userStatuses[index % userStatuses.length];

    return {
      id: `u${pad(index + 1, 3)}`,
      name,
      email: `${emailName}${index + 1}@example.com`,
      age: 18 + ((index * 7) % 47),
      status,
      createdAt: createDate(2025, index),
    };
  }),

  orders: Array.from({ length: 140 }, (_, index) => {
    const customerName = userNames[index % userNames.length];
    const paymentStatus = paymentStatuses[(index + 1) % paymentStatuses.length];

    return {
      orderId: `ord-${1001 + index}`,
      customerName,
      total: 25 + ((index * 37) % 975),
      paymentStatus,
      createdAt: createDate(2025, index + 2),
    };
  }),

  products: Array.from({ length: 100 }, (_, index) => {
    const name = productNames[index % productNames.length];
    const category = productCategories[index % productCategories.length];

    return {
      sku: `prd-${pad(index + 1, 3)}`,
      name: `${name} ${index + 1}`,
      price: 10 + ((index * 19) % 490),
      stock: (index * 11) % 120,
      category,
    };
  }),
};
