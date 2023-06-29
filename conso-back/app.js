// app.js is the entry point of the application. It is responsible for starting the server and loading the routes.

const express = require("express");
const app = express();
const cors = require("cors");

const { router, authenticate } = require("./routes/auth");

// Enable CORS
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);

// Parse the request body as JSON
app.use(express.json());

// authentication middleware
app.use("/login", router);

app.use("/auth", authenticate, (req, res) => {
  res.status(200).json({
    message: "Authenticated",
  });
});

// Mount the user routes
app.use("/user", require("./routes/user"));

// Mount the bank routes
app.use("/bank", require("./routes/bank"));

// Mount the document routes
app.use("/document", require("./routes/document"));

// Mount the banker routes
app.use("/banker", require("./routes/banker"));

// hello world
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
