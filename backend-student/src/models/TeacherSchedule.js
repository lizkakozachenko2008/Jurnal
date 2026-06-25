const { pool } = require('../config/database');

class TeacherSchedule {
  // Получить расписание преподавателя
  static async getByTeacher(teacherEmail) {
    const query = `
      SELECT * FROM schedules
      WHERE teacher_email = $1 OR teacher_name = (SELECT full_name FROM users WHERE email = $1)
      ORDER BY day_of_week, start_time
    `;
    const result = await pool.query(query, [teacherEmail]);
    return result.rows;
  }

  // Получить расписание преподавателя на конкретный день
  static async getByTeacherAndDay(teacherEmail, dayOfWeek) {
    const query = `
      SELECT * FROM schedules
      WHERE (teacher_email = $1 OR teacher_name = (SELECT full_name FROM users WHERE email = $1))
        AND day_of_week = $2
      ORDER BY start_time
    `;
    const result = await pool.query(query, [teacherEmail, dayOfWeek]);
    return result.rows;
  }

  // Добавить занятие в расписание
  static async create({ groupName, subject, teacherName, teacherEmail, dayOfWeek, startTime, endTime, classroom }) {
    const query = `
      INSERT INTO schedules (group_name, subject, teacher_name, teacher_email, day_of_week, start_time, end_time, classroom)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(query, [
      groupName, subject, teacherName, teacherEmail, dayOfWeek, startTime, endTime, classroom
    ]);
    return result.rows[0];
  }

  // Обновить занятие
  static async update(id, { groupName, subject, dayOfWeek, startTime, endTime, classroom }) {
    const query = `
      UPDATE schedules
      SET group_name = COALESCE($1, group_name),
          subject = COALESCE($2, subject),
          day_of_week = COALESCE($3, day_of_week),
          start_time = COALESCE($4, start_time),
          end_time = COALESCE($5, end_time),
          classroom = COALESCE($6, classroom)
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [groupName, subject, dayOfWeek, startTime, endTime, classroom, id]);
    return result.rows[0];
  }

  // Удалить занятие
  static async remove(id) {
    const query = 'DELETE FROM schedules WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = TeacherSchedule;
