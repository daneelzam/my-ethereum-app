# Simple app for creating and submitting send transaction in Etherium testnet (Goerli)

This project is hosted at: https://daneelzam.github.io/my-ethereum-app/

## Functional

* You can request the wallet balance by entering the address in the "Address from" field and clicking the button "Get balance".

* You can request a list of wallet transactions by entering an address in the "Address From" field and clicking the "Get Transaction List" balance.

* You can send a transaction from one wallet to another, for this you need to fill in all the fields, make sure that the transaction amount is less than the balance. After that, you need to click the "Submit" button and wait for the hash of the transaction to be received in the field below. The hash is clickable, the link leads to information about your transaction on goerli.etherscan.io

## Stack and limits

Project created with:
- [Create React App](https://github.com/facebook/create-react-app),
- [Web3.js](https://web3js.readthedocs.io/en/v1.8.2/web3.html),
- a node provided by [Infura](https://www.infura.io/),
- the goerli explorer provided by [etherscan.io](https://etherscan.io/).

If you want to fork this project and work on it locally, you need to get an API key for Infura and Etherscan. This application works with the Ethereum "Goerli" testnet, if you want to work with the Ethereum mainnet, you need to change the node url and in the explorer.