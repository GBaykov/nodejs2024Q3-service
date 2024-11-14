import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'root',
      password: 'password',
      database: 'postgres',
      // entities: [`${__dirname}/typeorm/entities/*{.js,.ts}`],
      entities: ['src/**/*.entity{.js,.ts}'],
      synchronize: true, // do not use in prod
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
