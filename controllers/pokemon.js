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


router.get('/new', function(req, res) {
    return res.render('pokemon/new');
});


router.post('/new', function(req, res) {
    const parsed_pokemon = {...req.body }
    // change datatype for reuse_count and water_landings
    parsed_pokemon.gameIndex = parseInt(req.body.gameIndex);
    parsed_pokemon.pokeType1 = req.body.pokeType1;
    parsed_pokemon.pokeType2 = req.body.pokeType2;
    parsed_pokemon.name = req.body.name;
    parsed_pokemon.url = req.body.url;


    // create capsule
    pokemon.create(parsed_pokemon)
    .then(createdPokemon => {
        console.log('pokemon created', createdPokemon.toJSON());
        res.render('single-pokemon', { pokemon: createdPokemon });
    })
    .catch(err => {
        console.log('Error', err);
        res.render('no-result');
    });
});
router.get('/edit/:name', function(req, res) {
    // find the capsule, and then go edit page
    pokemon.findOne({
        where: { name: req.params.name }
    })
    .then(foundPokemon => {
        // found capsule
        return res.render('pokemon/edit', { pokemon: foundPokemon });
    })
    .catch(err => {
        console.log('Error', err);
        res.render('no-result');
    })
});



router.put('/edit/:name', function(req, res) {
    // find the pokemon, and then go edit page
    console.log('form data', req.body);

    const parsed_pokemon = {...req.body }

    parsed_pokemon.gameIndex = parseInt(req.body.gameIndex);
    parsed_pokemon.pokeType1 = req.body.pokeType1;
    parsed_pokemon.pokeType2 = req.body.pokeType2;
    parsed_pokemon.name = req.body.name;
    parsed_pokemon.url = req.body.url;
    console.log('parsed_pokemon: ', parsed_pokemon);
    
    pokemon.update(parsed_pokemon, {
        where: { name: req.params.name }
    })
    .then(numOfRowsChanged => {
        console.log('how many rows got updated?', numOfRowsChanged);
        res.redirect(`/pokemon/${req.params.name}`);
    })
    .catch(err => console.log('Error', err));
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

router.get('/type-1/:pokeType1', function (req, res) {
    pokemon.findAll({
        where: { pokeType1: req.params.pokeType1 }
    })
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

router.get('/type-2/:pokeType2', function (req, res) {
    pokemon.findAll({
        where: { pokeType1: req.params.pokeType2 }
    })
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


router.get('/id/:gameIndex', function (req, res) {
    pokemon.findOne({
        where: { gameIndex: req.params.gameIndex }
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