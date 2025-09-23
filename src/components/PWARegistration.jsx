import { useEffect, useState } from 'react';

const PWARegistration = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Hide when running standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Register SW (respect base path if set by Vite)
    if ('serviceWorker' in navigator) {
      const base = import.meta.env.BASE_URL || '/';
      const swUrl = `${base}sw.js`;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setShowInstallButton(true);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      window.deferredPrompt = null;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Always show the button if not installed
    setShowInstallButton(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = window.deferredPrompt;
    const ua = navigator.userAgent || '';
    const vendor = navigator.vendor || '';
    const isEdge = /Edg\//.test(ua);
    const isChrome = /Chrome\//.test(ua) && !isEdge && /Google Inc/.test(vendor);

    if (promptEvent) {
      promptEvent.prompt();
      try { await promptEvent.userChoice; } catch (_) {}
      window.deferredPrompt = null;
      return;
    }

    // If Chrome or Edge: do not show one-line instructions, rely on native prompt only
    if (isChrome || isEdge) {
      return;
    }

    // For all other browsers, show minimal one-line hint
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    if (isIOS) {
      alert('Add to Home Screen: Share button → "Add to Home Screen"');
    } else if (isAndroid) {
      alert('Install app: Browser menu (⋮) → "Install app"');
    } else {
      alert('Install app: Use the install icon in your browser address bar.');
    }
  };

  if (isInstalled) return null;

  return (
    // <div
    //   style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 50 }}
    //   aria-hidden={!showInstallButton}
    // >
    //   {showInstallButton && (
    //     <button
    //       onClick={handleInstallClick}
    //       className="button"
    //       style={{ minWidth: '120px' }}
    //     >
    //       Download not now
    //     </button>
    //   )}
    // </div>
    <></>
  );
};

export default PWARegistration;
