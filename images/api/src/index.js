const express = require("express");
const knex = require("knex");
const dotenv = require("dotenv");

dotenv.config({ path: '.env' });

const app = express();

const knexfile = require("./db/knexfile");
const db = knex(knexfile.development);

app.use(express.json());

// Root route
app.get("/", (request, response) => {
  response.send({ message: "Hello" });
});

// Create a new student
app.post('/api/students', async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing or empty",
    });
  }

  const { id, first_name, last_name, age, email } = req.body;
  try {
    await db('students').insert({
      id,
      first_name,
      last_name,
      age,
      email,
    });
    res.status(201).send({
      message: 'Student created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

// Update an existing student
app.put('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;

  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing or empty",
    });
  }

  const { first_name, last_name, age, email } = req.body;
  try {
    // Update the student record
    await db('students')
      .where('id', studentId)
      .update({
        first_name,
        last_name,
        age,
        email,
      });

    res.status(200).send({
      message: 'Student updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

// Delete an existing student
app.delete('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    // Delete the student record
    await db('students')
      .where('id', studentId)
      .del();

    res.status(200).send({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

// Start the server
app.listen(3000, (err) => {
  if (!err) {
    console.log("Running on port " + 3000);
  } else {
    console.error(err);
  }
});

