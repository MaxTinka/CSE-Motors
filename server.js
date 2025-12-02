/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    // Create the 'session' table in your database first
    // CREATE TABLE "session" (
    //   "sid" varchar NOT NULL COLLATE "default",
    //   "sess" json NOT NULL,
    //   "expire" timestamp(6) NOT NULL
    // ) WITH (OIDS=FALSE);
    // ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    // CREATE INDEX "IDX_session_expire" ON "session" ("expire");
    conString: process.env.DATABASE_URL,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'cse340-motors-secret-key-' + Math.random().toString(36).substring(2, 15),
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Flash messages
app.use(flash());

/* ***********************
 * View engine templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Make messages available to all views
 *************************/
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

/* ***********************
 * Authentication Middleware
 *************************/
const authMiddleware = require("./utilities/authMiddleware");
app.use(authMiddleware.checkLogin);

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", function(req, res){
  res.render("index", {title: "Home"});
});

/* ***********************
 * Account Routes
 *************************/
const accountRoute = require("./routes/accountRoute");
app.use("/account", accountRoute);

/* ***********************
 * Inventory Routes
 *************************/
const inventoryRoute = require("./routes/inventoryRoute");
app.use("/inv", inventoryRoute);

/* ***********************
 * Error Handling Middleware
 *************************/

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "Sorry, we couldn't find the page you were looking for."
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later."
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nServer shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nServer shutting down...');
  process.exit(0);
});
