# La Batcave 1

C'est le prototype de l'édition 2 de La Batcave : https://www.labatcave.tech/

## Installation

1.

```sh
  npm install
```

2. Remplace ces variables par l'URL d'un gmeet que tu viens de lancer
   Et le mail et password du compte google dédié à ton visibot.
   Crée toi un compte sur rev.ai pour avoir un Token d'accès

```
  const URLGmeet = 'https://meet.google.com/XXX-XXXX-XXX';
  const email = 'XXXXXXXX@gmail.com';
  const password = 'XXXXXXXXXXXXXX';
  const accessTokenRevai = 'XXXXXXXXXXXXXXXXXXXXXXXXXX';
```

4. Change l'url du webhook dans le fichier main.ts

```
  const urlWebhookMake = 'https://hook.eu1.make.com/XXXXXXXXXXXXXXXXXXXXX';
```

3. Compile le code

```sh
  npm run watch
```

4. Exécute ton code et voilà !

```sh
  npm start
```

## License

Distribué sous la licence MIT License. Voir `LICENSE.txt` pour plus d'information.
