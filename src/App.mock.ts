export const MOCK_TR_LIST = [
    {
        "blockNumber": "8655048",
        "timeStamp": "1678816680",
        "hash": "0x8b9e31b3246d0779820da8211dd898a860a85fb1012ab792f7fd02b6a5a3fed4",
        "nonce": "19937",
        "blockHash": "0x177b7482c07efc2a0cc27ccb22a54bd6c157228e3f482af9263b1ee5ff26aeb7",
        "transactionIndex": "19",
        "from": "0x2d76f732b514b32773b46f019e1a2a4e51ddb964",
        "to": "0xc3e795487fc443a7f917229c1ad3193e3ca1964f",
        "value": "100000000000000000",
        "gas": "63000",
        "gasPrice": "143540389167",
        "isError": "0",
        "txreceipt_status": "1",
        "input": "0x",
        "contractAddress": "",
        "cumulativeGasUsed": "544120",
        "gasUsed": "21000",
        "confirmations": "4868",
        "methodId": "0x",
        "functionName": ""
    },
    {
        "blockNumber": "8659208",
        "timeStamp": "1678884000",
        "hash": "0x717f7eaa80c9d955e050e6a61d293ce43664bd9cccb50d531a4c0e76762aae00",
        "nonce": "0",
        "blockHash": "0x246542ffe5b4a7edc5fd19e13c1791c2f23934da9650614f6e4ab488bed0a1dc",
        "transactionIndex": "12",
        "from": "0xc3e795487fc443a7f917229c1ad3193e3ca1964f",
        "to": "0xade1ef6c399dcddd468958e0ab57f1508bbceebc",
        "value": "50000000000000000",
        "gas": "21000",
        "gasPrice": "42861508728",
        "isError": "0",
        "txreceipt_status": "1",
        "input": "0x",
        "contractAddress": "",
        "cumulativeGasUsed": "4510163",
        "gasUsed": "21000",
        "confirmations": "708",
        "methodId": "0x",
        "functionName": ""
    },
    {
        "blockNumber": "8659273",
        "timeStamp": "1678885008",
        "hash": "0xa695b4ab64a3e45f675b9f5437ae4d39b7cbd36e92edb31bf327b53a4873be65",
        "nonce": "1",
        "blockHash": "0xd84cfee2eca91855b888c4220fa848aa9aeab9f1d2eb6374fe6d7dc5fe5982df",
        "transactionIndex": "29",
        "from": "0xc3e795487fc443a7f917229c1ad3193e3ca1964f",
        "to": "0xade1ef6c399dcddd468958e0ab57f1508bbceebc",
        "value": "10000000000000000",
        "gas": "21000",
        "gasPrice": "38048948159",
        "isError": "0",
        "txreceipt_status": "1",
        "input": "0x",
        "contractAddress": "",
        "cumulativeGasUsed": "2498387",
        "gasUsed": "21000",
        "confirmations": "643",
        "methodId": "0x",
        "functionName": ""
    }
]

export const MOCK_TX_HASH = MOCK_TR_LIST[0].hash;

export const MOCK_TX_HASH_URL = `https://goerli.etherscan.io/tx/${MOCK_TX_HASH}`;
