const { pool } = require('../config/database');

class LabWork {
  static async findAll(subject = null) {
    let query = 'SELECT * FROM lab_works';
    const params = [];
    
    if (subject) {
      query += ' WHERE subject = $1';
      params.push(subject);
    }
    
    query += ' ORDER BY due_date ASC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM lab_works WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = LabWork;