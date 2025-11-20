import {jwtDecode} from "jwt-decode";
import { getAuthToken } from "./apiUtils";

export type DecodedToken = {
  id: number;
  username: string;
  userType: string;
  exp?: number;
  [key: string]: unknown;
};

export function getUserType(): string | null {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const decoded: DecodedToken = jwtDecode(token);
    return decoded.userType || null;
  } catch (err) {
    console.error("Error decoding JWT:", err);
    return null;
  }
}