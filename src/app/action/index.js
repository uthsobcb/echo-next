'use server';
import { removeAuthCookie } from "@/app/lib/auth";

export async function doSignOut() {
    await removeAuthCookie();
}