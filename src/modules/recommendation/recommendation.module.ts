import { Module } from '@nestjs/common';
import { RecommendationService } from './services/recommendation.service';
import { RecommendationController } from './controllers/recommendation.controller';
import { DynamoDBConfig } from '../../../dynamodb.config';

@Module({
  imports:[],
  controllers: [RecommendationController],
  providers: [RecommendationService, DynamoDBConfig]
})
export class RecommendationModule {}
