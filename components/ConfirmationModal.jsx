import { AlertTriangle } from "lucide-react";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        // FIX: Added 'backdrop-blur-sm' to the overlay div to create the blur effect
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-500/20 p-2 rounded-full">
                        <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                <p className="text-gray-300 mb-6">{children}</p>
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};