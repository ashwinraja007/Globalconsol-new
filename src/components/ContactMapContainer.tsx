import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";

const ContactMapContainer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/d/u/0/embed?mid=1rF5337I7j7xk98at6ZPdMul4aglzrLg&ehbc&ehbc=2E312F&hl=en&output=embed");

  useEffect(() => {
    const fetchMapUrl = async () => {
      try {
        const { data } = await supabase.from('global_presence_section').select('map_url').eq('id', 1).single();
        if (data && data.map_url) {
          setMapUrl(data.map_url);
        }
      } catch (err) {
        console.error("Failed to fetch map url", err);
      }
    };
    fetchMapUrl();
  }, []);

  const handleReload = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
      setIsLoaded(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden relative w-full transition-all duration-300 ease-in-out ${isFullScreen ? 'max-w-full' : 'max-w-6xl'} my-3`}>
        {/* Map Header */}
        <div className="flex justify-between items-center p-3 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
          <h3 className="font-medium text-red-700 flex items-center">
            <span className="hidden sm:inline">Interactive Global Presence Map</span>
            <span className="sm:hidden">Global Map</span>
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReload} className="text-red-600 border-red-200 hover:bg-red-50">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullScreen} className="text-red-600 border-red-200 hover:bg-red-50">
              {isFullScreen ? <>
                  <Minimize2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Compact</span>
                </> : <>
                  <Maximize2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Expand</span>
                </>}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className={`relative transition-all duration-300 ${isFullScreen ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {/* Mask the top black Google bar */}
          <div className="absolute top-0 left-0 w-full h-[50px] bg-white z-10 pointer-events-none" />
          
          <iframe 
            ref={iframeRef} 
            src={mapUrl} 
            title="Interactive Map" 
            className="w-full h-full border-0" 
            loading="eager" 
            style={{
              marginTop: '-125px',
              backgroundColor: 'transparent',
              filter: 'contrast(1.05) saturate(1.1)'
            }} 
            onLoad={() => setIsLoaded(true)}
          ></iframe>
          
          {/* Loading Spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                <p className="mt-3 text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Footer */}
        <div className="py-2 px-4 border-t border-red-100 bg-gradient-to-r from-white to-red-50 text-xs text-gray-500 text-center">
          <p>© 2025 OECL Global Presence Map | Data updated quarterly</p>
        </div>
      </div>
    </div>
  );
};

export default ContactMapContainer;
