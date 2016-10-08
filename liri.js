var perfume = require('perfume');
var inquirer = require('inquirer');
var request = require('request');
var creds = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var client = new Twitter(creds.twitterKeys);


var song = "";
var movie = "";
var liri = function(max, current) {
    if (current < max) {

        console.log("Hello, I'm LIRI! I am a Language Interpretation and Recognition Interface. What would you like to do today?");
        inquirer.prompt([{
            type: 'checkbox',
            message: 'Please choose an option',
            name: 'options',
            choices: [

                {
                    name: 'Display my last twenty tweets'
                }, {
                    name: 'Search a song with Spotify'
                }, {
                    name: 'Find a movie with OMDB'
                },
            ],
            validate: function(answer) {
                if (answer.length > 1) {
                    return 'You may only choose one option';
                }
                return true;
            }
        }]).then(function(answers) {
            console.log(answers.options[0]);

            if (answers.options[0] == 'Display my last twenty tweets') {
                twitter();
              
            }


            if (answers.options[0] === 'Search a song with Spotify') {
                inquirer.prompt([

                    {
                        type: 'input',
                        message: 'Please enter the song you wish to find',
                        name: 'song',

                    }

                ]).then(function(search) {

                    song = search.song;
                    console.log(song);
                    spot();

                });
            }

            if (answers.options[0] === 'Find a movie with OMDB') {
                inquirer.prompt([

                    {
                        type: 'input',
                        message: 'Please enter the movie you wish to find',
                        name: 'movie',

                    }

                ]).then(function(search) {

                    movie = search.movie;
                    console.log(movie);
                    omdb();

                });
            }
        });
    }
};

liri (25,0);



function twitter() {
    var params = { user_id: '253278398', count: 21, trim_user: true, };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i <= 20; i++) {
                console.log(JSON.stringify(tweets[i].created_at, null, 2));
                console.log(JSON.stringify(tweets[i].text, null, 2));
                console.log('------------------------------------');
            }

        } else {
            console.log(error);


        }
    });

}

function spot() {
    request('https://api.spotify.com/v1/search?q=' + song + '&type=track&market=US&limit=10', function(error, response, data) {

        if (!error) {
            for (var i = 0; i < 10; i++) {


                console.log("Artist(s): " + JSON.parse(data).tracks.items[i].artists[0].name);
                console.log("Album: " + JSON.parse(data).tracks.items[i].album.name);
                console.log("Song: " + JSON.parse(data).tracks.items[i].name);
                console.log("Preview: " + JSON.parse(data).tracks.items[i].preview_url);
                console.log("-----------------------------");
            }
        }
    });

}

function omdb() {
    request('http://www.omdbapi.com/?t=' + movie + '&y&type=movie&plot=short&r=json&tomatoes=true', function(error, response, body) {

        if (!error) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Released);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rottem Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Produced in: " + JSON.parse(body).Country);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
        }
    });

}
