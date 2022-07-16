// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Bank {
    address public bankOwner;
    string public bankName;
    mapping(address => uint256) public customerBalance;
    mapping(address => string) public customerAlias;
    address[] addresses = new address[](0);
    mapping(address => bool) public customerBalanceContains;

    constructor() {
        bankOwner = msg.sender;
    }

    function depositMoney() public payable {
        require(msg.value != 0, "You need to deposit some amount of money!");
        customerBalance[msg.sender] += msg.value;
        if (!customerBalanceContains[msg.sender]) {
            customerBalanceContains[msg.sender] = true;
            addresses.push(msg.sender);
        }
    }

    function setBankName(string memory _name) external {
        require(
            msg.sender == bankOwner,
            "You must be the owner to set the name of the bank"
        );
        bankName = _name;
    }

    function setCustomerAlias(address _account, string memory _accountAlias)
        external
    {
        require(
            msg.sender == bankOwner,
            "You must be the owner to set the name of the bank"
        );
        require(customerBalanceContains[_account], "Account not found");
        customerAlias[_account] = _accountAlias;
    }

    function withDrawMoney(address payable _to, uint256 _total) public payable {
        require(
            customerBalanceContains[msg.sender],
            "You never deposited funds"
        );
        require(
            _total <= customerBalance[msg.sender],
            "You have insuffient funds to withdraw"
        );

        customerBalance[msg.sender] -= _total;
        _to.transfer(_total);
    }

    function getCustomerBalance() external view returns (uint256) {
        return customerBalance[msg.sender];
    }

    function getBankBalance() public view returns (uint256) {
        require(
            msg.sender == bankOwner,
            "You must be the owner of the bank to see all balances."
        );
        return address(this).balance;
    }

    function getAccounts()
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            string[] memory
        )
    {
        require(
            msg.sender == bankOwner,
            "You must be the owner of the bank to see all balances."
        );
        uint256 totAdresses = addresses.length;
        address[] memory _addresses = new address[](totAdresses);
        uint256[] memory _balances = new uint256[](totAdresses);
        string[] memory _aliases = new string[](totAdresses);
        for (uint256 i = 0; i < totAdresses; i++) {
            _addresses[i] = addresses[i];
            _balances[i] = customerBalance[addresses[i]];
            _aliases[i] = customerAlias[addresses[i]];
        }
        return (_addresses, _balances, _aliases);
    }
}
