const validateRegistration = (req, res, next) => {
  const { email, password, fullName } = req.body;
  const errors = [];
  
  if (!email || !email.includes('@')) {
    errors.push('Введите корректный email');
  }
  
  if (!password || password.length < 6) {
    errors.push('Пароль должен быть не менее 6 символов');
  }
  
  if (!fullName || fullName.length < 2) {
    errors.push('Введите корректное имя');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email и пароль обязательны'
    });
  }
  
  next();
};

module.exports = { validateRegistration, validateLogin };