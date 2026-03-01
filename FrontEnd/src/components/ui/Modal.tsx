"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-lg p-6 w-[400px]">

        {children}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-red-500"
        >
          Close
        </button>

      </div>

    </div>
  );
}