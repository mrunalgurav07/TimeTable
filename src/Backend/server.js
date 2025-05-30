const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Make sure bcryptjs is installed: npm install bcryptjs
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies from requests

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/timetable", {
    // useNewUrlParser and useUnifiedTopology are no longer necessary in Mongoose 6+
    // but explicitly including them doesn't hurt for older versions.
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    // Exit process if DB connection fails
    process.exit(1); 
  });


const subjectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // Added unique constraint for code
  },
  { timestamps: true }
);
const SubjectModel = mongoose.model("subject", subjectSchema);


const classSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Added unique constraint for name
  },
  { timestamps: true }
);
const ClassModel = mongoose.model("class", classSchema);


const teacherSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true }, // Added as per your request
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

const TeacherModel = mongoose.model("teacher", teacherSchema);

const timetableEntrySchema = mongoose.Schema(
  {
    day: { type: String, required: true },
    class: { type: String, required: true },
    time: { type: String, required: true },
    subject: { type: String, required: true },
    room: { type: String, required: true },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teacher',
      required: false // Changed to false as it might not always be assigned immediately
    }
  },
  { timestamps: true }
);

const TimetableEntryModel = mongoose.model("timetableEntry", timetableEntrySchema);





// server.js (Relevant sections only)

// ... (existing imports, app setup, and database connection)

// --- Mongoose Schemas ---
// (subjectSchema, classSchema, teacherSchema, timetableEntrySchema remain as they are)

const lectureSchema = mongoose.Schema(
  {
    day: { type: String, required: true },
    subject: { type: String, required: true }, // Changed from 'name' to 'subject'
    lecture: { type: Number, required: true },   // Changed from 'lectureNumber' to 'lecture'
    time: { type: String, required: true },    // Changed from 'fromTime' to 'time'
  },
  { timestamps: true }
);
const LectureModel = mongoose.model("lectures", lectureSchema);


// --- API Routes ---
// Create new lecture
app.post("/lectures/create", async (req, res) => {
  try {
    const { day, subject, lecture, time } = req.body; // Updated field names

    // Validate required fields explicitly (though Mongoose will also validate)
    if (!day || !subject || !lecture || !time) { // Updated validation
      return res.status(400).json({
        success: false,
        message: "All fields are required (day, subject, lecture, time)" // Updated message
      });
    }

    const data = new LectureModel({
      day,
      subject, // Updated field name
      lecture, // Updated field name
      time,    // Updated field name
    });

    await data.save();

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data
    });
  } catch (err) {
    console.error("Error creating lecture:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create lecture"
    });
  }
});

// Get all lectures
app.get("/lectures", async (req, res) => {
  try {
    const lectures = await LectureModel.find().select('day subject lecture time'); // Updated selection

    res.json({
      success: true,
      data: lectures
    });
  } catch (err) {
    console.error("Error fetching lectures:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lectures"
    });
  }
});

// Update lecture
app.put("/lectures/:id", async (req, res) => {
  try {
    const { day, subject, lecture, time } = req.body; // Updated field names

    const updateData = {};
    if (day !== undefined) updateData.day = day;
    if (subject !== undefined) updateData.subject = subject; // Updated field name
    if (lecture !== undefined) updateData.lecture = lecture; // Updated field name
    if (time !== undefined) updateData.time = time;     // Updated field name

    const updatedLecture = await LectureModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found"
      });
    }

    res.json({
      success: true,
      message: "Lecture updated successfully",
      data: updatedLecture
    });
  } catch (err) {
    console.error("Error updating lecture:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update lecture"
    });
  }
});

// Delete lecture
app.delete("/lectures/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lecture ID format"
      });
    }

    const deleted = await LectureModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found"
      });
    }

    res.json({
      success: true,
      message: "Lecture deleted successfully",
      deletedId: req.params.id
    });
  } catch (err) {
    console.error("Error deleting lecture:", err);
    res.status(500).json({
      success: false,
      message: `Failed to delete lecture: ${err.message}`
    });
  }
});


// Create new subject
app.post("/subjects", async (req, res) => {
  try {
    const data = new SubjectModel(req.body);
    await data.save();
    res.status(201).json({ success: true, message: "Subject created successfully", data });
  } catch (err) {
    console.error("Error creating subject:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Subject code already exists." });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to create subject" });
  }
});

