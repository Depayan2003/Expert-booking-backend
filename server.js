// const express = require("express");
// require("dotenv").config();
// const connectDB = require("./utils/db");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const expertRoutes = require("./routes/expertRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");

// const app = express();

// // create HTTP server
// const server = http.createServer(app);

// // attach socket.io
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });

// // make io globally accessible
// app.set("io", io);

// // socket connection
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join_expert", (expertId) => {
//     socket.join(expertId);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // connect DB
// connectDB();

// app.use(cors());

// // middleware
// app.use(express.json());

// // routes
// app.use("/experts", expertRoutes);
// app.use("/bookings", bookingRoutes);

// app.get("/", (req, res) => {
//   res.send("API Running");
// });

// const PORT = process.env.PORT || 5000;

// // ⚠️ use server.listen instead of app.listen
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
require("dotenv").config();
const connectDB = require("./utils/db");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// create HTTP server
const server = http.createServer(app);

// ✅ CORS (important for frontend + socket)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PATCH"],
}));

// middleware
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/experts", expertRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ SOCKET CONFIG (IMPORTANT FIX)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

// make io globally accessible
app.set("io", io);

// socket connection
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join_expert", (expertId) => {
    socket.join(expertId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// port
const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});