require('dotenv').config();

const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

let action = 'cours-cisco-systems-CSCO-US17275R1023-1';

const url = `https://bourse.fortuneo.fr/actions/${action}`;

let dernierCoupon;

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);
    try {
        await page.waitForSelector('#popin_tc_privacy_button_3', {
            timeout:5000
        });
        await page.click('#popin_tc_privacy_button_3');
    } catch (e) {
        console.log('no popup');
    }
    await page.waitForSelector('#cotation > div > div > div:nth-child(4) > div > div > div.ng-scope > div > div:nth-child(12) > div.item-value > span');
    dernierCoupon = await page.evaluate(() => {
        return (document.querySelector('#cotation > div > div > div:nth-child(4) > div > div > div.ng-scope > div > div:nth-child(12) > div.item-value > span').innerText);
    });
}

app.get('/', (req, res) => {
    res.redirect('/cisco');
});

app.get('/cisco', (req, res) => {
    run().then(() => {
        res.json(dernierCoupon);
        console.log('done');
    });
})

app.listen(process.env.PORT, () => {
    console.log('server up and running !');
});
