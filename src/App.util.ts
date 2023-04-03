import Web3 from 'web3';
import type { EthTx } from './App.model';
import type { Dispatch, SetStateAction } from 'react'

const INFURA_URL = `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;
const web3 = new Web3(INFURA_URL);
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
};

export const getFee = async ({ amount, addressTo }: { amount: string, addressTo: string }): Promise<string> => {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const gasPriceBN = web3.utils.toBN(gasPrice);
        
        const transaction = {
            to: addressTo,
            value: web3.utils.toWei(amount, "ether"),
        };
  
        const gasEstimate = await web3.eth.estimateGas(transaction);
        const gasEstimateBN = web3.utils.toBN(gasEstimate);

        const gasInWeiBN = gasEstimateBN.mul(gasPriceBN);
        const gasInEth = web3.utils.fromWei(gasInWeiBN, "ether");
  
        return gasInEth;
    } catch (error) {
      throw new Error("Commission calculation error");
    }
};

export const sendTransaction = async ({ privateKey, addressTo, amount, setSendingStatus }: { privateKey: string, addressTo: string, amount: string, setSendingStatus: Dispatch<SetStateAction<string>> }): Promise<{
    hash: string;
    blockNumber: string;
}> => {
    const transactionObject: { to: string, value: string, gas?: number } = {
        to: addressTo,
        value: web3.utils.toWei(amount, 'ether'),
    };

    transactionObject.gas = await web3.eth.estimateGas(transactionObject);
        
    const { rawTransaction: signedTransaction } = await web3.eth.accounts.signTransaction(transactionObject, privateKey);

     if (!signedTransaction) {
        throw Error('Some problem')
     }

    setSendingStatus('Transaction signed')

    const receipt = await web3.eth
    .sendSignedTransaction(signedTransaction)
    .once("sending",  () => {
        setSendingStatus('The transaction is broadcast to the blockchain')
    })
    .once("sent", () => {
        setSendingStatus('Expecting a hash')
    })
    .once("transactionHash", (transactionHash) => {
        setSendingStatus(`Transaction verified, hash is: ${transactionHash}`)
    });
    
    return {
        hash: receipt.transactionHash, 
        blockNumber: receipt.blockNumber.toString()
    }
};

export const getTransactionList = async ({addressFrom}:{addressFrom: string}): Promise<EthTx[]> => {
    const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${addressFrom}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    const response = await fetch(url)
    const { result }: {result: EthTx[]} = await response.json();
    return result.map(tx => (
        {
            ...tx,
            value: web3.utils.fromWei(tx.value, 'ether'),
            timeStamp: new Date(Math.ceil(Number(tx.timeStamp) * 1000)).toLocaleDateString() + ' ' + new Date(Math.ceil(Number(tx.timeStamp) * 1000)).toLocaleTimeString()
        }
    ));
};