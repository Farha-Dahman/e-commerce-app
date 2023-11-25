import mongoose from "mongoose";
const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("connect successfully!");
    })
    .catch((err) => {
      console.log(`error when connect DB! ${err}`);
    });
};
export default connectionDB;
