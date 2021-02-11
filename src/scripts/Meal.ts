  export class Meal {
   name: string;
   price: number;
   date: string;

   constructor(name: string, price: number, date: string ) {
      this.name = name;
      this.price = price;
      this.date = date;
   }

   equals(meal: Meal) {
      return this.name == meal.name;
   }
}