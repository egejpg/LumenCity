"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/types";

export function useRole() {
  const [role, setRole] = useState<UserRole>("citizen");

  useEffect(() => {
    const saved = localStorage.getItem("lumen_role") as UserRole | null;
    if (saved) setRole(saved);
  }, []);

  function switchRole(newRole: UserRole) {
    setRole(newRole);
    localStorage.setItem("lumen_role", newRole);
  }

  return { role, switchRole };
}
