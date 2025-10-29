import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowstateService } from './workflowstate.service';

describe('WorkflowstateService', () => {
  let service: WorkflowstateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowstateService],
    }).compile();

    service = module.get<WorkflowstateService>(WorkflowstateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
