import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  Workflowstate,
  WorkflowstateDocument,
} from 'src/schemas/workflowstate.schema';
import { OrgRole } from '../users/constants/user.orgRole';
import { ContentStatus } from '../content/constants/Content.status';
import { UsersService } from '../users/users.service';
import { ContentService } from '../content/content.service';

@Injectable()
export class WorkflowstateService extends NestService<
  Workflowstate,
  WorkflowstateDocument
> {
  constructor(
    @InjectModel(Workflowstate.name)
    private readonly workflowstateModel: Model<Workflowstate>,

    private readonly contentService: ContentService,
  ) {
    super(workflowstateModel);
  }

  async deleteWorkflowState(workflowStateID: string) {
    try {
      return this.workflowstateModel.findByIdAndDelete(workflowStateID);
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async getContents_withPendingState(userID: string, userRole: OrgRole, query) {
    try {
      const workflowStates = (await this.workflowstateModel.find({
        isActive: true,
        contentStatus: ContentStatus.PENDING,
        $or: [
          {
            approverType: 'USER',
            approverValue: { $in: [userID] },
          },
          {
            approverType: 'ROLE',
            approverValue: { $in: [userRole] },
          },
        ],
      })) as WorkflowstateDocument[];

      return await this.contentService._find({
        ...query,
        _id: {
          $in: workflowStates.map((each) => String(each?.content || '')),
        },
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
