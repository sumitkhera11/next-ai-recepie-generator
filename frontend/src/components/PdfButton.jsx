"use client";

// import { PDFDownloadLink } from "@react-pdf/renderer";
import RecipePDF from "@/components/RecipePDF";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
import {Download} from "lucide-react";

const PDFDownloadLink = dynamic(
  () =>
    import("@react-pdf/renderer").then(
      (mod) => mod.PDFDownloadLink
    ),
  { ssr: false }
);


export default function PdfButton({ recipe }) {
    return (
        <PDFDownloadLink
            document={<RecipePDF recipe={recipe} />}
            fileName={`${recipe.slug}.pdf`}
        >
            {({ loading }) => (
                <Button
                    variant="outline"
                    className="border-2 border-orange-600 text-orange-700 hover:bg-orange-50 gap-2"
                    disabled={loading}
                >
                    <Download className="w-4 h-4" />
                    {loading ? "Preparing PDF..." : "Download PDF"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}