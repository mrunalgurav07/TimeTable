const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Enables parsing JSON bodies

// ---------- SCHEMAS ----------

// Lecture schema
const lectureSchema = mongoose.Schema(
  {
    lectureNumber: { type: Number, required: true },
    duration: { type: String, required: true }, // format "HH:mm"
    fromTime: { type: String, required: true }, // format "HH:mm"
    toTime: { type: String, required: true },   // format "HH:mm"
  },
  { timestamps: true }
);
const LectureModel = mongoose.model("lecture", lectureSchema);

// Subject schema
const subjectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);
const SubjectModel = mongoose.model("subject", subjectSchema);

// Class schema
const classSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
    },
    { timestamps: true }
);
const ClassModel = mongoose.model("class", classSchema);

// ---------- ROUTES ----------

// Lecture routes
app.post("/lecture/create", async (req, res) => {
  try {
    const data = new LectureModel(req.body);
    await data.save();
    res.json({ success: true, message: "Lecture created successfully", data });
  } catch (err) {
    console.error("Error creating lecture:", err);
    res.status(500).json({ success: false, message: "Failed to create lecture" });
  }
});

app.get("/lecture", async (req, res) => {
  try {
    const lectures = await LectureModel.find();
    res.json({ success: true, data: lectures });
  } catch (err) {
    console.error("Error fetching lectures:", err);
    res.status(500).json({ success: false, message: "Failed to fetch lectures" });
  }
});

// Subject routes
app.post("/subjects", async (req, res) => {
  try {
    const data = new SubjectModel(req.body);
    await data.save();
    res.json({ success: true, message: "Subject created successfully", data });
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ success: false, message: "Failed to create subject" });
  }
});

app.get("/subjects", async (req, res) => {
  try {
    const subjects = await SubjectModel.find();
    res.json({ success: true, data: subjects });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ success: false, message: "Failed to fetch subjects" });
  }
});

app.put("/subjects/:id", async (req, res) => {
  try {
    const updated = await SubjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ success: false, message: "Failed to update subject" });
  }
});

app.delete("/subjects/:id", async (req, res) => {
  try {
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

// ---------- CLASS ROUTES ----------

// Create new class
app.post("/classes", async (req, res) => {
  try {
    const data = new ClassModel(req.body);
    await data.save();
    res.json({ success: true, message: "Class created successfully", data });
  } catch (err) {
    console.error("Error creating class:", err);
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
    const updated = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    res.json({ success: true, message: "Class updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating class:", err);
    res.status(500).json({ success: false, message: "Failed to update class" });
  }
});

// Delete class
app.delete("/classes/:id", async (req, res) => {
  try {
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

// Teacher schema
const teacherSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    subject: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String }, // you might want to handle image URLs or paths
  },
  { timestamps: true }
);

const TeacherModel = mongoose.model("teacher", teacherSchema);

// Create new teacher
app.post("/teachers", async (req, res) => {
  try {
    const data = new TeacherModel(req.body);
    await data.save();
    res.json({ success: true, message: "Teacher created successfully", data });
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).json({ success: false, message: "Failed to create teacher" });
  }
});

// Get all teachers
app.get("/teachers", async (req, res) => {
  try {
    const teachers = await TeacherModel.find();
    res.json({ success: true, data: teachers });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ success: false, message: "Failed to fetch teachers" });
  }
});

// Update teacher
app.put("/teachers/:id", async (req, res) => {
  try {
    const updated = await TeacherModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    res.json({ success: true, message: "Teacher updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).json({ success: false, message: "Failed to update teacher" });
  }
});

// Delete teacher
app.delete("/teachers/:id", async (req, res) => {
  try {
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

// ------------ Admin--------------------



// ---------- DATABASE CONNECTION ----------

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/timetable", {
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
  });


// ----------------------------------------------------------

// First, let's add a model for timetable entries in server.js

// Timetable Entry schema
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
      required: false
    }
  },
  { timestamps: true }
);

const TimetableEntryModel = mongoose.model("timetableEntry", timetableEntrySchema);

// Create routes for timetable entries
app.post("/timetable-entries", async (req, res) => {
  try {
    const data = new TimetableEntryModel(req.body);
    await data.save();
    res.json({ success: true, message: "Timetable entry created successfully", data });
  } catch (err) {
    console.error("Error creating timetable entry:", err);
    res.status(500).json({ success: false, message: "Failed to create timetable entry" });
  }
});

app.get("/timetable-entries", async (req, res) => {
  try {
    // Support filtering by day and class
    const filter = {};
    if (req.query.day) filter.day = req.query.day;
    if (req.query.class) filter.class = req.query.class;
    
    const entries = await TimetableEntryModel.find(filter);
    res.json({ success: true, data: entries });
  } catch (err) {
    console.error("Error fetching timetable entries:", err);
    res.status(500).json({ success: false, message: "Failed to fetch timetable entries" });
  }
});

app.put("/timetable-entries/:id", async (req, res) => {
  try {
    const updated = await TimetableEntryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Timetable entry not found" });
    }
    res.json({ success: true, message: "Timetable entry updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating timetable entry:", err);
    res.status(500).json({ success: false, message: "Failed to update timetable entry" });
  }
});

app.delete("/timetable-entries/:id", async (req, res) => {
  try {
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