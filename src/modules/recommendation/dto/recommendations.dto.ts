import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendationsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly search: string;
}


export class RecommendationsResponseDto {
  @ApiProperty()
  readonly search: string;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  @IsArray()
  @Type(() => RecommendationDto)
  readonly recomentations?: RecommendationDto[];

  @ApiProperty()
  readonly error?: any;
}

class RecommendationDto {
  @ApiProperty()
  readonly updatedAt: string;

  @ApiProperty()
  @IsArray()
  @Type(() => MenuDto)
  readonly menus: any[];

  @ApiProperty()
  readonly createdAt: string;

  @ApiProperty()
  readonly foodType: string;

  @ApiProperty()
  readonly referencias: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;
}

class MenuDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly ingredients: string;

  @ApiProperty()
  readonly qualification: string;

  @ApiProperty()
  readonly price: string;
}