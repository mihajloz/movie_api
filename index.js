/**
 * Express application
 * @module
 */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");
app.use(morgan("common"));
app.use(express.static("public"));
const uuid = require("uuid");
const { check, validationResult } = require("express-validator");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect("mongodb://127.0.0.1:27017/moviedb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// cors
app.use(
  cors({
    origin: (origin, callback) => {
      return callback(null, true);
    },
  })
);

/**
 * GET all users
 * @name GET/users
 * @function
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * GET a single user by username
 * @name GET/users/:username
 * @function
 */
app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username } = req.params;

    Users.findOne({ Username: username })
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
  }
);

/**
 * CREATE a new user
 * @name POST/users
 * @function
 */
app.post(
  "/users",
  // validation logic
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

/**
 * UPDATE a user's username
 * @name PUT/users/:username
 * @function
 */
app.put(
  "/users/:username",
  // validation logic
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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
  }
);

/**
 * DELETE a user by username
 * @name DELETE/users/:Username
 * @function
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

/**
 * CREATE - Add a movie to user's favorite list
 * @name POST/users/:Username/movies/:MovieID
 * @function
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User not found");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * DELETE a movie from user's favorite list
 * @name DELETE/users/:Username/movies/:MovieID
 * @function
 */
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User not found");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Check if a movie is in the user's favorites
 * @name GET/users/:Username/movies/:MovieID
 * @function
 */
app.get(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { Username, MovieID } = req.params;

    Users.findOne({ Username, FavoriteMovies: MovieID })
      .then((user) => {
        if (user) {
          res.status(200).json({ isFavorite: true });
        } else {
          res.status(200).json({ isFavorite: false });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// home page
app.get("/", (req, res) => {
  res.send("Home Page");
});

/**
 * GET all movies
 * @name GET/movies
 * @function
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * GET a movie by title
 * @name GET/movies/:title
 * @function
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title } = req.params;

    Movies.findOne({ Title: title })
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
  }
);

/**
 * GET movies by genre
 * @name GET/movies/genres/:genreName
 * @function
 */
app.get(
  "/movies/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ "Genre.Name": req.params.genreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * GET movies by director
 * @name GET/movies/directors/:directorName
 * @function
 */
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Error handling middleware
 * @function
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

const port = process.env.PORT || 8080;
/**
 * Start the server
 */
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
