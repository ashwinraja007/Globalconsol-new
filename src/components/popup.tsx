import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AdmissionPopup = () => {
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("/force majeure notice pdf.pdf");

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        const { data, error } = await supabase.from('popup_section').select('*').eq('id', 1).single();
        if (error) throw error;
        if (data) {
          setIsActive(data.is_active ?? true);
          setPdfUrl(data.pdf_url || "/force majeure notice pdf.pdf");
        }
      } catch (err) {
        const local = localStorage.getItem('fallback_popup_section');
        if (local) {
          const parsed = JSON.parse(local);
          setIsActive(parsed.is_active ?? true);
          setPdfUrl(parsed.pdf_url || "/force majeure notice pdf.pdf");
        }
      }
    };
    fetchPopupData();

    window.addEventListener('website_updated', fetchPopupData);
    return () => window.removeEventListener('website_updated', fetchPopupData);
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => { setOpen(true); }, 3000);
      return () => clearTimeout(timer);
    } else {
      setOpen(false);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-screen h-screen md:max-w-4xl md:h-[90vh] p-0 border-none overflow-hidden bg-white shadow-xl flex items-center justify-center">
        
        <div className="relative w-full h-full flex flex-col">
          
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-20 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>

          {/* Scrollable PDF Viewer */}
          <div className="w-full h-full overflow-y-scroll">
            <iframe
              src={pdfUrl}
              title="Admission PDF"
              className="w-full h-full"
            />
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default AdmissionPopup;
