const { pool } = require('../config/database');

class LabSubmission {
  // Получить все лабораторные работы преподавателя
  static async getByTeacher(teacherEmail) {
    const query = `
      SELECT * FROM lab_works
      WHERE teacher_email = $1
      ORDER BY subject, due_date ASC
    `;
    const result = await pool.query(query, [teacherEmail]);
    return result.rows;
  }

  // Создать лабораторную работу
  static async create({ subject, title, description, dueDate, teacherName, teacherEmail, maxScore, isTeamWork, theoryMaterials }) {
    const query = `
      INSERT INTO lab_works (subject, title, description, due_date, teacher_name, teacher_email, max_score, is_team_work, theory_materials)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const result = await pool.query(query, [
      subject, title, description, dueDate, teacherName, teacherEmail,
      maxScore || 100, isTeamWork || false, theoryMaterials || null
    ]);
    return result.rows[0];
  }

  // Обновить лабораторную работу
  static async update(id, { title, description, dueDate, maxScore, isTeamWork, theoryMaterials }) {
    const query = `
      UPDATE lab_works
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          due_date = COALESCE($3, due_date),
          max_score = COALESCE($4, max_score),
          is_team_work = COALESCE($5, is_team_work),
          theory_materials = COALESCE($6, theory_materials)
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, dueDate, maxScore, isTeamWork, theoryMaterials, id]);
    return result.rows[0];
  }

  // Удалить лабораторную работу
  static async remove(id) {
    const query = 'DELETE FROM lab_works WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Получить сдачи по лабораторной работе
  static async getSubmissions(labWorkId) {
    const query = `
      SELECT * FROM lab_submissions
      WHERE lab_work_id = $1
      ORDER BY submitted_at DESC
    `;
    const result = await pool.query(query, [labWorkId]);
    return result.rows;
  }

  // Получить все сдачи преподавателя
  static async getAllSubmissions(teacherEmail) {
    const query = `
      SELECT ls.*, lw.title as lab_title, lw.subject, lw.due_date, lw.max_score, lw.is_team_work
      FROM lab_submissions ls
      JOIN lab_works lw ON ls.lab_work_id = lw.id
      WHERE lw.teacher_email = $1
      ORDER BY ls.submitted_at DESC
    `;
    const result = await pool.query(query, [teacherEmail]);
    return result.rows;
  }

  // Проверить работу (выставить оценку и комментарий)
  static async checkSubmission(id, { score, teacherComment }) {
    const query = `
      UPDATE lab_submissions
      SET score = $1, teacher_comment = $2, status = 'checked', checked_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [score, teacherComment || null, id]);
    return result.rows[0];
  }

  // Получить команды для лабораторной
  static async getTeams(labWorkId) {
    const query = `
      SELECT * FROM student_teams
      WHERE lab_work_id = $1
      ORDER BY team_name, student_name
    `;
    const result = await pool.query(query, [labWorkId]);
    return result.rows;
  }

  // Создать команду
  static async createTeam({ labWorkId, teamName, studentEmail, studentName }) {
    const query = `
      INSERT INTO student_teams (lab_work_id, team_name, student_email, student_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [labWorkId, teamName, studentEmail, studentName]);
    return result.rows[0];
  }

  // Удалить команду
  static async removeTeam(labWorkId, teamName) {
    const query = 'DELETE FROM student_teams WHERE lab_work_id = $1 AND team_name = $2';
    await pool.query(query, [labWorkId, teamName]);
  }
}

module.exports = LabSubmission;
