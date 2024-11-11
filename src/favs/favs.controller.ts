import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateFavDto: UpdateFavDto) {
  //   return this.favsService.update(+id, updateFavDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.favsService.findOne(+id);
  // }
  @Post('artist/:id')
  @HttpCode(201)
  createArtist(@Param('id') id: string) {
    return this.favsService.createArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favsService.removeArtist(id);
  }

  @Post('track/:id')
  @HttpCode(201)
  create(@Param('id') id: string) {
    return this.favsService.createTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.favsService.removeTrack(id);
  }
  @Post('album/:id')
  @HttpCode(201)
  createAlbum(@Param('id') id: string) {
    return this.favsService.createAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbum(id);
  }
}
