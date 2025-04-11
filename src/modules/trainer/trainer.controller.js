const Schedule = require("../admin/schedule.model")

exports.mySchedules = async (req, res) => {
    try{
        const trainerId = req.user.id; // Trainer ID from the decoded token

        const schedules = await Schedule.find({trainer:trainerId})
        .populate('createdBy', 'name email') // Populate the createdBy field with user details
        .populate('trainees', 'name email') // Populate the trainees field with user details
        .sort({ day: 1, startTime: 1 }); // Sort by day and startTime
        if (!schedules || schedules.length === 0) {
            return res.status(404).json({ message: "No schedules found" });
        }
        res.status(200).json({ message: "Schedules retrieved successfully", schedules });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}