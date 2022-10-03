import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavBar from './components/NavBar.js';
import { Footer } from './components/Footer.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile.js';
import SellNFT from './components/SellNFT.js';
import NFTPage from './components/NFTpage.js';

import { useState } from 'react';
import { ethers } from 'ethers';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import MarketplaceJSON from "./Marketplace.json";

function App() {

  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [marketplace, setMarketplace] = useState({})

  // MetaMask Connect
  const web3Handler = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0x5')
    {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
     })
    }  
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    loadContracts(signer)
  }

  // LoadContracts
  const loadContracts = async (signer) => {

    const marketplace = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    setMarketplace(marketplace)

    setLoading(false)
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
      <div>
        <NavBar web3Handler={web3Handler} account={account}/>  
        { loading ? (
              <div>
                <div className='spinner'>
                  <Spinner animation='border' style={{ display: 'flex' }} />
                  <p style={{ display: 'flex', margin: '6px', marginLeft: '20px'}}> Awaiting MetaMask Connection...</p>
                </div>
              </div>
          ):(
              <div>
                <Routes>
                  <Route path="/" element={<Marketplace />}/>
                  <Route path="/nftPage" element={<NFTPage />}/>        
                  <Route path="/profile" element={<Profile />}/>
                  <Route path="/sellNFT" element={<SellNFT />}/>             
                </Routes>
              </div>
          )}
        </div>
      </BrowserRouter>
      <Footer/>
    </div>
      
  );
}

export default App;