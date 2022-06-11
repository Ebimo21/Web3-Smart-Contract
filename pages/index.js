import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/testContract.json";

const Home = () => {

  let changer = "";
  
  const [currentAccount, setCurrentAccount] = useState("");
  const [tester, setTester] = useState([]);
  const [message, setMessage] = useState("");
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [sendingWaveProgress, setSendingWaveProgress] = useState("");

  const contractAddress = "0x0a2E8b087Ff18947EEB5F59Ed1bab5A2C2a6cBC3";
  const contractABI = abi.abi;

  const getAllTesters = async() =>{
    try {
      const {ethereum} = window;

      if(ethereum){

        const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const testContract = new ethers.Contract(contractAddress, contractABI, signer);

        const testers = await testContract.getAllTesters();

        let testersCleaned = [];
        testers.forEach((tester) =>{

          testersCleaned.push({
            user: tester.user,
            message: tester.message,
            timestamp: new Date(tester.timestamp * 1000),
          });

          
        });

        setTester(testersCleaned);
      }else {
        console.log("Ethereum object doesn't exist!")
      }
    }catch(error){
      console.log(error);
    }
  }

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
        setCurrentAccount(account);
        getAllTesters();

      } else {
        console.log("No authorized account found")
      }

    } catch (error) {

      console.log(error);
    }
  }

    const connectWallet = async (e) => {
      let btn = e.currentTarget;
      btn.classList.toggle("loading");
      setConnectingWallet(!connectingWallet);
      

      try {
        const { ethereum } = window;
  
        if (!ethereum) {
          alert("Get MetaMask!");
          return;
        }
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        setConnectingWallet(!connectingWallet);
        btn.classList.toggle("loading");
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        await getAllTesters();

      } catch (error) {
        console.log(error)
        // e.currentTarget.classList.toggle("loading");

      }
    }

    const test = async (e) => {
      let btn = e.currentTarget;
      btn.classList.toggle("loading");

      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const testContract = new ethers.Contract(contractAddress, contractABI, signer);

          setSendingWaveProgress("Establishing connection with Smart Contract!")
          let count = await testContract.getTotalTests();
          console.log("Retrieved total wave count...", count.toNumber());

          const waveTxn = await testContract.test(message);
          setSendingWaveProgress("Mining Transaction...!");
          console.log("Mining...", waveTxn.hash);

          await waveTxn.wait();
          setSendingWaveProgress("Finishing transaction")

          console.log("Mined -- ", waveTxn.hash);

          
          btn.classList.toggle("loading");
  
          count = await testContract.getTotalTests();
          console.log("Retrieved total wave count...", count.toNumber());
          setSendingWaveProgress("")

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, changer)

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

        
        {currentAccount? (
          <>

          {sendingWaveProgress? ( 
                    <>
                    <progress  className="progress w-full"></progress>
                    <label>{sendingWaveProgress}</label>
                    </>
                    ): ""} 

          
            <button className="waveButton btn" onClick={test}>
          Wave at Me
        </button>

          <button className="waveButton btn " onClick={getAllTesters}>Get All Testers</button>
          
          <br />
          <br />
          <br />
          
          <input type="text" placeholder="Type here" className="input w-full max-w-xs input-bordered" name={"message"} value={message} onChange={(e) => setMessage(e.target.value)} />
 
          </>
        ) : (
          <>
          <br/> 
          <br/> 

          {connectingWallet? ( 
          <progress  className="progress w-full"></progress>
          ): ""}          
          <button className="waveButton btn" onClick={connectWallet}>
            Connect Wallet
          </button>
          </>
        )}
        

      {/* {tester.map((test)=>{
        <div key={key}>


      })} */}

        {tester.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.user}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>  
            
            
            )


        })}
      </div>

    </div>
  );
}

export default Home