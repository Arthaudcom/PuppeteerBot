const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const Agences = 'a > div > img';
    const nbrSiteList = 10;
    const nbrPageListe = 30;
    const mailSelector = " div > div:nth-child(2) > a:nth-child(5)"
    const nameSelector = "#agency > h1"



    await page.goto('https://agencewebducanada.com/search?country=Quebec&ville=Qu%C3%A9bec&page=5');

    for (var pg = 1; pg < nbrPageListe; pg++) {
        for (var pas = 0; pas < nbrSiteList; pas++) {
            await page.waitForSelector(Agences);
            await clickSelector(Agences, page, pas);
            await page.waitForSelector(mailSelector)
            //if ((await (page.$eval(nameSelector, el => el.innerText)))!= null){
            //const name = await (page.$eval(nameSelector, el => el.innerText));
            //console.log(name);}
            if ((await (page.$eval(mailSelector, el => el.innerText)))!= null){
            const mail = await (page.$eval(mailSelector, el => el.innerText));
            console.log(mail);}
            await page.goBack();
            //await page.goto('https://agencewebducanada.com/search?country=Quebec&ville=Qu%C3%A9bec&page='+pg);
            await page.waitForSelector(Agences);
        }

        await page.goto('https://agencewebducanada.com/search?country=Quebec&ville=Qu%C3%A9bec&page='+(pg+1));
        
    }
    console.log('end');
    await page.screenshot({ path: 'screenshot/1.png' });

    await browser.close();
})();

/**
 * Fonction permettant de cliquer sur le i-ème élément
 * @param {string} selector Selecteur css qui correspond *à l'élément à trouver et à cliquer
 * @param {*} page Page web ouverte par Puppeteer
 * @param {number} i Selecteur css qui correspond aux éléments à trouver et à cliquer
 * 
 */
async function clickSelector(selector, page, i) {
    const selectorArray = await (page.$$(selector));
    await selectorArray[i].click();
}