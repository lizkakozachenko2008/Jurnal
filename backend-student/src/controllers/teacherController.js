const TeacherService = require('../services/teacherService');
const LessonProgram = require('../models/LessonProgram');

class TeacherController {
  // === ЖУРНАЛ ===

  // Получить предметы и группы преподавателя
  async getSubjects(req, res, next) {
    try {
      const subjects = await TeacherService.getSubjects(req.user.email);
      res.json({ success: true, data: subjects });
    } catch (error) {
      next(error);
    }
  }

  // Получить группы преподавателя
  async getGroups(req, res, next) {
    try {
      const groups = await TeacherService.getGroups(req.user.email);
      res.json({ success: true, data: groups });
    } catch (error) {
      next(error);
    }
  }

  // Получить полный журнал
  async getFullJournal(req, res, next) {
    try {
      const { subject, groupName } = req.params;
      const journal = await TeacherService.getFullJournal(subject, groupName);
      res.json({ success: true, data: journal });
    } catch (error) {
      next(error);
    }
  }

  // Добавить дату занятия
  async addLessonDate(req, res, next) {
    try {
      const { subject, groupName, lessonDate, topic, lessonType } = req.body;
      const lessonDateObj = await TeacherService.addLessonDate({
        subject,
        groupName,
        lessonDate,
        topic,
        lessonType: lessonType || 'lecture',
        teacherEmail: req.user.email,
      });
      res.status(201).json({ success: true, data: lessonDateObj });
    } catch (error) {
      next(error);
    }
  }

  // Удалить дату занятия
  async removeLessonDate(req, res, next) {
    try {
      const { id } = req.params;
      await TeacherService.removeLessonDate(id);
      res.json({ success: true, message: 'Дата занятия удалена' });
    } catch (error) {
      next(error);
    }
  }

  // Выставить оценку
  async setGrade(req, res, next) {
    try {
      const { studentEmail, studentName, subject, grade, gradeType, date, teacherComment } = req.body;
      const gradeObj = await TeacherService.setGrade({
        studentEmail,
        studentName,
        subject,
        grade: parseInt(grade, 10),
        gradeType: gradeType || 'lecture',
        date: date || new Date().toISOString().split('T')[0],
        teacherComment,
      });
      res.status(201).json({ success: true, data: gradeObj });
    } catch (error) {
      next(error);
    }
  }

  // Обновить оценку
  async updateGrade(req, res, next) {
    try {
      const { id } = req.params;
      const { grade, teacherComment } = req.body;
      const data = {};
      if (grade !== undefined) data.grade = parseInt(grade, 10);
      if (teacherComment !== undefined) data.teacherComment = teacherComment;
      const gradeObj = await TeacherService.updateGrade(id, data);
      res.json({ success: true, data: gradeObj });
    } catch (error) {
      next(error);
    }
  }

  // Удалить оценку
  async removeGrade(req, res, next) {
    try {
      const { id } = req.params;
      await TeacherService.removeGrade(id);
      res.json({ success: true, message: 'Оценка удалена' });
    } catch (error) {
      next(error);
    }
  }

