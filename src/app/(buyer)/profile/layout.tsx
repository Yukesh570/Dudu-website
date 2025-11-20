import { ReactNode } from "react";
import Link from "next/link";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-2">Hello, User Name</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4 text-lg">
              <Link href="/profile">Manage My Account</Link>
            </h2>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-600 hover:text-blue-600">
                <Link href="/profile/me">My Profile</Link>
              </li>
              <li className="text-gray-600 hover:text-blue-600">
                <Link href="/profile/address">Address Book</Link>
              </li>
            </ul>

            <h2 className="font-semibold mb-4 mt-8 text-lg">My Orders</h2>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-600">My Returns</li>
              <li className="text-gray-600">My Cancellations</li>
            </ul>

            <h2 className="font-semibold mb-4 mt-8 text-lg">My Reviews</h2>

            <p className="font-semibold mt-8 text-blue-600 hover:underline cursor-pointer">
              Sell On Dudu
            </p>
          </div>
        </div>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
