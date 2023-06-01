require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const router = express.Router();

const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session');
const flash = require('connect-flash');
const SECRET_SESSION = process.env.SECRET_SESSION;

const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');

// console.log(SECRET_SESSION);

app.use(flash());            // flash middleware



app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));


app.use(passport.initialize());      // Initialize passport
app.use(passport.session());         // Add a session


app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});
app.use('/auth', require('./controllers/auth'));
app.use('/', require('./controllers/index'));






// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});



// Index route
app.get('/poke-search', function (req, res) {
    axios.get('https://pokeapi.co/api/v2/pokemon/eevee')
        .then(function (response) {
            // handle success
            const pokemon = response.data;
            res.render('poke-search', { pokemon });
        })
        .catch(function (error) {
            res.json({ message: 'Pokemon.ID data not found. Please try again later.' });
        });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, function () {
    console.log(`Server is running on PORT`, PORT);
});

module.exports = {
    server,
    app,
    PORT,
    axios
};