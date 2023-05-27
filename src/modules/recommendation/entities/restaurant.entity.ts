import { Item } from 'dynamoose/dist/Item';

export class Restaurant extends Item {
    id: string;
    name:string;
    description:string;
    foodType:string;
    menus: [
        {
            name:string,
            ingredients:string,
            price:string,
            qualification:string
        }
    ];
    referencias: string[]
}