const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("../config/db"); // Database connection

// Middleware to format input data
const formatInputData = (req, res, next) => {
  const { year, price, quantity } = req.body;

  // Convert year, price, and quantity to appropriate data types
  req.body.year = year ? parseInt(year) : null;
  req.body.price = price ? parseFloat(price) : null;
  req.body.quantity = quantity ? parseInt(quantity) : null;

  next();
};

// Sanitization rules for the PUT and POST routes
const sanitizationRules = [
  body("name")
    .trim()
    .customSanitizer((value) => {
      // Allow only letters, numbers, spaces, hyphens, commas, periods, single quotes, forward slashes, and parentheses
      return value.replace(/[^a-zA-Z0-9',/().\s\-]/g, "");
    }),
  body("src").trim(),
  body("thumb").trim(),
  body("company")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/[^a-zA-Z0-9',/().\s\-]/g, "");
    }),
  body("brand")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/[^a-zA-Z0-9',/().\s\-]/g, "");
    }),
  body("series")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/[^a-zA-Z0-9',/().\s\-]/g, "");
    }),
  body("collection")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/[^a-zA-Z0-9',/().\s\-]/g, "");
    }),
  body("variant").trim().escape(),
  body("reissue").trim().escape(),
  body("year").toInt(),
  body("price").toFloat(),
  body("toycondition").trim().escape(),
  body("upc").trim().escape(),
  body("dateadded").trim().escape(),
  body("notes")
    .trim()
    .customSanitizer((value) => {
      return value.replace(/[^a-zA-Z0-9',/().\s\-]/g, "");
    }),
  body("completed").trim().escape(),
  body("quantity").toInt(),
];

// Validation rules for the PUT and POST routes
const validationRules = [
  body("name").isString().notEmpty(),
  body("src").isString().notEmpty(),
  body("thumb").isString().notEmpty(),
  body("brand").isString().notEmpty(),
  body("series").isString(),
  body("collection").isString(),
  body("variant").isString(),
  body("reissue").isString(),
  body("company").isString().notEmpty(),
  body("year").isInt({ min: 1900, max: new Date().getFullYear() }),
  body("price").isFloat({ min: 0 }),
  body("toycondition").isString(),
  body("upc").isString(),
  body("dateadded").isString(),
  body("notes").isString(),
  body("completed").isString(),
  body("quantity").isInt(),
];

// Route to get all toys
router.get("/", (req, res) => {
  // Your code to fetch all toys from the database
  const query = "SELECT * FROM toys";

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to query for toys", details: err });
    } else {
      res.json(result);
    }
  });
});

// Route to get a single toy by ID
router.get("/:id", (req, res) => {
  const toyId = req.params.id;
  const query = "SELECT * FROM toys WHERE id = ?";

  db.query(query, [toyId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to query for toy", details: err });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Toy not found" });
    } else {
      res.json(result[0]);
    }
  });
});

// Route to create a new toy record
router.post(
  "/",
  [formatInputData, ...sanitizationRules, ...validationRules],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array()); // Log validation errors
      return res.status(400).json(errors.array());
    }

    const {
      name,
      src,
      thumb,
      brand,
      series,
      collection,
      variant,
      reissue,
      company,
      year,
      price,
      toycondition,
      upc,
      dateadded,
      notes,
      quantity,
      completed,
    } = req.body;

    // Perform additional custom validation if needed
    if (year > new Date().getFullYear()) {
      return res.status(400).json({ error: "Year cannot be in the future" });
    }

    // ... Add more custom validation if required

    const query =
      "INSERT INTO toys (name, src, thumb, brand, series, collection, variant, reissue, company, year, price, toycondition, upc, dateadded, notes, quantity, completed) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [
      name,
      src,
      thumb,
      brand,
      series,
      collection,
      variant,
      reissue,
      company,
      year,
      price,
      toycondition,
      upc,
      dateadded,
      notes,
      quantity,
      completed,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create toy", details: err });
      } else {
        res.json({ success: true });
      }
    });
  }
);

// // Middleware to add 'io' to the 'res' object
// const socketIoMiddleware = (io) => (req, res, next) => {
//   res.io = io;
//   next();
// };

// Route to update a toy
router.put(
  "/:id",
  [formatInputData, ...sanitizationRules, ...validationRules],
  (req, res) => {
    const id = req.params.id;
    const {
      name,
      src,
      thumb,
      brand,
      series,
      collection,
      variant,
      reissue,
      company,
      year,
      price,
      toycondition,
      upc,
      notes,
      quantity,
      completed,
    } = req.body;

    // Validate required fields
    if (!name || !src || !brand || !company || !year) {
      res.status(400).json({ error: "Required fields are missing" });
      return;
    }

    // Retrieve existing data from the database
    const query = "SELECT * FROM toys WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Failed to retrieve existing data", details: err });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: "Toy not found" });
        return;
      }

      const existingData = results[0];

      // Compare fields and update the database if necessary
      const fieldsToUpdate = [
        "name",
        "src",
        "thumb",
        "brand",
        "company",
        "series",
        "collection",
        "variant",
        "reissue",
        "year",
        "price",
        "toycondition",
        "upc",
        "notes",
        "quantity",
        "completed",
      ];

      const updates = [];
      const values = [];

      fieldsToUpdate.forEach((field) => {
        if (
          req.body[field] !== undefined &&
          req.body[field] !== existingData[field]
        ) {
          updates.push(`${field} = ?`);
          values.push(req.body[field]);
        }
      });

      if (updates.length === 0) {
        res.status(400).json({ error: "No fields to update" });
        return;
      }

      values.push(id); // Add the ID as the last value for the WHERE clause

      const updateQuery = `UPDATE toys SET ${updates.join(", ")} WHERE id = ?`;

      // Execute the query with values
      db.query(updateQuery, values, (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          res
            .status(500)
            .json({ error: "Failed to update toy", details: updateErr });
        } else if (updateResult.affectedRows === 0) {
          res.status(404).json({ error: "Toy not found" });
        } else {
          // Notify clients about the update
          res.io.emit("updateItem");
          res.json({ message: "Toy updated successfully" });
        }
      });
    });
  }
);

// Route to delete a toy by ID
router.delete("/:id", (req, res) => {
  const toyId = req.params.id;
  const query = "DELETE FROM toys WHERE id = ?";

  db.query(query, [toyId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete toy", details: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Toy not found" });
    } else {
      res.io.emit("updateItem");
      res.json({ message: "Toy deleted successfully" });
    }
  });
});

module.exports = router;
