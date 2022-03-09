const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://agencewebducanada.com/search?country=Quebec&ville=Qu%C3%A9bec&page=1');

    const Agences = 'a > div > img';
    const nbrSiteListe = (await page.$$('#main-container > section > div > div:nth-child(2) > div')).length; //nombre d'agences par page
    console.log(nbrSiteListe);

    const element = await page.$('div > nav > ul > li:nth-child(12)');
    const nbrPageListe = await page.evaluate(element => element.textContent, element);  //nombre de pages
    console.log(nbrPageListe);

    const mailSelector = " div > div:nth-child(2) > a:nth-child(5)";

    for (var pg = 1; pg < nbrPageListe; pg++) { //selectionne chaque page
        for (var pasAgence = 0; pasAgence < nbrSiteListe; pasAgence++) {  //selectionne chaque agence 
            await page.waitForSelector(Agences); //attend que le selecteur css se charge
            await clickSelector(Agences, page, pasAgence);
            try { //vérifie si la page existe bien
                await page.waitForSelector(mailSelector, { timeout: 3000 })
                if ((await (page.$eval(mailSelector, el => el.innerText))) != null) {  //récupère le texte dans le selecteur de mail si il est présent sur la page
                    const mail = await (page.$eval(mailSelector, el => el.innerText));
                    console.log(mail); //écrit le mail dans la console
                    fs.writeFile('agences.txt', mail + "\n", { flag: 'a+' }, err => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        //file written successfully
                      })
                }
            } catch (error) {}
            await page.goBack();
            await page.waitForSelector(Agences);
        }

        await page.goto('https://agencewebducanada.com/search?country=Quebec&ville=Qu%C3%A9bec&page=' + (pg + 1));

    }
    console.log('end');

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