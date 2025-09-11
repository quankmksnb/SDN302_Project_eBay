"use client";
import Button from "@/common/Button";
import {
  LoadingDots,
  LoadingPulse,
  OverlayLoading,
  SimpleLoading,
  SkeletonLoading,
} from "@/common/Loading";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  // const isLoading = false;
  // if (isLoading)
  //   return (
  //     <>
  //       <SimpleLoading message={"Loading..."}></SimpleLoading>
  //       {/* <LoadingDots></LoadingDots> */}
  //       {/* <LoadingPulse></LoadingPulse> */}
  //       {/* <SkeletonLoading></SkeletonLoading> */}
  //       {/* <OverlayLoading></OverlayLoading> */}
  //     </>
  //   );
  return (
    <main>
      <div style={{ padding: 40, background: "" }}>
        <h1>Test Button Component</h1>

        {/* Primary Button */}
        {/* <Button
          size="lg"
          onClick={handleClick}
          isLoading={loading}
          variant="primary"
        >
          Shop now
        </Button> */}
        <Button
          onClick={handleClick}
          isLoading={loading}
          size="md"
          variant="light"
        >
          Shop now
        </Button>
        <div></div>
        {/* <Button
          onClick={handleClick}
          isLoading={loading}
          size="sm"
          variant="dark"
        >
          Shop now
        </Button> */}
      </div>
    </main>
  );
}
