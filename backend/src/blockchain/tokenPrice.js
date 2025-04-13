const axios = require("axios");

/**
* Reterivies the current price in USD from Coingecko
* @param {String} // string e.g. "Ethereum"
* @return {Number} value in USD
*/
const getCurrentTokenPrice = async (_token) => {
    let token = _token.toLowerCase();

    try {
        let url = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`;
        let fetchUrl = await axios.get(url);
        let currentUsdPrice = fetchUrl.data[token]['usd'];
        return currentUsdPrice;
        
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

module.exports ={
    getCurrentTokenPrice
}