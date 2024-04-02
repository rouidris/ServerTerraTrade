import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const getUserPosts = async (req, res) => {
    try {
        // Retrieve the user by ID
        const user = await User.findById(req.params.userId).populate('posts');

        if (!user) {
            return res.json({
                message: 'User not found.',
            });
        }

        res.json({
            userPosts: user.posts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error getting user posts.',
            error: error.message,
        });
    }
};


// GetAllUsers
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.json({
                message: 'Пользователей не найдено.',
            });
        }

        res.json({
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка при получении пользователей.',
            error: error.message,
        });
    }
};

// test phoneUser
export const test = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Поиск пользователя по userId
        const user = await User.findById(req.userId);

        if (!user) {
            return res.json({
                message: 'Пользователь не найден test',
            });
        }

        // Обновление номера телефона пользователя
        user.phone = phoneNumber;
        await user.save();

        // Генерация нового токена
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        );

        // Отправка ответа с обновленными данными пользователя и токеном
        res.json({
            message: 'Номер телефона обновлен',
            user,
            token
        });
    } catch (error) {
        // Обработка ошибок, если они возникнут
        console.error(error);
        res.status(500).json({ message: 'Произошла ошибка' });
    }
}


// Update role
// Пример обновления роли пользователя на сервере с использованием Express.js и Mongoose (для работы с MongoDB)
export const updateRole = async (req, res) => {
    try {
        // Проверяем, является ли пользователь администратором
        const requestingUser = await User.findById(req.userId);
        if (requestingUser.role !== 'admin') {
            return res.status(403).json({ message: 'Недостаточно прав для изменения ролей пользователей.' });
        }

        const { userId, newRole } = req.body;

        // Проверяем, существует ли пользователь с указанным userId
        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        // Обновляем роль пользователя
        userToUpdate.role = newRole;
        await userToUpdate.save();

        res.json({ message: 'Роль пользователя успешно обновлена.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Произошла ошибка при обновлении роли пользователя.' });
    }
}


// Register user
export const register = async (req, res) => {
    try {
        const { username, password } = req.body
        if (username.length > 15) {
            return res.json({
                message: 'Имя пользователя не может содержать более 15 символов.',
            })
        }

        if (password.length < 8) {
            return res.json({
                message: 'Пароль должен содержать не менее 8 символов.',
            })
        }
        const letterRegex = /[A-Za-z]/
        if (!letterRegex.test(password)) {
            return res.json({
                message: 'Пароль должен содержать хотя бы одну букву.',
            })
        }

        const digitRegex = /\d/
        if (!digitRegex.test(password)) {
            return res.json({
                message: 'Пароль должен содержать хотя бы одну цифру.',
            })
        }
        const isUsed = await User.findOne({ username })

        if (isUsed) {
            return res.json({
                message: 'Данный username уже занят.',
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username,
            password: hash,
        })

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        await newUser.save()

        res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно.',
        })
    } catch (error) {
        console.error(error);
        res.json({ message: 'Ошибка при создании пользователя.' })
    }
}

// Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({
                message: 'Неверный пароль.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            token,
            user,
            message: 'Вы вошли в систему.',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при авторизации.' })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({message: 'Нет доступа из контроллера.'})
    }
}

