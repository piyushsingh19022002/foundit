require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3Config = {
    region: process.env.AWS_REGION || 'us-east-1',
    forcePathStyle: true // Prevents SSL failures when bucket names contain dots
};

if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
    s3Config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    };
}

const s3 = new S3Client(s3Config);

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: function (req, file, cb) {
      if (!process.env.S3_BUCKET_NAME) {
          return cb(new Error("S3_BUCKET_NAME environment variable is required"));
      }
      cb(null, process.env.S3_BUCKET_NAME);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'items/' + uniqueSuffix + '-' + file.originalname);
    }
  })
});

module.exports = {
  upload,
  s3
};
