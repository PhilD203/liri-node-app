require("dotenv").config();
let keys = require("./keys.js");
let inquirer = require("inquirer");
let axios = require("axios");
let figlet = require('figlet');
let moment = require("moment");
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);

figlet('The Entertainer', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)

    inquirer.prompt([
        {
            type: "list",
            message: "WHAT DO YOU WANT?",
            choices: ["SPOTIFY-THIS-SONG", "CONCERT-THIS", "MOVIE-THIS", "DO-WHAT-IT-SAYS"],
            name: "user_choice"
        },
    ])
        .then(function (inquirerResponse) {

            if (inquirerResponse.user_choice === "SPOTIFY-THIS-SONG") {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Which song would you want to hear?",
                        name: "song_name"
                    }]).then(function (response) {
                        spotify.search({ type: 'track', query: response.song_name, limit: 1 }, function (err, data) {
                            if (err) {
                                return console.log('Error occurred: ' + err);
                            }
                            let trackResult = data.tracks.items[0]
                            console.log(`
                                Artist: ${trackResult.artists[0].name}
                                Album: ${trackResult.album.name}
                                Released: ${trackResult.album.release_date}
                                Link: ${trackResult.album.href} `)
                        });
                    })
            }
            else if (inquirerResponse.user_choice === "CONCERT-THIS") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Which show would you want to see?",
                            name: "show_name"
                        }]).then(function (response) {

                            var queryBands = "https://rest.bandsintown.com/artists/" + response.show_name + "/events?app_id=codingbootcamp";

                            axios.get(queryBands).then(
                                function(bandResponse){   
                                    
                                    console.log(`
                                    Venue: ${bandResponse.data[0].venue.name}
                                    City:  ${bandResponse.data[0].venue.city}
                                    Date: ${(moment(bandResponse.data[0].datetime).format("MM/DD/YYYY"))}
                                    `)
                                })        
                    })
            }

            else if (inquirerResponse.user_choice === "MOVIE-THIS") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "Which movie would you want to see?",
                            name: "movie_name"
                        }]).then(function (response) {

                            var movieQuery = "https://www.omdbapi.com/?t=" + response.movie_name + "&y=&plot=short&apikey=trilogy";

                            axios.get(movieQuery).then(function(movieResponse){

                                console.log(`
                                Year: ${movieResponse.data.Year}
                                Rated: ${movieResponse.data.imdbRating}
                                Actors: ${movieResponse.data.Actors}
                                Plot: ${movieResponse.data.Plot}
                                `)
                            })                             
                        })
                        
                }

            else if (inquirerResponse.user_choice === "DO-WHAT-IT-SAYS") {

            }

    });
});










