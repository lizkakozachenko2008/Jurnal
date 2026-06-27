const Schedule = require('../models/Schedule');
const Grade = require('../models/Grade');
const LabWork = require('../models/LabWork');
const LabSubmission = require('../models/LabSubmission');
const { pool } = require('../config/database');

class StudentService {
  static async getSchedule(groupName) {
    return Schedule.findByGroup(groupName);
  }

  static async getGrades(email) {
    return Grade.findByStudent(email);
  }

  static async getSubjectGrades(email, subject) {
    return Grade.findByStudentAndSubject(email, subject);
  }

  static async getLabWorks(subject = null) {
    return LabWork.findAll(subject);
  }

  static async getLabWorkDetails(id) {
    return LabWork.findById(id);
  }

  static async getMySubmission(labWorkId, studentEmail) {
    return LabSubmission.findByStudent(labWorkId, studentEmail);
  }

  static async getTeamMembers(labWorkId, studentEmail) {
    return LabSubmission.getTeamMembers(labWorkId, studentEmail);
  }

  static async submitLabWork({ labWorkId, studentEmail, studentName, solutionText, teamName, fileUrl }) {
    return LabSubmission.createSubmission({
      labWorkId,
      studentEmail,
      studentName,
      solutionText,
      teamName,
      fileUrl,
    });
  }

  static async getNotifications(studentEmail) {
    // Последние оценки (за последние 7 дней)
    const recentGrades = await Grade.findRecentByStudent(studentEmail, 7);
    // Последние проверки лабораторных с комментариями
    const recentChecks = await LabSubmission.findRecentChecks(studentEmail, 7);

    const notifications = [];

    for (const g of recentGrades) {
      notifications.push({
        id: `grade_${g.id}`,
        type: 'grade',
        message: `Новая оценка ${g.grade}/10 по предмету "${g.subject}"`,
        date: g.date,
        read: false,
      });
    }

    for (const s of recentChecks) {
      notifications.push({
        id: `check_${s.id}`,
        type: 'comment',
        message: `Преподаватель проверил работу${s.teacher_comment ? ': ' + s.teacher_comment : ''}`,
        date: s.checked_at,
        score: s.score,
        read: false,
      });
    }

    // Сортировать по дате (новые первыми)
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    return notifications;
  }

  // Журнал студента: оценки и посещаемость по предметам и датам
  static async getJournal(studentEmail, groupName) {
    // Получить все предметы группы
    const subjectsQuery = `SELECT DISTINCT subject FROM schedules WHERE group_name = $1 ORDER BY subject`;
    const subjectsResult = await pool.query(subjectsQuery, [groupName]);
    const subjects = subjectsResult.rows.map(r => r.subject);

    const journal = [];

    for (const subject of subjects) {
      // Даты занятий
      const datesQuery = `
        SELECT * FROM lesson_dates
        WHERE subject = $1 AND group_name = $2
        ORDER BY lesson_date ASC
      `;
      const datesResult = await pool.query(datesQuery, [subject, groupName]);
      const lessonDates = datesResult.rows;

      // Оценки студента по предмету
      const gradesQuery = `
        SELECT * FROM grades
        WHERE student_email = $1 AND subject = $2
        ORDER BY date ASC
      `;
      const gradesResult = await pool.query(gradesQuery, [studentEmail, subject]);
      const grades = gradesResult.rows;

      // Посещаемость студента по предмету
      const attendanceQuery = `
        SELECT * FROM attendance
        WHERE student_email = $1 AND subject = $2
        ORDER BY lesson_date ASC
      `;
      const attendanceResult = await pool.query(attendanceQuery, [studentEmail, subject]);
      const attendance = attendanceResult.rows;

      // Лабораторные по предмету
      const labsQuery = `
        SELECT * FROM lab_works
        WHERE subject = $1
        ORDER BY due_date ASC
      `;
      const labsResult = await pool.query(labsQuery, [subject]);
      const labs = labsResult.rows;

      journal.push({
        subject,
        lessonDates,
        grades,
        attendance,
        labs,
      });
    }

    return journal;
  }
}

module.exports = StudentService;