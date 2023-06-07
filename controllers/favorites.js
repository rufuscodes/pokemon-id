const express = require('express');
const axios = require('axios');

const router = express.Router();
const passport = require('../config/ppConfig');
const { user, pokemon, favorite } = require('../models');
const isLoggedIn = require('../middleware/isLoggedIn');








router.get('/', isLoggedIn, async (req, res) => {
    let favoritesData = await favorite.findAll({
  where: { userId: req.user.id },
});
  const favorites = await favorite.findAll({ where: { userId: req.user.id } });
    console.log(favorites.name)
    favoritesData = await Promise.all(favoritesData.map(async (favorite) => {
  const favoritePokemon = await pokemon.findOne({
    where: { name: favorite.name }
  });
  favorite.dataValues.pokemon = favoritePokemon;
  return favorite;
}));
  
  console.log('can we see favorites?',favorites);
  res.render('favorites', { favorites: favoritesData });
});

// Add favorite Pokemon
router.post('/:name', isLoggedIn, async (req, res) => {
  try {
    const { name } = req.params;
    
    // Check if a favorite with the same name already exists for this user
    const existingFavorite = await favorite.findOne({
      where: {
        userId: req.user.id,
        name: name
      }
    });
    if (existingFavorite) {
      res.status(409).send(`Favorite ${name} already exists`);
      return;
    }

    // Create new favorite for user and save to database
    const newFavorite = await favorite.create({
      userId: req.user.id,
      name: name
    });
    res.redirect(`/favorites`);
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
    res.redirect(`/favorites`);
  } catch (error) {
    console.error('Error deleting favorite: ', error);
  }
});





module.exports = router;
