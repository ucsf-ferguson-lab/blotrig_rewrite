export function ErrorPopup({
  error,
  onClose,
}: {
  error: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center">
        <h2 className="text-lg font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
