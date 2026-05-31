export const mockData = {
  users: [
    {
      id: "u001",
      name: "Aisha Patel",
      email: "aisha@example.com",
      age: 28,
      status: "active",
      createdAt: "2025-01-12",
    },
    {
      id: "u002",
      name: "Marcus Chen",
      email: "marcus@example.com",
      age: 34,
      status: "inactive",
      createdAt: "2025-02-03",
    },
    {
      id: "u003",
      name: "Elena Rodriguez",
      email: "elena@example.com",
      age: 22,
      status: "pending",
      createdAt: "2025-02-18",
    },
  ],
  orders: [
    {
      orderId: "ord-1001",
      customerName: "Aisha Patel",
      total: 240,
      paymentStatus: "paid",
      createdAt: "2025-03-04",
    },
    {
      orderId: "ord-1002",
      customerName: "Marcus Chen",
      total: 89,
      paymentStatus: "pending",
      createdAt: "2025-03-08",
    },
  ],
  products: [
    {
      sku: "prd-001",
      name: "Wireless Keyboard",
      price: 75,
      stock: 32,
      category: "electronics",
    },
    {
      sku: "prd-002",
      name: "Cotton Hoodie",
      price: 45,
      stock: 18,
      category: "fashion",
    },
  ],
};
