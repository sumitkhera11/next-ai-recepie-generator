"use client"

import { useFormStatus } from "react-dom"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function GenerateButton() {

  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="primary"
      size="default"
      disabled={pending}
      className="gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating with AI...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate
        </>
      )}
    </Button>
  )
}
