import { getSession } from "~/utils/session";

export async function GET() {
    const session = await getSession();
    session.destroy();
    
    return Response.redirect(process.env.NEXT_PUBLIC_APP_URL);
}
