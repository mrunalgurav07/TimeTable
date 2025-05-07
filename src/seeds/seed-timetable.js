// Run with: node seeds/seed-timetable.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/timetable", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    seedData();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Timetable Entry schema (must match the one in server.js)
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

// Sample data matching what was previously hardcoded
const sampleTimetableEntries = [
  { day: 'Monday', class: 'MCA I', time: '9:00 to 10:00', subject: 'OOM (NGM)', room: '110' },
  { day: 'Monday', class: 'MCA II', time: '9:00 to 10:00', subject: 'DS (VIP)', room: '109' },
  // Add all entries here...
];

async function seedData() {
  try {
    // First delete any existing entries
    await TimetableEntryModel.deleteMany({});
    console.log("✅ Cleared existing timetable entries");

    // Insert new entries
    const result = await TimetableEntryModel.insertMany(sampleTimetableEntries);
    console.log(`✅ Successfully seeded ${result.length} timetable entries`);

    // Disconnect from the database
    mongoose.disconnect();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.disconnect();
  }
}