// Get all subjects
app.get("/subjects", async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.json({ success: true, data: subjects });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ success: false, message: "Failed to fetch subjects" });
  }
});

// Update subject
app.put("/subjects/:id", async (req, res) => {
  try {
    const updated = await SubjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating subject:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Subject code already exists." });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to update subject" });
  }
});

// Delete subject
app.delete("/subjects/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid subject ID format" });
    }
    const deleted = await SubjectModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ success: false, message: "Failed to delete subject" });
  }
});




// Create new class
app.post("/classes", async (req, res) => {
  try {
    const data = new ClassModel(req.body);
    await data.save();
    res.status(201).json({ success: true, message: "Class created successfully", data });
  } catch (err) {
    console.error("Error creating class:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Class name already exists." });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to create class" });
  }
});

// Get all classes
app.get("/classes", async (req, res) => {
  try {
    const classes = await ClassModel.find();
    res.json({ success: true, data: classes });
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ success: false, message: "Failed to fetch classes" });
  }
});

// Update class
app.put("/classes/:id", async (req, res) => {
  try {
    const updated = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    res.json({ success: true, message: "Class updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating class:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Class name already exists." });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to update class" });
  }
});

// Delete class
app.delete("/classes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid class ID format" });
    }
    const deleted = await ClassModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    res.json({ success: true, message: "Class deleted successfully" });
  } catch (err) {
    console.error("Error deleting class:", err);
    res.status(500).json({ success: false, message: "Failed to delete class" });
  }
});


// Teacher Routes
// Create new teacher
app.post("/teachers", async (req, res) => {
  try {
    const data = new TeacherModel(req.body);
    await data.save();
    // No password to exclude now, just send the saved data
    res.status(201).json({ success: true, message: "Teacher created successfully", data });
  } catch (err) {
    console.error("Error creating teacher:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to create teacher" });
  }
});

// Get all teachers
app.get("/teachers", async (req, res) => {
  try {
    // No password to exclude now, just fetch all data
    const teachers = await TeacherModel.find(); // .select('-__v') is optional, but -password is not needed
    res.json({ success: true, data: teachers });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ success: false, message: "Failed to fetch teachers" });
  }
});

// Update teacher
app.put("/teachers/:id", async (req, res) => {
  try {
    // No password to handle for hashing
    const updateData = req.body; 

    const updated = await TeacherModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    // No password to exclude from response
    res.json({ success: true, message: "Teacher updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating teacher:", err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to update teacher" });
  }
});

// Delete teacher
app.delete("/teachers/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid teacher ID format" });
    }
    const deleted = await TeacherModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.json({ success: true, message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("Error deleting teacher:", err);
    res.status(500).json({ success: false, message: "Failed to delete teacher" });
  }
});


// Create new timetable entry
app.post("/timetable-entries", async (req, res) => {
  try {
    const data = new TimetableEntryModel(req.body);
    await data.save();
    res.status(201).json({ success: true, message: "Timetable entry created successfully", data });
  } catch (err) {
    console.error("Error creating timetable entry:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to create timetable entry" });
  }
});

// Get all timetable entries
app.get("/timetable-entries", async (req, res) => {
  try {
    const filter = {};
    if (req.query.day) filter.day = req.query.day;
    if (req.query.class) filter.class = req.query.class;

    // Populate the 'teacher' field to get teacher details
    const entries = await TimetableEntryModel.find(filter).populate('teacher', 'fullName email'); // Select specific teacher fields
    res.json({ success: true, data: entries });
  } catch (err) {
    console.error("Error fetching timetable entries:", err);
    res.status(500).json({ success: false, message: "Failed to fetch timetable entries" });
  }
});

// Update timetable entry
app.put("/timetable-entries/:id", async (req, res) => {
  try {
    const updated = await TimetableEntryModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }
    res.json({ success: true, message: "Timetable entry updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating timetable entry:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to update timetable entry" });
  }
});

// Delete timetable entry
app.delete("/timetable-entries/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid timetable entry ID format" });
    }
    const deleted = await TimetableEntryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }
    res.json({ success: true, message: "Timetable entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting timetable entry:", err);
    res.status(500).json({ success: false, message: "Failed to delete timetable entry" });
  }
});