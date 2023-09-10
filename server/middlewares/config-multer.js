const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    const date = new Date().toISOString().replace(/[:.]/g, "-");
    const formattedFilename = `${name}-${date}.${extension}`;
    callback(null, formattedFilename);
  },
});

module.exports = multer({ storage: storage }).single("imageUrl");
