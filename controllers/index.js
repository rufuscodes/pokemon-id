const express = require('express');
const axios = require('axios');

const router = express.Router();
const passport = require('../config/ppConfig');
const { user, pokemon } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');



router.get('/', function (req, res) {
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


module.exports = router;