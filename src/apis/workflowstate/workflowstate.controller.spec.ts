import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowstateController } from './workflowstate.controller';

describe('WorkflowstateController', () => {
  let controller: WorkflowstateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowstateController],
    }).compile();

    controller = module.get<WorkflowstateController>(WorkflowstateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
