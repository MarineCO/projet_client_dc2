
#\#AdoptADuchess

##Sommaire
I. Introduction
II. Guide d'installation
III. Le site

## I - Introduction

Duchess France est une association qui vise à valoriser et promouvoir les développeuses et les femmes avec un profil technique pour leur donner plus de visibilité.
Le projet *AdoptADuchess* est un système de marrainage : une carte permet de référencer les marraines et les filleules qui ont rejoint le programme. Cela permet de d'étendre les couples marraines/filleules, trop peu nombreux.

## II - Guide d'installation

Pour pouvoir profiter pleinement du site, quelques dépendances seront nécessaires. Toutes les commandes sont à taper en ligne de commande dans un terminal  : 

**Axios**
`npm install axios`

**JQuery**
`npm install jquery`

**Mustache**
`npm install mustache`

**Semantic-ui**
`npm install semantic-ui-css`

**Body-Parser**
`npm install body-parser`

**File-System**
`npm install fs`

**Express**
`npm install express`

**Sass**
Pour installer sass, il faut d'abord installer Ruby. Pour se faire, il suffit de taper en ligne de commande : 
`sudo apt-get install ruby-full`

Ensuite, taper en ligne de commande : 
`sudo su -c 'gem install sass'`

**Mailgun**
`npm install mailgun-js`

Un fichier dataGeojson.geojson sera à placer à la racine du dossier.

## III - Fonctionnement des fichiers

**Server.js**
Le fichier server.js permet de lancer le serveur sur le port 2929.

**getDataJson.js**
Appelé depuis la route "/data". Le fichier getDataJson.js va lire les données du geojson (“dataGeo.geojson”) et les renvoie pour qu’elles puissent être affichées sur la carte côté front.

**mailGun.js**
Appelé depuis la route “/sendMail” (lorsque l’utilisateur clique sur le bouton “envoyer un email” depuis la page contact.html). Le fichier va récupérer les données renseignées par l’internaute dans le formulaire d’envoi du mail. Il va lire le json (“data.json”) pour retrouver l’adresse email correspondante à l’ID de la destinataire. Il fait ensuite partir l’email en passant par le module MailGun-js. Ce module nécessite une clef API et un nom de domaine. Ceux-ci sont appelés dans les variables “api_key” et “domain”. Il est nécessaire de les définir dans un fichier config.js dont le modèle est défini dans le fichier config.example.js

**createGeojson-dev.js**
Le fichier createGeojson-dev.js n’est pas appelé depuis le serveur. Il permet de convertir le fichier json récupéré depuis le serveur du groupe DC1 (“data.json”) en fichier geojson (“dataGeo.geojson”). C’est ce fichier qui permet de gérer les requêtes envoyées à l’api Nominatim pour géolocaliser les marraines et filleules.


## IV - Le site 

Via le site de Duchess-France, on accède au site d'AdoptADuchess. 

![Imgur](http://i.imgur.com/zBNuf7u.png)

Le menu nous redirige sur la page. Ici on a l'accueil avec la présentation du programme de Duchess.

En cliquant sur "Concept" , on arrive sur cette partie de la single page application : 

![Imgur](http://i.imgur.com/07UWsQK.png)



En cliquant sur "Rejoignez-nous", l'utilisateur reçoit les informations nécessaires pour devenir soir filleule, soit marraine.

![Imgur](http://i.imgur.com/aHA5DmY.png)

En appuyant sur "Carte", l'utilisateur arrive sur le corps de la single page application : 

![Imgur](http://i.imgur.com/NFCR1yK.png)

C'est la carte qui permet de montrer les marraines et les filleules selon leur position géographique. En cliquant sur un point ( marraine ou filleule ), on accède à la carte profil de la personne sélectionnée : 

![Imgur](http://i.imgur.com/UWQgAjg.png)

Le visiteur a la possibilité de contacter par email la Duchess grâce à un bouton de contact sur la carte de profil . Il arrive sur cette page : 

![Imgur](http://i.imgur.com/PWwnF3V.png)


Une fois son mail envoyé, l'utilisateur est automatiquement redirigé vers la page d'accueil ( la single page application ). Un message vient confirmer l'envoi du mail.

Auteurs : 

Axel Bouillart : https://github.com/Etheyr
Laure Millian : https://github.com/Laure-Milian
Marine Colonge : https://github.com/MarineCO
Axel Lezin : https://github.com/Nomilol

