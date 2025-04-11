const Schedule = require("./schedule.model");
const User = require("../auth/auth.model");
const mongoose = require("mongoose");
// Create a new schedule without assigning a trainer
exports.createSchedule = async (req, res) => {
  try {
    const { day, startTime } = req.body;
    const adminId = req.user.id; // Admin ID from the decoded token

    const start = parseInt(startTime.split(":")[0]);
    const end = start + 2;
    const endTime = `${end}:00`;

    // Check if the admin has already created 5 schedules on the same day
    const scheduleCount = await Schedule.countDocuments({
      day: new Date(day),
      createdBy: adminId,
    });

    if (scheduleCount >= 5) {
      return res
        .status(400)
        .json({ message: "Max 5 schedules allowed per day" });
    }

    // Create the schedule without assigning a trainer
    const schedule = await Schedule.create({
      day: new Date(day),
      startTime,
      endTime,
      createdBy: adminId,
      trainer: null, // Initially no trainer assigned
      trainees: [], // No trainees yet
    });

    res
      .status(201)
      .json({ message: "Schedule created successfully", schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Assign a trainer to an existing schedule
exports.assignTrainer = async (req, res) => {
  try {
    // 1. Get the scheduleId from route parameters and trainerId from request body
    const { scheduleId } = req.params; // Schedule ID from URL params
    const { trainerId } = req.body; // Trainer ID from request body

    // 2. Log the received scheduleId and trainerId to verify they're correct
    console.log("Received scheduleId from params:", scheduleId);
    console.log("Received trainerId from body:", trainerId);

    // 3. Check if the schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      console.log("Schedule not found");
      return res.status(404).json({ message: "Schedule not found" });
    }
    console.log("Schedule found:", schedule);

    // 4. Convert the trainerId to an ObjectId (check if it's a valid 24-character hex string)
    const trainerObjectId = new mongoose.Types.ObjectId(trainerId);
    console.log("Converted trainerObjectId:", trainerObjectId);

    // 5. Check if the trainer exists and is a valid user
    const trainer = await User.findById(trainerObjectId);
    if (!trainer || trainer.role !== "trainer") {
      console.log("Trainer not found or invalid role");
      return res
        .status(404)
        .json({ message: "Trainer not found or invalid role" });
    }
    console.log("Trainer found:", trainer);

    // 6. Assign the trainer to the schedule
    schedule.trainer = trainerObjectId;
    await schedule.save();

    res
      .status(200)
      .json({ message: "Trainer assigned successfully", schedule });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
