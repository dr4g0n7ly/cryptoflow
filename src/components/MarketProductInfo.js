import './MarketProductInfo.css'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import back from '../public/back.png';
import { useState } from 'react';

import Marketplace from '../Marketplace.json';

const MarketProductInfo = (data) => {

    const [prodCat, setProdCat] = useState("");
    const ethers = require("ethers");

    console.log(data.data.price);

    if (data.data.category === 1 && prodCat !== "Electronics") {
        setProdCat("Electronics");
    }
    if (data.data.category === 2 && prodCat !== "Luxury") {
        setProdCat("Luxury");
    }
    if (data.data.category === 3 && prodCat !== "Automobile") {
        setProdCat("Automobile");
    }
    if (data.data.category === 4 && prodCat !== "Furniture") {
        setProdCat("Furniture");
    }

    async function buyProduct() {
    
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
            const salePrice = ethers.utils.parseUnits(data.data.price, 'ether')

            //execute sale
            let transaction = await contract.executeSale(data.data.tokenId, {value:salePrice})
            await transaction.wait()

            alert("Successfully purchased product!");
            window.location.replace("/")
        }
        catch(e) {
            alert( "Purchase error "+e )
        }
    }

    return (
        <div className="mp-info-body">
            <div className="backbody">
                <Button variant='outline-light' className="backbutton float-left" as={Link} to="/">
                    <img src={back} className="backlogo" alt='/'/>Back
                </Button>
            </div>
            <div className="mp-main">
                <img src={data.data.image} alt="" className="mp-img"/>
                <div className="mp-texts">
                    <p className="mp-category">{prodCat}</p>
                    <p className="mp-title">{data.data.name}</p>
                    <p className="mp-descr">{data.data.description}</p>
                    <p className="mp-price">💲Price: {data.data.price} wETH</p>
                    <Button className="mp-buy-button d-flex justify-content-center" size="lg" onClick={buyProduct}>Buy Product</Button>
                </div>            
            </div>
        </div>
    )
}

export default MarketProductInfo;