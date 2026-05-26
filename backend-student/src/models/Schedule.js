const { pool } = require('../config/database');

class Schedule {
  static async findByGroup(groupName) {
    const query = `
      SELECT * FROM schedules 
      WHERE group_name = $1 
      ORDER BY day_of_week, start_time
    `;
    const result = await pool.query(query, [groupName]);
    return result.rows;
  }

  static async getAll() {
    const query = 'SELECT * FROM schedules ORDER BY day_of_week, start_time';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Schedule;