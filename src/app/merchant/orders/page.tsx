/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  getUserById,
  getMerchantOrders,
  updateOrderStatus,
} from "@/lib/apiUtils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

type OrderItem = {
  id: number;
  quantity: number;
  price: string;
  __product__: {
    id: number;
    image: string;
    name: string;
    category: string;
    userId: number;
  };
};

type Order = {
  id: number;
  userId: number;
  status: string;
  price: string;
  createdAt: string;
  __orderItems__: OrderItem[];
};

type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

const STATUS_OPTIONS = [
  "OrderPlaced",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Pending",
];

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersCache, setUsersCache] = useState<Record<string, User>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [updatingOrders, setUpdatingOrders] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    fetchMerchantOrdersData();

    const interval = setInterval(() => {
      fetchMerchantOrdersData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function fetchMerchantOrdersData() {
    try {
      const response = await getMerchantOrders();

      if (response.status === "success") {
        const sortedOrders = response.data.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching merchant orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewUser(userId: number) {
    if (usersCache[userId]) return;

    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await getUserById(userId);
      if (res.status === "success") {
        setUsersCache((prev) => ({ ...prev, [userId]: res.data }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  }

  async function handleStatusChange(orderId: number, newStatus: string) {
    setUpdatingOrders((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await updateOrderStatus(orderId, newStatus);

      if (response.status === "success") {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "OrderPlaced":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Items Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border font-medium">{order.id}</td>
                  <td className="px-4 py-2 border">Rs. {order.price}</td>
                  <td className="px-4 py-2 border">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value)
                      }
                      disabled={updatingOrders[order.id]}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updatingOrders[order.id] && (
                      <span className="text-xs text-gray-500 ml-2">
                        Updating...
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {usersCache[order.userId] ? (
                      <div>
                        <p className="font-medium">
                          {usersCache[order.userId].firstName}{" "}
                          {usersCache[order.userId].lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {usersCache[order.userId].email}
                        </p>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleViewUser(order.userId)}
                        disabled={loadingUsers[order.userId]}
                      >
                        {loadingUsers[order.userId]
                          ? "Loading ..."
                          : "View Customer"}
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col gap-2">
                      {order.__orderItems__.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <img
                            src={`${MEDIA_URL}/${item.__product__.image}`}
                            alt={item.__product__.name}
                            className="w-8 h-8 object-contain rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.__product__.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × Rs. {item.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.__product__.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col gap-1">
                      {order.__orderItems__.map((item) => (
                        <div key={item.id} className="text-sm">
                          Rs.{" "}
                          {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
