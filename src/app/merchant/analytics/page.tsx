"use client";
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAllProducts, getMerchantOrders, getPayments } from "@/lib/apiUtils";

type Product = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  category?: string;
  createdAt?: string;
};

type Order = {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: string;
  userId: number;
  createdAt?: string;
};

type Payment = {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentstatus: string;
  transactionId?: string;
  createdAt?: string;
};

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
];

export default function MerchantAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, ordersRes, paymentsRes] = await Promise.allSettled([
        getAllProducts(),
        getMerchantOrders(),
        getPayments(),
      ]);

      if (productsRes.status === "fulfilled") {
        setProducts(productsRes.value?.data || []);
      }
      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value?.data || []);
      }
      if (paymentsRes.status === "fulfilled") {
        setPayments(paymentsRes.value?.data || []);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load analytics data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stockQuantity || 0),
    0
  );
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10).length;

  // Revenue from payments
  const totalRevenue = payments
    .filter((p) =>
      ["completed", "success"].includes(p.paymentstatus?.toLowerCase())
    )
    .reduce(
      (sum, p) =>
        sum + (typeof p.amount === "number" ? p.amount : Number(p.amount) || 0),
      0
    );

  // Orders metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "delivered"
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  // Extract unique customers from orders
  const uniqueCustomerIds = new Set(orders.map((o) => o.userId));
  const totalCustomers = uniqueCustomerIds.size;

  // Inventory value (stock value at cost)
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * (p.stockQuantity || 0),
    0
  );

  // Average order value
  const avgOrderValue =
    totalOrders > 0
      ? orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0) / totalOrders
      : 0;

  // Order status distribution
  const orderStatusData = [
    { name: "Pending", value: pendingOrders, color: "#f59e0b" },
    { name: "Completed", value: completedOrders, color: "#10b981" },
    { name: "Cancelled", value: cancelledOrders, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  // Payment method distribution
  const paymentMethodData = payments.reduce((acc, payment) => {
    const method = payment.paymentMethod || "Unknown";
    const existing = acc.find((item) => item.name === method);
    if (existing) {
      existing.value += 1;
      existing.amount += payment.amount || 0;
    } else {
      acc.push({ name: method, value: 1, amount: payment.amount || 0 });
    }
    return acc;
  }, [] as { name: string; value: number; amount: number }[]);

  // Top selling products (by order quantity)
  const productOrderCount = orders.reduce((acc, order) => {
    const existing = acc.find((item) => item.productId === order.productId);
    if (existing) {
      existing.quantity += order.quantity || 0;
      existing.revenue += order.totalPrice || 0;
    } else {
      const product = products.find((p) => p.id === order.productId);
      acc.push({
        productId: order.productId,
        name: product?.name || `Product #${order.productId}`,
        quantity: order.quantity || 0,
        revenue: order.totalPrice || 0,
      });
    }
    return acc;
  }, [] as { productId: number; name: string; quantity: number; revenue: number }[]);

  const topProducts = productOrderCount
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
    .map((p) => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
      revenue: p.revenue,
      quantity: p.quantity,
    }));

  // Product category distribution
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    const existing = acc.find((item) => item.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Stock levels overview
  const stockLevels = [
    {
      level: "Low (<10)",
      count: products.filter((p) => p.stockQuantity < 10).length,
    },
    {
      level: "Medium (10-50)",
      count: products.filter(
        (p) => p.stockQuantity >= 10 && p.stockQuantity < 50
      ).length,
    },
    {
      level: "High (50+)",
      count: products.filter((p) => p.stockQuantity >= 50).length,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                ${totalRevenue.toFixed(2)}
              </h3>
            </div>
            <DollarSign className="w-10 h-10 text-green-600 opacity-80" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            From{" "}
            {
              payments.filter(
                (p) =>
                  p.paymentstatus === "completed" ||
                  p.paymentstatus === "success"
              ).length
            }{" "}
            completed payments
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-600 opacity-80" />
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-green-600">{completedOrders} completed</span>
            <span className="text-orange-600">{pendingOrders} pending</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stock</p>
              <h3 className="text-2xl font-bold mt-1">{totalStock}</h3>
            </div>
            <Package className="w-10 h-10 text-purple-600 opacity-80" />
          </div>
          {lowStockProducts > 0 && (
            <p className="text-xs text-orange-600 mt-2">
              {lowStockProducts} low stock items
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
            </div>
            <Users className="w-10 h-10 text-pink-600 opacity-80" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Unique customers</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Selling Products by Revenue
          </h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No order data available
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">
            Order Status Distribution
          </h2>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No order data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          {paymentMethodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "amount") return `$${value.toFixed(2)}`;
                    return value;
                  }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" name="Count" />
                <Bar dataKey="amount" fill="#10b981" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No payment data available
            </div>
          )}
        </div>

        {/* Product Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No product data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 3 - Stock Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Stock Level Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevels} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="level" type="category" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Order Status Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Completed Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {completedOrders}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Pending Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {pendingOrders}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Cancelled Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {cancelledOrders}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg. Order Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              ${avgOrderValue.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Inventory Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              ${inventoryValue.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {totalProducts}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Low Stock Alert</p>
            <p className="text-xl font-bold text-orange-600 mt-1">
              {lowStockProducts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
