'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setError('');
            await api.post('/auth/register', data);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
                    </div>
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
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
