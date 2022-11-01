import AuctionProductInfo from "./AuctionProductInfo"
import AuctionplaceJSON from "../Auctionplace.json";
import axios from "axios";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import './Home.css';

const AuctionProductPage = () => {
    const sampleData = [];

    const [auctionProductData, updateAuctionProductData] = useState(sampleData);
    const [auctionProductDataFetched, auctionProductDataUpdateFetched] = useState(false);

    async function getAuctionProductData(T_ID) {
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
        
        auctionProductDataUpdateFetched(true);
        updateAuctionProductData(items);
    }

    let {id} = useParams()

    if(!auctionProductDataFetched) {
        getAuctionProductData(id);
    }

    return (
        <div className="home-body">

                <div className="product-container">
                    {auctionProductData.map((value, index) => {
                        return <AuctionProductInfo data={value} key={index}></AuctionProductInfo>;
                    })}
                </div>
          
        </div>
    );
}

export default AuctionProductPage;