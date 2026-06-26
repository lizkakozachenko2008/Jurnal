const Schedule = require('../models/Schedule');
const Grade = require('../models/Grade');
const LabWork = require('../models/LabWork');
const LabSubmission = require('../models/LabSubmission');

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
}

module.exports = StudentService;