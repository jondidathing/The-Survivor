import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNFT from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = 'jondoescoding';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
//const OPENSEA_LINK = 'https://testnets.opensea.io/collection/survivor-gcpfa2c8v6';
//const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x6c1be5D4A130845424AaC6CdC121CAe12eC9cbfa";


const App = () => {

  // storing the user's public wallet
  const [currentAccount, setCurrentAccount] = useState("");


  const checkIfWalletIsConnected = async () =>{
    // checking for access for the window.ethereum
    const {ethereum} = window;
    if (!ethereum) {
      console.log("Please get metamask!");
      return;
    } else {
      console.log("We have a ETH object", ethereum);
    }


      // checking if we can the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      // grabbing the first account of a user's metamask if they multiple
      if (accounts.length !== 0){
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        setupEventListener()
      } else {
        console.log("No authorized account found")   
      }
  }

// Setup our listener.
const setupEventListener = async () => {
  // Most of this looks the same as our function askContractToMintNft
  try {
    const { ethereum } = window;

    if (ethereum) {
      // Same stuff again
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer);

      // THIS IS THE MAGIC SAUCE.
      // This will essentially "capture" our event when our contract throws it.
      // If you're familiar with webhooks, it's very similar to that!
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      });

      console.log("Setup event listener!")

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }
    }catch(err) {
      console.log = err.message;
    }
  }



  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.nftGeneration();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        console.log(remainingNFT())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const remainingNFT = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer);
        const counter = await connectedContract.getTotalNFTsMintedSoFar();
        document.getElementById("value").innerHTML =  counter.toNumber();        
        //console.log(counter.toNumber(), "/10,000");
        //return counter.toNumber();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
      

    } catch (error) {
      console.log(error)
    }
    
  }




  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  /*
  * This runs our function when the page loads.
  */
    useEffect(() => {
      checkIfWalletIsConnected();
    }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">The Survivor Collection</p>
          <p className="sub-text">
          The Survivor get randomized weapons, personality traits, occupation and mutation generated. Stored on chain.
          </p>
            {currentAccount === "" 
              ? renderNotConnectedContainer()
              : (
                /** Add askContractToMintNft Action for the onClick event **/
                <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                  Mint NFT
                </button> 
              )
            }
        <p id="value" color="white">Minted (Out of 10,000): {remainingNFT}</p> 
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
          <div class="divider"/>
          <div>
            <button onClick={event => window.location.href='https://testnets.opensea.io/collection/survivor-gcpfa2c8v6'} className="cta-button opensea-button"> 🌊 View Collection on OpenSea</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
