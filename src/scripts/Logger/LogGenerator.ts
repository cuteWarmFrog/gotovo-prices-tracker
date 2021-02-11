import {Meal} from "../Meal";
const moment = require('moment');

export class LogGenerator {
   mealsPriceChanged: mealWithDelta[] = [];
   mealsPriceNOTChanged: Meal[] = [];
   newMeals: Meal[] = [];

   date: string;

   constructor(date: string) {
      this.date = date;
   }

   addMealToChanged(meal: Meal, delta: number): void {
      let mealWithDelta = {
         meal: meal,
         delta: delta
      }
      this.mealsPriceChanged.push(mealWithDelta);
   }

   addMealToNOTChange(meal: Meal): void {
      this.mealsPriceNOTChanged.push(meal);
   }

   addMealToNew(meal: Meal) {
      this.newMeals.push(meal);
   }

   //todo
   generate(): string {
      const date = this.getDate();
      let isMealsPriceChanged: string;
      if(this.mealsPriceChanged.length > 0) {
         isMealsPriceChanged = `Изменившиеся цены:\n`;
         this.mealsPriceChanged.map((meal: mealWithDelta) => {
            isMealsPriceChanged = isMealsPriceChanged.concat(this.getMealText(meal));
         })
      } else {
         isMealsPriceChanged = `Ни одно блюдо не подорожало.\n`
      }
      const text =
         `${date}\n\n${isMealsPriceChanged}\n${this.getNewMealsText()}`;
      return text;
   }

   private getNewMealsText() {
      if(this.newMeals.length > 0) {
         return `В базу добавлено ${this.newMeals.length} ${this.getRightWordForm()}`
      } else {
         return '';
      }
   }

   getRightWordForm() {

      //todo 11-19
      switch (this.newMeals.length % 10) {
         case 1:
            return 'новое блюдо';

         case 2:
         case 3:
         case 4:
            return 'новых блюда';

         case 5:
         case 6:
         case 7:
         case 8:
         case 9:
         case 0:
            return 'новых блюд'
      }

   }

   private riseOrFall(delta: number): string {
      return delta > 0 ? 'подорожало' : 'подешевело';
   }

   private getDate() {
      return `Отчет за ${this.date}`;
      //return moment().locale('RU').format('LL');
   }

   private getMealText(meal: mealWithDelta) {
      return `Блюдо "${meal.meal.name}" ${this.riseOrFall(meal.delta)} на ${Math.abs(meal.delta)}₽ и теперь стоит ${meal.meal.price}₽\n`
   }
}

interface mealWithDelta {
   meal: Meal;
   delta: number
}