  // Отметить посещаемость
  async setAttendance(req, res, next) {
    try {
      const { studentEmail, studentName, subject, lessonDate, status, minutesLate } = req.body;
      const attendance = await TeacherService.setAttendance({
        studentEmail,
        studentName,
        subject,
        lessonDate,
        status,
        minutesLate: minutesLate || 0,
      });
      res.status(201).json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  }

  // Массовое обновление посещаемости
  async bulkSetAttendance(req, res, next) {
    try {
      const { records } = req.body;
      const result = await TeacherService.bulkSetAttendance(records);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // === ЛАБОРАТОРНЫЕ РАБОТЫ ===

  // Получить лабораторные работы преподавателя
  async getLabWorks(req, res, next) {
    try {
      const labWorks = await TeacherService.getLabWorks(req.user.email);
      res.json({ success: true, data: labWorks });
    } catch (error) {
      next(error);
    }
  }

  // Создать лабораторную работу
  async createLabWork(req, res, next) {
    try {
      const { subject, title, description, dueDate, maxScore, isTeamWork, theoryMaterials } = req.body;
      const labWork = await TeacherService.createLabWork({
        subject,
        title,
        description,
        dueDate,
        teacherName: req.user.fullName,
        teacherEmail: req.user.email,
        maxScore: maxScore || 100,
        isTeamWork: isTeamWork || false,
        theoryMaterials,
      });
      res.status(201).json({ success: true, data: labWork });
    } catch (error) {
      next(error);
    }
  }

  // Обновить лабораторную работу
  async updateLabWork(req, res, next) {
    try {
      const { id } = req.params;
      const labWork = await TeacherService.updateLabWork(id, req.body);
      res.json({ success: true, data: labWork });
    } catch (error) {
      next(error);
    }
  }

  // Удалить лабораторную работу
  async removeLabWork(req, res, next) {
    try {
      const { id } = req.params;
      await TeacherService.removeLabWork(id);
      res.json({ success: true, message: 'Лабораторная работа удалена' });
    } catch (error) {
      next(error);
    }
  }

  // Получить сдачи по лабораторной
  async getSubmissions(req, res, next) {
    try {
      const { labWorkId } = req.params;
      const submissions = await TeacherService.getSubmissions(labWorkId);
      res.json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  }

  // Получить все сдачи преподавателя
  async getAllSubmissions(req, res, next) {
    try {
      const submissions = await TeacherService.getAllSubmissions(req.user.email);
      res.json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  }

  // Проверить работу
  async checkSubmission(req, res, next) {
    try {
      const { id } = req.params;
      const { score, teacherComment } = req.body;
      const submission = await TeacherService.checkSubmission(id, {
        score: score !== undefined ? parseInt(score, 10) : undefined,
        teacherComment,
      });
      res.json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  }

  // Создать команду
  async createTeam(req, res, next) {
    try {
      const { labWorkId, teamName, studentEmail, studentName } = req.body;
      const team = await TeacherService.createTeam({ labWorkId, teamName, studentEmail, studentName });
      res.status(201).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  // Получить команды лабораторной
  async getTeams(req, res, next) {
    try {
      const { labWorkId } = req.params;
      const teams = await TeacherService.getTeams(labWorkId);
      res.json({ success: true, data: teams });
    } catch (error) {
      next(error);
    }
  }

  // Удалить команду
  async removeTeam(req, res, next) {
    try {
      const { labWorkId, teamName } = req.params;
      await TeacherService.removeTeam(labWorkId, teamName);
      res.json({ success: true, message: 'Команда удалена' });
    } catch (error) {
      next(error);
    }
  }

  // === ПРОГРАММА ПРЕДМЕТА ===

  // Получить программу по предмету
  async getLessonProgram(req, res, next) {
    try {
      const { subject } = req.params;
      const program = await TeacherService.getLessonProgram(subject, req.user.email);
      res.json({ success: true, data: program });
    } catch (error) {
      next(error);
    }
  }

  // Добавить занятие в программу
  async addLessonToProgram(req, res, next) {
    try {
      const { subject, lessonNumber, lessonType, topic, description, materials } = req.body;
      const lesson = await TeacherService.addLessonToProgram({
        subject,
        teacherEmail: req.user.email,
        lessonNumber,
        lessonType,
        topic,
        description,
        materials,
      });
      res.status(201).json({ success: true, data: lesson });
    } catch (error) {
      next(error);
    }
  }

  // Обновить занятие в программе
  async updateLessonInProgram(req, res, next) {
    try {
      const { id } = req.params;
      const lesson = await TeacherService.updateLessonInProgram(id, req.body);
      res.json({ success: true, data: lesson });
    } catch (error) {
      next(error);
    }
  }

  // Удалить занятие из программы
  async removeLessonFromProgram(req, res, next) {
    try {
      const { id } = req.params;
      await TeacherService.removeLessonFromProgram(id);
      res.json({ success: true, message: 'Занятие удалено из программы' });
    } catch (error) {
      next(error);
    }
  }

  // === РАСПИСАНИЕ ===

  // Получить расписание преподавателя
  async getSchedule(req, res, next) {
    try {
      const schedule = await TeacherService.getSchedule(req.user.email);
      res.json({ success: true, data: schedule });
    } catch (error) {
      next(error);
    }
  }

  // === СТУДЕНТЫ ===

  // Получить всех студентов
  async getAllStudents(req, res, next) {
    try {
      const students = await TeacherService.getAllStudents();
      res.json({ success: true, data: students });
    } catch (error) {
      next(error);
    }
  }

  // Деактивировать/активировать студента
  async setStudentActive(req, res, next) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const student = await TeacherService.setStudentActive(id, isActive);
      res.json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }

  // Загрузить PDF к занятию программы
  async uploadProgramFile(req, res, next) {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Файл не загружен' });
      }
      const filePath = '/uploads/programs/' + req.file.filename;
      await LessonProgram.update(id, { materials_file: filePath });
      res.json({ success: true, data: { file_url: filePath } });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = new TeacherController();

