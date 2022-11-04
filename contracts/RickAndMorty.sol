// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "usingtellor/contracts/UsingTellor.sol";

contract RickAndMorty is UsingTellor {
    // This Contract now has access to all functions in UsingTellor
    
    // REF: https://github.com/tellor-io/dataSpecs/blob/main/types/NumericApiResponse.md
    string public queryType = "NumericApiResponse"; // name of query type
    string public url = "https://rickandmortyapi.com/api/episode"; // url of API
    string public parseArgs = "info,count"; // arguments we need to parse the JSON response

    uint256 public savedEpisodeCount; // last episode count retrieved from Tellor oracle

    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    function readValue() public view returns (uint256, uint256) {
        //build our queryData
        bytes memory _queryData = abi.encode(queryType, abi.encode(url, parseArgs));
        //hash it (build our queryId)
        bytes32 _queryId = keccak256(_queryData);
        //get our data. Using a delay of 5 seconds is NOT recommended for production. More on this in the docs.
        (bytes memory _value, uint256 _timestamp) = getDataBefore(_queryId, block.timestamp - 5 seconds);
        //decode our data
        return (abi.decode(_value, (uint256)), _timestamp);
    }

    function readAndSaveValue() public {
        (uint256 _value, uint256 _timestamp) = readValue();
        if(_timestamp > 0) {
            savedEpisodeCount = _value;
        }
    }

}