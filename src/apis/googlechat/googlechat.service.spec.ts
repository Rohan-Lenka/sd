import { Test, TestingModule } from '@nestjs/testing';
import { GooglechatService } from './googlechat.service';

describe('GooglechatService', () => {
  let service: GooglechatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooglechatService],
    }).compile();

    service = module.get<GooglechatService>(GooglechatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
