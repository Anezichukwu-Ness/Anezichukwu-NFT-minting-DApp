// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing necessary contracts and libraries from OpenZeppelin
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// Defining the main contract Save_The_Environment
contract Save_The_Environment is ERC721Enumerable, Ownable {
    // Importing SafeMath and Counters from OpenZeppelin
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Creating a counter for token IDs
    Counters.Counter public _tokenIds;

    // Setting the maximum supply of NFTs to 10 and the price per NFT to 0.05 ether
    uint public constant MAX_SUPPLY = 10;
    uint public constant PRICE = 0.001 ether;

    // Setting the maximum number of NFTs that can be minted per transaction to 2
    uint public constant MAX_PER_MINT = 2;

    // Setting a base URI for the NFTs
    string public baseTokenURI;

    // Defining the constructor function, which sets the base URI for the NFTs
    constructor(string memory baseURI) ERC721("Save_The_Environment", "SaveNFT") {
        setBaseURI(baseURI);
    }

    // Defining an internal function that returns the base URI for the NFTs
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // Defining a function that allows the owner to set the base URI for the NFTs
    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    // Defining a function that allows users to mint NFTs
    function mintNFTs(uint _count) public payable {
        // Checking the total number of NFTs that have been minted so far
        uint totalMinted = _tokenIds.current();

        // Requiring that there are enough NFTs left to mint
        require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left!");

        // Requiring that the user is minting at least 1 NFT and no more than 2 NFTs per transaction
        require(_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");

        // Requiring that the user has sent enough ether to purchase the NFTs
        require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");

         // Minting the specified number of NFTs and assigning them to the user
         for (uint i = 0; i < _count; i++) {
             _mintSingleNFT();
         }
    }
    
    // Mint a single NFT and increment the token ID counter
    function _mintSingleNFT() private {
        uint newTokenID = _tokenIds.current(); // Get the current token ID
        _safeMint(msg.sender, newTokenID);
        _tokenIds.increment();
    }

    //To get total NFT minted
    function getTokenIdsMinted() public view returns (uint256) {
    uint totalMinted = _tokenIds.current();
    return totalMinted;
  }
    
    //This function allows the contract owner to withdraw any ether stored in the contract. 
    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    //fetch the total amount in the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
}