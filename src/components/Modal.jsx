const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transform transition-transform duration-300 ease-in-out scale-95 max-h-full overflow-y-auto">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;