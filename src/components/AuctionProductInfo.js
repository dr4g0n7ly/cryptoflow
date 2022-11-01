import './AuctionProductInfo.css'
import { Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import back from '../public/back.png';
import { useState } from 'react';

import Auctionplace from '../Auctionplace.json';

const AuctionProductInfo = (data) => {

    console.log(data.data.endTime.toString().substring(0, 2));

    const [prodCat, setProdCat] = useState("");
    const [formParams, updateFormParams] = useState({ bid: '' });
    const ethers = require("ethers");

    if (data.data.category === 1 && prodCat !== "Electronics") {
        setProdCat("Electronics");
    }
    if (data.data.category === 2 && prodCat !== "Luxury") {
        setProdCat("Luxury");
    }
    if (data.data.category === 4 && prodCat !== "Furniture") {
        setProdCat("Furniture");
    }


    async function bidOnProduct(e) {

        //Upload data to IPFS
        try {
            const {bid} = formParams;
        //Make sure that none of the fields are empty
            if( !bid ) {
                alert("Please enter bid amount")
                return;
            }
            if (bid < data.data.price) {
                alert("Bid must be greater than current bid amount")
                return;
            }
                
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Auctionplace.address, Auctionplace.abi, signer)

            const salePrice = ethers.utils.parseUnits(bid, 'ether')

            let transaction = await contract.BidOnToken(data.data.tokenId, {value:salePrice})
            await transaction.wait()

            alert("Successfully bid on product");
            updateFormParams({ bid: '' });
            window.location.replace("/")
        }
        catch(e) {
            alert( "Bid error "+e )
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
                    <p className='mp-price'> ⌚Duration: {data.data.endTime.toString().substring(0, 2)} days</p>
                    <p className="mp-price">💲Price: {data.data.price} wETH</p>
                    <div>Place Your Bid: </div>
                    <div>
                        <Form.Control className="input" type="number" size="lg" placeholder="Your Bid" step="0.005" value={formParams.bid} onChange={e => updateFormParams({...formParams, bid: e.target.value})}/>
                        <Button className="ap-bid-button d-flex justify-content-center" size="lg" onClick={bidOnProduct}>Bid on Product</Button>
                    </div> 
                </div>            
            </div>
        </div>
    )
}

export default AuctionProductInfo;