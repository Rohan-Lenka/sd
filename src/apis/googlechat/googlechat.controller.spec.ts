import { Test, TestingModule } from '@nestjs/testing';
import { GooglechatController } from './googlechat.controller';

describe('GooglechatController', () => {
  let controller: GooglechatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GooglechatController],
    }).compile();

    controller = module.get<GooglechatController>(GooglechatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
