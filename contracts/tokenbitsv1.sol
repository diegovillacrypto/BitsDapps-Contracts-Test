// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol"; 
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";


contract TokenBits is Initializable,AccessControlUpgradeable,ERC20Upgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable, UUPSUpgradeable {

     bytes32 public constant BITS_ROLE = keccak256("BITS_ROLE");
     bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");


     /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }


     function initialize() initializer public {
        __ERC20_init("TokenBits", "BTK");
        __ERC20Permit_init("TokenBits");
        __ERC20Votes_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(BITS_ROLE,DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(UPGRADER_ROLE,DEFAULT_ADMIN_ROLE);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(BITS_ROLE,msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(BITS_ROLE) {
        _mint(to,amount);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }

         function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
} 