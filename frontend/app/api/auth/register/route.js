export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password, username } = body;

    if (!email || !password || !username) {
      return Response.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // 🔥 call Strapi register API
    const res = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (!res.ok) {
      return Response.json(
        { error: data.error?.message || "Signup failed" },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      user: data.user,
    });

  } catch (err) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}