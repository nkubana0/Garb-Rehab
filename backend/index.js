require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { sendMail } = require('./email'); // Import the sendMail function
const { generateOTP, verifyOTP } = require('./utils/otp'); // Import OTP utility

const port = process.env.PORT || 4000;
const app = express();
const nodemailer = require('nodemailer');

// Access environment variables
const email = process.env.EMAIL;
const appPassword = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: appPassword,
  },
});

function sendEmail(to, subject, text, attachments = []) {
  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    text: text,
    attachments: attachments,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
app.post("/upload", upload.single("product"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    res.json({
      success: 1,
      image_url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
    });
  } catch (err) {
    console.error("Error uploading to S3:", err);
    return res.status(500).json({ success: 0, message: "Failed to upload" });
  }
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

// MongoDB schema and models for Users
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  otp: { type: String, required: false },
  otpExpiration: { type: Date, required: false },
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

// Signup usage in a route
app.post('/signup', async (req, res) => {
  try {
    // Convert email to lowercase for consistency
    const email = req.body.email.toLowerCase();

    // Check if a user with this email already exists
    let check = await Users.findOne({ email });
    console.log("User check result:", check); // Log the result of the check

    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Existing user found with the same email address",
      });
    }

    const cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const otp = generateOTP();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    const user = new Users({
      name: req.body.username,
      email: email, // Store email in lowercase
      password: req.body.password,
      cartData: cart,
      otp,
      otpExpiration,
    });

    await user.save();

    // Send email with OTP
    sendEmail(req.body.email, "Verify Your Email", `Your OTP is: ${otp}`);
    res.json({ success: true, message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error('Error during signup:', error); // Log any errors
    res.status(500).json({ success: false, message: "Failed to process signup." });
  }
});

// Route for verifying OTP
app.post("/verify", async (req, res) => {
  const { email, otp } = req.body;
  const user = await Users.findOne({ email });

  if (!user || !verifyOTP(otp, user.otp, user.otpExpiration)) {
    return res.status(400).json({ success: false, errors: "Invalid OTP" });
  }

  user.verified = true;
  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// Route for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user && req.body.password === user.password) {
    //**if (!user.verified) {
      //return res.status(401).json({ success: false, errors: "Please verify your email." });
    //}

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } else {
    res.json({ success: false, errors: "Invalid credentials" });
  }
});

// Route for password reset request
app.post("/password-reset-request", async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, errors: "User not found." });
  }

  const otp = generateOTP();
  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

  user.otp = otp;
  user.otpExpiration = otpExpiration;
  await user.save();

  // Send email with OTP for password reset
  try {
    await sendMail(email, "Password Reset Request", `Your OTP is: ${otp}`);
    res.json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send OTP email." });
  }
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


// Route for resetting password
app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, errors: "User not found." });
    }

    if (!verifyOTP(otp, user.otp, user.otpExpiration)) {
      return res.status(400).json({ success: false, errors: "Invalid OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ success: false, errors: "Internal server error" });
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

// Route for popular in men category
app.get("/popularinmen", async (req, res) => {
  let products = await Product.find({ category: "men" });
  let popular_in_men = products.slice(0, 4);
  res.send(popular_in_men);
});

// Route for popular in children category
app.get("/popularinchildren", async (req, res) => {
  let products = await Product.find({ category: "children" });
  let popular_in_children = products.slice(0, 4);
  res.send(popular_in_children);
});

// Route to handle OAuth2 callback and exchange code for tokens
app.post('/auth/callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Authorization code is required' });
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code: code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = response.data;

    // Save tokens and user info as needed
    // Example: save tokens to the database or session

    res.json({ success: true, access_token, refresh_token });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ success: false, message: 'Failed to exchange authorization code for tokens' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
