import { useEffect, useState } from 'react';
import './App.css';
import contract from './contract/AnezichukwuNFT.json';
import { ethers } from 'ethers';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const contractAddress = "0xD2D5789b0f969eF8e3098868AA52895D2663d701";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

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

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      toast.success("wallet connected")
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.05") });

        console.log("Mining... please wait");
        toast.info("minting...please wait", {
          position: "top-right",
          autoClose: 18050,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://https://goerli.etherscan.io/tx/${nftTxn.hash}`);
        toast.success("congratulations...You just saved the environment")

      } else {
        console.log("Ethereum object does not exist");
        
      }

    } catch (err) {
      console.log(err);
      toast.error(err)
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1 className='heading'>Save The Environment</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      <div className='description'>
        <p>
      The world was once beautiful, but pollution, deforestation, and climate change threatened its existence. A group of passionate individuals launched a campaign to encourage people to plant trees and support environmental organizations. They created an NFT called "Plant a Tree, Save the Environment," a digital representation of a tree with a certificate of authenticity and a unique identification number minting for 0.05ETH. Funds realized from the sale of the NFTs would be donated to organizations fighting climate change and protecting the environment. The NFT not only allowed people to contribute to a good cause but also served as a symbol of their commitment to a sustainable future.
      </p>
      </div>
      
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