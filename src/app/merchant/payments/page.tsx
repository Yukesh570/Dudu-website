"use client";

import { useEffect, useState } from "react";
import { getPayments, getUserById, getProductById } from "@/lib/apiUtils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

type Payment = {
  id: number;
  amount: string;
  userId: string | null;
  paymentMethod: string;
  productIds: number[] | null;
  paymentstatus: string;
  transactionId: string;
  createdAt: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

type Product = {
  id: number;
  name: string;
  image: string;
  serviceId?: number;
};

export default function OrdersPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersCache, setUsersCache] = useState<Record<string, User>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  const [productsCache, setProductsCache] = useState<Record<string, Product>>(
    {}
  );
  const [loadingProducts, setLoadingProducts] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await getPayments();
        if (res.status === "success") {
          setPayments(res.data);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  async function handleViewUser(userId: string) {
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

  async function handleViewProduct(productId: number) {
    if (productsCache[productId]) return;
    setLoadingProducts((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await getProductById(productId);
      if (res.status === "success") {
        setProductsCache((prev) => ({ ...prev, [productId]: res.data }));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
    }
  }

  if (loading) return <p>Loading payments...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {payments.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Method</th>
                <th className="px-4 py-2 border">Transaction</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Products</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{p.id}</td>
                  <td className="px-4 py-2 border">Rs. {p.amount}</td>
                  <td className="px-4 py-2 border">{p.paymentstatus}</td>
                  <td className="px-4 py-2 border">{p.paymentMethod}</td>
                  <td className="px-4 py-2 border">{p.transactionId}</td>
                  <td className="px-4 py-2 border">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {p.userId ? (
                      usersCache[p.userId] ? (
                        <div>
                          <p className="font-medium">
                            {usersCache[p.userId].firstName}{" "}
                            {usersCache[p.userId].lastName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {usersCache[p.userId].email}
                          </p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleViewUser(p.userId!)}
                          disabled={loadingUsers[p.userId!]}
                        >
                          {loadingUsers[p.userId!]
                            ? "Loading ..."
                            : "View User"}
                        </Button>
                      )
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {p.productIds && p.productIds.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {p.productIds.map((pid) => (
                          <div key={pid} className="flex items-center gap-2">
                            {productsCache[pid] ? (
                              <Link
                                href={`/services/${productsCache[pid].serviceId}`}
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <img
                                  src={`${MEDIA_URL}/${productsCache[pid].image}`}
                                  alt={productsCache[pid].name}
                                  className="w-6 h-6 object-contain rounded"
                                />
                                {productsCache[pid].name}
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewProduct(pid)}
                                disabled={loadingProducts[pid]}
                              >
                                {loadingProducts[pid]
                                  ? "Loading..."
                                  : `Load Product ${pid}`}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
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
