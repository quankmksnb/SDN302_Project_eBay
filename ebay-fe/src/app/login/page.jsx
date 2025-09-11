"use client";
import Button from "@/common/Button";
import Loading, { SimpleLoading } from "@/common/Loading";
import Modal from "@/common/Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigator = useRouter();
  const backToHome = () => {
    navigator.push("/");
  };
  const hanldeClickOpen = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 1000);
  };
  return (
    <div
      className="p-4"
      aria-modal="true"
      role="dialog"
      style={{ height: "2000px" }}
    >
      <Button onClick={hanldeClickOpen}>Open modal</Button>
      {loading ? (
        <Loading type="overlay"/>
      ) : (
        <Modal
          size="xl"
          open={open}
          onClose={() => setOpen(false)}
          title="You're being redirected"
        >
          <p>
            You’ll complete your transaction with our trusted gift cards partner
            on ebay.launchgiftcards.com.
          </p>
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="dark"
              size="sm"
              className="bg-[#707070] h-[40px] !min-w-[60px] text-[14px] mr-2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-[40px] !min-w-[97px] text-[14px]"
              onClick={backToHome}
            >
              Let's go
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
