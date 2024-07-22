require('dotenv').config({ path: 'makefile.env' });
const port = process.env.PORT || 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
const allowedOrigins = [
  'https://garb-rehab.onrender.com',
  'https://garb-rehab-admin.onrender.com'
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**app.use(cors({
  origin: allowedOrigins
}));**/
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  res.json({
    success: 1,
    image_url: `${baseUrl}/images/${req.file.filename}`, // Use dynamic URL
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
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

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});

app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let new_collections = products.slice(1).slice(-8);
  console.log("New Collection Fetched");
  res.send(new_collections);
});

app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular In Women Fetched");
  res.send(popular_in_women);
});

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};

app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
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
  console.log("Get cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.post('/api/pay', async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const response = await axios.post('https://api.flutterwave.com/v3/payments', {
      tx_ref: `trx_${Date.now()}`,
      amount: req.body.amount,
      currency: 'RWF', // Use Rwandan Franc
      redirect_url: `${baseUrl}/payment/callback`, // Use dynamic URL
      payment_options: 'card,banktransfer,ussd,barter,paga,mobilemoney,bank_transfer,account,mpesa',
      meta: {
        consumer_id: 23,
        consumer_mac: '92a3-912ba-1192a'
      },
      customer: {
        email: req.body.email,
        phonenumber: req.body.phonenumber, // Use the phone number from request
        name: req.body.name
      },
      customizations: {
        title: 'Payment for items in cart',
        description: 'Fund of transaction'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
      }
    });

    const paymentLink = response.data.data.link;
    res.json({ success: true, paymentLink });
  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});
