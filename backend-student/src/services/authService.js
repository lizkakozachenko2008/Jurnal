const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../utils/constants');

class AuthService {
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        groupName: user.group_name,
        fullName: user.full_name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static async register(userData) {
    const { email, password, fullName, groupName, role } = userData;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = await User.create({ email, password, fullName, groupName, role });
    const token = this.generateToken(newUser);

    return { token, user: newUser };
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    const isValid = await User.comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Неверный email или пароль');
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  static async getProfile(userId) {
    return User.findById(userId);
  }
}

module.exports = AuthService;
