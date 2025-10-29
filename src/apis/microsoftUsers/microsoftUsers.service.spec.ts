import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftUsersService } from './microsoftUsers.service';

describe('MicrosoftUsersService', () => {
  let service: MicrosoftUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicrosoftUsersService],
    }).compile();

    service = module.get<MicrosoftUsersService>(MicrosoftUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
