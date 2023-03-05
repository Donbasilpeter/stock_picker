import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioGeneratorDto } from './create-portfolio-generator.dto';

export class UpdatePortfolioGeneratorDto extends PartialType(CreatePortfolioGeneratorDto) {}
