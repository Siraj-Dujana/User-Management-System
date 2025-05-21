const User = require("./model/schema.js");
const Admin = require("./model/admin.js");
const express = require("express");
const session = require("express-session");  // Added for session handling
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const fullId = uuidv4();
const shortId = fullId.split("-")[0];
const mongoose = require("mongoose");

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/userDB")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Session Configuration
app.use(
  session({
    secret: "mySuperSecretKey123!@#abcXYZ", // use a strong secret in production
    resave: false,
    saveUninitialized: false,
  })
);


// 👇 Add this middleware here
app.use((req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// View & Middleware Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "model")));
app.use(methodOverride("_method"));

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// ✅ Middleware to protect admin routes
function requireAdminLogin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

// Routes
app.get("/user", async (req, res) => {
  try {
    let count = await User.countDocuments({});
    let data = await User.find({});
    res.render("home.ejs", { data, count });
  } catch (err) {
    res.send("Error has occurred");
  }
});

app.get("/user/new", async (req, res) => {
  res.render("create.ejs", { display: false, title: "" });
});

app.post("/user/new", async (req, res) => {
  const { username, email, password } = req.body;
  const inserted = "Inserted Successfully";
  const already = "This Email is used Already";

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return res.render("create", {
        display: true,
        title: already,
      });
    }

    const newUser = new User({
      id: shortId,
      username,
      email,
      password,
    });

    await newUser.save();
    res.render("create", {
      display: true,
      title: inserted,
    });
  } catch (err) {
    console.error(err);
    res.render("create", {
      display: false,
      title: "An error has occurred",
    });
  }
});

app.get("/user/:id/edit", async (req, res) => {
  try {
    const user_result = await User.findOne({ id: req.params.id });
    res.render("edit", { user_result, title: "", display: false });
  } catch (err) {
    res.send("Error has occurred");
  }
});

app.patch("/user/:id", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user_result = await User.findOne({ id: req.params.id });
    if (!user_result || user_result.password !== password) {
      return res.render("edit", {
        user_result,
        title: "Password is incorrect!",
        display: true,
      });
    }

    user_result.username = username;
    await user_result.save();

    res.render("edit", {
      user_result,
      title: "Updated Successfully",
      display: true,
    });
  } catch (err) {
    console.log(err);
    res.send("Error has occurred");
  }
});

app.get("/user/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  res.render("delete", {
    Link: null,
    email: user.email,
    id: req.params.id,
    title: "",
    display: false,
  });
});

app.delete("/user/:id", async (req, res) => {
  const { email, password } = req.body;
  let link;
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user || user.email !== email || user.password !== password) {
      link = "/user/" + req.params.id;
      return res.render("delete", {
        Link: link,
        email: user.email,
        id: req.params.id,
        title: "Incorrect email or Password",
        display: true,
      });
    }

    await User.deleteOne({ id: req.params.id });
    link = "/user";
    res.render("delete", {
      Link: link,
      email: user.email,
      id: req.params.id,
      title: "Deleted Successfully!",
      display: true,
    });
  } catch (err) {
    res.send("Error has occurred");
  }
});

app.get("/search", async (req, res) => {
  try {
    let email = req.query.filter;
    let data = await User.find({ email: email });
    let count = data.length;
    res.render("home.ejs", { data, count });
  } catch (err) {
    console.log(err);
    res.send("Error has occurred");
  }
});

// Admin Register
app.get("/admin/Register", async (req, res) => {
  res.render("register.ejs", { display: false, title: null });
});

app.post("/admin/register", async (req, res) => {
  let { email, password, repassword } = req.body;
  let already = "Account Already Exist!";
  let incorrect = "Password is incorrect!";
  let inserted = "Successfully Registered!";

  try {
    const user = await Admin.findOne({ email: email });

    if (user) {
      return res.render("register", {
        display: true,
        title: already,
      });
    }

    if (password != repassword) {
      return res.render("register", {
        display: true,
        title: incorrect,
      });
    }

    const newadmin = new Admin({
      email,
      password,
    });

    await newadmin.save();
    res.render("register", {
      display: true,
      title: inserted,
    });
  } catch (err) {
    console.log(err);
  }
});

// Admin Login
app.get("/admin/login", async (req, res) => {
  res.render("login.ejs", { title: null, display: false });
});

app.post("/admin/login", async (req, res) => {
  let { email, password } = req.body;
  let no = "Account Does not Exist!";
  let incorrect = "Password is incorrect!";

  try {
    let user = await Admin.findOne({ email: email });

    if (!user) {
      return res.render("login", {
        display: true,
        title: no,
      });
    }

    if (password != user.password) {
      return res.render("login", {
        display: true,
        title: incorrect,
      });
    }

    req.session.isAdmin = true;  //Store session
    res.redirect("/admin");

  } catch (err) {
    console.log(err);
  }
});

// Admin Protected Route
app.get("/admin", requireAdminLogin, async (req, res) => {
  try {
    let count = await User.countDocuments({});
    let data = await User.find({});
    res.render("admin.ejs", { data, count });
  } catch (err) {
    res.send("Error has occurred");
  }
});

// Admin Logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Logout failed.");
    }
    res.redirect("/admin/login");
  });
});


