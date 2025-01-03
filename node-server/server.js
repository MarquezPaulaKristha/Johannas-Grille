const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const { spawn } = require("child_process"); // For calling Python (Prophet)
const moment = require("moment");
require('dotenv').config();
const axios = require('axios');

const PAYMONGO_SECRET_KEY = 'sk_test_sEx9zBemN6cU4uY4RudHyvtG';

// Initialize express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images statically

// PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5433, // Default to 5433 if not specified
// });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'johannasgrilledb',
  password: '12345678',
  port: 5433, // Default PostgreSQL port
});

// Multer storage for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // Use your actual secret key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // If no token is present

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid
    req.user = user; // Save decoded user information in req.user
    next(); // Proceed to the next middleware or route handler
  });
};

const upload = multer({ storage });

app.post('/api/signup', async (req, res) => {
  const { firstname, lastname, address, email, phonenumber, username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO customertbl (firstname, lastname, address, email, phonenumber, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [firstname, lastname, address, email, phonenumber, username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/api/customer/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM customertbl WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Compare hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.customerid, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ 
      success: true, 
      message: 'Login successful', 
      token,
      customerid: user.customerid,
      firstname: user.firstname, 
      lastname: user.lastname, 
      email: user.email, 
      image: user.image_url,
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.get('/api/customer/info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const result = await pool.query('SELECT customerid, firstname, lastname, email, username, image_url FROM customertbl WHERE customerid = $1', [decoded.id]);

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching customer info:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// --- API Endpoints ---
app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usertbl WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Send back firstname, lastname, usertype, email, and image_url
    res.json({ 
      success: true, 
      customerid: user.customerid,
      firstname: user.firstname, 
      lastname: user.lastname, 
      usertype: user.usertype, 
      email: user.email, 
      image: user.image_url,
      branch: user.branch // Add image_url here
    });   
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Fetch all menu items
app.get('/api/menuitems', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.menuitemid, 
        m.name, 
        m.price, 
        m.category, 
        m.image_url,
        i.inventoryid,
        i.branch,
        i.quantity 
      FROM 
        menuitemtbl m
      JOIN inventorytbl i ON i.menuitemid = m.menuitemid
      WHERE i.quantity > 0  -- Ensure only items with quantity > 0 are returned
      ORDER BY 
        m.menuitemid
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch a single menu item by ID
app.get('/api/menuitems/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM menuitemtbl WHERE menuitemid = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Menu item not found');
    }
  } catch (err) {
    console.error('Error fetching menu item:', err.message);
    res.status(500).send('Server error');
  }
});

// Update a menu item by ID
app.put('/api/menuitems/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  console.log("Menu Item ID:", id);  // Log the ID
  const { name, price, category } = req.body;
  console.log("Body data:", { name, price, category });  // Log body data
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query = 'UPDATE menuitemtbl SET name = $1, price = $2, category = $3';
    let values = [name, price, category];

    if (image_url) {
      query += ', image_url = $4 WHERE menuitemid = $5 RETURNING *';
      values.push(image_url, id);
    } else {
      query += ' WHERE menuitemid = $4 RETURNING *';
      values.push(id);
    }

    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the updated item
    } else {
      res.status(404).send('Menu item not found');
    }
  } catch (err) {
    console.error('Error updating menu item:', err.message);
    res.status(500).send('Server error');
  }
});

// Insert Menu Items
app.post('/api/menuitems', upload.single('image'), async (req, res) => {
  const { name, price, category, availability } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO menuitemtbl (name, price, category, availability, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, category, availability, image_url]
    );
    res.status(201).json(result.rows[0]); // Return the newly added menu item
  } catch (err) {
    console.error('Error adding menu item:', err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/menuitems-edit-availability/:id', async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  if (!availability) {
    return res.status(400).json({ error: 'Availability is required' });
  }

  try {
    // Update the item in the database
    const query = `
      UPDATE menuitemtbl
      SET availability = $1
      WHERE menuitemid = $2
      RETURNING *;
    `;
    const values = [availability, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(result.rows[0]); // Return the updated item
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'An error occurred while updating the menu item' });
  }
});

