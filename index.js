require("dotenv").config();
let keys = require("./keys.js");
let inquirer = require("inquirer");
let axios = require("axios");
let figlet = require('figlet');
let moment = require("moment");
let fs = require("fs");
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);

function spotifyThis(query){
    spotify.search({ type: 'track', query: query, limit: 1 }, function (err, data) {
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
}

function concertThis(query){
    
    var queryBands = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";

    axios.get(queryBands).then(
        function(bandResponse){   
            
            console.log(`
            Venue: ${bandResponse.data[0].venue.name}
            City:  ${bandResponse.data[0].venue.city}
            Date: ${(moment(bandResponse.data[0].datetime).format("MM/DD/YYYY"))}
            `)
        })        
}

function movieThis(query){
    var movieQuery = "https://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";

        axios.get(movieQuery).then(function(movieResponse){

                                console.log(`
                                Year: ${movieResponse.data.Year}
                                Rated: ${movieResponse.data.imdbRating}
                                Actors: ${movieResponse.data.Actors}
                                Plot: ${movieResponse.data.Plot}
                                `)
                            })   
}

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
            message: "WHAT WOULD YOU LIKE TO DO?",
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
                       spotifyThis(response.song_name);
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
                            concertThis(response.show_name);
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

                            movieThis(response.movie_name);                          
                        })
                        
                }

            else if (inquirerResponse.user_choice === "DO-WHAT-IT-SAYS") {
                   

                    fs.readFile("random.txt", "utf8", function(error, data) {
                      if (error) {
                        return console.log(error);
                      }
                        var output = data.split(",");
                        var random = Math.floor(Math.random() * (output.length / 2)); 

                        console.log(output[random * 2]);

                       if (output[random * 2] === "MOVIE-THIS"){
                           movieThis(output[(random * 2) + 1]);
                       }
                       else if(output[random * 2] === "SPOTIFY-THIS"){
                        spotifyThis(output[(random * 2) + 1]);
                       }
                       else if(output[random * 2] === "CONCERT-THIS"){
                        concertThis(output[(random * 2) + 1]);
                       }
                      });
                
              
            }

    });
});










