'use client';

import Image from 'next/image';

interface DeleteConfirmationDialogProps {
  concertName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationDialog({
  concertName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* Icon and Message */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <Image
              src="/svg/delete.svg"
              alt="Delete"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>
          <div className="text-gray-700 text-center text-lg">
            <p>Are you sure to delete</p>
            <p>&quot;{concertName}&quot;?</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-[#e84e4e] text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

