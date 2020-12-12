import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./User.js";
dotenv.config();

mongoose.set("debug", true);
mongoose.set("useCreateIndex", true);
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI || "mongodb://localhost/dscwow";
mongoose
  .connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`Database connected to ${databaseUri}`))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

export default { User };
