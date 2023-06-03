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

const db = require('./models');
const { user, pokemon } = require('./models');




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











// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

app.use('/auth', require('./controllers/auth'));
app.use('/pokemon', require("./controllers/pokemon") )
app.use('/', require('./controllers/index'));

// app.get('/poke-search', function (req, res) {
//   const pokemonData = pokemon.findAll()
//   console.log('Do you see pokemon', pokemonData);
//   res.render('poke-search', { pokemon: pokemonData })
// });

app.get('/pokemon', function(req, res) {
    return res.render('search');
});


app.get('/search', function(req, res) {
    return res.render('search');
});







app.get('/poke-search', function (req, res) {
    pokemon.findAll()
    .then(foundPokemon => {
        // found pokemon
        console.log(foundPokemon);
        // get all other capsules
        pokemon.findAll()
        .then(pokemons => {
            console.log(pokemons)
            res.render('poke-search', { pokemon: foundPokemon })
        })
        .catch(err => {
            console.log('Error', err);
            res.render('no-result');
        })
    })
    .catch(err => {
        console.log('Error', err);
        res.render('no-result');
    })
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