import { Test, TestingModule } from '@nestjs/testing';
import { ContentcommentService } from './contentcomment.service';

describe('ContentcommentService', () => {
  let service: ContentcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentcommentService],
    }).compile();

    service = module.get<ContentcommentService>(ContentcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
