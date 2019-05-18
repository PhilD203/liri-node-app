require("dotenv").config();
let keys = require("./keys.js");
let inquirer = require("inquirer");
let axios = require("axios");
let figlet = require('figlet');
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);

figlet('Music Choice', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)

    inquirer
    .prompt([

    {
        type:"list",
        message:"WHAT DO YOU WANT?",
        choices:["SPOTIFY-THIS-SONG", "CONCERT-THIS", "MOVIE-THIS", "DO-WHAT-IT-SAYS"],
        name: "user_choice"
    },
])
.then(function(inquirerResponse) {

   if(inquirerResponse.user_choice === "SPOTIFY-THIS-SONG"){
    inquirer
    .prompt([
    {
        type: "input",
        message: "Which song would you want to hear?",
        name: "song_name"
    }]).then(function(response) {
        spotify.search({ type: 'track', query: response.song_name, limit:1}, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }

            let trackResult = data.tracks.items[0]
            console.log(trackResult.artists[0].name); 
            console.log(trackResult.album.name); 
            console.log(trackResult.album.release_date);
            console.log(trackResult.album.href);

          });

    })

   }
   else if(inquirerResponse.user_choice === "CONCERT-THIS"){

   }
   else if(inquirerResponse.user_choice === "MOVIE-THIS"){
       
}
    else if(inquirerResponse.user_choice === "DO-WHAT-IT-SAYS"){
       
}
    
  });

});










