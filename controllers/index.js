const express = require('express');
const axios = require('axios');

const router = express.Router();
const passport = require('../config/ppConfig');
const { user } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');



router.get('/', function (req, res) {
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



module.exports = router;