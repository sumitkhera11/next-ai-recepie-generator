import { checkScanUsage, incrementScanUsage } from "@/actions/pantry.actions";
import { checkUserServer } from "@/lib/checkUserServer";
import { scanPantryImage } from "@/actions/pantry.actions";
// Better flow:
// Check limit
// Call Gemini
// If Gemini success → increment usage
// If Gemini fails → DO NOT increment

// 1. Auth check
// 2. Parse formData
// 3. Validate image exists
// 4. Validate file type & size
// 5. Check scan usage limit
// 6. Call Gemini Vision
// 7. If success → increment usage
// 8. Return result

export async function POST(req) {
    try {
        const user = await checkUserServer();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1️⃣ Parse formData (NOT req.json for images)
        const formData = await req.formData();
        const imageFile = formData.get("image");

        // 2️⃣ Validate image
        if (!imageFile) {
            return Response.json(
                { error: "Image is required" },
                { status: 400 }
            );
        }
        // 3️⃣ Validate file type
        if (!imageFile.type?.startsWith("image/")) {
            return Response.json(
                { error: "Invalid file type. Only images allowed." },
                { status: 400 }
            );
        }
        // 4️⃣ Validate file size (example: 5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (imageFile.size > MAX_SIZE) {
            return Response.json(
                { error: "Image too large (max 5MB)." },
                { status: 400 }
            );
        }

        // 1️⃣ Check limit
        const usage = await checkScanUsage();

        if (!usage?.allowed) {
            return Response.json(
                { error: "Free limit reached. Upgrade plan." },
                { status: 403 }
            );
        }
        // Call Gemini
        // 🔥 Generate recipe here
        // If Gemini success → increment usage
        // {
        //     "userPrompt": "Generate a healthy high-protein vegetarian dinner recipe"
        // }
        const scannedData = await scanPantryImage(formData);
        if (!scannedData || !scannedData.success) {
            return Response.json({ error: "AI failed to detect ingredient" }, { status: 500 });
        }

        // 3️⃣ Increment ONLY after success
        await incrementScanUsage( usage.currentUsage);

        return Response.json({
            success: true,
            ingredients: scannedData.ingredients,
            remainingScan: usage.remaining - 1,
        });

    } catch (error) {
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}