import { Injectable } from '@nestjs/common';
import { parallelCompute } from 'src/Helpers/app.helper';

@Injectable()
export class PortfolioGeneratorService {
  create() {
    const array = [
      [1, 2],
      [4, 5],
      [9, 13],
    ];

    return parallelCompute(array);
  }
}
