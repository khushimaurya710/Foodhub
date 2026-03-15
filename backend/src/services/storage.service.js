const ImageKit = require("imagekit");

const hasImagekitConfig =
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit = null;

if (hasImagekitConfig) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
} else {
    // Allow the backend to start even if ImageKit isn't configured.
    // Upload calls will fail with a clear error instead of crashing on startup.
    console.warn(
        "ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT in your .env to enable image uploads."
    );
}

async function uploadFile(file, fileName) {
    if (!imagekit) {
        throw new Error(
            "Image upload service is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT in your backend .env file."
        );
    }

    const result = await imagekit.upload({
        file: file,
        fileName: fileName
    });

    return result;
}

module.exports = {
    uploadFile
}