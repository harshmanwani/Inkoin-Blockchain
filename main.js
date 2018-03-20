const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previoushash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculatehHash();
    }

    calculatehHash(){
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "20/3/2018", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculatehHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash != currentBlock.calculatehHash()){
                return false;
            }

            if(currentBlock.previoushash != previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let inkoin = new Blockchain();
inkoin.addBlock(new Block(1, "21/3/2018", {amount: 2}));
inkoin.addBlock(new Block(2, "22/3/2018", {amount: 7}));

// console.log(JSON.stringify(inkoin, null, 4));

console.log("is chain valid? " + inkoin.isChainValid());

inkoin.chain[1].data = {amount: 50};

console.log("is chain valid? " + inkoin.isChainValid());