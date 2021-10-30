// load .env data into process.env
require("dotenv").config();

// Web server config
const http = require("http");
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const server = http.createServer(app);
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const db = require("./db");
const cookieSession = require("cookie-session");

// SOCKET.io
const socketio = require("socket.io");
const io = socketio(server);

// run when client connects
io.on("connection", (socket) => {
  console.log("New connection");

  // When user logged in
  socket.on("loggedIn", function (userId) {
    socket.join(userId);
  });

  // When user logged out
  socket.on("loggedOut", function (userId) {
    socket.leave(userId);
  });

  // When user clicks the chat
  socket.on("openChat", function (chatId) {
    socket.join(chatId);
  });

  // When user leaves the chat
  socket.on("closeChat", function (chatId) {
    socket.leave(chatId);
  });

  socket.on("message", function (messageInfo) {
    io.in(chatId).emit("chatMessage"); // this emits to chat
    io.in(userId).emit("lastMessage"); // this emits to inbox
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user left the chat");
  });
});

// connect to database
db.connect();

// cookie session init
app.use(
  cookieSession({
    name: "session",
    keys: [
      process.env.MY_SECRET_KEY || "mySecretKey",
      process.env.MY_SECRET_KEY_2 || "mySecretKey2",
    ],
  })
);

// colors for logging the endPoints
app.use(morgan("dev"));

// this is for ejs layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

// this is the assets folder
app.use(express.static("public"));

// This is our Routes for our apis
app.use("/api/auth", require("./routes/api/auth/authRoutes"));
app.use("/api/ad", require("./routes/api/ad/adRoutes"));
app.use(
  "/api/laptopImage",
  require("./routes/api/laptopImage/laptopImageRoutes")
);
app.use("/api/favorite", require("./routes/api/favorite/favoriteRoutes"));
app.use("/api/dashboard", require("./routes/api/dashboard/dashboardRoutes"));
app.use("/api/message", require("./routes/api/message/messageRoutes"));

// This is our Routes for all the pages
app.use("/", require("./routes/view/viewRoutes"));

server.listen(PORT, () => {
  console.log(`elf App is listening on port ${PORT}`);
});
