const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
    // Convert buffer to base64 string
    const base64File = file.toString('base64');

    const result = await imagekit.upload({
        file: base64File,
        fileName: fileName, // Note: ImageKit uses 'fileName' not 'filename'
    });

    return result;
}

module.exports = {
    uploadFile,
};