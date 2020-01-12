const config = require('./config.json');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https')
const app = express();

const Card = require('./classes/Card.js');
const CardList = require('./classes/CardList.js');
const OverallMatches = require('./classes/OverallMatches.js');

Array.prototype.unique = function () {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}




function updateMatcheList() {
    fs.readdir("matches", function (err, items) {
        items.forEach(item => {
            matches.insertNewMatch(item);
        });
        var newGames = matches.games;
        if (newGames != currentGames) {
            console.log("new game count:" + newGames);
            console.log("added:" + (newGames - currentGames));
            currentGames = newGames;
        }
    });
}
function updateCards() {
    var contents = JSON.parse(fs.readFileSync('cards/cards.json', 'utf8'));

    for (var c of contents) {
        cardlist.addCard(new Card(c.ID, c.Name, c.Rarity, c.Family, c.Up, c.Down, c.Right, c.Left));
    }
}
var matches = new OverallMatches();
var currentGames = matches.games;
var cardlist = new CardList();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(config.image_path, express.static(__dirname + '/cards'));

app.use(function (req, res, next) {
    console.log('Time        :', Date(Date.now()).toString() )
    console.log('Request URL :', req.originalUrl)
    console.log('Request From:', req.ip)
    console.log('-------------');
    next()
  })

/***** ROUTES ****/
app.get('/matches', (req, res) => {
    res.send(matches);
});

app.get('/cards', (req, res) => {
    res.send(cardlist)
});
app.get('/cards/:id', (req, res) => {
    console.log("requested card:" + req.params.id);
    let card = cardlist.getCardByID(req.params.id)
    if (card) {
        res.send(cardlist.getCardByID(req.params.id))
    }
    else {
        res.status(404).send("Not Found");
    }
});
app.get('/cards/:id/imagefile', function (req, res) {
    let card = cardlist.getCardByID(req.params.id)
    if (card) {
        card.generateImage()
            .then(function (img) {
                res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length });
                res.end(img, 'binary')
            });
    }
    else {
        res.status(404).send("Not Found");
    }
});




https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
    .listen(config.port, function () {
        console.log('listening on port ' + config.port)
    })




console.log("current games:" + currentGames);


updateCards();
// update the matches then update them ever 10 seconds
updateMatcheList();
setInterval(updateMatcheList, 10000);
