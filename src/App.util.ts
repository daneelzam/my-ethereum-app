import Web3 from 'web3';
import type { EthTx } from './App.model';

const web3 = new Web3(new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`));
const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

export const getBalance = async ({ addressFrom }: {addressFrom: string}): Promise<string> => {
    const balance = await web3.eth.getBalance(addressFrom, function(error, result) {
        if(!error) {
          return result
        }
        else {
          throw Error(error.message)
        }
    });  
    
    return web3.utils.fromWei(balance, 'ether');
}

export const sendTransaction = async ({ addressFrom, privateKey, addressTo, amount}: {addressFrom: string, privateKey: string, addressTo: string, amount: string }): Promise<{
    hash: string;
    blockNumber: string;
}> => {
    const transactionObject: {from: string, to: string, value: string, gas?: number} = {
        from: addressFrom,
        to: addressTo,
        value: web3.utils.toWei(amount, 'ether'),
      };

    transactionObject.gas = await web3.eth.estimateGas(transactionObject);
    
    const { rawTransaction: signedTransaction } = await web3.eth.accounts.signTransaction(transactionObject, privateKey);

     if (!signedTransaction) {
        throw Error('Some problem')
     }

    let hash = '';

    const receipt = await web3.eth
    .sendSignedTransaction(signedTransaction)
    .on("transactionHash", (txhash) => {
        hash = txhash;
    });
    
    return {
        hash, 
        blockNumber: receipt.blockNumber.toString()
    }
}

export const getTransactionList = async ({addressFrom}:{addressFrom: string}): Promise<EthTx[]> => {
    const responce = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${addressFrom}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETHERSCAN_API_KEY}`)
    const { result }: {result: EthTx[]} = await responce.json();
    return result.map(tx => (
        {
            ...tx,
            value: web3.utils.fromWei(tx.value, 'ether'),
            timeStamp: new Date(Math.ceil(Number(tx.timeStamp) * 1000)).toLocaleDateString() + ' ' + new Date(Math.ceil(Number(tx.timeStamp) * 1000)).toLocaleTimeString()
        }
    ));
}