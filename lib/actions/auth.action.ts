'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please log in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            message: 'User created successfully. Please log in.'
        }

    } catch (error: any) {
        console.error('Error creating user:', error);

        if (error.code === 'auth/email-already-in-use') {
            return {
                success: false,
                message: 'Email already in use. Please use a different email address.'
            };
        }

        return {
            success: false,
            message: "Failed to create an account"
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'User not found. Please sign up.'
            }
        }

        await setSessionCookie(idToken);
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000 // 7 days
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
    });
}

export async function getCurrentUser(): Promise<User | null> {
    // Get the session cookie from the request
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection
            ('users')
            .doc(decodedClaims.uid)
            .get();

        if (!userRecord.exists) return null;


        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}
