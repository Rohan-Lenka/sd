import { Test, TestingModule } from '@nestjs/testing';
import { FormfieldsController } from './formfields.controller';

describe('FormfieldsController', () => {
  let controller: FormfieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormfieldsController],
    }).compile();

    controller = module.get<FormfieldsController>(FormfieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
