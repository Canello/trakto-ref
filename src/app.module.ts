const path = require('path');
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { ImagesModule } from './images/images.module';
import { Metadata } from './images/data-storage/metadata.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_ATLAS_CONNECTION_STRING,
      useNewUrlParser: true,
      synchronize: true,
      logging: true,
      entities: [Metadata],
    }),
    ImagesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
