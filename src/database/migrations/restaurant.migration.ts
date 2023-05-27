
import * as dynamoose from 'dynamoose';
import * as fs from 'fs';
import { Restaurant } from '../../modules/recommendation/entities/restaurant.entity';
import { restaurantSchema } from '../../modules/recommendation/entities/restautant.shema';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
"credentials": {
    "accessKeyId": process.env.DYNAMODB_ACCESS_KEY_ID,
    "secretAccessKey": process.env.DYNAMODB_SECRET_ACCESS_KEY
},
  "region": process.env.DYNAMODB_REGION
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

// Crea el modelo basado en el esquema
const Model = dynamoose.model('restaurants', restaurantSchema);

async function loadArrayToDynamoDB(dataArray: Restaurant[]){
  try {

    const results = await Model.scan().exec();

    if(results.length > 0){
      console.log('Los datos ya fueron cargados en DynamoDB :) .'); return true;
    }

    for await(let item of dataArray){

      let restaurant = new Model({
          id: uuidv4(),
          name: item.name,
          description: item.description,
          foodType: item.foodType,
          menus: item.menus,
          referencias: item.referencias.join(",")
      });

      console.log(`Datos cargados del restaurante: ${item.name}, tipo de comida: ${item.foodType}`);
      await restaurant.save();
    }

    console.log('Datos cargados exitosamente en DynamoDB. :D ');
  

  } catch (error) {
    console.error('Error al cargar datos en DynamoDB :( ');
  }
}

const data =  fs.readFileSync('restaurants.json', 'utf-8');

loadArrayToDynamoDB(JSON.parse(data));