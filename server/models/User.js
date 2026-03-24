const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false, default: null }, // Google OAuth user-lər üçün null ola bilər
    googleId: { type: String, default: null },                  // Google OAuth
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar:   { type: String, default: '' },
    resetPasswordToken:  { type: String, default: null },
    resetPasswordExpire: { type: Date,   default: null },
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
    if (!this.password) return false; // Google OAuth user-i normal login edə bilməz
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);