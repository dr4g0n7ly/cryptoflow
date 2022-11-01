import MarketProductInfo from "./MarketProductInfo";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import './Home.css';

const MarketProductPage = () => {
    const sampleData = [];

    const [marketProductData, updateMArketProductData] = useState(sampleData);
    const [marketProductDataFetched, marketProductDataUpdateFetched] = useState(false);

    async function getMarketProductData(T_ID) {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getMarketProductDetails(T_ID)

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

        console.log("Product details (marketplace): ",items);

        marketProductDataUpdateFetched(true);
        updateMArketProductData(items);
    }

    let {id} = useParams()

    if(!marketProductDataFetched) {
        getMarketProductData(id);
    }

    return (
        <div className="home-body">

                <div className="product-container">
                    {marketProductData.map((value, index) => {
                        return <MarketProductInfo data={value} key={index}></MarketProductInfo>;
                    })}
                </div>
          
        </div>
    );
}

export default MarketProductPage;