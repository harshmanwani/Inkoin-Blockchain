const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previoushash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")){
            this.hash = this.calculateHash();
        }
        console.log("Block mined " + this.hash);
        
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
    }

    createGenesisBlock(){
        return new Block(0, "20/3/2018", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        // newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash != currentBlock.calculateHash()){
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

console.log("Mining Block 1...");
inkoin.addBlock(new Block(1, "21/3/2018", {amount: 2}));

console.log("Mining Block 1...");
inkoin.addBlock(new Block(2, "22/3/2018", {amount: 7}));