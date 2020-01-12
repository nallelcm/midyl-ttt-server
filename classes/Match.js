const fs = require('fs');
class Match 
{
    #matchData;
    constructor(fileName)
    {
        this.fileName = fileName;
        this.readData();
        this.findWinner();
        this.datetime = new Date(this.#matchData.Start);
        this.duration = (new Date(this.#matchData.End) - this.datetime)/1000;
        this.rules = [];
        this.findRules();
        this.npc = this.#matchData.Player2Name;
    }
    findRules()
    {
        var rules = [this.#matchData.RegionalRule1, this.#matchData.RegionalRule2, this.#matchData.MatchRule1,this.#matchData.MatchRule2];
        for (var x =0;x<rules.length;x++)
        {
            if (rules[x] != "None")
            {
                this.rules.push(rules[x]);
            }
        }
    }
    readData()
    {
        let rawdata = fs.readFileSync('matches/'+this.fileName);
        this.#matchData = JSON.parse(rawdata);
    }
    findWinner()
    {
        var startingPlayer=this.#matchData.RoundHistory[0].StartingPlayer;
        var wardenshipArray = this.#matchData.RoundHistory.slice(-1)[0].Wardenship;
        var count=0;
        if (startingPlayer==2)
        {
            count++;
        }
        for (var x = 0; x < wardenshipArray.length; x++)
        {
            if (wardenshipArray[x]==1)
            {
                count+=wardenshipArray[x];
            }
        }

        var outcome = undefined;
	var winningPlayer = this.#matchData.RoundHistory.slice(-1)[0].RoundState;
	switch(winningPlayer)
	{
		case "Player1Win":
			outcome="win";
			break;
		case "Player2Win":
			outcome="lose";
			break;
		case "Draw":
			outcome="draw";
			break;
	}
        this.startingPlayer = startingPlayer;
        this.outcome = outcome;
    }
}
module.exports = Match;