'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const ResponsiveVoiceScript = () => {
  useEffect(() => {
    const checkAndInitVoice = () => {
      if (window.responsiveVoice) {
        try {
          // Test if voice is working with a silent test
          window.responsiveVoice.speak('', 'UK English Female', {
            volume: 0,
            onstart: () => console.log('ResponsiveVoice is working'),
            onend: () => console.log('ResponsiveVoice test complete'),
            onerror: (e) => console.error('ResponsiveVoice test error:', e)
          });
        } catch (error) {
          console.error('Error testing ResponsiveVoice:', error);
        }
      } else {
        console.log('ResponsiveVoice not loaded yet');
      }
    };

    // Check multiple times to ensure initialization
    const interval = setInterval(checkAndInitVoice, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000); // Stop checking after 10 seconds

    // Also initialize on first click
    const handleClick = () => {
      checkAndInitVoice();
      document.removeEventListener('click', handleClick);
    };
    document.addEventListener('click', handleClick);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <Script
      id="responsive-voice"
      src="https://code.responsivevoice.org/responsivevoice.js?key=bVsaYCVM"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('ResponsiveVoice script loaded');
      }}
      onError={(e) => {
        console.error('Error loading ResponsiveVoice:', e);
      }}
    />
  );
};

export default ResponsiveVoiceScript; 