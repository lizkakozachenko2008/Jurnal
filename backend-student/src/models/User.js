const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, fullName, groupName, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'student';

    const query = `
      INSERT INTO users (email, password, full_name, role, group_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, role, group_name, is_active, created_at
    `;

    const result = await pool.query(query, [email, hashedPassword, fullName, userRole, groupName || null]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, full_name, role, group_name, is_active, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAllStudents() {
    const query = `
      SELECT id, email, full_name, group_name, is_active, created_at
      FROM users WHERE role = 'student'
      ORDER BY group_name, full_name
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findAllTeachers() {
    const query = `
      SELECT id, email, full_name, role, created_at
      FROM users WHERE role = 'teacher'
      ORDER BY full_name
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async setActive(id, isActive) {
    const query = 'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, email, full_name, role, group_name, is_active';
    const result = await pool.query(query, [isActive, id]);
    return result.rows[0];
  }
}

module.exports = User;
