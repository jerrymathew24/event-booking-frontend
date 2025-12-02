'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setError('');
            const response = await api.post('/auth/login', data);
            login(response.data.access_token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
