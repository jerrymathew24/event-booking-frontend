'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { Calendar, Users } from 'lucide-react';

interface EventCardProps {
    event: Event;
}

export default function EventCard({ event }: EventCardProps) {
    const eventDate = new Date(event.startAt).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const eventTime = new Date(event.startAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{event.description}</p>

                <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{eventDate} • {eventTime}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-4">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                        {event.capacity - event.seatsBooked} seats left / {event.capacity} total
                    </span>
                </div>

                <Link
                    href={`/events/${event.id}`}
                    className="block w-full text-center bg-blue-50 text-blue-600 font-medium py-2 rounded hover:bg-blue-100 transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
