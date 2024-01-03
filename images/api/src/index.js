const express = require("express");
const knex = require("knex");
const dotenv = require("dotenv");

dotenv.config({ path: '.env' });

const app = express();

const knexfile = require("./db/knexfile");
const db = knex(knexfile.development);

app.use(express.json());



const { checkStudentName } = require("./helpers/endPointHelpers.js")

// Root route
app.get("/", (request, response) => {
  response.send({ message: "Hello" });
});

/**
 
POST endpoint for creating a new student.
@param - The HTTP request object.
@param - The HTTP response object.
@returns - The HTTP response containing either a success message or an error.
*/
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

/**
 
PUT endpoint for updating a new student.
@param - The HTTP request object.
@param - The HTTP response object.
@returns - The HTTP response containing either a success message or an error.
*/

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

/**
 
DELETE endpoint for deleting a student.
@param - The HTTP request object.
@param - The HTTP response object.
@returns - The HTTP response containing either a success message or an error.
*/

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

/**
 
GET endpoint to retrieve all students or a specific student by ID
@param - The HTTP request object.
@param - The HTTP response object.
@returns - The HTTP response containing either a success message or an error.
*/

app.get('/api/students/:id?', async (req, res) => {
  const studentId = req.params.id;

  try {
    if (studentId) {
      // Retrieve a specific student by ID
      const student = await db('students').where('id', studentId).first();
      if (!student) {
        return res.status(404).send({
          error: "Student not found",
        });
      }

      res.status(200).send(student);
    } else {
      // Retrieve all students
      const students = await db('students');
      res.status(200).send(students);
    }
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

/**
 
GET endpoint to retrieve all students
@param - The HTTP request object.
@param - The HTTP response object.
@returns - The HTTP response containing either a success message or an error.
*/

app.get('/api/students', async (req, res) => {
    try {
      const students = await db('students');
      res.status(200).send(students);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: "Something went wrong",
        value: error,
      });
    }
  });

  /**
 * POST endpoint for a student to submit water consumption.
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */
  app.post('/api/water_info', async (req, res) => {
    const { student_id, glasses_of_water } = req.body;
  
    try {
      // Record water consumption for the specified student
      await db('water_info').insert({
        student_id,
        glasses_of_water,
      });
  
      res.status(201).send({
        message: 'Water consumption recorded successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: "Something went wrong",
        value: error,
      });
    }
  });

   /**
 * GET endpoint to retrieve a students to submit water consumption.
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */

  app.get('/api/water-info/:student_id', async (req, res) => {
    const studentId = req.params.student_id;
  
    try {
      // Retrieve water consumption records for the specified student
      const waterInfo = await db('water_info').where('student_id', studentId);
  
      res.status(200).send(waterInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: "Something went wrong",
        value: error,
      });
    }
  });

    /**
 * GET endpoint to retrieve all students to submit water consumption.
 * @param - The HTTP request object.
 * @param - The HTTP response object.
 * @returns - The HTTP response containing either a success message or an error.
 */

  app.get('/api/water-info-all', async (req, res) => {
    try {
      // Perform a join operation to retrieve all students with their water consumption records
      const result = await db('water_info')
        .join('students', 'water_info.student_id', 'students.id')
        .select('students.id as student_id', 'students.first_name', 'students.last_name', 'water_info.glasses_of_water');
  
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: "Something went wrong",
        value: error,
      });
    }
  });

  /**
 * DELETE endpoint to remove water consumption records for a specific student.
 * @param {number} req.params.studentId - The ID of the student for whom water consumption records should be deleted.
 * @returns {Object} - The HTTP response containing either a success message or an error.
 */
app.delete('/api/water-info/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Check if the student exists
    const existingStudent = await db('students').where('id', studentId).first();
    if (!existingStudent) {
      return res.status(404).send({
        error: "Student not found",
      });
    }

    // Delete water consumption records for the specified student
    await db('water_info').where('student_id', studentId).del();

    res.status(200).send({
      message: 'Water consumption records deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});

/**
 * PUT endpoint to update water consumption records for a specific student.
 * @param {number} req.params.studentId - The ID of the student for whom water consumption records should be updated.
 * @param {Object} req.body - The request body containing the updated water consumption data.
 * @returns {Object} - The HTTP response containing either a success message or an error.
 */
app.put('/api/water-info/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  if (!req.body) {
    return res.status(400).send({
      error: "Request body is missing or empty",
    });
  }

  const { glasses_of_water } = req.body;

  try {
    // Check if the student exists
    const existingStudent = await db('students').where('id', studentId).first();
    if (!existingStudent) {
      return res.status(404).send({
        error: "Student not found",
      });
    }

    // Update water consumption records for the specified student
    await db('water_info').where('student_id', studentId).update({ glasses_of_water });

    res.status(200).send({
      message: 'Water consumption records updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Something went wrong",
      value: error,
    });
  }
});


