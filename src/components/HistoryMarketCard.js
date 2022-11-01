import { BrowserRouter as Router, Link } from "react-router-dom";
import './ProductCard.css';
import { useState, useEffect } from 'react';
import './HistoryCard.css';
import { Button } from 'react-bootstrap';

import Marketplace from '../Marketplace.json';

function HistoryMarketCard (data)  {

    const [status, setStatus] = useState("Listed");

    console.log(data);

    useEffect(() => {

        if (!data.data.listed && status!=="") {
            setStatus("");
            console.log("STATUS ",status);
        }

        if (data.data.listed && status!=="Listed") {
            setStatus("Listed");
            console.log("STATUS ",status);
        }

    })

    async function UnlistProduct() {

        try {
            const ethers = require("ethers");
                
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            console.log("listed before unlist: " + data.data.listed);

            let transaction = await contract.Unlist(data.data.tokenId)
            await transaction.wait()

            console.log("listed after unlist: " + data.data.listed);

            alert("Successfully unlisted product");
            window.location.replace("/")
        }
        catch(e) {
            alert( "Bid error "+e )
        }
    }

    return (
        <Link className="card-link" data={data}>

            <div className="main">
                <div className="c">
                    <img src={data.data.image} alt="" className="img"/>
                </div>
                <div className="c">
                    <h3>{data.data.name}</h3>
                    <br/>
                    <p>{data.data.description}</p>
                </div>
                <div className="c" id="c3">
                    <p>{status}</p>
                    { status == "Listed" ?
                        <Button className="mp-buy-button d-flex justify-content-center" id="history-button" size="lg" style={{margin: 'auto'}} onClick={UnlistProduct} >Unlist</Button> :
                        <div>Purchased</div>
                    }
                </div>
            </div>

        </Link>
    )
}

export default HistoryMarketCard;