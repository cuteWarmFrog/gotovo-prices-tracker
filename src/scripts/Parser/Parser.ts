import {Meal} from "../Meal";

const cheerio = require('cheerio');

export class Parser implements Parser {

   constructor() {
   }

   parse(html: string): Array<Meal> {
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
         let date: string = new Date().toLocaleDateString('RU');
         menu.push(new Meal(name, prices[i], date));
      })

      //ну и ахуительный же фильтр я придумал (из-за карусели дублируются некоторые позиции)
      return menu.filter((meal: Meal, i: number, arr: Meal[]) => {
         return arr.slice(i).filter((anotherMeal: Meal) => meal.equals(anotherMeal)).length <= 1;
      });
   }

}