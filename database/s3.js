const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const path = require('path');

const envPathFileUrl = path.join(__dirname, '../.env');
require('dotenv')
    .config({ path: envPathFileUrl });

const bucketName = process.env.AWS_BUCKET
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename
    }
  
    return s3.upload(uploadParams).promise()
  }
  exports.uploadFile = uploadFile

  function getFileStream(fileKey){
      const downloadParams = {
          Key: fileKey,
          Bucket: bucketName
      }
      return s3.getObject(downloadParams).createReadStream()
  }
  exports.getFileStream = getFileStream