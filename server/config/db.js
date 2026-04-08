const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsAllowInvalidCertificates: true
        });
        console.log(`✅ MongoDB bağlandı: ${conn.connection.host}`);
    } catch (err) {
        console.error('❌ Bağlana bilmədi:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;