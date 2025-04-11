const multer = require("multer");
const path = require("path");

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the directory to store the uploaded images
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // unique file name
    );
  },
});

const fileFilter = (req, file, cb) => {
  // For debugging
  console.log("File upload attempt:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  const allowedMimeTypes = /^image\/(jpeg|png|gif|webp)$/i;

  const extname = allowedExtensions.test(file.originalname.toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    console.log("Rejection reason:", {
      validExtension: extname,
      validMimetype: mimetype,
    });
    cb(
      new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)"),
      false
    );
  }
};

// Set up multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB file size limit
});

module.exports = upload;
