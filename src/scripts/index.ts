import {Meal} from './Meal';
import {WebElement} from "selenium-webdriver";

const fs = require('fs');
const cheerio = require('cheerio');
require("chromedriver");
const webdriver = require('selenium-webdriver');
const until = webdriver.until;
const by = webdriver.By;

const url = "https://gotovo.ru/";

const localTesting = true;

(async function MainWrapper() {
   let html: string;
   if(localTesting) {
      html = readFromTestingFile();
   } else {
      html = await getHtmlFromBrowser();
   }
   const menu = parseHtml(html);
   console.log(menu)

})();

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

function parseHtml(html: string): Array<Meal> {
   const $ = cheerio.load(html);
   let names: string[] = [];
   let prices: number[] = [];

   //верхняя чась меню, данные в span
   let parsedNamesSpan = $('.container:nth-child(3) a span');
   parsedNamesSpan.each((i: number, element: any) => {
      names.push(element.children[0].data);
   })

   //остальное меню, данные в h3
   let parsedNamesH3 = $('.container:nth-child(3) a h3');
   parsedNamesH3.each((i: number, element: any) => {
      names.push(element.children[0].data);
   })

   //цены все одинакого храня в
   let parsedPrices = $('.container:nth-child(3) a button');
   parsedPrices.each((i: number, element: any) => {
      prices.push(Number.parseFloat(element.children[0].data));
   })

   const menu: Array<Meal> = [];
   names.forEach((name, i) => {
      menu.push(new Meal(name, prices[i]))
   })

   //ну и ахуительный же фильтр я придумал (из-за карусели дублируются некоторые позиции)
   const filteredMenu = menu.filter((meal: Meal, i: number, arr: Meal[]) => {
      return arr.slice(i).filter((anotherMeal: Meal) => meal.equals(anotherMeal)).length <= 1;
   })

   return filteredMenu;
}


