import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../database/data-source';
import { User } from 'src/user/entities/user.entity';
import { version } from 'os';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Fav } from 'src/favs/entities/fav.entity';

const dataSource = new DataSource(dataSourceOptions);
const userRepository = dataSource.getRepository(User);
const tracksRepository = dataSource.getRepository(Track);
const albumsRepository = dataSource.getRepository(Album);
const artistsRepository = dataSource.getRepository(Artist);
const favsRepository = dataSource.getRepository(Fav);

async function connect() {
  try {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source connect', err);
  }
}

async function disconnect() {
  try {
    await dataSource.destroy();

    console.log('Data Source disconnected!');
  } catch (err) {
    console.error('Error during Data Source disconnect', err);
  }
}

async function seed() {
  const UserSeed = () => [
    {
      login: 'Admin',
      passwrd: 'Admin',
      version: 1,
    },
  ];

  await userRepository.save(UserSeed());
  console.log('created seeds');
}

async function runSeed() {
  await connect();
  console.log('connected');
  await seed();
  console.log('seed done');
  await disconnect();
  console.log('disconnected');
}

runSeed();
