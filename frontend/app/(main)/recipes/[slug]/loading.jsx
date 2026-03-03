"use client";
// import Loader from "@/components/ui/Loader";

// export default function Loading({ params }) {
//     const formattedSlug = params?.slug
//         ?.split("-")
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
//     return (
//         <Loader
//             text={
//                 <>
//                     Preparing recipe for{" "}
//                     <span className="font-bold text-black">
//                         {formattedSlug}
//                     </span>
//                     ...
//                 </>
//             }
//         />
//     );
// }
// loading.jsx a Client Component
import { useParams } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function Loading() {
    const params = useParams();
    
  const formattedSlug = params?.slug
    ?.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Loader slug={formattedSlug} />
  );
}