const StudentService = require('../services/studentService');

class StudentController {
  async getSchedule(req, res, next) {
    try {
      const groupName = req.user.groupName || req.query.group || 'ИС-41';
      const schedule = await StudentService.getSchedule(groupName);
      
      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async getGrades(req, res, next) {
    try {
      const email = req.user.email || req.query.email;
      const grades = await StudentService.getGrades(email);
      
      res.json({
        success: true,
        data: grades
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubjectGrades(req, res, next) {
    try {
      const { subject } = req.params;
      const email = req.user.email || req.query.email;
      const grades = await StudentService.getSubjectGrades(email, subject);
      
      res.json({
        success: true,
        data: grades
      });
    } catch (error) {
      next(error);
    }
  }

  async getLabWorks(req, res, next) {
    try {
      const { subject } = req.query;
      const labWorks = await StudentService.getLabWorks(subject);
      
      res.json({
        success: true,
        data: labWorks
      });
    } catch (error) {
      next(error);
    }
  }

  async getLabWorkDetails(req, res, next) {
    try {
      const { id } = req.params;
      const labWork = await StudentService.getLabWorkDetails(id);

      if (!labWork) {
        return res.status(404).json({
          success: false,
          error: 'Лабораторная работа не найдена'
        });
      }

      res.json({
        success: true,
        data: labWork
      });
    } catch (error) {
      next(error);
    }
  }

  // Получить собственную сдачу по лабораторной
  async getMySubmission(req, res, next) {
    try {
      const { id } = req.params;
      const submission = await StudentService.getMySubmission(id, req.user.email);
      res.json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  }

  // Сдать лабораторную работу (с файлом)
  async submitLabWork(req, res, next) {
    try {
      const { id } = req.params;
      const { solution_text, team_name } = req.body;
      const fileUrl = req.file ? '/uploads/labs/' + req.file.filename : null;

      const submission = await StudentService.submitLabWork({
        labWorkId: id,
        studentEmail: req.user.email,
        studentName: req.user.fullName,
        solutionText: solution_text || null,
        teamName: team_name || null,
        fileUrl,
      });

      res.status(201).json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }

  // Получить уведомления (новые оценки и комментарии)
  async getNotifications(req, res, next) {
    try {
      const notifications = await StudentService.getNotifications(req.user.email);
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();