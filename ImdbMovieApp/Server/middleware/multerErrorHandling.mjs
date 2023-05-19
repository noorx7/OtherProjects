
import multer from "multer";
// error handling middleware to handle multer errors
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: 'File too large, Upload Something Below 1MB!' });
    } else {
        next(err);
    }
};