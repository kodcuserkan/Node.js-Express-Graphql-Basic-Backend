const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const MOCKED_DATA = require('./data.json');
const { findWord } = require('./utils');

const PORT = process.env.PORT || 4000;

// Building the schema
const schema = buildSchema(`
  type Query {
    film(id: String!): Film
    films(Genre: String!): [Film]
  }
  type Mutation {
    updateFilmTitle(id: String!, title: String!): Film
  }
  type Film {
    id: String
    Title: String
    Year: String
    Rated: String
    Released: String
    Runtime: String
    Genre: String
    Director: String
    Writer: String
    Actors: String
    Plot: String
    Language: String
    Country: String
    Awards: String
    Poster: String
    Metascore: String
    imdbRating: String
    imdbVotes: String
    imdbID: String
    Type: String
    Response: String
    Images: [String]
  }
`)

//Gets specific film by id
const getFilm = ({id}) => {
  return new Promise((resolve, reject) => {
    const film = MOCKED_DATA.find(film => film.id === id);
    if (film) {
      resolve(film);
    } else {
      reject(`Film with id ${id} not found`);
    }
  });
}

//Gets films by genre
const getFilmsByGenre = ({Genre}) => {
  return new Promise((resolve, reject) => {
    const films = MOCKED_DATA.filter(film => findWord(film.Genre, Genre));
    if (films.length > 0) {
      resolve(films);
    } else {
      reject(`Films with genre ${Genre} not found`);
    }
  });
}

// Updates film title
const updateFilmTitle = ({id, title}) => {
  return new Promise((resolve, reject) => {
    const film = MOCKED_DATA.find(film => film.id === id);
    if (film) {
      film.Title = title;
      resolve(film);
    } else {
      reject(`Film with id ${id} not found`);
    }
  });
}

// The root provides a resolver function for each field in the schema.
const root = {
  film: getFilm,
  films: getFilmsByGenre,
  updateFilmTitle
}

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(PORT, () => console.log(`Now browse to localhost:${PORT}/graphql`));