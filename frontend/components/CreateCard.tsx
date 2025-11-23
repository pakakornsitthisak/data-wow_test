'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CreateCard() {
  const [concertName, setConcertName] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full shadow-sm">
      {/* Section 1: Title "Create" with horizontal divider */}
      <div className="pt-6">
        <div className="px-6">
          <h3 className="text-xl font-semibold text-[#1692ec] mb-4">Create</h3>
        </div>
        <div className="border-b border-gray-200 mx-6"></div>
      </div>

      {/* Section 2: Two input items on the same line */}
      <div className="px-6 py-4">
        <div className="flex flex-row gap-6">
          {/* Item 1: Concert Name */}
          <div className="flex flex-col space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">Concert Name</label>
            <input
              type="text"
              value={concertName}
              onChange={(e) => setConcertName(e.target.value)}
              placeholder="Please input concert name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1692ec] focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Item 2: Total of seat with icon */}
          <div className="flex flex-col space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">Total of seat</label>
            <div className="relative">
              <input
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="Please input total of seats"
                min="1"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1692ec] focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <Image
                  src="/svg/total_of_seats.svg"
                  alt="Total of seats"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Description */}
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please input description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1692ec] focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>
      </div>

      {/* Section 4: Save Button */}
      <div className="px-6 pb-6 flex justify-end">
        <button
          type="button"
          className="bg-[#1690e9] text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
}

