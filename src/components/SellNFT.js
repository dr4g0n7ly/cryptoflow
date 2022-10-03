import React, { useState } from 'react';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Button, Row, Col } from 'react-bootstrap';
import './SellNFT.css';
import back from '../public/back.png';

const SellNFT = () => {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {name, description, price} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !price || !fileURL)
            return;

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', price: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error "+e )
        }
    }

    console.log("Working", process.env);
    return (
        <div className="add-body">
            <div className="backbody">
                <Button className="backbutton float-left" as={Link} to="/">
                    <img src={back} className="backlogo" alt='/'/>Back
                </Button>
            </div>
            <div className="d-flex justify-content-center">
                <h2 style={{padding: '20px'}}>Add Product</h2>
            </div>
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: '1000px'}}>
                <div className="content mx-auto">
                <Row className="g-4">
                    <Col>
                        <div className="add-heading">Product Image</div>
                        <input className="file-upload" type={"file"} onChange={OnChangeFile}></input>
                    </Col>
                    <Col>
                        <div className="add-heading">Product Name</div>
                        <input className="input" id="name" type="text" placeholder="Name" size="lg" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                        <div className="add-heading">Product Description</div>
                        <textarea className="input" cols="40" rows="5" id="description" type="text" placeholder="Description" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="add-heading">Starting Bid</div>
                        <input className="input" type="number" size="lg" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                    </Col>
                    <Col>
                        <div className="add-heading">Bid Increment</div>
                        <input className="input" type="number" size="lg" placeholder="Min 0.01 ETH" step="0.01"></input>
                    </Col>
                </Row>
                <br></br>
                <div className="text-green text-center">{message}</div>
                <Button onClick={listNFT} className="add-button">
                    Add Product
                </Button>
                </div>
                </main>
            </div>
        </div>
    );
}

export default SellNFT;