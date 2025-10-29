import { Test, TestingModule } from '@nestjs/testing';
import { ContentworkflowController } from './contentworkflow.controller';

describe('ContentworkflowController', () => {
  let controller: ContentworkflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentworkflowController],
    }).compile();

    controller = module.get<ContentworkflowController>(
      ContentworkflowController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
