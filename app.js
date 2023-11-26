const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000; //eg django runs on 8000

// Create a connection to MySQL
const db = mysql.createConnection({
  host: "localhost", // Update if MySQL is running on a different host
  user: "",
  password: "",
  database: "",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL");
});

// Middleware to parse JSON and handle form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle form submissions
app.post("/submitForm", (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Insert the data into the MySQL table
    db.query(
      "INSERT INTO ISAloginDB (email, password, role) VALUES (?, ?, ?)", //here ISAloginDB is the author's db name
      [email, password, role],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into MySQL:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.send("Data inserted successfully");
      }
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});