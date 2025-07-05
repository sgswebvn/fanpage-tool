"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }
    let decoded: any;
    try {
      decoded = jwt.decode(token);
    } catch {
      router.replace("/auth/login");
      return;
    }
    if (decoded?.role !== "admin") {
      router.replace("/not-authorized");
    }
  }, [router]);

  return <>{children}</>;
}