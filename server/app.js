import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import db from "./models/index.js";
import routes from "./routes/index.js";
import errorHandler from "./handlers/error.js";
import routeNotFoundHandler from "./handlers/routeNotFound.js";
import compression from "compression";
import helmet from "helmet";
import expAutoSan from "express-autosanitizer";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

const whitelist = ["http://localhost:8080"];

const corsOption = {
  credentials: true,
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const PORT = process.env.PORT || 3000,
  IP = process.env.IP || "127.0.0.1",
  app = express();

app.use(cors(corsOption));
app.use(allowCrossDomain);
app.set("trust proxy", 1);
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(expAutoSan.allUnsafe);
app.use(xss());
app.use(mongoSanitize());

app.use("/api", routes);
app.use(errorHandler);
app.use(routeNotFoundHandler);

app.listen(PORT, () => {
  console.log(`DSCWOW Server has started on PORT:${PORT} IP:${IP}`);
});
