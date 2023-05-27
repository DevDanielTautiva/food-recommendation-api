// dynamodb.config.ts

import { Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';

@Injectable()
export class DynamoDBConfig {

  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  tableName: string;

  constructor() {

    this.region = process.env.DYNAMODB_REGION;
    this.accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
    this.tableName = process.env.DYNAMODB_TABLE_NAME;

    // Create new DynamoDB instance
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      "credentials": {
          "accessKeyId": this.accessKeyId,
          "secretAccessKey": this.secretAccessKey
      },
      "region": this.region
    });
  
    // Set DynamoDB instance to the Dynamoose DDB instance
    dynamoose.aws.ddb.set(ddb);
  }


}
