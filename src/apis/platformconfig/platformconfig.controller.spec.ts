import { Test, TestingModule } from '@nestjs/testing';
import { PlatformconfigController } from './platformconfig.controller';

describe('PlatformconfigController', () => {
  let controller: PlatformconfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformconfigController],
    }).compile();

    controller = module.get<PlatformconfigController>(PlatformconfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
