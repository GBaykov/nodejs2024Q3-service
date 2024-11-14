import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Fav {
  @Column()
  artists: string[]; // favorite artists ids

  @Column()
  albums: string[]; // favorite albums ids

  @Column()
  tracks: string[]; // favorite tracks ids
}
