const bcrypt = require('bcrypt');
const Model = require('../models/index.js');
const User  = Model.User; 
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already registered' });
        }

        // Hash password sebelum disimpan
        const saltRounds = 10; // Jumlah perulangan hashing (semakin tinggi, semakin aman)
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        //const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user ke database
        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username credentials' });
        }

        // Cek password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password credentials' });
        }

        //Buat token JWT (optional)
        const token = jwt.sign({ id: user.id, username: user.username }, 'secretKey', { expiresIn: '12h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login };
