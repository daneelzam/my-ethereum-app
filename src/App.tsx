import React, { useEffect, useState } from 'react';
// import logo from './logo.png';
import githubLogo from './github.logo.svg';
import './App.css';
import { getBalance, getTransactionList, sendTransaction, getFee } from './App.util';
import { EthTx } from './App.model';

function App() {
  const [addressFrom, setAddressFrom] = useState<string | undefined>();
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [addressTo, setAddressTo] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const [fee, setFee] = useState<string | undefined>();

  const [balance, setBalance] = useState<string| undefined>();
  const [balanceIsLoading, setBalanceIsLoading] = useState(false);

  const [txList, setTxList] = useState<EthTx[]>()
  const [txListIsLoading, setTxListIsLoading] = useState(false);

  const [txHash, setTxHash] = useState<string| undefined>();
  const [txURL, setTxURl] = useState<string| undefined>();
  const [blockNumber, setBlockNumber] = useState<string| undefined>();
  const [txIsSending, setTxIsSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState('Create transaction object');

  const [error, setError] = useState<string| undefined>();
  
  useEffect(function cleanError(){
    if(error){
      setTimeout(() => setError(undefined), 2000);
    }
  }, [error, setError]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (amount && addressTo) {
        setFee('Loading')
        const estimatedFee = await getFee({ amount, addressTo });
        setFee(estimatedFee);
      } else {
        setFee('');
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [amount, addressTo]);

  const getBalanceHandler = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (!addressFrom){
      setError('Please enter wallet address ')
    } else {
      setBalanceIsLoading(true)

      try {
        const result = await getBalance({addressFrom});
        setBalance(result)
      } catch (err: any) {
        setError(err.message || 'Error')
      }
      
      setBalanceIsLoading(false);
    }
  }

  const getTransactionListHandler = async () => {
    if (!addressFrom){
      setError('Please enter wallet address ')
    } else {
      setTxListIsLoading(true)

      try {
        const result = await getTransactionList({addressFrom});
        setTxList(result)
      } catch (err: any) {
        setError(err.message || 'Error')
      }
      
      setTxListIsLoading(false);
    }
  }

  const sendTransactionHandler = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    setTxHash('');
    setTxIsSending(false);
    setBlockNumber('');
    setSendingStatus('Create transaction object');

    if (!addressFrom || !addressTo || !privateKey || !amount){
      setError('Please fill in all fields')
      return;
    }

    if (balance === undefined){
      setError('Please get the balance');
      return;
    }

    if (!balance || +balance < +amount){
      setError('Insufficient funds');
      return;
    }
    
    setTxIsSending(true);

    try {
      const result = await sendTransaction({ addressTo, amount, privateKey, setSendingStatus });
      setTxHash(result.hash);
      setTxURl(`https://goerli.etherscan.io/tx/${result.hash}`)
      setBlockNumber(result.blockNumber)
    } catch (err: any) {
      setError(err.message || 'Error')
    }

    setTxIsSending(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h1>
          Simple app for creating and submitting send transaction in Etherium testnet (Goerli)
        </h1>
      </header>
      <article className="App-body">
        <div className='line'/>
        <h2>Your wallet info</h2>
        <form className="form">
          <div className='form-item'>
            <label htmlFor="addressFrom">Address from</label>
            <input type="text" name="addressFrom" value={addressFrom} onChange={(event: React.FormEvent<HTMLInputElement>)=>setAddressFrom(event.currentTarget.value)}/>
          </div>
          <div className='form-item'>
            <label htmlFor="privateKey">Private key</label>
            <input type="text" name="privateKey" value={privateKey} onChange={(event: React.FormEvent<HTMLInputElement>)=>setPrivateKey(event.currentTarget.value)}/>
          </div>
            <button className='button' disabled={balanceIsLoading} onClick={getBalanceHandler}>{
              balanceIsLoading
              ? <div className='loading'>Loading</div>
              : 'Get balance'}
            </button>
          <div className='result'>
            <div>Balance:</div>
            <div>{balance ? `${balance} GETH` : '-'}</div>
          </div>
        </form>
        <div className='line'/>
        <h2>Transaction info</h2>
        <form className="form">
        <div className='form-item'>
            <label htmlFor="addressTo">Address to</label>
            <input type="text" name="addressTo" value={addressTo} onChange={(event: React.FormEvent<HTMLInputElement>)=>setAddressTo(event.currentTarget.value)}/>
          </div>
          <div className='form-item'>
            <label htmlFor="amount">Amount</label>
            <input type="text" name="amount" value={amount} onChange={(event: React.FormEvent<HTMLInputElement>)=>setAmount(event.currentTarget.value)}/>
            <span className='ticker'>GETH</span>
          </div>
          <div className='form-item'>
            <label htmlFor="fee">Fee</label>
            <input type="text" name="fee" value={fee || '-'} disabled/>
            <span className='ticker'>GETH</span>
          </div>
          <button className='button' onClick={sendTransactionHandler}>
            {txIsSending
              ? <div className='loading'>Loading</div>
              : 'Send'}
          </button>
          {!blockNumber && txIsSending && <div>{sendingStatus}</div>}
          {blockNumber && !txIsSending && <div>SUCCESS, your transaction in the chain now, in block number {blockNumber}</div>}
          <div className='result'>
            <div>Transaction hash:</div>
            <div className='hash'>{txHash ? <a href={txURL} target='_blank' rel="noreferrer">{txHash}</a> : '-'}</div>
          </div>
          {error && <div className='error'>{error}</div>}
        </form>
        <div>
          <div>
            <div className='line'/>
            <h2>Transactions:</h2>
            <div className='button-wrapper'>
              <button className='button' onClick={getTransactionListHandler}>
              {txListIsLoading
                ? <div className='loading'>Loading</div>
                : 'Get transaction list'}
              </button>
            </div>
            <div className='tx-list-wrapper'>
              {(txList && txList.length) && txList.map(tx => (
                <div className='tx-item-wrapper' key={tx.hash}>
                  <div className='tx-item'>
                    <div>Date:</div>
                    <div>{tx.timeStamp}</div>
                  </div>
                  <div className='tx-item'>
                    <div>Hash:</div>
                    <div className='hash'>{<a href={`https://goerli.etherscan.io/tx/${tx.hash}`} target='_blank' rel="noreferrer">{tx.hash}</a>}</div>
                  </div>
                  <div className='tx-item'>
                    <div>From:</div>
                    <div>{tx.from}</div>
                  </div>
                  <div className='tx-item'>
                    <div>To:</div>
                    <div>{tx.to}</div>
                  </div>
                  <div className='tx-item'>
                    <div>Amount:</div>
                    <div>{tx.value} GETH</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
      <footer>
        <a href='https://github.com/daneelzam/my-ethereum-app' target="_blank" rel="noreferrer">
          <img src={githubLogo} alt="GitHub logo"/>
        </a>
      </footer>
    </div>
  );
}

export default App;