app.post('/api/reservations/create', async (req, res) => {
  const { reservationDetails, selectedItems } = req.body;

  console.log('Request body:', req.body); // Debugging: Check request structure

  try {
    // Check if reservationDetails and reservationId exist
    if (!reservationDetails || !reservationDetails.reservationId) {
      return res.status(400).json({ error: 'Reservation ID is missing' });
    }

    // Insert reservation data
    const result = await pool.query(
      `INSERT INTO reservationtbl (reservationid, numberofguests, reservationdate, reservationtime, branch, amount)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING reservationid`,
      [
        reservationDetails.reservationId,
        reservationDetails.numberofguests,
        reservationDetails.reservationdate,
        reservationDetails.reservationtime,
        reservationDetails.branch,
        reservationDetails.totalAmount,
      ]
    );

    // Get the reservationid from the query result
    const reservationId = result.rows[0].reservationid;

    // Send a successful response with the reservationId
    res.json({ success: true, message: 'Reservation confirmed', reservationId });
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).send('Server Error');
  }
});

// Endpoint to handle reservation items (without creating a reservation in reservationtbl)
app.post('/api/reservations/items', async (req, res) => {
  const { reservationDetails, items } = req.body;

  try {
      // Insert selected items into reservation_item table
      for (const { reservationId, itemId, qty } of items) {
          await pool.query(
              `INSERT INTO reservationitemtbl (reservationid, menuitemid, qty)
               VALUES ($1, $2, $3)`,
              [reservationId, itemId, qty]
          );
      }

      res.json({ success: true, message: 'Items confirmed' });
  } catch (err) {
      console.error('Error inserting reservation items:', err);
      res.status(500).send('Error inserting reservation items');
  }
});

app.post('/api/reservations/payment', async (req, res) => {
  const { reservationId, referenceCode } = req.body;

  if (!reservationId || !referenceCode) {
    return res.status(400).json({ success: false, message: 'Missing reservationId or referenceCode' });
  }

  try {
    // Update the reservationtbl with the GCash payment details
    const result = await pool.query(
      `UPDATE reservationtbl
       SET referencecode = $1
       WHERE reservationid = $2`,
      [referenceCode, reservationId]
    );

    if (result.rowCount === 0) {
      // No rows were updated
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Payment details confirmed' });
  } catch (err) {
    console.error('Error inserting payment details:', err);
    res.status(500).json({ success: false, message: 'Error inserting payment details' });
  }
});



// delete menu items

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM menuitemtbl WHERE menuitemid = $1 RETURNING *', [id]);

    if (result.rows.length > 0) {
      res.json({ message: 'Product deleted successfully', item: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch distinct categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM menuitemtbl');
    res.json(result.rows.map(row => row.category));
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/reservationmenuitems', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservationmenutbl ORDER BY menuitemid');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch distinct categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM menuitemtbl');
    res.json(result.rows.map(row => row.category));
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all users
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usertbl');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all users by id
app.get('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT * FROM usertbl WHERE userid = $1', [id]);
      if (result.rows.length > 0) {
          res.json(result.rows[0]); // Return the employee details
      } else {
          res.status(404).send('Employee not found');
      }
  } catch (err) {
      console.error('Error fetching employee details:', err.message);
      res.status(500).send('Server error');
  }
});


