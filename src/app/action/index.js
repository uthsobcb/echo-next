'use server';
import { signIn, signOut } from "auth";

export async function doSignOut() {
    await signOut();
}

export async function login(formData) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,

        });
    } catch (error) {
        throw error;
    }
}