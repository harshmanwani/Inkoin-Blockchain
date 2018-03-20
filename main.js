const SHA256 = require('crypto-js/sha256');

//Instance of each transaction. It can be any data, here it is a currency transaction
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

//Fundamental element of blockchain. Each block is mined and added to the chain
class Block{
    constructor(timestamp, transactions, previoushash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0; //this is random number used to add difficulty in mining. so that each hash is different from last one
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    //Difficulty is like number of zeros in prefix of hash. 
    //Bitcoin uses zeros but it can be any constraint so that miners find exact hashes to make a new block and get reward
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
        
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 50;
    }

    //Genesis Block is the first block in any blockchain.
    //It is created manually, because there is no previous hash
    createGenesisBlock(){
        return new Block(Date.parse("2018-03-18"), [], "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //All the transactions are added in an array.
    //There is an interval fixed i.e 10 minutes, when all the pending transactions will be confirmed.
    //Reward address is the address of miner who got the hash of defined difficulty first while mining.
    //But usually there are mining pools, where each reward is distributed in whole group according to their contributed computing power.
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block Successfully Mined!");
        this.chain.push(block);

        //Added a transaction to reward the miner
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    //To get balance of an address, the chain is looped for all the from and to transactions for that address
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    //Check the validity of chain by checking any tempers in hashes
    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previoushash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let inkoin = new Blockchain();

inkoin.createTransaction(new Transaction('address1', 'address2', 70));
inkoin.createTransaction(new Transaction('address2', 'address1', 25));

console.log("\nStarting the miner...");
inkoin.minePendingTransactions('dexters-address');

console.log('\nBalance of Dexter is', inkoin.getBalanceOfAddress('dexters-address'));

//Miner's reward is processed in next transaction, so we run it again to see.
console.log("\nStarting the miner again...");
inkoin.minePendingTransactions('dexters-address');

console.log('\nBalance of Dexter is', inkoin.getBalanceOfAddress('dexters-address'));