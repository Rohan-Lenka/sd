import { Test, TestingModule } from '@nestjs/testing';
import { ContentactionlogController } from './contentactionlog.controller';

describe('ContentactionlogController', () => {
  let controller: ContentactionlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentactionlogController],
    }).compile();

    controller = module.get<ContentactionlogController>(
      ContentactionlogController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
