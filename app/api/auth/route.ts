import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Simple mock check — replace with real auth later
    await new Promise((r) => setTimeout(r, 400));

    if (email === "user@example.com" && password === "password") {
      return NextResponse.json(
        { success: true, token: "mock-token", user: { name: "Demo User", email } },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Bad request" }, { status: 400 });
  }
}
