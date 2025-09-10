'use client';

import dynamic from "next/dynamic";

const DevicePageTest = dynamic(() => import("@/pages/device"), { ssr: false });

export default function DevicePage() {
  return <DevicePageTest />;
}
