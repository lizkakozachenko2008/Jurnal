const AuthService = require('../services/authService');
const { ValidationError, AuthError } = require('../utils/errors');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, fullName, groupName } = req.body;
      
      const result = await AuthService.register({ email, password, fullName, groupName });
      
      res.status(201).json({
        success: true,
        message: 'Регистрация успешна',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.login(email, password);
      
      res.json({
        success: true,
        message: 'Вход выполнен успешно',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();