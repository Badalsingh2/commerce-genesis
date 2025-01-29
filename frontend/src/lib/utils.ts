import { Roles } from "@/types/globals";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkRole = async (role: Roles) => {
  const response = await fetch('/api/check-role');
  const data = await response.json();
  return data.role === role;
}

export const setRole = async (role: Roles, userId: string) => {
  const response = await fetch('/api/set-role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, role }),
  });
  const data = await response.json();
  return data;
}

export const getRole = async () => {
  const response = await fetch('/api/check-role');
  const data = await response.json();
  return data.role;
}
