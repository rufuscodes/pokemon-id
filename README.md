# pokemon-id

Pocket Monster (Pokemon) Identification System
<b>Pokemon.ID</b> is a Web Application that utilizes API data from <a href="https://github.com/PokeAPI">PokeAPI</a> is a user-friendly application that allows users to browse and search through a comprehensive database of Pokemon characters. Built using HTML, CSS, and JavaScript, the app retrieves data from the [PokeAPI](https://pokeapi.co/) to provide detailed information about each Pokemon including its type, abilities, stats, and evolutions.

### Features

- Search for Pokemon by name or ID
- Filter Pokemon by type
- View detailed information about each Pokemon, including its abilities, and stats
- Search for a Pokemom (name, type1, type2, base point, pokedex ID)
- Favorite a Pokemon
- Create a new Pokemon to the database
- Edit a Pokemon in the database
- Ability to upload profile picture

In addition to providing valuable information about each Pokemon character, the app offers an engaging and interactive user experience. Users can easily navigate between related Pokemon using the evolution chain and explore the vast world of Pokemon with ease.

### Technologies Used

- HTML
- CSS
- JavaScript
- [PokeAPI](https://pokeapi.co/)

Pokemon.ID represents the perfect platform for fans of the Pokemon franchise who want to learn more about their favorite characters and expand their knowledge about the world of Pokemon.

<hr />

# HOW TO INSTALL

- Requires `node.js`, `postgres`, and `sequelize`

1. `Fork` and `Clone` this repository to your local machine.
2. Create your `.env` file in the root of the application
3. Import models `sequelize db:migrate`
4. Seed the database with Pokemon data `sequelize db:seed:all`
5. Run `npm run dev` to start server.
6. Open `localhost:8000` in your broswer to use the app or

<hr />


### Seeding Pokemon stats via the PokeAPI Calls

Most of the data used in this app is from the country api. All of the data are seeded from the country api for easy and fast access.

```javascript
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
```

# Most used route

List all Pokemon: /pokemon
View favorites list: /favorites
Advanced Pokemon search: /search
Query Pokemon by name: /pokemon/: name
Query Pokemon by name: /pokemon/id/ :gameindex number
Query Pokemon by types: /pokemon/type-1/ :type
Query Pokemon by types: /pokemon/type-2/ :type

# Dependencies

axios: ^1.4.0
bcryptjs: ^2.4.3
connect-flash: ^0.1.1
dotenv: ^16.0.2
ejs: ^3.1.9
ejs-layouts: ^0.0.1
express: ^4.18.2
express-ejs-layouts: ^2.5.1
express-router: ^0.0.1
express-session: ^1.17.3
method-override: ^3.0.0
multer: ^1.4.5-lts.1
node: ^20.2.0
passport: ^0.6.0
passport-local: ^1.0.0
pg: ^8.11.0
pg-hstore: ^2.3.4
sequelize: ^6.31.1
sequelize-cli: ^6.6.1
supertest: ^6.3.3

# Todo/Chores

1. Implement new UX
2. Add user messaging and private messages
3. Add Social OAUTH login
4. Add Navigate between related Pokemon using the evolution chain
