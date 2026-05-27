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
}

module.exports = new StudentController();