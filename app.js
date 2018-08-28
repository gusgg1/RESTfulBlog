const bodyParser       = require("body-parser");
const express          = require("express");
const mongoose         = require("mongoose");
const methodOverride   = require("method-override");
const expressSanitizer = require("express-sanitizer");

const app = express();

// APP CONFIG:
// setting up bodyParser to work
app.use(bodyParser.urlencoded({extended: true}));
// connecting mongoose to DB
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });
// setting up the view engine with ejs
app.set("view engine", "ejs");
// So we can server our custom style sheet
app.use(express.static("public"));
// here we look for the string "_method" in our edit form
app.use(methodOverride("_method"));
// Sanitizer has to come AFTER bodyParser
app.use(expressSanitizer());

// MONGOOSE / MODEL CONFIG:
  // We can always det up a default value in our Schema, for example in case the user does not provide an image.
const blogSchema = new mongoose.Schema({
  title: String,
  // image: {type: String, default: "placeholderimage.jpg"}
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

// Compiling our model
const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1515705576963-95cad62945b6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fd0a9edabe9fd24d887dd3665be3268e&auto=format&fit=crop&w=500&q=60",
//   body: "Hello this is a blog post"
// });

// RESTFUL ROUTES:
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR");
    } else {
      res.render("index", { blogs });
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
  console.log(req.body);
  // Here we remove any script tags in the body / description with sanitizer
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log("=============");
  console.log(req.body);

  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render("show", { foundBlog });
    }
  })
});


// EDIT ROUTE -----------------------------------------------------------
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { foundBlog });
    }
  })
});

// UPDATE ROUTE
app.put("/blogs/:id" ,function(req, res) {

  // Here we remove any script tags in the body / description with sanitizer
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      res.render("/blogs");
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});
// ----------------------------------------------------------------------

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
  Blog.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});


app.listen(3000, function() {
  console.log("blog server running on port 3000");
});
