import { Test, TestingModule } from '@nestjs/testing';
import { ContentactionlogService } from './contentactionlog.service';

describe('ContentactionlogService', () => {
  let service: ContentactionlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentactionlogService],
    }).compile();

    service = module.get<ContentactionlogService>(ContentactionlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
