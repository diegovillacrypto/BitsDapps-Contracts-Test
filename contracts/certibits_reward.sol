// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

 interface IERC20Votes {

    function mint(address to, uint256 amount) external;

 }
    contract CertiBits is Initializable,AccessControlUpgradeable,UUPSUpgradeable{
    
    bytes32 public constant BITS_ROLE = keccak256("BITS_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    IERC20Votes bitsToken;
    uint public totalCertiBits;
    uint256 public bonusReward; //Amount of Tokens for reward
    address recipient;


    struct signature{
        address signer;
        string sign_data;
    }

    mapping (string => signature[]) hash2SignaturesList;
    mapping (address => string[]) address2SignaturesList;
    mapping (address => mapping(string => bool)) address2hashstate;
    mapping (address => uint) pubkey2IDu;
    mapping (address => bool) public address2state;
    mapping (address => uint) signatures;

    event newRewardValue(uint256 _rewardAmount);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(IERC20Votes _bitsTokenAddress, uint256 _bonusReward, address _recipient) initializer public {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(BITS_ROLE,DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(UPGRADER_ROLE,DEFAULT_ADMIN_ROLE);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(BITS_ROLE,msg.sender);


        bitsToken = _bitsTokenAddress;
        bonusReward = _bonusReward;
        recipient = _recipient;
    }


    function changeRecipient(address _newAddress) public onlyRole(UPGRADER_ROLE) {
        recipient = _newAddress;
    }

    function changeTokenAddress(IERC20Votes _newTokenBits) public onlyRole(UPGRADER_ROLE) {
        bitsToken = _newTokenBits;
    }


    function setReward (uint256 _rewardAmount) public onlyRole(UPGRADER_ROLE) {
        bonusReward = _rewardAmount;
        emit newRewardValue(_rewardAmount);
    }



    function Certify(string memory _hash, string memory _data) payable public {
        require(!address2hashstate[msg.sender][_hash],"Address already signed these hash");
        require(msg.value>=1 ether, "min payment for certi is 1 Celo");
        payable(recipient).transfer(msg.value);
        address2hashstate[msg.sender][_hash]=true;
        hash2SignaturesList[_hash].push(signature(msg.sender, _data));
        address2SignaturesList[_msgSender()].push(_hash);
        totalCertiBits++;
        bitsToken.mint(msg.sender,bonusReward);
        }

    
    function validateHash(string memory _hash) public view returns(signature[] memory) {
        return (hash2SignaturesList[_hash]);
    }
    function mySignatures() public view returns(string[] memory) {
        return (address2SignaturesList[_msgSender()]);
    }
    function validateSingleHash(string memory _hash, uint _i) public view returns(address, string memory) {
        return (hash2SignaturesList[_hash][_i].signer,hash2SignaturesList[_hash][_i].sign_data);
    }
    function mySingleSignature(uint _i) public view returns(string memory) {
        return (address2SignaturesList[_msgSender()][_i]);
    }
    function validateHashLength(string memory _hash) public view returns(uint) {
        return (hash2SignaturesList[_hash].length);
    }
    function mySignaturesLength() public view returns(uint) {
        return (address2SignaturesList[_msgSender()].length);
    }

     function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}