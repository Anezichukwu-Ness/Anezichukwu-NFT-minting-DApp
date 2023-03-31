import { useEffect, useState } from 'react';
import './App.css';
import contract from './contract/AnezichukwuNFT.json';
import { ethers } from 'ethers';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "./components/Card";
import Navbar from "./components/Navbar"
import axios from 'axios'
import data from "./data";
import logo from './3.jpg'




const contractAddress = "0x1C4B6a2a53E9B0A79350E04b326112CF3122Ba16";
const abi = contract.abi;

function App() {
   // Define state variables using useState hooks
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [balance, setBalance] = useState("0");

  // Function to check if Metamask wallet is connected
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      toast.warn("kindly download Metamask")
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      toast.success("wallet connected")
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  // Function to connect Metamask wallet
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const networkId = await ethereum.request({method: 'net_version'});
      if (networkId !== '80001') {
        console.log("kindly switch to Mumbai test network")
        alert ("kindly switch to Mumbai test network")
        return;
      }
      console.log("Found an account! Address: ", accounts[0]);
      toast.success("wallet connected")
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

 
   // Function to mint NFT
  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

        console.log("Mining... please wait");
        toast.loading("Making a donation please wait...", { autoClose: false });
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`);
        toast.dismiss();
        alert(`Donation made you recieved an NFT, see transaction at: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`)
        getTokenIdsMinted()
        checkBalance();
      } else {
        console.log("Ethereum object does not exist");
        
      }

    } catch (err) {
      console.log(err);
      toast.error(err)
    }
  }

  //function to get token Id minted
  const getTokenIdsMinted = async () => {
    const { ethereum } = window;
  
    if (ethereum) {
      console.log("fetch tokenID");
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const nftContract = new ethers.Contract(contractAddress, abi, provider);
  
      try {
        const _tokenIds = await nftContract.getTokenIdsMinted();
        console.log("fetched!", _tokenIds);
        setTokenIdsMinted(_tokenIds.toString());
      } catch (error) {
        console.log(error);
        toast.error("");
      }
    } else {
      console.log("Metamask is not connected");
      toast.error("Metamask is not connected");
    }
  }

 //function to check contract balance
  const checkBalance = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("fetch balance");
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const nftContract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const balanceWei = await nftContract.getBalance();
        const balanceEth = ethers.utils.formatEther(balanceWei);
        console.log("fetched!");
        console.log(`Your balance is ${balanceEth} ETH.`);
        setBalance(balanceEth);
      } catch (error) {
        console.log(error);
        toast.error("Error, could not fetch your balance");
      }
    } else {
      console.log("Metamask is not connected");
      toast.error("Metamask is not connected");
    }
  }  

  useEffect(() => {
    checkWalletIsConnected();
    getTokenIdsMinted();
    checkBalance();
  }, [])

 
  return (
    <div className='main-app'>
      <Navbar />
{currentAccount ? (
    <div className='mainBody'>
        <div className='mintCard'> 
            <h2 className='card--header'>Donate to the campaign</h2>
            <div className="connectStatus">
                  {currentAccount !== "" ? "Connected to" : "Not Connected"} {currentAccount !== "" ? (currentAccount.substring(0, 15) + '...') : ""}
                </div>
            
            <div className='card--body'>
                <img src={logo} className="App-logo" alt="logo" />
                <div className='info--card'>
                    <div className="tokenID">
                       Total Donated: {balance} MATIC
                      <p>Target: 0.1 MATIC</p>
                    </div>
                    <hr className='infocard--hr'/>
                    <p className='nftPrice--description'>Donate 0.01MATIC <span>+ GAS</span></p>
                    <hr/>
                    <button onClick={mintNftHandler} type='button' className='buyButton'> Donate </button>
                </div>
            </div>

            <div className='card--footer'>
              <hr/>
              <h3>CONTRACT ADDRESS</h3>
              <p><a href="https://mumbai.polygonscan.com/address/0x1C4B6a2a53E9B0A79350E04b326112CF3122Ba16#code"target="_blank">View on Polygonscan</a></p>
            </div>

        </div>
        
       
    </div>    
      ) : (
      <div className='landinPage--container'>  
      
       <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
                      Connect Wallet
       </button>

       <div className='landingPage'>  
           <img src={logo} id="landingPage--image" alt="logo" />
           <div>
               <h2>About the project</h2>
                     <p className='projectIntro'>The “Save the environment” idea is a campaign to help combat climate change. The aim and purpose of the project is to help raise fund, and this is to be achieved by people making donations to the campaign to help plant trees. By making a donation of 0.01 MATIC you automatically planted a tree to help save the environment, and an NFT will be airdropped to your wallet. The NFT is a token of appreciation for your act of kindness in a move to help save our environment.</p>
           </div>
       </div>
      </div> 
       )}
      
      
      
      
      <ToastContainer 
       position='top-right'
       autoClose={5000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
      />
    </div>
    
  )
}


export default App;
