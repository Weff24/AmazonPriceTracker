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
    let price = await page.$eval('.a-offscreen', element => element.innerText);
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
    return { price: price, name: name, url: url };
}
//    let try1 = await page.$eval('#price_inside_buybox', element => element.innerText)
//    let try2 = await page.$eval('#newBuyBoxPrice', element => element.innerText);
//    return try1.catch(try2.catch(console.log).then(price => price)).then(price => price);


/*setInterval(() => {
    getData('https://www.amazon.com/Sceptre-E248W-19203R-Monitor-Speakers-Metallic/dp/B0773ZY26F/ref=sr_1_3?crid=1F339NAOAA66M&dchild=1&keywords=24+inch+monitor&qid=1630359358&sprefix=24+inch+%2Caps%2C243&sr=8-3').then(console.log);
}, 10000);*/

//getData('https://www.amazon.com/Sceptre-E248W-19203R-Monitor-Speakers-Metallic/dp/B0773ZY26F/ref=sr_1_4?dchild=1&keywords=monitor&qid=1631216549&sr=8-4').then(console.log);

//getData('https://www.amazon.com/BenQ-EW3280U-Entertainment-connectivity-Speakers/dp/B081V1M5CR/ref=sxin_13?asc_contentid=amzn1.osa.b870b3ef-2829-44c0-a1c7-25a882f978be.ATVPDKIKX0DER.en_US&asc_contenttype=article&ascsubtag=amzn1.osa.b870b3ef-2829-44c0-a1c7-25a882f978be.ATVPDKIKX0DER.en_US&creativeASIN=B081V1M5CR&cv_ct_cx=monitor&cv_ct_id=amzn1.osa.b870b3ef-2829-44c0-a1c7-25a882f978be.ATVPDKIKX0DER.en_US&cv_ct_pg=search&cv_ct_we=asin&cv_ct_wn=osp-single-source-earns-comm&dchild=1&keywords=monitor&linkCode=oas&pd_rd_i=B081V1M5CR&pd_rd_r=cb45e161-c929-4f6a-b517-427a55bb4a18&pd_rd_w=9Fc3b&pd_rd_wg=I5RK1&pf_rd_p=f6709837-67ea-47b2-90de-f82e8db57444&pf_rd_r=3Y5XE8WXZVP9S22KW14F&qid=1631152227&sr=1-3-a3cc9a7a-2f07-46dc-8259-ac02200376a0&tag=plonsite20-20').then(console.log);

module.exports = { getData };