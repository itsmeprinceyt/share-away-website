import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, duration = 2000) => {
    setToast(message);

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    setTimeout(() => setToast(null), duration);
  };

  const Toast = () =>
    toast ? (
      <div className=" fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500 to-pink-400
        text-white rounded-lg px-4 py-2 border border-pink-500 hover:scale-105 transition-all duration-300
        shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight text-center max-[500px]:text-xs">
        {toast}
      </div>
    ) : null;

  return { showToast, Toast };
};
