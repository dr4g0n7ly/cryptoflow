import ProductCard from "./ProductCard";
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

    async function getAllNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getUnsoldNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                category: i.category,
            }
            return item;
        }))

        console.log("Market items: ",items);

        marketUpdateFetched(true);
        updateMarketData(items);
    }

    async function getAllAuctions() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(AuctionplaceJSON.address, AuctionplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getUnsoldProducts()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.bidPrice.toString(), 'ether');
            let bidIncrement = ethers.utils.formatUnits(i.bidIncrement.toString(), 'ether');
            let item = {
                price,
                bidIncrement,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
                category: i.category,
                endTime: i.endTime,
            }
            return item;
        }))

        console.log("Auction items: ",items);
        
        auctionUpdateFetched(true);
        updateAuctionData(items);
    }

    if(!marketDataFetched)
        getAllNFTs();

    if(!auctionDataFetched)
        getAllAuctions();

    return (
        <div className="home-body">
            <div className="home-block">
                <div className="homeTitles">💥 Seasonal</div>
                <img src={banner} alt="" className="banner"/>
            </div>
            <div className="home-block">
                <div className="homeTitles">🏷️ Products</div>
                    <div className="product-container">
                        {marketData.map((value, index) => {
                            return <ProductCard data={value} key={index}></ProductCard>;
                        })}
                        {auctionData.map((value, index) => {
                            return <ProductCard data={value} key={index}></ProductCard>;
                        })}
                    </div>
            </div>            
        </div>
    );

}

export default Home;