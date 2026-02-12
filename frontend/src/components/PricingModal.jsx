"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PricingModal({ subscriptionTier, children }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isFree = subscriptionTier === "free";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {isFree ? "Upgrade Plan" : "Your Current Plan"}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button>
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4 text-sm">
            {isFree ? (
              <>
                <p>You are currently on the Free plan.</p>
                <p>Upgrade to Starter Plus for more features.</p>

                <Button className="w-full">
                  Upgrade to Starter Plus
                </Button>
              </>
            ) : (
              <>
                <p>You are currently on Starter Plus plan 🎉</p>

                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
