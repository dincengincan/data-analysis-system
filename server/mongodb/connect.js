import mongooes from "mongoose";

const connectDB = async (url) => {
  mongooes.set("strictQuery", true);

  mongooes
    .connect(url)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
};

export default connectDB;
