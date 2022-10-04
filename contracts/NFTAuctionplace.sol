//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTAuctionplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable owner;
    uint256 listPrice = 0.01 ether;

    //The structure to store info about a listed token
    struct AuctionToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        address payable highestBidder;
        uint256 bidPrice;
        uint256 bidIncrement;
        uint256 endTime;
        uint256 category;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully auctioned
    event TokenAuctionedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        address highestBidder,
        uint256 bidPrice,
        uint256 bidIncrement,
        uint256 endTime,
        uint256 category,
        bool currentlyListed
    );

    mapping(uint256 => AuctionToken) private idToAuctionedToken;

    constructor() ERC721("NFTAuctionplace", "NFTA") {
        owner = payable(msg.sender);
    }


    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }


    function StartAuction(string memory tokenURI, uint256 price, uint256 bidIncrement, uint256 durationInSeconds, uint256 category) public payable returns (uint) {
        require(msg.value == listPrice, "Must send listing price");
        require(price > 5000000000000000, "Must set price of auction item greater than 0.005 ETH");
        require(durationInSeconds > 15, "Must set duration of auction greater than 0");

        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();

        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        idToAuctionedToken[currentTokenId] = AuctionToken(
            currentTokenId,
            payable(address(this)),
            payable(msg.sender),
            payable(msg.sender),
            price,
            bidIncrement,
            block.timestamp + durationInSeconds,
            category,
            true
        );

        payable(owner).transfer(listPrice);
        _transfer(msg.sender, address(this), currentTokenId);

        emit TokenAuctionedSuccess(
            currentTokenId,
            address(this),
            msg.sender,
            msg.sender,
            price,
            bidIncrement,
            block.timestamp + durationInSeconds,
            category,
            true
        );

        return currentTokenId;
        
    }

    function BidOnToken (uint tokenId) public payable {

        uint256 price = idToAuctionedToken[tokenId].bidPrice;
        uint256 bidInc = idToAuctionedToken[tokenId].bidIncrement;
        address seller = idToAuctionedToken[tokenId].seller;
        address currentBidder = idToAuctionedToken[tokenId].highestBidder;
        uint256 endTime = idToAuctionedToken[tokenId].endTime;
        bool currentlyListed = idToAuctionedToken[tokenId].currentlyListed;

        if (endTime <= block.timestamp && currentlyListed == true) {
            idToAuctionedToken[tokenId].currentlyListed = false;
            idToAuctionedToken[tokenId].owner = payable(currentBidder);
            
            _transfer(address(this), currentBidder, tokenId);
            approve(address(this), tokenId);

            if (seller != currentBidder) {
                payable(currentBidder).transfer(price);
            }
            
        }

        require(currentlyListed = true, "Item must be currently listed");
        require(msg.value >= price + bidInc, "Bid must be atleast bid Increment greater than current bid price");
        require(block.timestamp >= endTime, "Auction has expired");

        if (seller != currentBidder) {
            payable(currentBidder).transfer(price);
        }

        idToAuctionedToken[tokenId].bidPrice = msg.value;
        idToAuctionedToken[tokenId].highestBidder = payable(msg.sender);
    }

    function getAllProducts() public view returns (AuctionToken[] memory) {

        uint itemCount = _tokenIds.current();
        AuctionToken[] memory tokens = new AuctionToken[](itemCount);
        uint currentIndex = 0;
        uint currentId;

        for(uint i=0;i<itemCount;i++)
        {
            currentId = i + 1;
            AuctionToken storage currentItem = idToAuctionedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    function getUnsoldProducts() public view returns (AuctionToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;

        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToAuctionedToken[i+1].currentlyListed == true){
                itemCount += 1;
            }
        }

        AuctionToken[] memory items = new AuctionToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToAuctionedToken[i+1].currentlyListed == true) {
                currentId = i+1;
                AuctionToken storage currentItem = idToAuctionedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getCategoryProducts(uint256 categoryNum) public view returns (AuctionToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;

        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToAuctionedToken[i+1].currentlyListed == true && idToAuctionedToken[i+1].category == categoryNum){
                itemCount += 1;
            }
        }

        AuctionToken[] memory items = new AuctionToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToAuctionedToken[i+1].currentlyListed == true && idToAuctionedToken[i+1].category == categoryNum) {
                currentId = i+1;
                AuctionToken storage currentItem = idToAuctionedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getMyProducts() public view returns (AuctionToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToAuctionedToken[i+1].owner == msg.sender || idToAuctionedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        AuctionToken[] memory items = new AuctionToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToAuctionedToken[i+1].owner == msg.sender || idToAuctionedToken[i+1].seller == msg.sender) {
                currentId = i+1;
                AuctionToken storage currentItem = idToAuctionedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}