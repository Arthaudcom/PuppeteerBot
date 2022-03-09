# Pupeteer bot

## Lancement de l'app

Se rendre sur 
 ```bash
 https://agencewebducanada.com/agences
```
 Possibilité de sélectionner une province puis une ville

Lancement du bot :
```bash
node index.js
```
## Le projet

Script permettant de récupérer les adresses courriels des agences web du Canada avec la possibilité d'affiner par ville.
Réalisé avec Puppeteer, node js et file system

<img src="https://developers.google.com/web/tools/images/puppeteer.png" alt="drawing" width="120" style="margin:70px"/>   
<img src="https://sdtimes.com/wp-content/uploads/2021/10/1_COvz0L3FUapYYbsQHHZ90g.png" alt="drawing" width="200" style="margin:70px"/>

## Objectif du projet
L'objectif principal du projet est de trouver des entreprises ou faire mon stage de fin de formation. Je souhaitais le faire dans une agence web et j'ai trouvé ce site qui en recense une grande partie. J'ai eu l'idée de récupérer l'adresse mail de chacune des entreprises de façon itérative pour mettre toutes les chances de mon côté et trouver plus facilement mon stage.


## Les outils utilisés

### Puppeteer
Librairie Node fournissant une API permettant d'exécuter et de lancer chrome en Headless. Dans le cadre de mon projet, il est lancé pour aller sur le site des agences web, cliquer sur la première agence, récupérer l'adresse courriel, revenir sur la page précédente et recommencer.  

### Node File system
File system est une API permettant d'écrire dans un fichier. Dans le cadre de mon projet, Puppeteer va récupérer l'adresse courriel et File system va l'écrire dans le fichier agences.txt