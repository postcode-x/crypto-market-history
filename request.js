async function getAllUrls(urls) {
    try {
        let data = await Promise.all(
            urls.map(
                url => fetch(url).then(value => value.json()))
        );

        return (data)

    } catch (error) {
        console.log(error);
        throw (error);
    }
}

let marketV3 = 'BTC-USDT';
let market = 'USDT-BTC';
let marketHistoryURL = 'https://api.bittrex.com/v3/markets/' + marketV3 + '/trades';
let priceURL = 'https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=' + market + '&tickInterval=oneMin';
let tickerURL = 'https://api.bittrex.com/v3/markets/' + marketV3 + '/ticker';
let urls = [marketHistoryURL, priceURL, tickerURL];