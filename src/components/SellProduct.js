import React, { useState } from 'react';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Button, Row, Col, Form } from 'react-bootstrap';
import './SellProduct.css';
import back from '../public/back.png';

const SellProduct = () => {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '', category: '1'});
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
        const {name, description, price, category} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !price || !fileURL || !category)
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
            const category = formParams.category;
            console.log("Category: ", category);
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, category, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', price: '', category: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error "+e )
        }
    }

    console.log("Working", process.env);
    return (
        <div className="sell-body">
            <div className="backbody">
                <Button variant='outline-light' className="backbutton float-left" as={Link} to="/">
                    <img src={back} className="backlogo" alt='/'/>Back
                </Button>
            </div>
            <div className="d-flex justify-content-center">
                <h2 style={{padding: '20px'}}>Sell Product</h2>
            </div>
            <div>
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: '1000px'}}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Col>
                                <div className="sell-heading">Product Image</div>
                                <Form.Control className="file-upload" type={"file"} name="file" onChange={OnChangeFile}/>
                            </Col>
                            <Col>
                                <div className="sell-heading">Product Name</div>
                                <Form.Control className="input" type="text" placeholder="Product Name" size="lg" id="name" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name} />
                                <div className="sell-heading">Product Description</div>
                                <Form.Control className="input" as="textarea" placeholder="Product Description" size="lg" id="description" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="sell-heading">Product Price</div>
                                <Form.Control className="input" type="number" size="lg" placeholder="Min 0.005 ETH" step="0.05" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="sell-heading">Category</div>
                                <Form.Select className="category" value={formParams.category} onChange={e => updateFormParams({...formParams, category: e.target.value})}>
                                    <option value="1">Electronics</option>
                                    <option value="2">Luxury</option>
                                    <option value="3">Vehicles</option>
                                    <option value="4">Furniture</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <br/>
                        <div className="text-green text-center">{message}</div>
                        <Button className="sell-button d-flex justify-content-center" size="lg" onClick={listNFT}>Sell Product</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SellProduct;