import CryptoJS from "crypto-js";
const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET;
const EXPIRE_TIME = process.env.NEXT_PUBLIC_URL_EXPIRES_SECONDS;
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

export async function decryptData(encrypted) {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
        if (!bytes?.sigBytes) return null;
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
        return null;
    }
}

export async function encryptData(data) {
    try {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET);
        return encrypted.toString();
    } catch (err) {
        return null;
    }
}

export async function encryptEndpointAndRedirect(url) {
    const encrypted = await encryptData({
        url: url,
        expires_in: new Date(Date.now() + EXPIRE_TIME * 1000).toISOString()
    });

    location.href = APP_ENV === 'production' ? `/api/enc__${encrypted}__enc` : `/api/${url}`;
}

export async function encryptEndpoint(url) {
    const encrypted = await encryptData({
        url: url,
        expires_in: new Date(Date.now() + EXPIRE_TIME * 1000).toISOString()
    });

    return APP_ENV === 'production' ? `/api/enc__${encrypted}__enc` : `/api/${url}`;
}