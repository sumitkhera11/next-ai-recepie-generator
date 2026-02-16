"use client";

import { useState } from "react";
// import { DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useClerk } from "@clerk/nextjs";

// import * as RadixDialog from "@radix-ui/react-RadixDialog";
import * as RadixDialog from "@radix-ui/react-dialog";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";



export default function PricingModal({ subscriptionTier = "free", onUpgrade }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const clerk = useClerk();
    const { user } = useUser();
    const { openCheckout } = useClerk();


  const handleUpgrade = async () => {
  setLoading(true);

  const res = await fetch("/api/checkout", {
    method: "POST",
  });

  const data = await res.json();

  window.location.href = data.url;
};

    // const handleUpgrade = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch("/api/upgrade", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 newTier: "starter_plus",
    //             }),
    //         });

    //         const data = await res.json();
    //         console.log("UPGRADE RESPONSE1:", data);

    //         if (!res.ok) {
    //             throw new Error(data.error || "Upgrade failed");
    //         }

    //         onUpgrade?.("starter_plus");
    //         setIsOpen(false);
    //         router.refresh();

    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // Badge styling
    const badgeClass =
        subscriptionTier === "starter_plus"
            ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white"
            : "bg-gray-700 text-white";

    return (
        <RadixDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            {/* Trigger */}
            <RadixDialog.Trigger asChild>
                <div className="cursor-pointer inline-flex items-center">
                    <Badge className={`${badgeClass} flex items-center gap-1`}>
                        <Sparkles className="h-3 w-3" />
                        {subscriptionTier === "starter_plus" ? "Starter Plus" : "Free Plan"}
                    </Badge>
                </div>
            </RadixDialog.Trigger>

            {/* Modal */}
            <RadixDialog.Portal>
                <RadixDialog.Overlay className="fixed inset-0 bg-black/40" />
                <RadixDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    bg-white rounded-lg p-6 w-80 shadow-lg animate-fade-in">
                    <RadixDialog.Title className="text-lg font-semibold mb-2">
                        Upgrade Your Plan
                    </RadixDialog.Title>
                    <RadixDialog.Description className="text-sm text-gray-600 mb-4">
                        You are currently on <strong>{subscriptionTier}</strong> plan.
                    </RadixDialog.Description>


                    {subscriptionTier === "free" && (
                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? "Upgrading..." : "Upgrade to Starter Plus"}
                        </Button>
                    )}

                    {subscriptionTier === "starter_plus" && (
                        <p className="text-sm text-gray-500 text-center">
                            You already have the Starter Plus plan.
                        </p>
                    )}

                    <Button
                        className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </Button>
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}