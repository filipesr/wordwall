import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: 'horizontal' | 'rectangle' | 'auto';
  className?: string;
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) return;

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const getAdStyle = () => {
    switch (format) {
      case 'horizontal':
        return { display: 'block', width: '100%', height: '50px' };
      case 'rectangle':
        return { display: 'block', width: '300px', height: '250px', margin: '0 auto' };
      default:
        return { display: 'block' };
    }
  };

  const isDev = import.meta.env.DEV;

  if (isDev) {
    return (
      <div
        className={`bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={getAdStyle()}
      >
        [Ad Banner - {format}]
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={getAdStyle()}
      data-ad-client="ca-pub-9170994599683217"
      data-ad-slot={slot}
      data-ad-format={format === 'auto' ? 'auto' : undefined}
      data-full-width-responsive={format === 'horizontal' ? 'true' : undefined}
    />
  );
}
