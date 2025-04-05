// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AgentNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    uint256 public constant ACCESS_FEE = 0.00000001 ether;
    
    struct Agent {
        string ipfsHash;
        address owner;
        bool exists;
    }
    
    mapping(uint256 => Agent) public agents;
    mapping(string => uint256) public hashToTokenId;
    mapping(address => mapping(string => bool)) public userAccess;
    
    event AgentCreated(uint256 tokenId, string ipfsHash, address owner);
    event AccessGranted(address user, string ipfsHash);
    
    constructor() ERC721("AgentNFT", "ANFT") {}
    
    function createAgent(string memory ipfsHash) public returns (uint256) {
        require(hashToTokenId[ipfsHash] == 0, "Agent already exists");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        
        agents[newTokenId] = Agent(ipfsHash, msg.sender, true);
        hashToTokenId[ipfsHash] = newTokenId;
        userAccess[msg.sender][ipfsHash] = true;
        
        emit AgentCreated(newTokenId, ipfsHash, msg.sender);
        
        return newTokenId;
    }
    
    function requestAccess(string memory ipfsHash) public payable {
        uint256 tokenId = hashToTokenId[ipfsHash];
        require(tokenId != 0, "Agent does not exist");
        require(!userAccess[msg.sender][ipfsHash], "Access already granted");
        require(msg.value >= ACCESS_FEE, "Insufficient payment");
        
        address owner = agents[tokenId].owner;
        require(msg.sender != owner, "Owner already has access");
        
        payable(owner).transfer(msg.value);
        userAccess[msg.sender][ipfsHash] = true;
        
        emit AccessGranted(msg.sender, ipfsHash);
    }
    
    function hasAccess(address user, string memory ipfsHash) public view returns (bool) {
        return userAccess[user][ipfsHash];
    }
    
    function getAgentDetails(uint256 tokenId) public view returns (Agent memory) {
        require(agents[tokenId].exists, "Agent does not exist");
        return agents[tokenId];
    }
    
    function getAllAgents() public view returns (Agent[] memory) {
        Agent[] memory allAgents = new Agent[](_tokenIds.current());
        
        for(uint256 i = 1; i <= _tokenIds.current(); i++) {
            allAgents[i-1] = agents[i];
        }
        
        return allAgents;
    }
}
