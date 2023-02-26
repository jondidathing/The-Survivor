// SPDX-License-Identifier: MIT

pragma solidity <= 0.80;

interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Marketplace{

    uint internal productLength = 0;

    address internal cUSDTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    struct Product {
        address payable owner;
        string name;
        string image;
        string description;
        string location; 
        uint price;
        uint sold;
    }

    mapping (uint => Product) internal products;

    function writeProduct(
        string memory _name,
        string memory _image, 
        string memory _description,
        string memory _location,
        uint _price
    ) public {
        uint _sold = 0;
        products[productLength] = Product(
            payable (msg.sender), 
            _name, 
            _image, 
            _description, 
            _location, 
            _price, 
            _sold
        
        );
        productLength++;
    }


	function readProduct(uint _index) public view returns (
		address payable,
		string memory,
		string memory,
		string memory,
		string memory,
		uint,
		uint
    ){  
        return (
            products[_index].owner,
            products[_index].name,
            products[_index].image,
            products[_index].description,
            products[_index].location,
            products[_index].price,
            products[_index].sold
	    );
	}

    function readProductLength() public view returns (uint)
    {
        return productLength;
    }

    function buyProduct(uint _index)public payable {
        require(
            /// persons who is buying the product = msg.sender
            /// person who is getting the product = product[_index].owner
            /// the price at which the sender is buying the product at = product[_index].price
            IERC20(cUSDTokenAddress).transferFrom(
                msg.sender, 
                products[_index].owner, 
                products[_index].price 
            ), 
            "Transfer Has Failed"
        );
        products[_index].sold++;
    }


}
