import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); //cb(error, destination)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //cb(error, filename)
  },
});

export const singleUpload = multer({ storage }).single("photo");
