const { pool } = require('../config/database');

class LessonProgram {
  // Получить программу по предмету
  static async getBySubject(subject, teacherEmail) {
    const query = `
      SELECT * FROM lesson_programs
      WHERE subject = $1 AND teacher_email = $2
      ORDER BY lesson_number ASC
    `;
    const result = await pool.query(query, [subject, teacherEmail]);
    return result.rows;
  }

  // Добавить занятие в программу
  static async create({ subject, teacherEmail, lessonNumber, lessonType, topic, description, materials }) {
    const query = `
      INSERT INTO lesson_programs (subject, teacher_email, lesson_number, lesson_type, topic, description, materials)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      subject, teacherEmail, lessonNumber, lessonType, topic, description, materials || null
    ]);
    return result.rows[0];
  }

  // Обновить занятие
  static async update(id, { lessonType, topic, description, materials, materials_file }) {
    const query = `
      UPDATE lesson_programs
      SET lesson_type = COALESCE($1, lesson_type),
          topic = COALESCE($2, topic),
          description = COALESCE($3, description),
          materials = COALESCE($4, materials),
          materials_file = COALESCE($5, materials_file)
      WHERE id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [lessonType, topic, description, materials, materials_file, id]);
    return result.rows[0];
  }

  // Удалить занятие
  static async remove(id) {
    const query = 'DELETE FROM lesson_programs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Получить все предметы преподавателя с программами
  static async getTeacherPrograms(teacherEmail) {
    const query = `
      SELECT DISTINCT subject FROM lesson_programs
      WHERE teacher_email = $1
      ORDER BY subject
    `;
    const result = await pool.query(query, [teacherEmail]);
    return result.rows.map(r => r.subject);
  }
}

module.exports = LessonProgram;
