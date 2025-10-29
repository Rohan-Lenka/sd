import { Test, TestingModule } from '@nestjs/testing';
import { ContentworkflowService } from './contentworkflow.service';

describe('ContentworkflowService', () => {
  let service: ContentworkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentworkflowService],
    }).compile();

    service = module.get<ContentworkflowService>(ContentworkflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
