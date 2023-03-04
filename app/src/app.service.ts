import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import  {AxiosError} from 'axios';

import { GPU } from 'gpu.js';
const gpu = new GPU();

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getHello(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://www.google.co.in/').pipe(
        catchError((error: AxiosError) => {
          console.log(error)
          throw 'An error happened!';
        }),
      ),
    );

   return "nil"
}
}