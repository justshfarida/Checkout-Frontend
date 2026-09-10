import http from "node:http";

const items = [
  {
    id: 1,
    name: "Xsolla T-Shirt",
    description: "Classic cotton tee with Xsolla logo. Unisex fit.",
    price: 2500,
    stock: 114,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 2,
    name: "Developer Hoodie",
    description: "Heavyweight pullover hoodie. Perfect for late-night PRs.",
    price: 6000,
    stock: 43,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 3,
    name: "Sticker Pack",
    description: "10-pack of Xsolla and open-source themed stickers.",
    price: 500,
    stock: 282,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    description: "Tenkeyless, Cherry MX Brown switches. USB-C.",
    price: 18000,
    stock: 16,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 5,
    name: "Laptop Stand",
    description: "Aluminium adjustable stand. Folds flat for travel.",
    price: 4500,
    stock: 58,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 6,
    name: "USB-C Hub",
    description: "7-in-1 hub: HDMI 4K, 3× USB-A, SD, microSD, PD.",
    price: 3200,
    stock: 73,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 7,
    name: "Notebook (A5)",
    description: "Dot-grid, 200 pages, lay-flat binding.",
    price: 1200,
    stock: 200,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 8,
    name: "Cable Organiser",
    description: "Leather magnetic cable ties, pack of 6.",
    price: 800,
    stock: 148,
    created_at: "2026-08-06T14:13:17.245506Z",
  },
  {
    id: 9,
    name: "Mechanical Keyboard",
    description: "Compact mechanical keyboard with tactile switches",
    price: 8900,
    stock: 0,
    created_at: "2026-08-24T11:06:39.981634Z",
  },
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url.startsWith("/items")) {
    res.writeHead(200);

    res.end(
      JSON.stringify({
        items,
        limit: 9,
        offset: 0,
        total: items.length,
      }),
    );

    return;
  }

  res.writeHead(404);

  res.end(
    JSON.stringify({
      error: "Not found",
    }),
  );
});

server.listen(8080, "0.0.0.0", () => {
  console.log("Mock API running on port 8080");
});