import { google } from "googleapis";
import { connectToDatabase } from "~/utils/mongodb";
import { getSession } from "~/utils/session";
import { NextResponse } from "next/server";

async function GET(req) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const mode = url.searchParams.get("state"); // 'login' or 'signup'

    if (!code) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=code_not_provided`);
    if (!mode || !["login", "signup"].includes(mode)) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=invalid_mode`);

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
        const { data } = await oauth2.userinfo.get();

        const { db } = await connectToDatabase();
        const usersCollection = db.collection("users_collection");
        const user = await usersCollection.findOne({ email: data.email });

        if (mode === "login") {
            if (!user) {
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=user_not_found`);
            }

            const session = await getSession();
            session.user = {
                id: user._id,
                name: user.name,
                login_mode: user.login_mode,
                email: user.email,
                picture: user.picture,
            };
            await session.save();
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/home`);
        }

        if (mode === "signup") {
            if (user) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=user_already_exists`);

            // const newUser = {
            //     name: data.name,
            //     email: data.email,
            //     picture: data.picture,
            //     login_mode: "Google",
            //     createdAt: new Date(),
            // };
            // const result = await usersCollection.insertOne(newUser);

            // const session = await getSession();
            // session.user = {
            //     id: result.insertedId,
            //     name: newUser.name,
            //     login_mode: newUser.login_mode,
            //     email: newUser.email,
            //     picture: newUser.picture,
            // };
            // await session.save();
            // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/signup?name:${data.name}&email:${data.email}&image:${data.picture}&login_mode:Google`);
        }
    } catch (err) {
        console.error(err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=something_went_wrong`);
    }
}

export default GET;