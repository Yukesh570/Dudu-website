// src/lib/apiUtils.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Cookie Helpers -------------------- */
export function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${
    secure ? "; Secure" : ""
  }`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
}

export function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/* -------------------- JWT Helpers -------------------- */
export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getUserType(): string | null {
  const token = getAuthToken();
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.userType || null;
}

/* -------------------- Auth Helpers -------------------- */
export function getAuthToken(): string | null {
  return (
    getCookie("authToken") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null)
  );
}

export function setAuthToken(token: string) {
  setCookie("authToken", token, 7);
  try {
    localStorage.setItem("authToken", token);
  } catch {}
}

export function clearAuthToken() {
  clearCookie("authToken");
  try {
    localStorage.removeItem("authToken");
  } catch {}
}

/* -------------------- Auth APIs -------------------- */
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.message || "Login failed");

  const token =
    data.token ?? data.access ?? data.access_token ?? data?.data?.token;
  if (!token) throw new Error("Login response missing token");

  setAuthToken(token);

  if (typeof window !== "undefined") {
    window.location.href = "/";
    window.location.reload();
  }

  return token;
}

export function logout() {
  clearAuthToken();
  window.dispatchEvent(new Event('logout'));
  if (typeof window !== "undefined") {
    window.location.href = "/login";
    window.location.reload();
  }
}

/* -------------------- Generic Fetch -------------------- */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  if (!token) throw new Error("No auth token available");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res.json();
}

/* -------------------- Cart APIs -------------------- */
export async function addToCart(productId: number, quantity = 1) {
  return fetchWithAuth(`/cart/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function getCart() {
  const token = getAuthToken();
  if (!token) throw new Error("Not logged in");

  const res = await fetch(`${API_BASE}/cart/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch cart");

  return res.json();
}

/* -------------------- Order APIs -------------------- */
export async function getMerchantOrders() {
  return fetchWithAuth(`/order/getByMerchant`);
}

export async function updateOrderStatus(orderId: number, status: string) {
  return fetchWithAuth(`/order/edit/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function getOrderById(orderId: number) {
  return fetchWithAuth(`/order/getOne/${orderId}`);
}

export async function getAllOrders() {
  return fetchWithAuth(`/order/getAll`);
}

export async function createOrder(orderData: {
  productId?: number;
  quantity?: number;
  items?: Array<{ productId: number; quantity: number }>;
  [key: string]: unknown;
}) {
  return fetchWithAuth(`/order/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
}

export async function deleteOrder(orderId: number) {
  return fetchWithAuth(`/order/delete/${orderId}`, {
    method: "DELETE",
  });
}

/* -------------------- Payments APIs -------------------- */
export async function getPayments() {
  return fetchWithAuth(`/payment/getAll`);
}

export async function getPaymentById(paymentId: number) {
  return fetchWithAuth(`/payment/getOne/${paymentId}`);
}

export async function createPayment(paymentData: {
  amount: number;
  paymentMethod: string;
  productIds?: number[];
  transactionId?: string;
  [key: string]: unknown;
}) {
  return fetchWithAuth(`/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
}

export async function updatePayment(paymentId: number, paymentData: {
  amount?: number;
  paymentMethod?: string;
  paymentstatus?: string;
  [key: string]: unknown;
}) {
  return fetchWithAuth(`/payment/edit/${paymentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
}

export async function deletePayment(paymentId: number) {
  return fetchWithAuth(`/payment/delete/${paymentId}`, {
    method: "DELETE",
  });
}

/* -------------------- User APIs -------------------- */
export async function getUserById(userId: string | number) {
  return fetchWithAuth(`/auth/getOne/${userId}`);
}

export async function getAllUsers() {
  return fetchWithAuth(`/auth/getAll`);
}

/* -------------------- Products APIs -------------------- */
export async function getProductById(productId: number) {
  return fetchWithAuth(`/product/getOne/${productId}`);
}

export async function getAllProducts() {
  return fetchWithAuth(`/product/getAll`);
}

// Public endpoint - no auth required
export async function getAllProductsPublic() {
  const res = await fetch(`${API_BASE}/product/getAll`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(formData: FormData) {
  const token = getAuthToken();
  if (!token) throw new Error("Not logged in");

  const res = await fetch(`${API_BASE}/product/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "Failed to create product");
  }

  return json;
}

export async function updateProduct(id: number, formData: FormData) {
  const token = getAuthToken();
  if (!token) throw new Error("Not logged in");

  const res = await fetch(`${API_BASE}/product/edit/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "Failed to update product");
  }

  return json;
}

export async function deleteProduct(id: number) {
  const token = getAuthToken();
  if (!token) throw new Error("Not logged in");

  const res = await fetch(`${API_BASE}/product/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok || json.status !== "success") {
    throw new Error(json.message || "Failed to delete product");
  }

  return json;
}