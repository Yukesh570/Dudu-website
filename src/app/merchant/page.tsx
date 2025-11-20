"use client";

import products from "@/data/products.json";

export default function MerchantDashboard() {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.count, 0);
  const averageRating = (
    products.reduce((sum, product) => sum + product.rate, 0) / totalProducts
  ).toFixed(1);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.count,
    0
  );

  const pendingOrders = 5;
  const completedOrders = 42;

  const highestPrice = Math.max(...products.map((p) => p.price));
  const lowStock = products.filter((p) => p.count < 10).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {totalProducts}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Total Stock</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-secondary)" }}
          >
            {totalStock}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Average Rating</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-accent)" }}
          >
            ⭐ {averageRating}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Inventory Value</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-tertiary)" }}
          >
            Rs. {totalValue.toLocaleString()}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Pending Orders</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {pendingOrders}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Completed Orders</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-sidebar-primary)" }}
          >
            {completedOrders}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Highest Priced Item</h2>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--color-chart-2)" }}
          >
            Rs. {highestPrice}
          </p>
        </div>

        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Low Stock Items</h2>
          <p
            className="text-3xl font-bold"
            style={{ color: "var(--color-destructive)" }}
          >
            {lowStock}
          </p>
        </div>
      </div>

      {/* Recent Products */}
      <div
        className="mt-8 p-6 rounded-lg shadow"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-card-foreground)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-collapse text-sm"
            style={{ borderColor: "var(--color-border)" }}
          >
            <thead
              style={{
                backgroundColor: "var(--color-muted)",
                color: "var(--color-muted-foreground)",
              }}
            >
              <tr>
                <th
                  className="px-4 py-2 border text-left"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  Name
                </th>
                <th
                  className="px-4 py-2 border text-left"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  Price
                </th>
                <th
                  className="px-4 py-2 border text-left"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  Stock
                </th>
                <th
                  className="px-4 py-2 border text-left"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-muted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td
                    className="px-4 py-2 border font-medium"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {product.name}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    Rs. {product.price.toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {product.count}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    ⭐ {product.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
