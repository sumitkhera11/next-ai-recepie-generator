"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles } from "lucide-react";
import * as RadixDialog from "@radix-ui/react-dialog";

export default function PricingModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <RadixDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixDialog.Trigger asChild>
        <div className="cursor-pointer inline-flex items-center">
          <Badge className="bg-gray-900 text-white flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Free Plan
          </Badge>
        </div>
      </RadixDialog.Trigger>

      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40" />
        <RadixDialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     bg-white rounded-lg p-6 w-80 shadow-lg"
        >
          <RadixDialog.Title className="text-lg font-semibold mb-2">
            Free Plan
          </RadixDialog.Title>

          <RadixDialog.Description className="text-sm text-gray-600 mb-4">
            You are currently using the free version of the app.
          </RadixDialog.Description>

          <Button
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
