require("dotenv").config({ path: "makefile.env" });
const port = process.env.PORT || 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for uploading files to S3
app.post("/upload", upload.single("product"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Make the file publicly accessible
  };

  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.error("Error uploading to S3:", err);
      return res.status(500).json({ success: 0, message: "Failed to upload" });
    }

    res.json({
      success: 1,
      image_url: data.Location, // S3 file URL
    });
  });
});

// MongoDB schema and models
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Route for adding a product
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id = products.length ? products[products.length - 1].id + 1 : 1;

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

// Route for removing a product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// Route for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// MongoDB schema and models for Users
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Route for user signup
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with same email address",
    });
  }
  
  const cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = { user: { id: user.id } };
  const token = jwt.sign(data, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// Route for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user && req.body.password === user.password) {
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } else {
    res.json({ success: false, errors: "Invalid credentials" });
  }
});

// Route for new collections
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let new_collections = products.slice(-8);
  res.send(new_collections);
});

// Route for popular in women category
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  res.send(popular_in_women);
});

// Middleware to fetch user from token
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// Routes for handling cart operations
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

app.post("/getcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Payment integration with Flutterwave
app.post("/api/pay", async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: `trx_${Date.now()}`,
        amount: req.body.amount,
        currency: "RWF",
        redirect_url: `${baseUrl}/payment/callback`,
        payment_options:
          "card,banktransfer,ussd,barter,paga,mobilemoney,bank_transfer,account,mpesa",
        meta: {
          consumer_id: 23,
          consumer_mac: "92a3-912ba-1192a",
        },
        customer: {
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          name: req.body.name,
        },
        customizations: {
          title: "Payment for items in cart",
          description: "Fund of transaction",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const paymentLink = response.data.data.link;
    res.json({ success: true, paymentLink });
  } catch (error) {
    console.error("Error initiating payment:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
});

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});
