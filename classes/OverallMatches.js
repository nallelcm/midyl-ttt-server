const Match = require('./Match.js');

class OverallMatches
{
    
    constructor() 
    {
        this.matches = [];
        this.updateStats();
    }
    insertNewMatch(fileName)
    {
        var notFound=true;
        for (var x = 0; x < this.matches.length; x++)
        {
            if (fileName==this.matches[x].fileName)
            {
                notFound=false;
            }
        }
        if (notFound)
        {
            this.matches.push(new Match(fileName));
        }
        this.updateStats();
    }
    updateStats()
    {
        this.games = this.matches.length;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        var npcs = [];
        for (var x = 0; x < this.matches.length; x++)
        {
            switch(this.matches[x].outcome)
            {
                case "win":
                    this.wins++;
                    break;
                case "draw":
                    this.draws++;
                    break;
                case "lose":
                    this.losses++;
                    break;
            }
            npcs.push(this.matches[x].npc);
        }
        this.uniqueNPCS = npcs.unique().length;
    }
}
module.exports = OverallMatches;