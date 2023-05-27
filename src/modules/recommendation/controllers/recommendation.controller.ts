import { Controller, Body, Post, UseInterceptors } from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationsDto, RecommendationsResponseDto } from '../dto/recommendations.dto';
import { formatWordInterceptor } from 'src/helpers/formatWord.interceptor';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {
  }

  @UseInterceptors(formatWordInterceptor)
  @Post('/search')
  async recommend(@Body() body: RecommendationsDto): Promise<RecommendationsResponseDto> {
      return this.recommendationService.recommend(body);
  }

}