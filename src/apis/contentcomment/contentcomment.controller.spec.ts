import { Test, TestingModule } from '@nestjs/testing';
import { ContentcommentController } from './contentcomment.controller';

describe('ContentcommentController', () => {
  let controller: ContentcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentcommentController],
    }).compile();

    controller = module.get<ContentcommentController>(ContentcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
