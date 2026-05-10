import { auth } from "./auth";

export async function getAuthSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function isAdmin() {
  try {
    const session = await auth();
    return session?.user?.role === "admin";
  } catch {
    return false;
  }
}
