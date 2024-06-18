const { app } = require("./Socket/socket.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const ErrorHandler = require("./Helpers/errorHandler.js");
const appError = require("./Helpers/appError.js");

const authRouter      = require("./Modules/authentication/routes/auth.route.js");
const userRouter      = require("./Modules/user/routes/user.route.js");
const chatRouter      = require("./Modules/chat/routes/chat.route.js");
const reviewRouter    = require("./Modules/Review/routes/review.route.js");
const residenceRouter = require("./Modules/residence/routes/residence.route.js");
const adminRouter     = require("./Modules/admin/routes/admin.route.js");

app.use(cors());
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Home finder API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/residence", residenceRouter);
app.use("/api/v1/admin",    adminRouter);

app.all("*", (req, res, next) => {
  return next(
    new appError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(ErrorHandler);

module.exports = app;
