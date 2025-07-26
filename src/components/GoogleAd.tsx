import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  client: string;
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false); // Track if ad was already pushed

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      script.onload = () => {
        if (!pushedRef.current) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushedRef.current = true;
          } catch (e) {
            console.error('AdSense push error (onload):', e);
          }
        }
      };
    } else {
      if (!pushedRef.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        } catch (e) {
          console.error('AdSense push error:', e);
        }
      }
    }
  }, [client]);

  return (
    <div ref={adRef} className={`google-ad ${className}`} style={{ overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: responsive ? '100%' : undefined,
          height: format === 'auto' ? 'auto' : undefined,
          ...style,
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default GoogleAd;
