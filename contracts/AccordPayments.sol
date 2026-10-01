// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Local research prototype. Exact native payments, no administrator or escrow.
contract AccordPayments {
    struct Quote {
        address buyer;
        address seller;
        uint256 amount; // Native payment amount in wei (1 ETH = 10^18 wei).
        bytes32 requestHash;
        bytes32 resultHash;
        bytes32 nonce;
        uint256 expiry; // Last valid payment time, in Unix seconds.
    }
    bytes32 private constant DOMAIN_TYPE_HASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant QUOTE_TYPE_HASH = keccak256("Quote(address buyer,address seller,uint256 amount,bytes32 requestHash,bytes32 resultHash,bytes32 nonce,uint256 expiry)");
    uint256 private constant MAX_SIGNATURE_S = 0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;
    mapping(bytes32 => bool) public paid;
    event Paid(bytes32 indexed quoteId, address indexed buyer, address indexed seller, uint256 amount, bytes32 requestHash, bytes32 resultHash);

    function pay(Quote calldata quote, bytes calldata signature) external payable {
        require(msg.sender == quote.buyer, "Wrong buyer");
        require(quote.seller != address(0), "Invalid seller");
        require(quote.amount > 0 && msg.value == quote.amount, "Wrong payment amount");
        require(block.timestamp <= quote.expiry, "Quote expired");
        bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPE_HASH, keccak256("Accord"), keccak256("0.1"), block.chainid, address(this)));
        bytes32 quoteHash = keccak256(abi.encode(QUOTE_TYPE_HASH, quote.buyer, quote.seller, quote.amount, quote.requestHash, quote.resultHash, quote.nonce, quote.expiry));
        bytes32 quoteIdentifier = keccak256(abi.encodePacked("\x19\x01", domainSeparator, quoteHash));
        require(!paid[quoteIdentifier], "Quote already paid");
        require(signature.length == 65, "Invalid signature length");
        bytes32 signatureR;
        bytes32 signatureS;
        uint8 recoveryId;
        assembly {
            signatureR := calldataload(signature.offset)
            signatureS := calldataload(add(signature.offset, 32))
            recoveryId := byte(0, calldataload(add(signature.offset, 64)))
        }
        require(uint256(signatureS) <= MAX_SIGNATURE_S && (recoveryId == 27 || recoveryId == 28), "Invalid signature encoding");
        require(ecrecover(quoteIdentifier, recoveryId, signatureR, signatureS) == quote.seller, "Invalid seller signature");
        paid[quoteIdentifier] = true;
        (bool paymentDelivered,) = payable(quote.seller).call{value: quote.amount}("");
        require(paymentDelivered, "Seller rejected payment");
        emit Paid(quoteIdentifier, quote.buyer, quote.seller, quote.amount, quote.requestHash, quote.resultHash);
    }
}
