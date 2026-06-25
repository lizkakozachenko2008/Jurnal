const Journal = require('../models/Journal');
const LabSubmission = require('../models/LabSubmission');
const LessonProgram = require('../models/LessonProgram');
const TeacherSchedule = require('../models/TeacherSchedule');
const User = require('../models/User');

class TeacherService {
  // === ЖУРНАЛ ===

  // Получить предметы и группы преподавателя
  static async getSubjects(teacherEmail) {
    return Journal.getTeacherSubjects(teacherEmail);
  }

  // Получить группы преподавателя
  static async getGroups(teacherEmail) {
    return Journal.getTeacherGroups(teacherEmail);
  }

  // Получить студентов группы
  static async getStudents(groupName) {
    return Journal.getGroupStudents(groupName);
  }

  // Получить полный журнал (студенты + оценки + даты занятий + посещаемость)
  static async getFullJournal(subject, groupName) {
    const [students, gradesData, lessonDates, attendance] = await Promise.all([
      Journal.getGroupStudents(groupName),
      Journal.getGrades(subject, groupName),
      Journal.getLessonDates(subject, groupName),
      Journal.getAttendance(subject, groupName),
    ]);

    return {
      students,
      grades: gradesData.grades,
      lessonDates,
      attendance,
    };
  }

  // Добавить дату занятия
  static async addLessonDate(data) {
    return Journal.addLessonDate(data);
  }

  // Удалить дату занятия
  static async removeLessonDate(id) {
    return Journal.removeLessonDate(id);
  }

  // Выставить оценку
  static async setGrade(data) {
    if (data.grade < 0 || data.grade > 100) {
      throw new Error('Оценка должна быть от 0 до 100');
    }
    return Journal.setGrade(data);
  }

  // Обновить оценку
  static async updateGrade(id, data) {
    if (data.grade !== undefined && (data.grade < 0 || data.grade > 100)) {
      throw new Error('Оценка должна быть от 0 до 100');
    }
    return Journal.updateGrade(id, data);
  }

  // Удалить оценку
  static async removeGrade(id) {
    return Journal.removeGrade(id);
  }

  // Отметить посещаемость
  static async setAttendance(data) {
    return Journal.setAttendance(data);
  }

  // Массовое обновление посещаемости
  static async bulkSetAttendance(records) {
    return Journal.bulkSetAttendance(records);
  }

  // === ЛАБОРАТОРНЫЕ РАБОТЫ ===

  // Получить лабораторные работы преподавателя
  static async getLabWorks(teacherEmail) {
    return LabSubmission.getByTeacher(teacherEmail);
  }

  // Создать лабораторную работу
  static async createLabWork(data) {
    return LabSubmission.create(data);
  }

  // Обновить лабораторную работу
  static async updateLabWork(id, data) {
    return LabSubmission.update(id, data);
  }

  // Удалить лабораторную работу
  static async removeLabWork(id) {
    return LabSubmission.remove(id);
  }

  // Получить сдачи по лабораторной
  static async getSubmissions(labWorkId) {
    return LabSubmission.getSubmissions(labWorkId);
  }

  // Получить все сдачи преподавателя
  static async getAllSubmissions(teacherEmail) {
    return LabSubmission.getAllSubmissions(teacherEmail);
  }

  // Проверить работу
  static async checkSubmission(id, data) {
    return LabSubmission.checkSubmission(id, data);
  }

  // Управление командами
  static async createTeam(data) {
    return LabSubmission.createTeam(data);
  }

  static async getTeams(labWorkId) {
    return LabSubmission.getTeams(labWorkId);
  }

  static async removeTeam(labWorkId, teamName) {
    return LabSubmission.removeTeam(labWorkId, teamName);
  }

  // === ПРОГРАММА ПРЕДМЕТА ===

  // Получить программу по предмету
  static async getLessonProgram(subject, teacherEmail) {
    return LessonProgram.getBySubject(subject, teacherEmail);
  }

  // Добавить занятие в программу
  static async addLessonToProgram(data) {
    return LessonProgram.create(data);
  }

  // Обновить занятие в программе
  static async updateLessonInProgram(id, data) {
    return LessonProgram.update(id, data);
  }

  // Удалить занятие из программы
  static async removeLessonFromProgram(id) {
    return LessonProgram.remove(id);
  }

  // === РАСПИСАНИЕ ===

  // Получить расписание преподавателя
  static async getSchedule(teacherEmail) {
    return TeacherSchedule.getByTeacher(teacherEmail);
  }

  // Получить расписание на день
  static async getScheduleByDay(teacherEmail, dayOfWeek) {
    return TeacherSchedule.getByTeacherAndDay(teacherEmail, dayOfWeek);
  }

  // === СТУДЕНТЫ ===

  // Получить всех студентов
  static async getAllStudents() {
    return User.findAllStudents();
  }

  // Деактивировать/активировать студента (отчислить/восстановить)
  static async setStudentActive(id, isActive) {
    return User.setActive(id, isActive);
  }
}

module.exports = TeacherService;
