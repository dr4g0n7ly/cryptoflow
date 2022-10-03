import React from 'react';
import './Footer.css';
import cflogo from '../public/cflogo.png';

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer-body mt-auto">
        <div className="container">
            <div className="row">
                <div className="col">
                    <img src={cflogo} alt="" className="footerlogo"/> 
                    <h4 className="footer-brand">CryptoFlow</h4>
                </div>
                <div className="footer-right">
                    <div className="col">
                        <h4 className="footer-heading">Pages</h4>
                        <ul className="list-unstyled">
                            <li className="footer-item">Seasonal</li>
                            <li className="footer-item">Add Product</li>
                            <li className="footer-item">History</li>
                            <li className="footer-item">Ongoing</li>
                        </ul>
                    </div>
                    <div className="col">
                        <h4 className="footer-heading">Connect</h4>
                        <ul className="list-unstyled">
                            <li className="footer-item">FAQ</li>
                            <li className="footer-item">Support</li>
                            <li className="footer-item">Feedback</li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr />
            <div className="row">
                <p className="col" id="footer-bottom">
                    <p>&copy;{new Date().getFullYear()} CryptoFlow, Inc. All rights reserved</p>
                    <p>T&C</p>
                    <p>Privacy Policy</p>
                </p>
            </div>
        </div>
      </div>
    )
  }
}
