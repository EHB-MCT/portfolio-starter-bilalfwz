const express = require("express");
const knex = require("knex");
const dotenv = require("dotenv");

dotenv.config({ path: '.env' });

const app = express();

const knexfile = require("./db/knexfile");
const db = knex(knexfile.development);

app.use(express.json());

// console.log(db.raw("SELECT 1+1"))
app.get("/", (request,response ) =>{
    response.send({ message: "hello"})
})

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
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("Running on port " + 3000);
  } else {
    console.error(err);
  }
});