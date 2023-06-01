'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

await axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000')
.then(async response => {
    console.log(response.data);
    const pokemonz = response.data.results.map(c => {
        const result = {
            name: c.name,
            url: c.url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        return result;
    })
    console.log('new capsules', pokemonz);
    await queryInterface.bulkInsert('pokemons', pokemonz, {})
})
.catch(err => console.log(err))


  },

  async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('pokemons', null, {});

  }
};
