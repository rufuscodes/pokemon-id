'use strict';
const axios = require('axios');



/** @type {import('sequelize-cli').Migration} */
module.exports = {


  
  async up(queryInterface, Sequelize) {
    try {
      const response = await axios.get(
        'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000'
      );

      console.log(response.data);


      const pokemon = [];

      for (const c of response.data.results) {

        const pokeId = c.url.split('/');
        const pokeNumber = pokeId[6];

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeNumber}`);
        const data = await res.json();
        const pokeNumberData = data.base_experience;
        const pokeImage = data.sprites.versions['generation-v']['black-white'].animated.front_shiny || data.sprites.other['official-artwork'].front_default;
        const pokeType1 = data.types[0].type['name'];
        // const gameIndex = data.game_indices?.[0]?.game_index ?? 'none';
        const gameIndex = parseInt(data['id'].toString().padStart(3, '0'))
        // let pokeType2 = data.types[1].type['name']

        // if (pokeType2 === undefined) {
        //     let pokeType2 = 'None'
        //     return pokeType2
        // }
      let pokeType2 = data.types[1]?.type['name'] || 'None';



        console.log('PokemonNumberData', pokeNumberData, typeof(pokeNumberData), pokeImage, pokeType1, pokeType2, gameIndex);


        const result = {
          name: c.name,
          url: c.url,
          base: pokeNumberData,
          image: pokeImage,
          pokeType1: pokeType1,
          pokeType2: pokeType2,
          gameIndex: gameIndex,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        pokemon.push(result);
      }

      console.log('New seeded pokemon', pokemon);

      await queryInterface.bulkInsert('pokemons', pokemon, {});
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pokemons', null, {});
  },
};
