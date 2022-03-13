const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://agencewebducanada.com/search?country=Quebec';

    await page.goto(url);  //navigue vers l'url

    const Agences = 'a > div > img';
    const nbrSiteListe = (await page.$$('#main-container > section > div > div:nth-child(2) > div')).length; //nombre d'agences par page
    console.log("nombre de site par page: "+nbrSiteListe);

    const element = await page.$('div > nav > ul > li:nth-child(12)');
    const nbrPageListe = await page.evaluate(element => element.textContent, element);  //nombre de pages
    const waitingTime = nbrPageListe*nbrSiteListe/80;
    console.log("Nombre de pages: "+nbrPageListe);
    console.log("Rapidité du bot: 80 mails par minute");
    console.log("Temps d'attente estimé: " + Math.round(waitingTime) + "min");

    const mailSelector = " div > div:nth-child(2) > a:nth-child(5)";

    for (var pg = 1; pg < nbrPageListe; pg++) { //selectionne chaque page
        for (var pasAgence = 0; pasAgence < nbrSiteListe; pasAgence++) {  //selectionne chaque agence 
            await page.waitForSelector(Agences); //attend que le selecteur css se charge
            await clickSelector(Agences, page, pasAgence);
            try { //vérifie si la page existe bien
                await page.waitForSelector(mailSelector, { timeout: 3000 })
                if ((await (page.$eval(mailSelector, el => el.innerText))) != null) {  //récupère le texte dans le selecteur de mail si il est bien présent
                    const mail = await (page.$eval(mailSelector, el => el.innerText));
                    fs.writeFile('agences.txt', mail + "\n", { flag: 'a+' }, err => { //ecrit le mail dans le fichier agence.txt
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                }
            } catch (error) { }
            await page.goBack();
            await page.waitForSelector(Agences);
        }
        await page.goto(url + '&page=' + (pg + 1)); //navigue vers la page suivante
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