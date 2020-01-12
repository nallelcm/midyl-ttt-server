class CardList
{
    constructor()
    {
        this.cards = [];
    }
    addCard(card)
    {
        this.cards.push(card);
    }
    getCardByID(id)
    {
        return this.cards.filter(function (card) {
            return card.id == id;
        })[0];
    }
}
module.exports = CardList;