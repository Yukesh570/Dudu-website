"use client";

import Link from "next/link";
import products from "@/data/products.json";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function MerchantDashboard() {
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.count < 10).length;

  const categoryData = [
    { name: "Electronics", value: 14 },
    { name: "Fashion", value: 8 },
    { name: "Home", value: 5 },
    { name: "Sports", value: 3 },
  ];

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Merchant Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back! Manage your products, track orders, and analyze your store
        performance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Products"
          href="/merchant/products"
          description="Manage and update product listings."
        />
        <DashboardCard
          title="Orders"
          href="/merchant/orders"
          description="Track and fulfill customer orders."
        />
        <DashboardCard
          title="Customers"
          href="/merchant/customers"
          description="View and manage customer profiles."
        />

        <DashboardCard
          title="Payments"
          href="/merchant/payments"
          description="Monitor completed and pending payments."
        />
        <DashboardCard
          title="Inventory"
          href="/merchant/products"
          description="Check stock levels and low stock alerts."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MiniStat title="Total Products" value={totalProducts} />
        <MiniStat title="Low Stock Items" value={lowStock} />
        <MiniStat title="Pending Orders" value={5} />
        <MiniStat title="Completed Orders" value={42} />
      </div>

      <div
        className="p-6 rounded-lg shadow"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-card-foreground)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Categories Overview</h2>
          <Link
            href="/merchant/analytics"
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Continue to Analytics →
          </Link>
        </div>

        <div className="h-64" style={{ overflow: "visible" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-6 rounded-lg shadow bg-card hover:bg-muted transition-colors"
      style={{ color: "var(--color-card-foreground)" }}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

function MiniStat({ title, value }: { title: string; value: number }) {
  return (
    <div
      className="p-6 rounded-lg shadow"
      style={{
        backgroundColor: "var(--color-card)",
        color: "var(--color-card-foreground)",
      }}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
