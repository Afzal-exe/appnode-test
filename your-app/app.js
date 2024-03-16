const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const db = require('./config/db.config'); // Import database configuration

const app = express();

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true })); // Configure session management
app.use(passport.initialize());
app.use(passport.session());

// Set up templating engine (adjust for your choice)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import and configure Passport.js (replace with your chosen strategy)
require('./config/passport')(passport);

// Set up routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
