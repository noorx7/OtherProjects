
import multer from 'multer';
import path from 'path';
import fs from 'fs';


// Set up multer middleware to handle file uploads
export const photoMiddleware = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, callback) => {
            const ext = path.extname(file.originalname);
            const filename = `profile_picture_${Date.now()}${ext}`;
            callback(null, filename);
        }
    }),
    limits: { fileSize: 1024 * 1024 }, // 1 MB file size limit


});

