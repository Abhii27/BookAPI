require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Initializing express
const app = express();

// Configurations
app.use(express.json());

console.log(process.env.MONGO_URL);

// Establish Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(console.log("mongodb connected successfully🚀🚀."))
  .catch((err) => console.log(err));

// Initializing Microservices
app.use("/book", Books);
app.use("/author", Authors);
app.use("/publication", Publications);

app.listen(3000, () => console.log("Server Running!!🚀"));
