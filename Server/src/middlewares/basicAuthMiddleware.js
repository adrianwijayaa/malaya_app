const bcrypt = require('bcrypt');
const Model = require('../models/index.js');
const User  = Model.User; // Import model User

const basicAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Unauthorized: No credentials provided' });
    }

    // Decode Basic Auth (format: "Basic base64(username:password)")
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    
    const [username, password] = credentials.split(':');

    try {
        // Cari user berdasarkan email
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
        }

        // Cek password
        const validPassword = await bcrypt.compare(password, user.password);

        
        if (!validPassword) {
            return res.status(401).json({ message: 'Unauthorized: Invalid password credentials' });
        }

        // Simpan user di req agar bisa digunakan di controller
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = basicAuth;
