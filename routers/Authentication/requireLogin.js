import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import USER from "../../Data Models/userSchema.js";
dotenv.config();

const requireLogin = async (req, res, next) => {
      try {
            // tokens passed in the request URL itself
            // const token = req.query.token;

            // tokens passed through headers 
            const token = req.headers.authorization.split(' ')[1]; // Get the token from the "Authorization" header

            if (!token) {
                  return res.status(404).json({ error: `Token not found` });
            }

            const verifyToken = jwt.verify(token, process.env.SecretKey);
            const check = USER.findOne({ _id: verifyToken.id });

            if (check) {
                  req.id = check._id;
                  next();
            }
      } catch (err) {
            return res.status(403).send(`unVerified user!`)
      }
}

export default requireLogin;