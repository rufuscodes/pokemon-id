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


router.get('/:name', function (req, res) {
    pokemon.findOne({
        where: { name: req.params.name }
    })
    .then(foundPokemon => {
        // found pokemon
        console.log(foundPokemon);
        // get all other capsules
        pokemon.findAll()
        .then(pokemons => {
            console.log(pokemons)
            res.render('single-pokemon', { pokemons: foundPokemon })
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

router.post('/search', function (req, res) {
    if (req.body.category === 'name') {
        pokemon.findOne({
            where: { name: req.body.item}
        })
        .then(foundPokemon => {
            return res.redirect(`/pokemon/${foundPokemon.name}`);
        })
        .catch(err => {
            console.log('Error', err);
            res.render('no-result');
        });
    } else if (req.body.category === 'pokeType1') {
        pokemon.findAll({
            where: { pokeType1: req.body.item }
        })
        .then(foundPokemon => {
            console.log(foundPokemon);
            res.render('poke-search', { pokemon: foundPokemon });
        })
        .catch(err => {
            console.log('Error', err);
            res.render('no-result');
        });
    } else if (req.body.category === 'pokeType2') {
        pokemon.findAll({
            where: { pokeType2: req.body.item }
        })
        .then(foundPokemon => {
            console.log(foundPokemon);
            res.render('poke-search', { pokemon: foundPokemon });
        })
        .catch(err => {
            console.log('Error', err);
            res.render('no-result');
        });
    }
         else if (req.body.category === 'base') {
        pokemon.findAll({
            where: { base: req.body.item }
        })
        .then(foundPokemon => {
            console.log(foundPokemon);
            res.render('poke-search', { pokemon: foundPokemon });
        })
        .catch(err => {
            console.log('Error', err);
            res.render('no-result');
        });
    }
           else if (req.body.category === 'gameIndex') {
        pokemon.findAll({
            where: { gameIndex: req.body.item }
        })
        .then(foundPokemon => {
            console.log(foundPokemon);
            res.render('poke-search', { pokemon: foundPokemon });
        })
        .catch(err => {
            console.log('Error', err);
            res.render('no-result');
        });
    }
    else {
        // Invalid category selected
        res.render('no-result');
    }
});




module.exports = router;