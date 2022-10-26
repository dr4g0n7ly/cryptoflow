import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import ProductCard from './ProductCard';

export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
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
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return (
        <div>
            <div>
            <div>
                <div>
                    <h2>Wallet Address</h2>  
                    {address}
                </div>
            </div>
            <div>
                    <div>
                        <h2>No. of NFTs</h2>
                        {data.length}
                    </div>
                    <div>
                        <h2>Total Value</h2>
                        {totalPrice} ETH
                    </div>
            </div>
            <div>
                <h2>Your NFTs</h2>
                <div>
                    {data.map((value, index) => {
                    return <ProductCard data={value} key={index}></ProductCard>;
                    })}
                </div>
                <div>
                    {data.length == 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
                </div>
            </div>
            </div>
        </div>
    )
};