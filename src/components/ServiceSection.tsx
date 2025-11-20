"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

type Service = {
  id: number;
  image: string;
  name: string;
  order: number;
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${API_URL}/service/getAll`);
        const json = await res.json();
        if (json.status === "success") {
          setServices(json.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }
    fetchServices();
  }, []);

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold mb-4">Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {services
          .sort((a, b) => a.order - b.order)
          .map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.name}`}
              className="no-underline"
            >
              <Card className="cursor-pointer hover:shadow-lg transition">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <div className="w-14 h-14 relative mb-2">
                    <img
  src={`${MEDIA_URL}/${service.image}`}
  alt={service.name}
  className="object-contain w-full h-full"
/>
                    {/* <Image
                      src={`${MEDIA_URL}/${service.image}`}
                      alt={service.name}
                      fill
                      className="object-contain"
                    /> */}
                  </div>
                  <span className="text-sm font-medium">{service.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </section>
  );
}
