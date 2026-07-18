const argon2 = require('argon2');
const User = require('../models/User');
const { generateToken } = require('../helpers/tokenHelper');

const register = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una cuenta registrada con este correo electrónico.',
            });
        }

        const hashedPassword = await argon2.hash(password);

        const user = new User({
            nombre,
            correo,
            password: hashedPassword,
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente.',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'El correo electrónico ya está registrado.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario.',
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas. Correo o contraseña inválidos.',
            });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas. Correo o contraseña inválidos.',
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso.',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión.',
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: { user: req.user },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil.',
            error: error.message,
        });
    }
};

module.exports = { register, login, getProfile };