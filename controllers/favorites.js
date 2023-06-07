const express = require('express');
const axios = require('axios');

const router = express.Router();
const passport = require('../config/ppConfig');
const { user, pokemon, favorite } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', isLoggedIn, async (req, res) => {
  const favorites = await favorite.findAll({ where: { userId: req.user.id } });
  console.log('can we see favorites?',favorites);
  res.render('favorites', { favorites: favorites });
});

router.get('/:name', isLoggedIn, async (req, res) => {
  try {
    const newFavorite = await favorite.create({
      userId: req.user.id,
      name: req.params.name
    });
    res.redirect(`/pokemon/${newFavorite.name}`);
  } catch (error) {
    console.error('Error adding favorite: ', error);
  }
});

// Delete a favorite
router.delete('/remove/:name', isLoggedIn, async (req, res) => {
  try {
    const fav = await favorite.findOne({
      where: {
        userId: req.user.id,
        name: req.params.name
      }
    });
    if (!fav) {
      res.status(404).send('Favorite not found');
      return;
    }
    await fav.destroy();
    res.redirect(`/pokemon/${fav.name}`);
  } catch (error) {
    console.error('Error deleting favorite: ', error);
  }
});

module.exports = router;
