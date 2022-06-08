import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/testContract.json";

const Home = () => {
  
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x06811B2c0562C9D0ACe3A4AAFc13a7a570dbB206";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async() => {

    try{
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        alert("Make sure you have metamask!")
        return;

      } else {
        console.log("Ethereum object injected to the browser successfully!", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }

    } catch (error) {

      console.log(error);
    }
  }

    const connectWallet = async () => {

      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error)
      }
    }

    const test = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const testContract = new ethers.Contract(contractAddress, contractABI, signer);

          let count = await testContract.getTotalTests();
          console.log("Retrieved total wave count...", count.toNumber());

          const waveTxn = await testContract.test();
          console.log("Mining...", waveTxn.hash);

          await waveTxn.wait();
          console.log("Mined -- ", waveTxn.hash);
  
          count = await testContract.getTotalTests();
          console.log("Retrieved total wave count...", count.toNumber());
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        {currentAccount? 
        <div className="header">
        👋 Hey there! You can send a wave. Yeh!
        </div>
        :
        <div className="header">
        👋 Hey there! Connect your MetaMask Account and you will be able to send a wave!
        </div>}

        <div className="bio">
        I am <strong>Ebimo</strong> and I work on building responsive web app for clients? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={test}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default Home