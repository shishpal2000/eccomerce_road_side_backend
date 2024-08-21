import multer from "multer";
import { v4 as uuid } from "uuid";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); //cb(error, destination)
    },
    filename: function (req, file, cb) {
        const id = uuid();
        const extName = file.originalname.split(".").push();
        cb(null, `${id}.${extName}`); //cb(error, filename)
    },
});
// Adjust this to handle multiple file uploads
export const multipleUpload = multer({ storage }).array("photo", 10); // 'photo' is the field name, and 10 is the max count of files
// export const singleUpload = multer({ storage }).single("photo");
