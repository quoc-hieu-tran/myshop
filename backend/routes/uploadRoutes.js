import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();
// Storage: save to /uploads with a unique filename
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // root-level folder
  },
  filename(req, file, cb) {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});
// Only allow images (jpg/jpeg/png)
function fileFilter(req, file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error("Images only (jpg, jpeg, png)"));
}
// Optional: size limit ~1MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});
// POST /api/upload (single file under field name "image")
router.post("/", upload.single("image"), (req, res) => {
  // Multer handled the save; just return a usable path
  res.send({
    message: "Image uploaded",
    image: `/${req.file.path}`, // e.g. /uploads/image-1699999999.jpg
  });
});
export default router;
