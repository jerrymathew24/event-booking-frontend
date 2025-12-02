'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in (e.g., check cookie or local storage if we were using it explicitly)
        // Since we are using httpOnly cookies, we might need an endpoint to "get current user"
        // For now, we'll rely on the presence of a non-httpOnly flag or just try to fetch user profile
        // But we haven't implemented a "me" endpoint yet in the backend properly (except maybe implicitly)
        // Let's assume for this milestone we might store a flag in localStorage or just rely on the API failing.

        // Actually, the backend login returns an accessToken. The plan said "optionally set cookie".
        // The backend code I wrote:
        // res.cookie('access_token', accessToken, ...);
        // return { accessToken };

        // So the client receives the token. We should probably store it in localStorage for easy access 
        // if we want to use it for "isAuthenticated" check on client side, 
        // OR we rely on the cookie.

        // If we rely on the cookie, we need a /me endpoint to verify.
        // The backend UsersController has findOne, but not "me".
        // The AuthController has login/register.

        // Let's implement a simple approach: Store the token in localStorage as well for now 
        // to easily check "isAuthenticated" state, or just trust the cookie and try to fetch data.
        // Given the backend returns { accessToken }, let's store it.

        const token = localStorage.getItem('accessToken');
        if (token) {
            // We could decode it to get user info if it's a JWT
            // For now, let's just set isAuthenticated = true
            // and maybe try to fetch user details if we had an endpoint.
            // We'll decode the JWT payload to get the user ID/email.
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                setUser({ id: payload.sub, email: payload.email, name: payload.name || 'User' });
            } catch (e) {
                console.error("Failed to decode token", e);
                localStorage.removeItem('accessToken');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('accessToken', token);
        // Decode token to set user
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            setUser({ id: payload.sub, email: payload.email, name: payload.name || 'User' });
            router.push('/');
        } catch (e) {
            console.error("Failed to decode token", e);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        // Also call backend to clear cookie if we had a logout endpoint (we don't yet)
        // But we can just clear client state.
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
