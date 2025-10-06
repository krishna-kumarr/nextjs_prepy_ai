import { google } from "googleapis";

async function GET(req) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    );

    const scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ];

    const url = oauth2Client.generateAuthUrl({
        scope: scopes,
        state: "login"
    });

    // send_email({
    //     template: "registered",
    //     to: "kumarkrishna11231@gmail.com",
    //     data: {}
    // })

    return Response.redirect(url);
}

export default GET;