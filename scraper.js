const puppeteer = require('puppeteer');

/*function getData(url) {
    return checkPrice(url)
        .catch(console.log)
        .then(price => { return price });
} */

async function getData(url) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "domcontentloaded"});
//    let price = await page.evaluate((element) => element.innerText, await page.$$('#price_inside_buybox'));
//    let price = await page.$eval('#newBuyBoxPrice', element => element.innerText);
    let priceString = await page.$eval('.a-offscreen', element => element.innerText);
    let name = await page.$eval('#productTitle', element => element.innerText);
/*    let price;
    try {
        price = await page.$eval('#price_inside_buybox, #newBuyBoxPrice', element => element.innerText);
    } catch {
        try {
            price = await page.$eval('#newBuyBoxPrice', element => element.innerText);
        } catch {
            console.log('Price not found.');
        }
    }*/
    await browser.close();
    
    let timestamp = Date.now();
/*    let dateObject = new Date(timestamp);
    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let hour = dateObject.getHours();
    let mins = dateObject.getMinutes();
    let time = month + '/' + day + ' @ ' + hour + ':' + mins; */

    let price = parseFloat(priceString.substring(1));

    return { price: price, name: name, url: url , time: timestamp};
}
//    let try1 = await page.$eval('#price_inside_buybox', element => element.innerText)
//    let try2 = await page.$eval('#newBuyBoxPrice', element => element.innerText);
//    return try1.catch(try2.catch(console.log).then(price => price)).then(price => price);


/*setInterval(() => {
    getData('https://www.amazon.com/Sceptre-E248W-19203R-Monitor-Speakers-Metallic/dp/B0773ZY26F/ref=sr_1_3?crid=1F339NAOAA66M&dchild=1&keywords=24+inch+monitor&qid=1630359358&sprefix=24+inch+%2Caps%2C243&sr=8-3').then(console.log);
}, 10000);*/

module.exports = { getData };