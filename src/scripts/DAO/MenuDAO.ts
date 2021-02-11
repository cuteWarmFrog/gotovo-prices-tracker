import {Meal} from "../Meal";
import {QueryResult} from "pg";

const db = require('./database');

export class MenuDAO {

   constructor() {
   }

   async  checkIfMealExists(meal: Meal) {
      const result: QueryResult = await db.query(
         `SELECT *
       FROM meals
       WHERE name = $1;`, [meal.name]);
      return result.rows.length > 0;
   }


   async addMeal(meal: Meal) {
      const result: QueryResult = await db.query(
         `INSERT INTO meals (name, price, date)
       VALUES ($1, $2, $3);`, [meal.name, meal.price, meal.date]);
   }

   async checkIfPriceChanged(meal: Meal) {
      const maxPrice: number = await this.getMealMaxPrice(meal);
      return meal.price !== maxPrice;
   }

   async getMealMaxPrice(meal: Meal) {
      //const result: QueryResult = await db.query(
      // `SELECT MAX(price) from meals WHERE name=$1`, [meal.name]);

      const result: QueryResult = await db.query(
         `select price from meals where name=$1 and id=(SELECT MAX(id) from meals WHERE name=$1)`, [meal.name]);
      return Number.parseInt(result.rows[0].price);
   }


   async getPriceChange(meal: Meal): Promise<number> {
      const maxPrice = await this.getMealMaxPrice(meal);
      return meal.price - maxPrice;
   }
}