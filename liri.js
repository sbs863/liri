var inquirer = require('inquirer');
var fs = require('fs');
var request = require('request');
var creds = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var client = new Twitter(creds.twitterKeys);
var readMyData = ('./random.txt');

random = [];


var options = {
    'Search a song with Spotify': {
        message: 'Please enter the song you wish to find',
        fun: spot,
        callback: printSongs
    },
    'Find a movie with OMDB': {
        message: 'Please enter the movie you wish to find',
        fun: omdb,
        callback: printMovies
    }
};

var liri = function() {


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
            }, {
                name: 'Do what it says'
            }
        ],
        validate: function(answer) {
            if (answer.length > 1) {
                return 'You may only choose one option';
            }
            return true;
        }
    }]).then(function(answers) {

        if (answers.options[0] == 'Display my last twenty tweets') {
            twitter(printTweets);

        } else {
            var selected = options[answers.options[0]];

            inquirer.prompt({
                    name: 'test',
                    message: selected.message,
                    type: 'input'
                })
                .then(function(search) {
                    
                    selected.fun(search.test, selected.callback);
                });
        }


        // if (answers.options[0] === 'Search a song with Spotify') {
        //     inquirer.prompt([

        //         {
        //             type: 'input',
        //             message: 'Please enter the song you wish to find',
        //             name: 'song',

        //         }

        //     ]).then(function(search) {

        //         song = search.song;
        //         spot();

        //     });
        // }

        // if (answers.options[0] === 'Find a movie with OMDB') {
        //     inquirer.prompt([

        //         {
        //             type: 'input',
        //             message: 'Please enter the movie you wish to find',
        //             name: 'movie',

        //         }

        //     ]).then(function(search) {

        //         movie = search.movie;
        //         omdb();

        //     });
        // }
        if (answers.options[0] === 'Do what it says') {
            fs.readFile('random.txt', 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                random.push(data);
                // console.log(random);
                song = data[1];
            });
        }
    });
};
liri();

function twitter(callback) {
    var params = { user_id: '253278398', count: 21, trim_user: true, };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            callback(null, tweets);
            return liri();
        }
        callback(error);
    });

}

function printTweets(error, tweets) {
    if (error) {
        console.log(error);
    } else {
        for (var i = 0; i <= 20; i++) {
            console.log(JSON.stringify(tweets[i].created_at, null, 2));
            console.log(JSON.stringify(tweets[i].text, null, 2));
            console.log('------------------------------------');
        }
    }
}

function spot(song, callback) {
    if (song === "") {
        song = "The Sign";
    }
    console.log(song);
    request('https://api.spotify.com/v1/search?q=' + song + '&type=track&market=US&limit=10', function(error, response, song) {
        if (!error) {
            callback(null, song);
            return liri();
        }
    });
}

function printSongs(error, song) {
    if (error) {
        console.log(error);
    } else {
        for (var i = 0; i < 10; i++) {
            console.log("Artist(s): " + JSON.parse(song).tracks.items[i].artists[0].name);
            console.log("Album: " + JSON.parse(song).tracks.items[i].album.name);
            console.log("Song: " + JSON.parse(song).tracks.items[i].name);
            console.log("Preview: " + JSON.parse(song).tracks.items[i].preview_url);
            console.log("-----------------------------");
        }
    }
}

function omdb(movie, callback) {
    if (movie === "") {
        movie = "Mr. Nobody";
    }
    request('http://www.omdbapi.com/?t=' + movie + '&y&type=movie&plot=short&r=json&tomatoes=true', function(error, response, movie) {
        if (!error) {
            callback(null, movie);
            return liri();

        }

    });

}

function printMovies(error, movie) {
    if (error) {
        console.log(error);
    } else {

        console.log("Title: " + JSON.parse(movie).Title);
        console.log("Released: " + JSON.parse(movie).Released);
        console.log("IMDB Rating: " + JSON.parse(movie).imdbRating);
        console.log("Plot: " + JSON.parse(movie).Plot);
        console.log("Actors: " + JSON.parse(movie).Actors);
        console.log("Rottem Tomatoes Rating: " + JSON.parse(movie).tomatoRating);
        console.log("Language: " + JSON.parse(movie).Language);
        console.log("Produced in: " + JSON.parse(movie).Country);
        console.log("Rotten Tomatoes URL: " + JSON.parse(movie).tomatoURL);

    }

}
