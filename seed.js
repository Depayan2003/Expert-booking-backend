const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./utils/db");
const Expert = require("./models/Expert");

const seedExperts = async () => {
  try {
    await connectDB();

    // ❌ DELETE OLD DATA
    await Expert.deleteMany();
    console.log("Old experts deleted");

    // 🧠 Random slot generator
    const dates = ["2026-05-10", "2026-05-11", "2026-05-12"];
    const times = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM"
    ];

    const generateSlots = () => {
      return Array.from({ length: 3 }, () => ({
        date: dates[Math.floor(Math.random() * dates.length)],
        time: times[Math.floor(Math.random() * times.length)],
        isBooked: false
      }));
    };

    // ✅ VARIETY OF EXPERTS
    const experts = [
      { name: "John Doe", category: "Developer", experience: 5, rating: 4.5 },
      { name: "Jane Smith", category: "Designer", experience: 3, rating: 4.2 },
      { name: "Amit Sharma", category: "Backend Developer", experience: 6, rating: 4.6 },
      { name: "Priya Singh", category: "UI/UX Designer", experience: 4, rating: 4.3 },
      { name: "Rahul Verma", category: "Full Stack Developer", experience: 7, rating: 4.7 },
      { name: "Sneha Gupta", category: "Graphic Designer", experience: 5, rating: 4.4 },
      { name: "Karan Mehta", category: "Frontend Developer", experience: 2, rating: 4.1 },
      { name: "Neha Kapoor", category: "Product Designer", experience: 6, rating: 4.6 },
      { name: "Arjun Patel", category: "DevOps Engineer", experience: 8, rating: 4.8 },
      { name: "Meera Nair", category: "UX Researcher", experience: 3, rating: 4.2 },
      { name: "Rohit Das", category: "Mobile Developer", experience: 4, rating: 4.3 },
      { name: "Ananya Roy", category: "UI Designer", experience: 5, rating: 4.5 },
      { name: "Vikas Yadav", category: "Cloud Engineer", experience: 6, rating: 4.6 },
      { name: "Pooja Jain", category: "Illustrator", experience: 2, rating: 4.0 },
      { name: "Suresh Kumar", category: "Software Architect", experience: 9, rating: 4.9 },
      { name: "Aditya Sen", category: "AI/ML Engineer", experience: 5, rating: 4.7 },
      { name: "Ritika Bose", category: "Data Scientist", experience: 4, rating: 4.5 },
      { name: "Nikhil Jain", category: "Cyber Security", experience: 6, rating: 4.6 },
      { name: "Tanya Ghosh", category: "QA Engineer", experience: 3, rating: 4.2 },
      { name: "Manish Gupta", category: "Blockchain Developer", experience: 5, rating: 4.4 }
    ];

    // 🧱 Attach random slots
    const finalData = experts.map(e => ({
      ...e,
      slots: generateSlots()
    }));

    // 💾 INSERT
    await Expert.insertMany(finalData);

    console.log("New diverse experts inserted successfully ✅");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedExperts();