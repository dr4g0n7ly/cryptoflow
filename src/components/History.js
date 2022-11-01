import HistoryMarketCard from "./HistoryMarketCard";
import HistoryAuctionCard from "./HistoryAuctionCard";
import MarketplaceJSON from "../Marketplace.json";
import AuctionplaceJSON from "../Auctionplace.json";
import axios from "axios";
import { useState } from "react";
import banner from '../public/banner.png';
import './Home.css';

const Home = () => {

    const sampleData = [];

    const [marketData, updateMarketData] = useState(sampleData);
    const [marketDataFetched, marketUpdateFetched] = useState(false);

    const [auctionData, updateAuctionData] = useState(sampleData);
    const [auctionDataFetched, auctionUpdateFetched] = useState(false);

    async function getMyMarketProducts() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                tokenId: i.tokenId.toNumber(),
                image: meta.image,
                name: meta.name,
                description: meta.description,
                listed: i.currentlyListed,
            }
            console.log("history item: ",item);
            return item;
        }))

        console.log("My market items: ",items);

        marketUpdateFetched(true);
        updateMarketData(items);
    }

    async function getMyAuctionProducts() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(AuctionplaceJSON.address, AuctionplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getMyProducts()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let item = {
                tokenId: i.tokenId.toNumber(),
                image: meta.image,
                name: meta.name,
                description: meta.description,
                listed: i.currentlyListed,
            }

            console.log("history item: ",item);
            return item;
        }))

        console.log("My auction items: ",items);
        
        auctionUpdateFetched(true);
        updateAuctionData(items);
    }

    if(!marketDataFetched) {
        getMyMarketProducts();
    }
        

    if(!auctionDataFetched) {
        getMyAuctionProducts();
    }
        

    return (
        <div className="home-body">
            <div className="home-block">
                <div className="homeTitles" style={{margin: '0px 0px 20px'}}>History</div>
                <div className="product-container">
                    {marketData.map((value, index) => {
                        return <HistoryMarketCard data={value} key={index}></HistoryMarketCard>;
                    })}
                    {auctionData.map((value, index) => {
                        return <HistoryAuctionCard data={value} key={index}></HistoryAuctionCard>;
                    })}
                </div>
            </div>            
        </div>
    );

}

export default Home;