const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Ошибки валидации
  if (err.message.includes('уже существует')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  // Ошибки авторизации
  if (err.message.includes('Неверный') || err.message.includes('пароль')) {
    return res.status(401).json({
      success: false,
      error: err.message
    });
  }
  
  // Ошибки базы данных
  if (err.code) {
    return res.status(500).json({
      success: false,
      error: 'Ошибка базы данных'
    });
  }
  
  // Общая ошибка
  res.status(500).json({
    success: false,
    error: err.message || 'Внутренняя ошибка сервера'
  });
};

module.exports = errorHandler;