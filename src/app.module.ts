import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamoDBConfig } from '../dynamodb.config';
import { RecommendationModule } from './modules/recommendation/recommendation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    RecommendationModule,
  ],
  controllers: [],
  providers: [DynamoDBConfig],
})
export class AppModule {}
