const puppeteer = require('puppeteer');
const fs = require('fs');
const cliProgress = require('cli-progress');
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.etaBuffer = 12;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://www.agenceswebduquebec.com/agences/liste/montreal';

    await page.goto(url);  //navigue vers l'url

    const Agences = 'div.logo > a > img'; 
    const nbrSiteListe = (await page.$$('div.logo > a > img')).length; //nombre d'agences par page
    console.log("nombre de site par page: "+nbrSiteListe); 
    const mailSelector = "#contact >p:nth-child(2) > a"; //selecteur css du mail

    //navigation vers la dernière page pour connaitre le nombre total de pages
    const fin = '#main > nav > span.last > a'; //selecteur css du lien vers la dernière page
    await page.waitForSelector(fin);
    await page.click(fin);
    await page.waitForSelector('#main > nav > span.page.current');
    const nbrPageListe = await page.$eval('#main > nav > span.page.current', el => el.innerText); //nombre de page
    console.log("nombre de pages: "+nbrPageListe);
    await page.goto(url);  //retour à la première page

    bar.start(nbrPageListe*nbrSiteListe, 0); //initialisation de la barre de progression

    for (var pg = 1; pg < nbrPageListe; pg++) { //selectionne chaque page
        for (var pasAgence = 0; pasAgence < nbrSiteListe; pasAgence++) {  //selectionne chaque agence 
            await page.waitForSelector(Agences); //attend que le selecteur css se charge
            await clickSelector(Agences, page, pasAgence);
            try { //vérifie si la page existe bien
                await page.waitForSelector(mailSelector, { timeout: 3000 })
                if ((await (page.$eval(mailSelector, el => el.innerText.includes("@")))))  {  //récupère le texte dans le selecteur de mail si il est bien présent
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
            bar.increment();
        }
        await page.goto(url + '?page=' + (pg + 1)); //navigue vers la page suivante
    }
    console.log('end');
    await browser.close();
})();

/**
 * Fonction permettant de cliquer sur le i-ème élément
 * @param {string} selector Selecteur css qui correspond à l'élément à trouver et à cliquer
 * @param {*} page Page web ouverte par Puppeteer
 * @param {number} i Selecteur css qui correspond aux éléments à trouver et à cliquer
 * 
 */
async function clickSelector(selector, page, i) {
    const selectorArray = await (page.$$(selector));
    await selectorArray[i].click();
}