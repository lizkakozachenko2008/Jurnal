module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'student_journal_secret_key',
  JWT_EXPIRES_IN: '7d',
  PORT: process.env.PORT || 5000,
  SALT_ROUNDS: 10
};