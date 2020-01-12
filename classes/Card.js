const config = require('../config.json');
const Jimp = require('jimp');
class Card {
    constructor(id, name, rarity, family, up, down, right, left) {
        this.id = id;
        this.name = name;
        this.rarity = rarity;
        this.family = family;
        this.up = up;
        this.down = down;
        this.right = right;
        this.left = left;
        let proto = "http";
        if (config.https)
        {
            proto = "https";
        }
        let port = ":"+config.port
        if (config.port == 80)
        {
            port = "";
        }
        this.imageurl = proto + "://" + config.url + port + "/cards/" + this.id + "/imagefile";
    }
    async generateImage() {
        const [image, rarity, up, down, right, left, family, background] = await Promise.all([
            Jimp.read("./cards/full/"+this.id+".png"),
            Jimp.read("./cards/rarity/"+this.rarity+"stars.png"),
            Jimp.read("./cards/strength/"+this.up+".png"),
            Jimp.read("./cards/strength/"+this.down+".png"),
            Jimp.read("./cards/strength/"+this.right+".png"),
            Jimp.read("./cards/strength/"+this.left+".png"),
            Jimp.read("./cards/family/"+this.family.toLowerCase()+".png"),
            Jimp.read("./cards/full/bg.png")
          ]);
        
        const padding = 10;
        let baseXMin = 2 * padding;
        let baseXMax = image.bitmap.width - 2 * padding;
        let baseYMin = padding;
        let baseYMax = image.bitmap.height - padding;
        let baseHalfX = image.bitmap.width / 2;
        let baseHalfY = image.bitmap.height / 2;
        
        return background
            .composite(image,0,0)
            .composite(rarity,10,4)
            .composite(up,baseHalfX - up.bitmap.width / 2, baseYMin, up.bitmap.width)
            .composite(down,baseHalfX - down.bitmap.width / 2, baseYMax - down.bitmap.width)
            .composite(right,baseXMax - right.bitmap.width / 2, baseHalfY)
            .composite(left,baseXMin - left.bitmap.width / 2, baseHalfY, left.bitmap.width)
            .composite(family,image.bitmap.width - 25, 5)
            .scale(2)
            .getBufferAsync(Jimp.MIME_PNG);
    }
}
module.exports = Card; 