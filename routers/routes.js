import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import USER from "../Data Models/userSchema.js";
import PRODUCT from "../Data Models/productSchema.js";
import requireLogin from "./Authentication/requireLogin.js";
const router = express.Router();

//Register user (signup):
router.post("/register", async (req, res) => {
      try {
            const { name, email, phone, password, confirmPassword } = req.body;
            if (!name) {
                  return res.status(403).json({ error: "Name is a required field" });
            }
            if (!email) {
                  return res.status(403).json({ error: "email is a required field" });
            }
            if (!phone) {
                  return res.status(403).json({ error: "phone is a required field" });
            }
            if (!password) {
                  return res.status(403).json({ error: "password is a required field" });
            }
            if (!confirmPassword) {
                  return res.status(403).json({ error: "confirmPassword is a required field" });
            }
            if (password !== confirmPassword) {
                  return res.status(403).json({ error: "Passwords doesnt match" });
            }

            const checkUser = await USER.findOne({ email: email });
            if (checkUser) {
                  return res.status(403).json({ error: "User already registered, please login" });
            }
            //password encryption
            const encryptPassword = await bcrypt.hash(password, 10);

            const newUser = await new USER({
                  name,
                  email,
                  password: encryptPassword,
                  confirmPassword: encryptPassword,
                  phone
            }).save();
            if (newUser) {
                  return res.status(201).json({ message: "New user registered successfully", NewUSER: newUser });
            }

      } catch (error) {
            console.log(`error in register catch block : ${error}`);
            return res.status(400).json({ error: error });
      }
})


//Login user (Sign in):
router.post("/login", async (req, res) => {
      try {
            const { email, password } = req.body;

            if (!email) {
                  return res.status(403).json({ error: "Email is a required field" });
            }
            if (!password) {
                  return res.status(403).json({ error: "password is a required field" });
            }

            const userCheck = await USER.findOne({ email: email });
            if (!userCheck) {
                  return res.status(403).json({ error: "Unregistered user! Please Login first" });
            }

            const decrypt = await bcrypt.compare(password, userCheck.password);
            if (decrypt) {
                  const token = await jwt.sign({ id: userCheck._id }, process.env.SecretKey, { expiresIn: "1d" });
                  if (token) {
                        return res.status(201).json({ message: "User login successful", generatedToken: token });
                  }
            } if (!decrypt) {
                  return res.status(403).json({ error: "Invalid password" });
            }
      } catch (err) {
            console.log(`error : ${err}`);
            return res.status(403).send(err);
      }
})


//create new product:
router.post("/createproduct", requireLogin, async (req, res) => {
      try {
            const { bookName, author, publishDate, mrp, bookType, description } = req.body;
            if (!bookName) {
                  return res.status(403).json({ error: "BookName is a required field" });
            }
            if (!author) {
                  return res.status(403).json({ error: "author is a required field" });
            }
            if (!publishDate) {
                  return res.status(403).json({ error: "publishDate is a required field" });
            }
            if (!mrp) {
                  return res.status(403).json({ error: "mrp is a required field" });
            }
            if (!bookType) {
                  return res.status(403).json({ error: "bookType is a required field" });
            }
            if (!description) {
                  return res.status(403).json({ error: "description is a required field" });
            }

            const newBook = await new PRODUCT({
                  bookName,
                  author,
                  publishDate,
                  mrp,
                  bookType,
                  description
            }).save();
            console.log(newBook);
            return res.status(201).json({ message: `new Product created successfully`, newProduct: newBook });
      } catch (err) {
            console.log(`error in create new product catch block : ${err}`);
            return res.status(403).json({ error: err });
      }
})


//read a product using product Id
router.get("/getsingleproduct/:id", requireLogin, async (req, res) => {
      try {
            const id = req.params.id;
            const checkProduct = await PRODUCT.findById(id);
            return res.status(201).json({ message: "product fetched successfully", Book: checkProduct });
      } catch (err) {
            console.log(`error in get single product catch block :  ${err}`);
            return res.status(403).json({ error: err });
      }
})


//read all available products
router.get("/allproducts", requireLogin, async (req, res) => {
      try {
            const getAllBooks = await PRODUCT.find();
            return res.status(201).json({ AllAvailbleBooks: getAllBooks });
      } catch (err) {
            console.log(`error while getting all products, ${err}`);
            return res.status(403).json({
                  error: err
            })
      }
})


//update a product using product Id
router.put("/updateproduct/:id", requireLogin, async (req, res) => {
      try {
            const id = req.params.id;
            const findProductAndUpdate = await PRODUCT.findByIdAndUpdate(id, {
                  $set: req.body
            }, {
                  new: true
            });

            return res.status(201).json({ message: "Product updated successfully", updatedBook: findProductAndUpdate });
      } catch (err) {
            console.log(`error in catch block while updating a product by Id: ${err}`);
            return res.status(403).json({ error: err });
      }
})


//delete a product using product Id
router.delete("/deleteproduct/:id", requireLogin, async (req, res) => {
      try {
            const id = req.params.id;
            const deleteBook = await PRODUCT.findByIdAndDelete(id);
            return res.status(201).json({ message: `Product deleted successfully`, DeletedBook: deleteBook });
      } catch (err) {
            console.log(`error while deleting the product : ${err}`);
            return res.status(403).json({ error: err });
      }
})

export default router;