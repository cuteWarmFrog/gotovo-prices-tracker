import {Meal} from "../Meal";

interface Parser {
   parse(html: string): Array<Meal>;
}