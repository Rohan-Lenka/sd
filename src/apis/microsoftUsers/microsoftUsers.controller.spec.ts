import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftUsersController } from './microsoftUsers.controller';

describe('MicrosoftUsersController', () => {
  let controller: MicrosoftUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicrosoftUsersController],
    }).compile();

    controller = module.get<MicrosoftUsersController>(MicrosoftUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
