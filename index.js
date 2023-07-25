import express from "express";
import mongoose from "mongoose";
import router from "./routers/routes.js";
import dotenv from "dotenv";

const app = express();
const port = process.env.port || 8009;
dotenv.config();

app.use(express.json());
app.use(router);

const mongooseConnection = () => {
      try {
            mongoose.connect(process.env.MongoDbUrl, {
                  useNewUrlParser: true
            });
            console.log(`connected to db`);
      } catch (err) {
            console.log(`connection terminated, ${err}`);
      }
}

mongooseConnection();

app.listen(port, () => {
      console.log(`Server listening to port : ${port}`);
})