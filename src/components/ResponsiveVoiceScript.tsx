'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const ResponsiveVoiceScript = () => {
  useEffect(() => {
    const checkAndInitVoice = () => {
      if (window.responsiveVoice) {
        try {
          // Test all main voices with silent initialization
          const testVoices = [
            'UK English Female',
            'Spanish Latin American Female',
            'French Female',
            'Deutsch Female',
            'Hindi Female',
            'Chinese Female',
            'Arabic Female',
            'Japanese Female',
            'Korean Female'
          ];

          const initializeVoice = (index: number) => {
            if (index >= testVoices.length) {
              console.log('All voices initialized');
              return;
            }

            const voice = testVoices[index];
            window.responsiveVoice.speak('', voice, {
              volume: 0,
              onstart: () => console.log(`${voice} initialized`),
              onend: () => initializeVoice(index + 1),
              onerror: (e) => {
                console.error(`${voice} test error:`, e);
                initializeVoice(index + 1);
              }
            });
          };

          initializeVoice(0);
        } catch (error) {
          console.error('Error testing ResponsiveVoice:', error);
        }
      } else {
        console.log('ResponsiveVoice not loaded yet');
      }
    };

    // Check multiple times to ensure initialization
    const interval = setInterval(checkAndInitVoice, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    // Initialize on first user interaction
    const handleInteraction = () => {
      checkAndInitVoice();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
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