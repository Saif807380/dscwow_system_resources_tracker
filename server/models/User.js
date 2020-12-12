import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    instances: [
      {
        name: String,
        provider: String,
        cluster: String,
        publcIP: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (!user.isModified("password")) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const user = this._update;
  try {
    if (!user.password) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

const comparePassword = async function (candidatePassword, next) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    next(err);
    return false;
  }
};

userSchema.methods.comparePassword = comparePassword;
const User = mongoose.model("User", userSchema);
export default User;
