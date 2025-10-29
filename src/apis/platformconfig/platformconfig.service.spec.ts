import { Test, TestingModule } from '@nestjs/testing';
import { PlatformconfigService } from './platformconfig.service';

describe('PlatformconfigService', () => {
  let service: PlatformconfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformconfigService],
    }).compile();

    service = module.get<PlatformconfigService>(PlatformconfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
