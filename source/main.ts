import { launch, getStream } from 'puppeteer-stream';
import fs from 'fs';
import { RevAiApiClient } from 'revai-node-sdk';
import { exit } from 'process';
import axios from 'axios';

const nameFile = __dirname + '/test.mp3';
const urlWebhookMake = 'https://hook.eu1.make.com/XXXXXXXXXXXXXXXXXXXXX';
const file = fs.createWriteStream(nameFile);

const _delay = async (seconds: number) => {
  await new Promise((r) => setTimeout(r, seconds * 1000));
};

const _sendJobIdMake = async (jobId: string) => {
  try {
    const res = await axios.post(urlWebhookMake, { jobId });
    console.log(`Status requête Make webhook : ${res.status}`);
  } catch (error) {
    console.log(error);
  }
};

export default async (
  email: string,
  password: string,
  URLGmeet: string,
  accessTokenRevai: string
) => {
  const clientRevAI = new RevAiApiClient(accessTokenRevai);
  const browser = await launch({
    headless: false,
  });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(URLGmeet, ['camera', 'microphone']);

  //Logging Google
  const page = await browser.newPage();
  await page.goto('https://accounts.google.com/ ');

  await page.type('#identifierId', email, { delay: 100 });
  await page.click('#identifierNext');
  await page.waitForSelector('input[name="Passwd"]');
  await _delay(1);
  await page.type('input[name="Passwd"]', password, { delay: 100 });
  await page.click('#passwordNext');
  await _delay(3);

  //Go to Meet
  await page.goto(URLGmeet);
  await _delay(1);
  await page.keyboard.down('Control');
  await page.keyboard.press('d');
  await _delay(1);
  await page.keyboard.press('e');
  await _delay(1);
  await page.keyboard.up('Control');
  await _delay(1);

  const buttons = await page.$$('button');
  await Promise.all(
    buttons.map(async (button) => {
      await page.evaluate((el) => {
        if (
          el.textContent == 'Participer' ||
          el.textContent == 'Participer à la réunion'
        ) {
          el.click();
        }
      }, button);
    })
  );

  const stream = await getStream(page, { audio: true, video: false });
  console.log('recording');
  stream.pipe(file);

  browser.once('disconnected', async () => {
    file.close();
    console.log('finished');
    //J'envoie le fichier au service revAI
    const job = await clientRevAI.submitJobLocalFile(nameFile, {
      language: 'fr',
    });
    console.log(job);
    //J'envoie au webhook créé dans Make le jobId
    await _sendJobIdMake(job.id);
    exit();
  });
};
