require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var path = require('path');
// const getDate = require("./date");
const date = require(__dirname + "/date.js");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

const app = express();



app.set("view engine", "ejs"); //use EJS as its view engine
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
const store = new MongoDBStore({
  uri: "mongodb+srv://noamtamari98:noam8deshalit@cluster0.mwumbab.mongodb.net/chessUsersDB",
  collection: 'sessions'
});

store.on('error', function (error) {
  console.log(error);
});
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: store
}))
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://noamtamari98:noam8deshalit@cluster0.mwumbab.mongodb.net/chessUsersDB");

function Game(id, date, board, turn, turnCounter, moves, timerOption, undoOption, blackTime, whiteTime) {
  this.id = id;
  this.date = date;
  this.board = board;
  this.turn = turn;
  this.turnCounter = turnCounter;
  this.moves = moves;
  this.timerOption = timerOption;
  this.undoOption = undoOption;
  this.blackTime = blackTime;
  this.whiteTime = whiteTime;
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  games: Array
});



userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id).then(user => {
    console.log("find")
    done(null, user);
  })
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/ChessGame"
},
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function (req, res) {
  let gamesData = [];
  res.render("home.ejs");

  // Game.find({}).then((games) => {
  //   if (games.length === 0) {
  //     //res.render("homepage.ejs", { games: gamesData });
  //     res.render("login.ejs");
  //   } else {
  //     games.forEach(game => {
  //       gamesData.push([game.id, game.date]);
  //     });
  //     //res.render("homepage.ejs", { games: gamesData });
  //     res.render("login.ejs");
  //     // games.forEach(game => {
  //     //   console.log(game.date);
  //     // });

  //   }
  // }).catch(err => {
  //   console.log(err);
  // });

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
    User.findById(req.user.id)
      .then((foundUser) => {
        foundUser.games.forEach(game => {
          if (game.id === gameID) {
            console.log("GameID = " + gameID);
            console.log(game);
            switch (game.timerOption) {
              case true:
                if (game.undoOption === true) {
                  res.render("index", { savedBoard: JSON.stringify(game), WithTime: true, time: game.blackTime[1], undo: true });
                } else {
                  res.render("index", { savedBoard: JSON.stringify(game), WithTime: true, time: game.blackTime[1], undo: false });
                }
                break;

              default:
                if (game.undoOption === true) {
                  res.render("index", { savedBoard: JSON.stringify(game), WithTime: false, time: "unlimited", undo: true });
                } else {
                  res.render("index", {
                    savedBoard: JSON.stringify(game), WithTime: false,
                    time: "unlimited",
                    undo: false,
                  });
                }
                break;

            }
          }
        });

      })
      .catch((err) => {
        console.log(err);
        console.log('Cannot find the game you are looking for ):');
        res.redirect("/");
      });
    //IF THE PLAYER PRESSED "SAVE GAME" THE DATA WILL BE CATCHED HERE
  } else {

    const data = req.body;
    const savedDate = date.getDate();
    const id = Math.random().toString(36).substring(2);
    const savedGame = {
      id: id,
      date: savedDate,
      board: req.body.game.board,
      turn: req.body.game.turn,
      turncounter: req.body.game.turnCounter,
      moves: req.body.game.moves,
      timerOption: req.body.game.timerOption,
      undoOption: req.body.game.undoOption,
      blackTime: req.body.game.blackTime,
      whiteTime: req.body.game.whiteTime
    };

    User.findById(req.user.id).then(foundUser => {
      foundUser.games.push(savedGame);
      foundUser.save();
    }).catch(err => {
      console.log(err);
    });
    res.write("Game have been saved");
  }
});

app.get("/auth/google", passport.authenticate('google', {

  scope: ['profile']

}));

app.get("/auth/google/ChessGame",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function (req, res) {
    User.findById(req.user.id).then(foundUser => {
      // Successful authentication, redirect home.
      res.render("homepage.ejs", { games: foundUser.games });
    }).catch(err => {
      console.log(err);
    })

  });

app.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    User.findById(req.user.id).then(foundUser => {
      var userGames = foundUser.games;
      res.render("homepage.ejs", { games: userGames });
    })
  } else {
    res.render("login.ejs");
  }
})

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function (err) {
    if (err) {
      console.log("login error " + err);
    } else {
      User.find({ "username": user.username }).then(foundUser => {
        var userGames = foundUser[0].games;
        passport.authenticate("local")(req, res, function () {
          res.render("homepage.ejs", { games: userGames });
        })
      })
    }
  })

})

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("logout error " + err);
    }
    res.redirect('/');
  });
});
app.post("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("logout error " + err);
    }
    res.redirect('/');
  });
});

app.get("/register", function (req, res) {
  res.render("register.ejs");
})
app.post("/register", function (req, res) {
  console.log(req.body.username);
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    // console.log(res);
    if (err) {
      console.log("Register Error" + err);
    } else {
      passport.authenticate("local")(req, res, function () {
        console.log("Register succsuflly");
        User.findById(req.user.id).then(foundUser => {
          var userGames = foundUser.games;
          res.render("homepage.ejs", { games: userGames });
        })
      })
    }
  })

})

app.listen(3000, function () {
  console.log("server started on port 3000");
});
