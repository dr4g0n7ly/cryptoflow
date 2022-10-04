import ProductCard from "./ProductCard";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import banner from '../public/banner.png';
import './Home.css';

const Home = () => {

    const sampleData = [];
    const [data, updateData] = useState(sampleData);
    const [dataFetched, updateFetched] = useState(false);

    async function getAllNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getAllNFTs()

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
            }
            return item;
        }))
        updateFetched(true);
        updateData(items);
    }

    if(!dataFetched)
        getAllNFTs();

    return (
        <div className="home-body">
            <div className="home-block">
                <div className="homeTitles">💥 Seasonal</div>
                <img src={banner} alt="" className="banner"/>
            </div>
            <div className="home-block">
                <div className="homeTitles">🏷️ Products</div>
                    <div className="product-container">
                        {data.map((value, index) => {
                            return <ProductCard data={value} key={index}></ProductCard>;
                        })}
                    </div>
            </div>            
        </div>
    );

}

export default Home;