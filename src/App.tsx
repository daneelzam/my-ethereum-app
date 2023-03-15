import React, { useState } from 'react';
import Web3 from 'web3';
import logo from './logo.png';
import './App.css';

const web3 = new Web3(new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`));

function App() {
  const [addressFrom, setAddressFrom] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState('');
  const [addressTo, setAddressTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txURL, setTxURl] = useState('');
  const [error, setError] = useState('');
  const [blockNumber, setBlockNumber] = useState('');

  const getBalance = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!addressFrom){
      setError('Please enter wallet address ')
      return;
    }
    web3.eth.getBalance(addressFrom, function(error, result) {
      if(!error) {
        const balance = web3.utils.fromWei(result, 'ether');
        setBalance(balance)
      }
      else {
        setError(error.message);
      }
    });

  }

  const sendTransaction = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!addressFrom || !addressTo || !privateKey || !amount){
      setError('Please fill in all fields')
      return;
    }

    if (!balance || +balance < +amount){
      setError('Insufficient funds');
      return;
    }

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const transactionObject: {from: string, to: string, value: string, gas?: number} = {
        from: account.address,
        to: addressTo,
        value: web3.utils.toWei(amount, 'ether'),
      };

    transactionObject.gas = await web3.eth.estimateGas(transactionObject);


    const receipt = await web3.eth
    .sendTransaction(transactionObject)
    .once("transactionHash", (txhash) => {
      setTxHash(txhash);
      setTxURl(`https://goerli.etherscan.io/tx/${txhash}`)
    });

    setBlockNumber(receipt.blockNumber.toString())
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Simple app for creating and submitting send transaction in Etherium testnet (Goerli)
        </h1>
      </header>
      <article className="App-body">
        <form className="form">
          <div>
            <label htmlFor="addressFrom">Address from</label>
            <input type="text" name="addressFrom" value={addressFrom} onChange={(event: React.FormEvent<HTMLInputElement>)=>setAddressFrom(event.currentTarget.value)}/>
          </div>
          <div>
            <label htmlFor="privateKey">Private key</label>
            <input type="text" name="privateKey" value={privateKey} onChange={(event: React.FormEvent<HTMLInputElement>)=>setPrivateKey(event.currentTarget.value)}/>
          </div>
          <button onClick={getBalance}>Get balance</button>
          <div>Balance: {balance ? `${balance} Goerli Eth` : '-'}</div>
        </form>
        <form className="form">
          <div>
            <label htmlFor="addressTo">Address to</label>
            <input type="text" name="addressTo" value={addressTo} onChange={(event: React.FormEvent<HTMLInputElement>)=>setAddressTo(event.currentTarget.value)}/>
          </div>
          <div>
            <label htmlFor="amount">amount</label>
            <input type="text" name="amount" value={amount} onChange={(event: React.FormEvent<HTMLInputElement>)=>setAmount(event.currentTarget.value)}/>
          </div>
          <button onClick={sendTransaction}>Send</button>
          <div>Transaction hash: {txHash ? <a href={txURL}>{txHash}</a> : '-'}</div>
          {blockNumber && <div>SUCCESS, your transaction in the chain now, in block number {blockNumber}</div>}
        </form>
        {error && <div className='error'>{error}</div>}
      </article>
    </div>
  );
}

export default App;
