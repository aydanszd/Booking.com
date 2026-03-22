const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: 'Validation xətası', errors });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `${field} artıq mövcuddur` });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Yanlış ID formatı' });
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token etibarsızdır' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token müddəti bitib' });
    }

    // Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Fayl həcmi 5MB-dan böyükdür' });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Server xətası',
    });
};

module.exports = errorHandler;