import React, { useState } from 'react';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Button, Row, Col, Form } from 'react-bootstrap';
import './AuctionProduct.css';
import back from '../public/back.png';

const AuctionProduct = () => {

    const [formParams, updateFormParams] = useState({ name: '', description: '', price: '', category: ''});

    return (
        <div className="auction-body">
            <div className="backbody">
                <Button variant='outline-light' className="backbutton float-left" as={Link} to="/">
                    <img src={back} className="backlogo" alt='/'/>Back
                </Button>
            </div>
            <div className="d-flex justify-content-center">
                <h2 style={{padding: '20px'}}>Auction Product</h2>
            </div>
            <div>
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: '1000px'}}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Col>
                                <div className="auction-heading">Product Image</div>
                                <Form.Control className="file-upload" type={"file"} name="file"/>
                            </Col>
                            <Col>
                                <div className="auction-heading">Product Name</div>
                                <Form.Control className="input" type="text" placeholder="Product Name" size="lg" id="name"/>
                                <div className="auction-heading">Product Description</div>
                                <Form.Control className="input" as="textarea" placeholder="Product Description" size="lg" id="description"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="auction-heading">Starting Bid</div>
                                <Form.Control className="input" type="number" size="lg" placeholder="Min 0.005 ETH" step="0.005"/>
                            </Col>
                            <Col>
                                <div className="auction-heading">Bid Increment</div>
                                <Form.Control className="input" type="number" size="lg" placeholder="Min 0.005 ETH" step="0.005"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="auction-heading">Category</div>
                                <Form.Select className="category">
                                    <option value="1">Electronics</option>
                                    <option value="2">Luxury</option>
                                    <option value="3">Vehicles</option>
                                    <option value="4">Furniture</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <div className="auction-heading">Duration</div>
                                <Form.Control className="input" type="select" size="lg" placeholder="Number of days" min="0"/>
                            </Col>
                        </Row>
                        <br/><br/>
                        <div className="text-green text-center"></div>
                        <Button className="auction-button d-flex justify-content-center" size="lg">Auction Product</Button>
                    </div>
                </main>
            </div>
        </div>  
    );  
}   

export default AuctionProduct;