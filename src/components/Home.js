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

    const categorySampleData = [[]];

    const [mCat1Data, updateMCat1Data] = useState(sampleData);
    const [mCat2Data, updateMCat2Data] = useState(sampleData);
    const [mCat3Data, updateMCat3Data] = useState(sampleData);
    const [mCat4Data, updateMCat4Data] = useState(sampleData);

    const [aCat1Data, updateACat1Data] = useState(sampleData);
    const [aCat2Data, updateACat2Data] = useState(sampleData);
    const [aCat3Data, updateACat3Data] = useState(sampleData);
    const [aCat4Data, updateACat4Data] = useState(sampleData);

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

    async function getCategoryNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)


        let transaction1 = await contract.getCategoryNFTs(1)

        const items1 = await Promise.all(transaction1.map(async i => {
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

        updateMCat1Data(items1);


        let transaction2 = await contract.getCategoryNFTs(2)

        const items2 = await Promise.all(transaction2.map(async i => {
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
        
        updateMCat2Data(items2);


        

        let transaction3 = await contract.getCategoryNFTs(3)

        const items3 = await Promise.all(transaction3.map(async i => {
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
        
        updateMCat3Data(items3);

        

        let transaction4 = await contract.getCategoryNFTs(4)

        const items4 = await Promise.all(transaction4.map(async i => {
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
        
        updateMCat4Data(items4);
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

    async function getCategoryAuctions() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(AuctionplaceJSON.address, AuctionplaceJSON.abi, signer)


        let transaction1 = await contract.getCategoryProducts(1)

        const items1 = await Promise.all(transaction1.map(async i => {
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
        
        updateACat1Data(items1);


        let transaction2 = await contract.getCategoryProducts(2)

        const items2 = await Promise.all(transaction2.map(async i => {
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
        
        updateACat2Data(items2);


        let transaction3 = await contract.getCategoryProducts(3)

        const items3 = await Promise.all(transaction3.map(async i => {
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
        
        updateACat3Data(items3);


        let transaction4 = await contract.getCategoryProducts(4)

        const items4 = await Promise.all(transaction4.map(async i => {
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
        
        updateACat4Data(items4);
    }


    if(!marketDataFetched) {
        getAllNFTs();
        getCategoryNFTs();
    }
        

    if(!auctionDataFetched) {
        getAllAuctions();
        getCategoryAuctions();
    }
        

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
                <br/><br/><br/>
                <div className="homeTitles">🏷️ Electronics</div>
                <div className="product-container">
                    {mCat1Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                    {aCat1Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                </div>
                <br/><br/>
                <div className="homeTitles">🏷️ Luxury</div>
                <div className="product-container">
                    {mCat2Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                    {aCat2Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                </div>
                <br/><br/>
                <div className="homeTitles">🏷️ Vehicles</div>
                <div className="product-container">
                    {mCat3Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                    {aCat3Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                </div>
                <br/><br/>
                <div className="homeTitles">🏷️ Furniture</div>
                <div className="product-container">
                    {mCat4Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                    {aCat4Data.map((value, index) => {
                        return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                </div>

            </div>            
        </div>
    );

}

export default Home;