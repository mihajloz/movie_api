const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("common"));

app.use(express.static("public"));

const topMovies = [
  { title: "The Shawshank Redemption", director: "Frank Darabont" },
  { title: "The Godfather", director: "Francis Ford Coppola" },
  { title: "The Dark Knight", director: "Christopher Nolan" },
  { title: "The Godfather Part II", director: "Francis Ford Coppola" },
  { title: "12 Angry Men", director: "Sidney Lumet" },
  { title: "Schindler's List", director: "Steven Spielberg" },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
  },
  { title: "Pulp Fiction", director: "Quentin Tarantino" },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    director: "Peter Jackson",
  },
  { title: "The Good, the Bad and the Ugly", director: "Sergio Leone" },
];

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
