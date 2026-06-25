const { pool } = require('../config/database');

class Journal {
  // Получить все предметы и группы преподавателя
  static async getTeacherSubjects(teacherEmail) {
    const query = `
      SELECT DISTINCT subject, group_name, teacher_name
      FROM schedules
      WHERE teacher_email = $1 OR teacher_name = (SELECT full_name FROM users WHERE email = $1)
      ORDER BY subject, group_name
    `;
    const result = await pool.query(query, [teacherEmail]);
    return result.rows;
  }

  // Получить список студентов группы
  static async getGroupStudents(groupName) {
    const query = `
      SELECT id, email, full_name, group_name, is_active, created_at
      FROM users
      WHERE role = 'student' AND group_name = $1
      ORDER BY full_name
    `;
    const result = await pool.query(query, [groupName]);
    return result.rows;
  }

  // Получить все группы, в которых ведёт преподаватель
  static async getTeacherGroups(teacherEmail) {
    const query = `
      SELECT DISTINCT group_name
      FROM schedules
      WHERE teacher_email = $1 OR teacher_name = (SELECT full_name FROM users WHERE email = $1)
      ORDER BY group_name
    `;
    const result = await pool.query(query, [teacherEmail]);
    return result.rows.map(r => r.group_name);
  }

  // Получить даты занятий по предмету и группе
  static async getLessonDates(subject, groupName) {
    const query = `
      SELECT * FROM lesson_dates
      WHERE subject = $1 AND group_name = $2
      ORDER BY lesson_date ASC
    `;
    const result = await pool.query(query, [subject, groupName]);
    return result.rows;
  }

  // Добавить дату занятия
  static async addLessonDate({ subject, groupName, lessonDate, topic, lessonType, teacherEmail }) {
    const query = `
      INSERT INTO lesson_dates (subject, group_name, lesson_date, topic, lesson_type, teacher_email)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [subject, groupName, lessonDate, topic, lessonType, teacherEmail]);
    return result.rows[0];
  }

  // Удалить дату занятия
  static async removeLessonDate(id) {
    const query = 'DELETE FROM lesson_dates WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Получить оценки по предмету и группе
  static async getGrades(subject, groupName) {
    const studentsQuery = `
      SELECT email, full_name, is_active, created_at
      FROM users
      WHERE role = 'student' AND group_name = $1
      ORDER BY full_name
    `;
    const studentsResult = await pool.query(studentsQuery, [groupName]);
    const students = studentsResult.rows;

    const gradesQuery = `
      SELECT * FROM grades
      WHERE subject = $1 AND student_email IN (SELECT email FROM users WHERE group_name = $2)
      ORDER BY date ASC
    `;
    const gradesResult = await pool.query(gradesQuery, [subject, groupName]);
    const grades = gradesResult.rows;

    return { students, grades };
  }

  // Выставить оценку
  static async setGrade({ studentEmail, studentName, subject, grade, gradeType, date, teacherComment }) {
    const query = `
      INSERT INTO grades (student_email, student_name, subject, grade, grade_type, date, teacher_comment)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [studentEmail, studentName, subject, grade, gradeType, date, teacherComment || null]);
    return result.rows[0];
  }

  // Обновить оценку
  static async updateGrade(id, { grade, teacherComment }) {
    const query = `
      UPDATE grades SET grade = $1, teacher_comment = $2 WHERE id = $3 RETURNING *
    `;
    const result = await pool.query(query, [grade, teacherComment || null, id]);
    return result.rows[0];
  }

  // Удалить оценку
  static async removeGrade(id) {
    const query = 'DELETE FROM grades WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Получить посещаемость
  static async getAttendance(subject, groupName) {
    const query = `
      SELECT * FROM attendance
      WHERE subject = $1 AND student_email IN (SELECT email FROM users WHERE group_name = $2)
      ORDER BY lesson_date ASC
    `;
    const result = await pool.query(query, [subject, groupName]);
    return result.rows;
  }

  // Отметить посещаемость
  static async setAttendance({ studentEmail, studentName, subject, lessonDate, status, minutesLate }) {
    // Проверяем, есть ли уже запись
    const existing = await pool.query(
      'SELECT * FROM attendance WHERE student_email = $1 AND subject = $2 AND lesson_date = $3',
      [studentEmail, subject, lessonDate]
    );

    if (existing.rows.length > 0) {
      const query = `
        UPDATE attendance SET status = $1, minutes_late = $2
        WHERE student_email = $3 AND subject = $4 AND lesson_date = $5
        RETURNING *
      `;
      const result = await pool.query(query, [status, minutesLate || 0, studentEmail, subject, lessonDate]);
      return result.rows[0];
    }

    const query = `
      INSERT INTO attendance (student_email, student_name, subject, lesson_date, status, minutes_late)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [studentEmail, studentName, subject, lessonDate, status, minutesLate || 0]);
    return result.rows[0];
  }

  // Массовое обновление посещаемости
  static async bulkSetAttendance(records) {
    const results = [];
    for (const record of records) {
      const result = await this.setAttendance(record);
      results.push(result);
    }
    return results;
  }
}

module.exports = Journal;
