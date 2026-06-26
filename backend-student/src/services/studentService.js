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
}

module.exports = StudentService;