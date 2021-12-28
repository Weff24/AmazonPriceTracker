const puppeteer = require('puppeteer');

// Gets the website data 
async function getData(url) {
    // Launch puppeteer and web scrape desired data
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    let priceString = await page.$eval('.a-offscreen', element => element.innerText);
    let name = await page.$eval('#productTitle', element => element.innerText);
    await browser.close();

    // Add and reformat data
    let timestamp = Date.now();
    let price = parseFloat(priceString.substring(1));

    return { price: price, name: name, url: url, time: timestamp };
}

module.exports = { getData };