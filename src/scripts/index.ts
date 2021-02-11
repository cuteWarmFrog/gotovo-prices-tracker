import {Meal} from './Meal';
import {WebElement} from "selenium-webdriver";
import {MenuDAO} from "./DAO/MenuDAO";
import {Parser} from "./Parser/Parser";
import {LogGenerator} from "./Logger/LogGenerator";
import {TelegramLogger} from "./Logger/TelegramLogger";

const fs = require('fs');
require("chromedriver");
const webdriver = require('selenium-webdriver');
const until = webdriver.until;
const by = webdriver.By;

const url = "https://gotovo.ru/";

const menuDAO = new MenuDAO();
const parser = new Parser();

const fromBrowser = true;

(async function MainWrapper() {
   let menu: Array<Meal>;

   if (fromBrowser) {

      let html = await getHtmlFromBrowser();
      menu = parser.parse(html);

   } else {
      menu = require('../MenuJson/February_6.json');
   }
   //fs.writeFileSync('February_9.json', JSON.stringify(menu));

   await processMenu(menu);
})();

async function processMenu(menu: Array<Meal>) {
   const logGen: LogGenerator = new LogGenerator(menu[0].date);


   for(let i = 0; i < menu.length; i++) {
      let meal = menu[i];
      if(await menuDAO.checkIfMealExists(meal)) {

         if(await menuDAO.checkIfPriceChanged(meal)) {

            let delta = await menuDAO.getPriceChange(meal);
            await logGen.addMealToChanged(meal, delta)
            await menuDAO.addMeal(meal);
         } else {
            await logGen.addMealToNOTChange(meal);
         }
      } else {
         await menuDAO.addMeal(meal);
         await logGen.addMealToNew(meal);
      }
   }


   const TgLogger = new TelegramLogger(logGen);
   TgLogger.log();

   console.log(logGen.generate());
}


async function getHtmlFromBrowser(): Promise<string> {
   const driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
   await driver.get(url);
   await driver.wait(until.elementLocated(by.id("garnish")), 45000);
   const element: WebElement = await driver.findElement(by.id('root'));
   return await element.getAttribute("innerHTML");
}

function readFromTestingFile(): string {
   return fs.readFileSync('testHtml.txt', 'utf8');
}


