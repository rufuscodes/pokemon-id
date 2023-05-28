const express = require('express');
const axios = require('axios');
const app = express();
const ejsLayouts = require('express-ejs-layouts')
const router = express.Router();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));



app.get('/', function (req, res) {
    res.render('index')
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