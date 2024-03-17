// routes/index.js

var express = require('express');
var router = express.Router();

var database = require('../database');

// Function to check if user_login table exists
function checkUserTable(callback) {
    database.query("SHOW TABLES LIKE 'user_login'", function(error, result) {
        if (error) {
            console.error('Error checking for user_login table:', error);
            callback(error, false);
            return;
        }
        callback(null, result.length > 0);
    });
}

// Function to create user_login table
function createUserTable(callback) {
    var createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_login (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        user_email VARCHAR(100) NOT NULL,
        user_password VARCHAR(100) NOT NULL
    )`;
    database.query(createTableQuery, function(error) {
        if (error) {
            console.error('Error creating user_login table:', error);
            callback(error);
            return;
        }
        console.log('user_login table created successfully');
        callback(null);
    });
}

// GET home page
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', session : req.session });
});

// POST login
router.post('/login', function(request, response, next) {
    var user_email_address = request.body.user_email_address;
    var user_password = request.body.user_password;

    if (user_email_address && user_password) {
        // Check if user_login table exists
        checkUserTable(function(error, tableExists) {
            if (error) {
                response.status(500).send('Internal server error');
                return;
            }
            if (!tableExists) {
                response.send('No users registered yet. Please register first.');
                return;
            }
            // Proceed with login
            var query = `
            SELECT * FROM user_login 
            WHERE user_email = ?`;

            database.query(query, [user_email_address], function(error, data) {
                if (error) {
                    console.error('Error selecting user:', error);
                    response.status(500).send('Internal server error');
                    return;
                }
                if (data.length > 0 && data[0].user_password === user_password) {
                    request.session.user_id = data[0].user_id;
                    // After successful login
                    response.redirect("/userlist");
                } else {
                    response.send('Incorrect Email Address or Password');
                }
            });
        });
    } else {
        response.send('Please Enter Email Address and Password Details');
    }
});

// GET logout
router.get('/logout', function(request, response, next) {
    request.session.destroy();
    response.redirect("/");
});

// GET register page
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
});

// POST register
router.post('/register', function(req, res, next) {
    var username = req.body.username;
    var user_email_address = req.body.user_email_address;
    var user_password = req.body.user_password;

    console.log('Received data:', req.body); // Log received form data

    if (username && user_email_address && user_password) {
        // Check if user_login table exists
        checkUserTable(function(error, tableExists) {
            if (error) {
                res.status(500).send('Internal server error');
                return;
            }
            // Create user_login table if it doesn't exist
            if (!tableExists) {
                createUserTable(function(error) {
                    if (error) {
                        res.status(500).send('Internal server error');
                        return;
                    }
                    // Proceed with user registration
                    registerUser(res, username, user_email_address, user_password);
                });
            } else {
                // Proceed with user registration
                registerUser(res, username, user_email_address, user_password);
            }
        });
    } else {
        res.send('Please Enter Username, Email Address, and Password');
    }
});

// Function to register user
function registerUser(res, username, user_email_address, user_password) {
    var query = `
    INSERT INTO user_login (username, user_email, user_password) 
    VALUES (?, ?, ?)
    `;

    database.query(query, [username, user_email_address, user_password], function(error, results, fields) {
        if (error) {
            console.error('Error registering user:', error);
            res.status(500).send('Internal server error');
        } else {
            // After successful registration
            res.redirect("/userlist");
        }
    });
}

// userlist route
router.get('/userlist', function(req, res, next) {
    // Write code here to query the database and retrieve user names
    database.query('SELECT username FROM user_login', function(error, results, fields) {
        if (error) {
            console.error('Error retrieving user list:', error);
            res.status(500).send('Internal server error');
        } else {
            // Render the user list view and pass the retrieved user names to it
            res.render('userlist', { title: 'Registered Users', users: results });
        }
    });
});



//logout route
router.post('/logout', function(req, res, next) {
    // Destroy the session and redirect to login page
    req.session.destroy();
    res.redirect("/");
});


module.exports = router;
