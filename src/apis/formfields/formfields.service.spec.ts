import { Test, TestingModule } from '@nestjs/testing';
import { FormfieldsService } from './formfields.service';

describe('FormfieldsService', () => {
  let service: FormfieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormfieldsService],
    }).compile();

    service = module.get<FormfieldsService>(FormfieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
