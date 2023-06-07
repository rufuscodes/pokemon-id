const express = require('express');
const axios = require('axios');

const router = express.Router();
const passport = require('../config/ppConfig');
const { user, pokemon, favorite } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');



router.get('/', isLoggedIn, async function (req, res) {
  try {
    const foundPokemon = await pokemon.findAll();
    const favorites = await favorite.findAll({
      where: { userId: req.user.id },
    });
    const favoriteNames = favorites.map((fav) => fav.name);
    res.render('poke-search', {
      pokemon: foundPokemon,
      favorites: favoriteNames,
    });
  } catch (err) {
    console.log('Error', err);
    res.render('no-result');
  }
});





module.exports = router;