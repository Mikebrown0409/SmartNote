require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const ensureLoggedIn = require("./middleware/ensure-logged-in");
const notesController = require('./controllers/notes')
const authController = require('./controllers/auth');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(require('./middleware/add-user-to-req-and-locals'));

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.use('/auth', authController);

app.use(ensureLoggedIn); 
app.use('/notes', notesController);

app.listen(port, () => {
});

