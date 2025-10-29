import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOAuthService } from './googleOAuth.service';

describe('GoogleOauthService', () => {
  let service: GoogleOAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleOAuthService],
    }).compile();

    service = module.get<GoogleOAuthService>(GoogleOAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
