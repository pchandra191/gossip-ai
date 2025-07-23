import React, { useEffect } from 'react';

// Extend Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: {
      push: (params: Record<string, unknown>) => void;
    }[];
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

export const GoogleAd: React.FC<GoogleAdProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
}) => {
  useEffect(() => {
    // Check if window and window.adsbygoogle are defined
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        // Push the ad to Google's ad service
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className={`google-ad ${className}`} style={{ overflow: 'hidden', ...style }}>
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