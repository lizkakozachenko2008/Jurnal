const { pool } = require('../config/database');

class Grade {
  static async findByStudent(email) {
    const query = 'SELECT * FROM grades WHERE student_email = $1 ORDER BY date DESC';
    const result = await pool.query(query, [email]);
    return result.rows;
  }

  static async findByStudentAndSubject(email, subject) {
    const query = 'SELECT * FROM grades WHERE student_email = $1 AND subject = $2 ORDER BY date DESC';
    const result = await pool.query(query, [email, subject]);
    return result.rows;
  }

  static async findRecentByStudent(email, days) {
    const query = `
      SELECT * FROM grades
      WHERE student_email = $1 AND date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY date DESC
    `;
    const result = await pool.query(query, [email]);
    return result.rows;
  }
}

module.exports = Grade;