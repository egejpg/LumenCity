"use client";

import { Marker } from "react-leaflet";
import type { Report } from "@/types";

import { useState } from "react";
import StarryModal from "../citizen/StarryModal";

interface ReportPinProps {
  report: Report;
}

export default function ReportPin({ report }: ReportPinProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Marker 
        position={[report.lat, report.lng]}
        eventHandlers={{
          click: () => setShowModal(true)
        }}
      />
      
      {showModal && (
        <StarryModal 
          report={report} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}
