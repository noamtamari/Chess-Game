const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var path = require('path');
// const getDate = require("./date");
const date = require(__dirname + "/date.js");

const app = express();

mongoose.connect("mongodb+srv://noamtamari98:noam8deshalit@cluster0.mwumbab.mongodb.net/chessGamesDB");
const gameSchema = new mongoose.Schema({
  date: String,
  board: {
    type: Array,
    required: [true, "please check your data entry, no name specefied!"]
  },
  turn: String,
  turnCounter: Number,
  moves: Array,
  timerOption: String,
  undoOption: String,
  blackTime: Array,
  whiteTime: Array
});
const Game = mongoose.model("Game", gameSchema);

app.set("view engine", "ejs"); //use EJS as its view engine
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var counter = 0;
app.get("/", function (req, res) {
  let gamesData = [];

  Game.find({}).then((games) => {
    if (games.length === 0) {
      res.render("homepage.ejs", { games: gamesData });
    } else {
      games.forEach(game => {
        gamesData.push([game.id, game.date]);
      });
      res.render("homepage.ejs", { games: gamesData });
      // games.forEach(game => {
      //   console.log(game.date);
      // });

    }
  }).catch(err => {
    console.log(err);
  });

  // let day = date.getDate();

  // res.render("list", {
  //      listTitle: day ,
  //      newListItem: items
  //     });
});

app.post("/1vs1", function (req, res) {
  //   res.sendFile(__dirname + "/index.html");

  let customTime = req.body.customTime;
  let radioTime = req.body.radioTime;
  let unlimited = req.body.unlimited;
  let undo = req.body.undo;


  counter++;
  switch (radioTime) {
    case "custom":
      if (undo === "on") {
        res.render("index", { savedBoard: "undefined", WithTime: true, time: customTime, undo: true });
      } else {
        res.render("index", { savedBoard: "undefined", WithTime: true, time: customTime, undo: false });
      }
      break;

    default:
      if (undo === "on") {
        res.render("index", { savedBoard: "undefined", WithTime: false, time: "unlimited", undo: true });
      } else {
        res.render("index", {
          savedBoard: "undefined", WithTime: false,
          time: "unlimited",
          undo: false,
        });
      }
      break;

  }

  // console.log("customTime = " +customTime +"is selected : " +radioTime +" unlimited is selected ? " +unlimited +" able previous moves ? " +undo);
  // console.log(customTime);


  console.log(req.body);

  // res.sendFile(__dirname + "/index.html");
});

app.post("/1vs1/:dateOfGame", function (req, res) {
  // res.render("index", {
  //   WithTime: false,
  //   time: "unlimited",
  //   undo: false,
  // });

  const gameID = req.params.dateOfGame;

  //IF THE PLAYER SELECED A SAVED GAME 

  if (gameID !== 'submit-data') {
    Game.findById({ _id: gameID })
      .then((foundGame) => {
        if (foundGame === null) {
          console.log('Cannot find the game you are looking for ):');
          res.redirect("/");
        } else {
          // let withTime= 
          console.log("GameID = " + gameID);
          switch (foundGame.timerOption) {
            case "true":
              if (foundGame.undoOption === "true") {
                res.render("index", { savedBoard: JSON.stringify(foundGame), WithTime: true, time: foundGame.blackTime[1], undo: true });
              } else {
                res.render("index", { savedBoard: JSON.stringify(foundGame), WithTime: true, time: foundGame.blackTime[1], undo: false });
              }
              break;

            default:
              if (foundGame.undoOption === "true") {
                res.render("index", { savedBoard: JSON.stringify(foundGame), WithTime: false, time: "unlimited", undo: true });
              } else {
                res.render("index", {
                  savedBoard: JSON.stringify(foundGame), WithTime: false,
                  time: "unlimited",
                  undo: false,
                });
              }
              break;

          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //IF THE PLAYER PRESSED "SAVE GAME" THE DATA WILL BE CATCHED HERE
  } else {
    const data = req.body;
    const savedDate = date.getDate();
    console.log(savedDate);
    const savedGame = new Game({
      date: savedDate,
      board: req.body.game.board,
      turn: req.body.game.turn,
      turnCounter: req.body.game.turnCounter,
      moves: req.body.game.moves,
      timerOption: req.body.game.timerOption,
      undoOption: req.body.game.undoOption,
      blackTime: req.body.game.blackTime,
      whiteTime: req.body.game.whiteTime
    })
    savedGame.save();
    res.write("Game have been saved");
  }
});



app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});
