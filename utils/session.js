import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const sessionOptions = {
    password: process.env.IRON_SESSION_PASSWORD, // At least 32 chars
    cookieName: "myapp_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return await getIronSession(cookieStore, sessionOptions);
}
