const Schedule = require('../models/Schedule');
const Grade = require('../models/Grade');
const LabWork = require('../models/LabWork');

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
}

module.exports = StudentService;