app.put('/api/employees/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  console.log("EmployeeId:", id);  // Log the ID
  const { firstname, lastname, email, username, branch } = req.body;
  console.log("Body data:", { firstname, lastname, email, username, branch });  // Log body data
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
      let query = 'UPDATE usertbl SET firstname = $1, lastname = $2, email = $3, username = $4, branch = $5';
      let values = [firstname, lastname, email, username, branch];

      if (image_url) {
          query += ', image_url = $6 WHERE userid = $7 RETURNING *';
          values.push(image_url, id);
      }
      query += ' WHERE userid = $6 RETURNING *'; // Use $7 for id
      values.push(id);

      const result = await pool.query(query, values);
      if (result.rows.length > 0) {
          res.json(result.rows[0]); // Return the updated item
      } else {
          res.status(404).send('Employee not found');
      }
  } catch (err) {
      console.error('Error updating employee details:', err.message);
      res.status(500).send('Server error');
  }
});


//add employee
app.post("/api/employeeadd", upload.single('image'), async (req, res) => {
  const {usertype, firstname, lastname, email, username, password, branch} = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO usertbl (usertype, firstname, lastname, email, username, password, branch, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [usertype, firstname, lastname, email, username, password, branch, image_url]
    );
    res.status(201).json(result.rows[0]); // Return the newly added menu item
  } catch (err) {
    console.error('Error adding employee:', err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/employees/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query = 'UPDATE usertbl SET username = $1, email = $2';
    const values = [username, email];

    if (image_url) {
      query += ', image_url = $3 WHERE userid = $4 RETURNING *';
      values.push(image_url, id);
    } else {
      query += ' WHERE userid = $3 RETURNING *';
      values.push(id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE employee by ID
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM usertbl WHERE userid = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/employee-orders', async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        o.orderid,
        o.ordertype,
        oi.menuitemid, 
        oi.quantity, 
        m.name, 
        m.price
      FROM 
        orderstbl o
      JOIN 
        orderitemtbl oi ON o.orderid = oi.orderid
      JOIN 
        menuitemtbl m ON oi.menuitemid = m.menuitemid
      WHERE 
        o.status = 'Pending' -- Ensure the orders are 'Pending'
    `);
    
    // Group the items by orderid
    const groupedOrders = result.rows.reduce((acc, item) => {
      if (!acc[item.orderid]) {
        acc[item.orderid] = {
          orderid: item.orderid,
          ordertype: item.ordertype,
          items: [] // Initialize the items array
        };
      }
      // Push the item details into the items array
      acc[item.orderid].items.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      });
      return acc;
    }, {});

    // Convert the grouped orders object to an array
    const ordersArray = Object.values(groupedOrders);

    res.status(200).json(ordersArray); // Send the grouped orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservationtbl');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM reservationtbl WHERE reservationid = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Menu item not found');
    }
  } catch (err) {
    console.error('Error fetching menu item:', err.message);
    res.status(500).send('Server error');
  }
});


app.post("/api/reservations", async (req, res) => {
  const {numberofguests, reservationdate, reservationtime, branch} = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO reservationtbl (numberofguests, reservationdate, reservationtime, branch) VALUES ($1, $2, $3, $4) RETURNING *',
      [numberofguests, reservationdate, reservationtime, branch]
    );
    res.status(201).json(result.rows[0]); // Return the newly added menu item
  } catch (err) {
    console.error('Error adding reservation:', err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/menu-items', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM reservationmenutbl');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).send('Server Error');
  }
});


app.get('/api/customer', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customertbl ORDER BY customerid ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/customer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM customertbl WHERE customerid = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Customer not found');
    }
  } catch (err) {
    console.error('Error fetching customer details:', err.message);
    res.status(500).send('Server error');
  }
});


app.put('/api/customer/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, address, email, phonenumber } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query = 'UPDATE customertbl SET firstname = $1, lastname = $2, address = $3, email = $4, phonenumber = $5';
    let values = [firstname, lastname, address, email, phonenumber];

    if (image_url) {
      query += ', image_url = $6 WHERE customerid = $7 RETURNING *';
      values.push(image_url, id);
    } else {
      query += ' WHERE customerid = $6 RETURNING *';
      values.push(id);
    }

    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the updated item
    } else {
      res.status(404).send('Customer not found');
    }
  } catch (err) {
    console.error('Error updating customer details:', err.message);
    res.status(500).send('Server error');
  }
});

app.delete("/api/customer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM customertbl WHERE customerid = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orderstbl');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu items:', err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/order/:orderId', async (req, res) => {
  const { orderId } = req.params; // Ensure the variable is named correctly

  try {
    const result = await pool.query(
      `SELECT oi.*, m.name, m.price, m.image_url
       FROM orderitemtbl oi
       JOIN menuitemtbl m ON oi.menuitemid = m.menuitemid
       WHERE oi.orderid = $1`, // Use correct parameter
      [orderId] // Make sure the orderId is passed as a parameter
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching order items:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
});


// POST endpoint to add items to an order
app.post('/api/orderitems', async (req, res) => {
  const { menuitemid, orderid } = req.body;

  try {
    // Check if the orderid already exists in orderstbl
    const existingOrder = await pool.query(
      'SELECT * FROM orderstbl WHERE orderid = $1',
      [orderid]
    );

    let order;

    // If the orderid doesn't exist, insert it
    if (existingOrder.rows.length === 0) {
      order = await pool.query(
        'INSERT INTO orderstbl (orderid) VALUES ($1) RETURNING *',
        [orderid]
      );
    } else {
      order = existingOrder;
    }

    // Insert into orderitemtbl (regardless of whether orderid was new or existing)
    const result = await pool.query(
      'INSERT INTO orderitemtbl (orderid, menuitemid) VALUES ($1, $2) RETURNING *',  // Correct column name
      [orderid, menuitemid]
    );

    // Respond with both the order and order item information
    res.status(201).json({
      order: order.rows[0], // Whether new or existing, return the order details
      result: result.rows[0], // Newly inserted order item
    });
  } catch (error) {
    console.error('Error adding order item:', error);
    res.status(500).json({ error: 'Failed to add order item' });
  }
});

app.put('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { customerId = '0000', orderType, totalAmount, date, time } = req.body;

  // Log the received customerId to verify it's coming through as a string
  console.log('Received customerId:', customerId);

  try {
    const result = await pool.query(
      'UPDATE orderstbl SET customerid = $1, ordertype = $2, totalamount = $3, date = $4, time = $5 WHERE orderid = $6 RETURNING *',
      [customerId, orderType, totalAmount, date, time, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Confirm an order
app.post('/api/confirm-order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Ensure the order exists
    const order = await pool.query('SELECT * FROM orderstbl WHERE orderid = $1', [orderId]);

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Perform order confirmation logic (e.g., mark as confirmed in the database)
    const result = await pool.query(
      'UPDATE orderstbl SET status = $1 WHERE orderid = $2 RETURNING *',
      ['Pending', orderId]
    );

    res.status(200).json({
      message: 'Order confirmed successfully',
      order: result.rows[0],
    });
  } catch (error) {
    console.error('Error confirming order:', error.message);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});

app.delete('/api/orderitems/:orderitemid', async (req, res) => {
  const { orderitemid } = req.params;

  try {
    // Query to delete the item from orderitemtbl
    const result = await pool.query('DELETE FROM orderitemtbl WHERE orderitemid = $1 RETURNING *', [orderitemid]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error('Error removing item:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/reservations', async (req, res) => {
  const { reservationDetails, selectedItems, totalAmount } = req.body;

  try {
    // Insert reservation details into the reservation table (you may need to create it if it doesn't exist)
    const result = await pool.query(
      `INSERT INTO reservationtbl (numberofguests, reservationdate, reservationtime, branch)
       VALUES ($1, $2, $3, $4) RETURNING reservationid`,
      [
        reservationDetails.numberofguests,
        reservationDetails.reservationdate,
        reservationDetails.reservationtime,
        reservationDetails.branch,
      ]
    );
    const reservationid = result.rows[0].reservationid;

    // Insert each selected item into a reservations_items table (if you need a relationship for tracking items per reservation)
    for (const category in selectedItems) {
      for (const itemName in selectedItems[category]) {
        const item = selectedItems[category][itemName];
        await pool.query(
          `INSERT INTO reservations_items (reservationid, item_name, qty, price)
           VALUES ($1, $2, $3, $4)`,
          [reservationid, itemName, item.qty, item.price]
        );
      }
    }

    res.json({ success: true, message: 'Reservation confirmed', reservationid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET endpoint to fetch menu items
app.get('/api/menu-items', (req, res) => {
  res.json(menuItems);
});

app.post('/api/reservations/receipt', async (req, res) => {
  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ success: false, message: "Reservation ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT
        reservationtbl.branch,
        reservationtbl.reservationdate,
        reservationtbl.reservationtime,
        reservationtbl.numberofguests,
        reservationmenutbl.item_name,
        reservationitemtbl.qty,
        reservationmenutbl.package_price,
        (reservationitemtbl.qty * reservationmenutbl.package_price) AS total_cost
      FROM
        reservationtbl
      JOIN
        reservationitemtbl ON reservationtbl.reservationid = reservationitemtbl.reservationid
      JOIN
        reservationmenutbl ON reservationitemtbl.menuitemid = reservationmenutbl.menuitemid
      WHERE
        reservationtbl.reservationid = $1`,
      [reservationId]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, reservations: result.rows });
    } else {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.inventoryid,
        i.quantity,
        i.branch,
        m.menuitemid,
        m.name,
        m.image_url,
        m.category
      FROM
        inventorytbl i
      JOIN menuitemtbl m ON i.menuitemid = m.menuitemid
      ORDER BY i.inventoryid ASC
      `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error inventory menu items:', err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;  // Inventory ID from the route
  const { quantity } = req.body; // Updated quantity from the request body

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ error: 'Invalid quantity value' });
  }

  try {
    // Update query
    const result = await pool.query(
      'UPDATE inventorytbl SET quantity = $1 WHERE inventoryid = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Return the updated row
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/send-inventory', async (req, res) => {
  console.log('Request body:', req.body); // Log incoming request
  const { productId, invid, quantityToSend, branch } = req.body;

  if (!productId || !invid || !quantityToSend || !branch) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Determine the destination branch
    const destinationBranch = branch === 'Bauan' ? 'Batangas' : 'Bauan';

    // Begin transaction
    const client = await pool.connect();
    await client.query('BEGIN');

    // Subtract quantity from the current branch
    const subtractQuery = `
      UPDATE inventorytbl
      SET quantity = quantity - $1
      WHERE inventoryid = $2 AND branch = $3 AND quantity >= $1
      RETURNING inventoryid, quantity;
    `;
    const subtractResult = await client.query(subtractQuery, [quantityToSend, invid, branch]);

    if (subtractResult.rowCount === 0) {
      throw new Error('Insufficient quantity or invalid inventory ID.');
    }

    // Add quantity to the destination branch
    const addQuery = `
      UPDATE inventorytbl
      SET quantity = quantity + $1
      WHERE menuitemid = $2 AND branch = $3
      RETURNING menuitemid, quantity;
    `;
    const addResult = await client.query(addQuery, [quantityToSend, productId, destinationBranch]);

    // If the destination branch entry doesn't exist, insert a new record
    if (addResult.rowCount === 0) {
      const insertQuery = `
        INSERT INTO inventorytbl (menuitemid, quantity, branch)
        SELECT $1, $2, $3
        FROM inventorytbl
        WHERE inventoryid = $4
        RETURNING inventoryid, quantity;
      `;
      await client.query(insertQuery, [productId, quantityToSend, destinationBranch, invid]);
    }

    // Commit the transaction
    await client.query('COMMIT');
    res.status(200).json({ message: 'Inventory successfully transferred.' });
  } catch (error) {
    console.error('Error transferring inventory:', error.message);
    res.status(500).json({ error: 'An error occurred while transferring inventory.' });
  } finally {
  }
});

app.get('/analytics', async (req, res) => {
  const { month } = req.query; // Get month from query parameter

  if (month === undefined || isNaN(month) || month < 0 || month > 11) {
    return res.status(400).send('Invalid month parameter');
  }

  try {
    // Get orders for the selected month and the current year
    const { rows } = await pool.query(
      `SELECT EXTRACT(week FROM date) AS week, SUM(totalamount) AS total_sales
       FROM orderstbl
       WHERE EXTRACT(year FROM date) = EXTRACT(year FROM CURRENT_DATE)
         AND EXTRACT(month FROM date) = $1
       GROUP BY week
       ORDER BY week`,
      [month + 1] // PostgreSQL month starts at 1, so add 1
    );

    const weeklySales = rows.map((row) => ({
      week: `Week ${row.week}`,
      totalSales: parseFloat(row.total_sales),
    }));

    // Return data to frontend
    res.json({
      labels: weeklySales.map((data) => data.week),
      datasets: [
        {
          label: 'Weekly Sales',
          data: weeklySales.map((data) => data.totalSales),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/top-items', async (req, res) => {
  try {
      const month = parseInt(req.query.month, 10);
      const year = new Date().getFullYear();
      const limit = 5;

      if (!month || !year) {
          return res.status(400).json({ message: 'Month and year are required' });
      }

      const result = await pool.query(
          `
          SELECT 
              i.menuitemid, 
              i.name,
              SUM(t.quantity) AS percentValues 
          FROM orderitemtbl t
          JOIN menuitemtbl i ON t.menuitemid = i.menuitemid
          JOIN orderstbl o ON o.orderid = t.orderid
          WHERE 
              EXTRACT(MONTH FROM o.date) = $1 
              AND EXTRACT(YEAR FROM o.date) = $2
          GROUP BY i.menuitemid
          ORDER BY percentValues DESC
          LIMIT $3;
          `,
          [month, year, limit || 5] 
      );

      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching top items:', error);
      res.status(500).json({ message: 'Error fetching top items' });
  }
});


async function getOrderData() {
  try {
    const query = `
      SELECT orderid, customerid, ordertype, date, totalamount, time
      FROM orderstbl
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw new Error("Failed to fetch order data");
  }
}

app.get("/api/predict", async (req, res) => {
  try {
    const month = req.query.month ? parseInt(req.query.month) : null;
    const year = req.query.year ? parseInt(req.query.year) : null; // Get the year from query

    // Step 1: Query and Prepare Data
    let orderData = await getOrderData();

    // Data transformation using plain JavaScript
    orderData = orderData
      .map((row) => {
        const dateStr = row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date;
        const timeStr = row.time;
        const datetimeString = `${dateStr} ${timeStr}`;
        const datetime = moment(datetimeString, "YYYY-MM-DD HH:mm:ss").local();
        return { ...row, datetime };
      })
      .filter((row) => row.datetime.isValid());

    // Extract day, month, and hour
    orderData = orderData.map((row) => ({
      ...row,
      day: row.datetime.format("YYYY-MM-DD"),
      month: row.datetime.month() + 1, // Moment.js months are zero-based
      year: row.datetime.year(), // Add year to the data
      hour: row.datetime.hour(),
    }));

    // Filter by year and month if provided
    if (year) {
      orderData = orderData.filter((row) => row.year === year);
    }

    if (month) {
      orderData = orderData.filter((row) => row.month === month);
    }

    // Filter business hours (9 AM to 9 PM)
    orderData = orderData.filter((row) => row.hour >= 9 && row.hour <= 20);

    // Group data by day and hour
    const groupedData = {};
    orderData.forEach((row) => {
      const key = `${row.day}-${row.hour}`;
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key]++;
    });

    const peakHours = Object.entries(groupedData)
      .map(([key, count]) => {
        const day = key.slice(0, 10);  // YYYY-MM-DD
        const hour = parseInt(key.slice(11));  // HH
        if (isNaN(hour)) return null;
        return { day, hour, count };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.day === b.day) {
          return a.hour - b.hour;
        }
        return a.day < b.day ? -1 : 1;
      })
      .reduce((acc, cur) => {
        const existing = acc.find((item) => item.day === cur.day);
        if (!existing || cur.count > existing.count) {
          acc = acc.filter((item) => item.day !== cur.day);
          acc.push({ day: cur.day, hour: cur.hour, count: cur.count });
        }
        return acc;
      }, []);

    // Step 3: Call Python Script for Forecasting
    const python = spawn("python", ["prophet_forecast.py", month, year]);

    // Send data to Python script
    python.stdin.write(JSON.stringify(peakHours));
    python.stdin.end();

    let result = "";
    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Error from Python: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        res.status(500).json({ message: "Error in Python script." });
      } else {
        const predictions = JSON.parse(result);
        res.json({
          message: "Predicted peak hours for the specified month and year are ready.",
          predictions,
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.post('/api/gcash-checkout', async (req, res) => {
  const { lineItems } = req.body;

  const formattedLineItems = lineItems.map((item) => {
      return {
          currency: 'PHP',
          amount: Math.round(item.price * 100), 
          name: item.name,
          quantity: item.quantity,
      };
  });

  try {
      const response = await axios.post(
          'https://api.paymongo.com/v1/checkout_sessions',
          {
              data: {
                  attributes: {
                      send_email_receipt: false,
                      show_line_items: true,
                      line_items: formattedLineItems, 
                      payment_method_types: ['gcash'],
                      success_url: 'http://localhost:5173/employee/success',
                      cancel_url: 'http://localhost:5173/employee/order',
                  },
              },
          },
          {
              headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`, 
              },
          }
      );

      const checkoutUrl = response.data.data.attributes.checkout_url;

      if (!checkoutUrl) {
          return res.status(500).json({ error: 'Checkout URL not found in response' });
      }
      res.status(200).json({ url: checkoutUrl });
  } catch (error) {
      console.error('Error creating checkout session:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to create checkout session', details: error.response ? error.response.data : error.message });
  }
});

app.post('/api/customer-gcash-checkout', async (req, res) => {
  const { lineItems } = req.body;

  const formattedLineItems = lineItems.map((item) => {
      return {
          currency: 'PHP',
          amount: Math.round(item.price * 100), 
          name: item.name,
          quantity: item.quantity,
      };
  });

  try {
      const response = await axios.post(
          'https://api.paymongo.com/v1/checkout_sessions',
          {
              data: {
                  attributes: {
                      send_email_receipt: false,
                      show_line_items: true,
                      line_items: formattedLineItems, 
                      payment_method_types: ['gcash'],
                      success_url: 'http://localhost:5173/success',
                      cancel_url: 'http://localhost:5173/',
                  },
              },
          },
          {
              headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`, 
              },
          }
      );

      const checkoutUrl = response.data.data.attributes.checkout_url;

      if (!checkoutUrl) {
          return res.status(500).json({ error: 'Checkout URL not found in response' });
      }
      res.status(200).json({ url: checkoutUrl });
  } catch (error) {
      console.error('Error creating checkout session:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to create checkout session', details: error.response ? error.response.data : error.message });
  }
});

app.post('/api/create-order', async (req, res) => {
  const { customerid, orderItems, totalamount, ordertype, date, time, tableno, status } = req.body;

  try {
    // Extract orderid from the first item in orderItems
    const formattedDate = date.replace(/-/g, ""); // Remove dashes from date
    const orderid = `${formattedDate}${orderItems[0].orderid}`;

    // Insert into Orders table with manually provided orderid
    await pool.query(
      'INSERT INTO orderstbl (orderid, customerid, totalamount, ordertype, date, time, tableno, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [orderid, customerid, totalamount, ordertype, date, time, tableno, status]
    );

    // Insert items into the orderitemtbl table
    for (let item of orderItems) {
      await pool.query(
        'INSERT INTO orderitemtbl (orderid, menuitemid, quantity) VALUES ($1, $2, $3)',
        [orderid, item.menuitemid, item.order_quantity]
      );
    }

    for (let item of orderItems) {
      await pool.query(
          'UPDATE inventorytbl SET quantity = quantity - $1 WHERE menuitemid = $2',
          [item.order_quantity, item.menuitemid]
      );
    }

    res.status(200).json({ message: 'Order created successfully' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/orders/:orderid/status', async (req, res) => {
  const { orderid } = req.params; // Extract order ID from URL
  const { status } = req.body;    // Extract new status (e.g., 'Complete') from the request body

  if (!status || status !== 'Complete') {
    return res.status(400).json({ error: 'Invalid status or missing status' });
  }

  try {
    // Update the order status in the database
    const result = await pool.query(
      'UPDATE orderstbl SET status = $1 WHERE orderid = $2 RETURNING *',
      [status, orderid] // Set the new status and use the order ID to locate the order
    );

    // If no rows were affected, the order ID was not found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Successfully updated, return the updated order
    res.status(200).json({ message: 'Order updated successfully', order: result.rows[0] });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.post('/api/reservation-gcash-checkout', async (req, res) => {
  const { lineItems } = req.body;

  const formattedLineItems = lineItems.map((item) => {
      return {
          currency: 'PHP',
          amount: Math.round(item.price * 100), 
          name: item.name,
          quantity: item.quantity,
      };
  });

  try {
      const response = await axios.post(
          'https://api.paymongo.com/v1/checkout_sessions',
          {
              data: {
                  attributes: {
                      send_email_receipt: false,
                      show_line_items: true,
                      line_items: formattedLineItems, 
                      payment_method_types: ['gcash'],
                      success_url: 'http://localhost:5173/success-reservation',
                      cancel_url: 'http://localhost:5173/',
                  },
              },
          },
          {
              headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`, 
              },
          }
      );

      const checkoutUrl = response.data.data.attributes.checkout_url;

      if (!checkoutUrl) {
          return res.status(500).json({ error: 'Checkout URL not found in response' });
      }
      res.status(200).json({ url: checkoutUrl });
  } catch (error) {
      console.error('Error creating checkout session:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to create checkout session', details: error.response ? error.response.data : error.message });
  }
});

app.post('/api/create-reservation', async (req, res) => {
  const reservations = req.body; // The payload array from the frontend

  try {
      // Loop through each reservation item in the payload
      for (let reservation of reservations) {
          const {
              reservationId,
              customerid,
              numberOfGuests,
              reservationDate,
              reservationTime,
              branch,
              amount,
              modeOfPayment,
              status,
              menuItemId,
              quantity,
          } = reservation;

          // Insert into reservation table (only if new reservation)
          await pool.query(
              `INSERT INTO reservationtbl (reservationid, customerid, numberofguests, reservationdate, reservationtime, branch, amount, modeofpayment, status)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT (reservationid) DO NOTHING`, // Prevent duplicate reservations
              [reservationId, customerid, numberOfGuests, reservationDate, reservationTime, branch, amount, modeOfPayment, status]
          );

          // Insert item details into transactions table
          await pool.query(
              `INSERT INTO reservationitemtbl (reservationid, menuitemid, qty)
               VALUES ($1, $2, $3)`,
              [reservationId, menuItemId, quantity]
          );

          // Update inventory stock
          // await pool.query(
          //     `UPDATE inventory SET quality_stocks = quality_stocks - $1 WHERE item_id = $2`,
          //     [quantity, menuItemId]
          // );
      }

      res.status(200).json({ message: 'Reservations created successfully' });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

