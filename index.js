const express = require("express");
bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(express.static("public"));
const uuid = require("uuid");

let users = [
  {
    id: 1,
    name: "John",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Godfather"],
  },
];

let movies = [
  {
    title: "The Shawshank Redemption",
    description:
      "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    directors: {
      name: "Frank Darabont",
      bio: "Frank Darabont (born January 28, 1959) is a Hungarian-American film director, screenwriter and producer who has been nominated for three Academy Awards and a Golden Globe. He was born in France by Hungarian parents who fled Budapest during the 1956 uprising, but the family moved to Los Angeles while he was still an infant. He has directed the films The Shawshank Redemption, The Green Mile, and The Mist, all based on stories by Stephen King. In 2010 he developed and executive produced the first season of the AMC network television series The Walking Dead.",
      dateOfBirth: 1959,
      dateOfDeath: undefined,
    },
    genres: [
      {
        name: "Drama",
        description:
          "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.",
      },
    ],
  },
  {
    title: "The Godfather",
    description:
      "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    directors: {
      name: "Francis Ford Coppola",
      bio: "Francis Ford Coppola (born April 7, 1939) is an American film director, producer and screenwriter. He is widely acclaimed as one of Hollywood's most celebrated and influential film directors. He epitomized the group of filmmakers known as the New Hollywood, which included George Lucas, Martin Scorsese, Robert Altman, Woody Allen and William Friedkin, who emerged in the early 1970s with unconventional ideas that challenged contemporary filmmaking.",
      dateOfBirth: 1939,
      dateOfDeath: undefined,
    },
    genres: {
      name: "Drama",
      description:
        "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.",
    },
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    directors: {
      name: "Christopher Nolan",
      bio: "Christopher Edward Nolan, CBE (born 30 July 1970) is a British-American film director, screenwriter, and producer. He was born in Westminster, London, England and holds both British and American citizenship due to his American mother. He is known for writing and directing critically acclaimed films such as Memento (2000), The Prestige (2006), The Dark Knight Trilogy (2005-12), Inception (2010), Interstellar (2014) and Dunkirk (2017). Nolan is the founder of the production company Syncopy Films. He often collaborates with his wife, producer Emma Thomas, and his brother, screenwriter Jonathan Nolan.",
      dateOfBirth: 1970,
      dateOfDeath: undefined,
    },
    genres: {
      name: "Action",
      description:
        "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
  },
];

// CREATE user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Name required");
  }
});

// UPDATE username
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("User not found");
  }
});

// CREATE add favorite movie
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    // res.status(200).json(user);
    res.status(200).send(`${movieTitle} has been added to user's favorites`);
  } else {
    res.status(404).send("User not found.");
  }
});

// DELETE favorite movie
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user's favorites`);
  } else {
    res.status(404).send("User not found");
  }
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(404).send("User not found.");
  }
});

// home page
app.get("/", (req, res) => {
  res.send("Home Page");
});

// GET all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// GET movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Movie not found");
  }
});

// GET genre
app.get("/movies/genres/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genres.name === genreName).genres;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send("Genre not found");
  }
});

// GET director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.directors.name === directorName
  ).directors;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send("Director not found");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
