"use client";

import { ClockLoader } from "react-spinners";
import { useEffect, useState } from "react";

export default function Loader({ slug }) {
    const [dots, setDots] = useState(".");

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev =>
                prev.length >= 3 ? "." : prev + "."
            );
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center text-center max-w-md">

                {/* Spinner */}
                {/* <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-6" /> */}
                {/* Clock Loader */}
                <ClockLoader
                    size={60}
                    color="#ea580c"   // Tailwind orange-600
                    speedMultiplier={1}
                />

                {/* Main Line */}
                <div className="text-center space-y-2">
                    <p className="text-base text-stone-500">
                        Preparing recipe for{dots}
                    </p>

                    <p className="text-2xl font-semibold text-orange-600 animate-pulse tracking-wide">
                        {slug}
                    </p>
                </div>

                {/* Subtext */}
                <p className="mt-3 text-sm text-stone-400">
                    AI is crafting ingredients & instructions just for you
                </p>

            </div>
        </div>
    );
}