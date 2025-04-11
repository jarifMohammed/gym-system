const Schedule = require('../admin/schedule.model');

exports.getAvailableSchedules = async (req, res) => {
    try {
      const schedules = await Schedule.find().populate('trainer');
  
      // Filter out full schedules (>= 10)
      const available = schedules.filter(sch => sch.trainees.length < 10);
  
      res.status(200).json(available);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  