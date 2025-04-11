const Schedule = require('../admin/schedule.model');
const User = require('../auth/auth.model')
exports.bookSchedule = async (req, res) => {
    try {
      const { scheduleId } = req.params;
      const traineeId = req.user.id;
  
      const schedule = await Schedule.findById(scheduleId);
  
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
  
      // Check if already booked
      if (schedule.trainees.includes(traineeId)) {
        return res.status(400).json({ message: 'You already booked this schedule' });
      }
  
      
      if (schedule.trainees.length >= 10) {
        return res.status(400).json({ message: 'Schedule is full. Please choose another one.' });
      }
  
      // ✅ Add trainee to the schedule
      schedule.trainees.push(traineeId);
      await schedule.save();
  
      res.status(200).json({ message: 'You have successfully booked the schedule' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
      const updates = req.body;
  
      // Optional: prevent password update from here if handled separately
      if (updates.password) {
        return res.status(400).json({ message: "Password update not allowed here" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };


  exports.cancelBooking = async (req,res) => {
    try {
      const { scheduleId } = req.params;
      const userId = req.user._id;
  
      const schedule = await Schedule.findById(scheduleId);
  
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }
  
      // Check if the user is in the trainees array
      const isTrainee = schedule.trainees.some(
        (traineeId) => traineeId.toString() === userId.toString()
      );
  
      if (!isTrainee) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to cancel this schedule",
        });
      }
  
      // Remove the user from the trainees array
      schedule.trainees = schedule.trainees.filter(
        (traineeId) => traineeId.toString() !== userId.toString()
      );
  
      await schedule.save();
  
      return res.status(200).json({
        success: true,
        message: "You have successfully cancelled your booking for this schedule.",
      });
    } catch (error) {
      console.error("Cancel booking error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  