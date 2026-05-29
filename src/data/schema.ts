import type { DataSourceSchema } from "@/types/query";

export const schemas: DataSourceSchema[] = [
  {
    id: "users",
    label: "Users Collection",
    fields: [
      { name: "id", label: "ID", type: "string" },
      { name: "name", label: "Name", type: "string" },
      { name: "email", label: "Email", type: "string" },
      { name: "age", label: "Age", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "enum",
        options: ["active", "inactive", "pending"],
      },
      { name: "createdAt", label: "Created At", type: "date" },
    ],
  },
  {
    id: "orders",
    label: "Orders Collection",
    fields: [
      { name: "orderId", label: "Order ID", type: "string" },
      { name: "customerName", label: "Customer Name", type: "string" },
      { name: "total", label: "Total", type: "number" },
      {
        name: "paymentStatus",
        label: "Payment Status",
        type: "enum",
        options: ["paid", "pending", "failed"],
      },
      { name: "createdAt", label: "Created At", type: "date" },
    ],
  },
  {
    id: "products",
    label: "Products Collection",
    fields: [
      { name: "sku", label: "SKU", type: "string" },
      { name: "name", label: "Product Name", type: "string" },
      { name: "price", label: "Price", type: "number" },
      { name: "stock", label: "Stock", type: "number" },
      {
        name: "category",
        label: "Category",
        type: "enum",
        options: ["electronics", "fashion", "books", "home"],
      },
    ],
  },
];
