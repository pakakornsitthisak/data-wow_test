'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api, Concert, Reservation } from '@/lib/api';
import ConcertCard from '@/components/ConcertCard';
import Sidebar from '@/components/Sidebar';
import CreateCard from '@/components/CreateCard';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { ApiError } from '@/lib/api';

export default function AdminPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Create'>('Overview');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [concertToDelete, setConcertToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('userMode', 'admin');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [concertsData, reservationsData] = await Promise.all([
        api.getConcerts(),
        api.getReservations(),
      ]);
      setConcerts(concertsData);
      setReservations(reservationsData);
    } catch (err) {
      setError(err as ApiError | Error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConcert = async (concertId: number) => {
    try {
      setError(null);
      await api.deleteConcert(concertId);
      await loadData();
      setDeleteDialogOpen(false);
      setConcertToDelete(null);
    } catch (err) {
      setError(err as ApiError | Error);
    }
  };

  const openDeleteDialog = (concert: Concert) => {
    setConcertToDelete({ id: concert.id, name: concert.name });
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setConcertToDelete(null);
  };

  const confirmDelete = () => {
    if (concertToDelete) {
      handleDeleteConcert(concertToDelete.id);
    }
  };

  const getReservedCount = (concertId: number) => {
    return reservations.filter(
      (r) => r.concertId === concertId && r.status === 'reserve',
    ).length;
  };

  // Calculate statistics for admin
  const totalSeats = concerts.reduce((sum, concert) => sum + concert.seat, 0);
  const reserveCount = reservations.filter((r) => r.status === 'reserve').length;
  const cancelCount = reservations.filter((r) => r.status === 'cancel').length;

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col overflow-hidden w-full h-full">
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
            {/* Total of seats */}
            <div className="bg-[#0070a4] rounded-lg p-6 text-white flex flex-col items-center justify-center w-full">
              <div className="mb-3">
                <Image
                  src="/svg/total_of_seats.svg"
                  alt="Total of seats"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm font-medium opacity-90 mb-2">Total of seats</div>
              <div className="text-3xl font-bold">{totalSeats}</div>
            </div>
            
            {/* Reserve */}
            <div className="bg-[#01a48b] rounded-lg p-6 text-white flex flex-col items-center justify-center w-full">
              <div className="mb-3">
                <Image
                  src="/svg/reserve.svg"
                  alt="Reserve"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm font-medium opacity-90 mb-2">Reserve</div>
              <div className="text-3xl font-bold">{reserveCount}</div>
            </div>
            
            {/* Cancel */}
            <div className="bg-[#e84e4e] rounded-lg p-6 text-white flex flex-col items-center justify-center w-full">
              <div className="mb-3">
                <Image
                  src="/svg/cancel.svg"
                  alt="Cancel"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm font-medium opacity-90 mb-2">Cancel</div>
              <div className="text-3xl font-bold">{cancelCount}</div>
            </div>
          </div>

          {/* Section 2 - Navigation and Content */}
          <div className="flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Navigation Bar - Fixed */}
            <div className="shrink-0 bg-gray-50 z-10 pb-4 border-b border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('Overview')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'Overview'
                      ? 'text-[#1692ec] border-b-2 border-[#1692ec]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('Create')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'Create'
                      ? 'text-[#1692ec] border-b-2 border-[#1692ec]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create
                </button>
              </div>
            </div>

            {/* Content based on active tab - Scrollable */}
            {activeTab === 'Overview' && (
              <div className="flex flex-col space-y-4 overflow-y-auto flex-1 min-h-0 mt-6 pr-2">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading concerts...</p>
                  </div>
                ) : concerts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-600">No concerts available at the moment.</p>
                  </div>
                ) : (
                  concerts.map((concert) => {
                    const reservedCount = getReservedCount(concert.id);
                    return (
                      <ConcertCard
                        key={concert.id}
                        concert={concert}
                        reservedCount={reservedCount}
                        onDelete={openDeleteDialog}
                        isAdmin={true}
                      />
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'Create' && (
              <div className="overflow-y-auto flex-1 min-h-0 mt-6 pr-2">
                <CreateCard />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        concertName={concertToDelete?.name || ''}
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

