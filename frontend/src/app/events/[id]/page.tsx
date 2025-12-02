'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Event } from '@/types';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

export default function EventDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
                        {error || 'Event not found'}
                    </div>
                </div>
            </div>
        );
    }

    const startDate = new Date(event.startAt).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const startTime = new Date(event.startAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    const endTime = new Date(event.endAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    const seatsLeft = event.capacity - event.seatsBooked;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                                    <span>{startDate}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="h-5 w-5 mr-3 text-blue-600" />
                                    <span>{startTime} - {endTime}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                                    <span>{seatsLeft} seats available ({event.capacity} total)</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Information</h3>
                                <p className="text-gray-600 mb-4">
                                    Reserve your spot now! Only {seatsLeft} seats left.
                                </p>
                                {/* Booking button/form will go here in Milestone 4 */}
                                <button
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={seatsLeft <= 0}
                                >
                                    {seatsLeft > 0 ? 'Book Now' : 'Sold Out'}
                                </button>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Event</h2>
                            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
