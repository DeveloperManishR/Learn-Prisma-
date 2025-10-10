import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {

    console.log("file",file)
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multiImageStorage= multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/product-images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

export const uploadImages = multer({
  storage: storage,
  //fileFilter: multerFilter,
});

export const uploadMultiImages=multer({
  storage:multiImageStorage
}) 

//const upload = multer({ storage })
