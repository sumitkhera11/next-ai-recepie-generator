import { checkUserServer } from "@/lib/checkUserServer";


export async function GET() {
  try {
    const user = await checkUserServer();
    return Response.json({ user });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
