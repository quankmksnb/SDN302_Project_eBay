import {
  LoadingDots,
  LoadingPulse,
  OverlayLoading,
  SimpleLoading,
  SkeletonLoading,
} from "@/common/Loading";

export default function LoginPage() {
  const isLoading = true;
  if (isLoading)
    return (
      <>
        <SimpleLoading message={"Loading..."}></SimpleLoading>
        {/* <LoadingDots></LoadingDots> */}
        {/* <LoadingPulse></LoadingPulse> */}
        {/* <SkeletonLoading></SkeletonLoading> */}
        {/* <OverlayLoading></OverlayLoading> */}
      </>
    );
  return (
    <main>
      <p className="text-2xl text-white bg-red-500">Bú tailwind màu đỏ</p>
    </main>
  );
}
