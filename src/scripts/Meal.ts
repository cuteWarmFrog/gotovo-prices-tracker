  export class Meal {
   name: string;
   price: number;

   constructor(name: string, price: number) {
      this.name = name;
      this.price = price;
   }

   equals(meal: Meal) {
      return this.name == meal.name;
   }
}