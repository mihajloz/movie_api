const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(express.static("public"));
const uuid = require("uuid");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://127.0.0.1:27017/moviedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// GET all users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// CREATE user
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// UPDATE username
app.put("/users/:username", (req, res) => {
  const { username } = req.params;
  const updatedUser = req.body;

  Users.findOneAndUpdate({ Username: username }, updatedUser, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// DELETE username
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// CREATE add favorite movie
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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

// home page
app.get("/", (req, res) => {
  res.send("Home Page");
});

// GET all movies
// app.get("/movies", (req, res) => {
//   res.status(200).json(movies);
// });
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error: " + err);
    });
});

// GET movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;

  Movies.findOne({ title: title })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send("Movie not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// GET genre
app.get("/movies/genres/:genreName", (req, res) => {
  Movies.find({ "Genre.Name": req.params.genreName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// GET director
app.get("/movies/directors/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
