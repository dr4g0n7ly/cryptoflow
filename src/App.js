import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavBar from './components/NavBar.js';
import { Footer } from './components/Footer.js';
import Home from './components/Home.js';
import History from './components/History.js';
import Profile from './components/Profile.js';
import SellProduct from './components/SellProduct.js';
import AuctionProductPage from './components/AuctionProductPage';
import MarketProductPage from './components/MarketProductPage';
import AuctionProduct from './components/AuctionProduct.js';

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
                  <Route path="/" element={<Home />}/>
                  <Route path="/auctionProductPage/:id" element={<AuctionProductPage />}/>
                  <Route path="/marketProductPage/:id" element={<MarketProductPage />}/>        
                  <Route path="/profile" element={<Profile />}/>
                  <Route path="/history" element={<History />}/>
                  <Route path="/sellProduct" element={<SellProduct />}/>  
                  <Route path="/auctionProduct" element={<AuctionProduct />}/>  
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