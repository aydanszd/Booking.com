const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let app;
let isConnected = false;

module.exports = async (req, res) => {
    try {
        if (!app) {
            const connectDB = require('../config/db');
            app = require('../app');
            if (!isConnected) {
                await connectDB();
                isConnected = true;
            }
        }
        return app(req, res);
    } catch (err) {
        console.error('Startup error:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};
