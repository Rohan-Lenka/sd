import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  AudienceManager,
  AudienceManagerDocument,
} from 'src/schemas/audienceManager.schema';
import { Users } from 'src/schemas/users.schema';
import { UserRole } from '../users/constants/users.role';
import { OrgRole } from '../users/constants/user.orgRole';

@Injectable()
export class AudienceManagerService extends NestService<
  AudienceManager,
  AudienceManagerDocument
> {
  constructor(
    @InjectModel(AudienceManager.name)
    private readonly audienceManagerModel: Model<AudienceManager>,
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {
    super(audienceManagerModel);
  }

  async createAudienceGroup(audienceGroupPayload: AudienceManager) {
    if (!audienceGroupPayload) {
      throw new Error('Audience Group Payload is required');
    }
    const newGroup = await this._create(audienceGroupPayload);
    return newGroup;
  }

  async getUserfromAudienceGroup(groupId: string) {
    if (!groupId) {
      throw new Error('Group ID is required');
    }
    const group = await this.audienceManagerModel.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    return await this.getUsersFromFilters(group.filters);
  }

  async getUsersFromFilters(groupFilters: any[], organisation?: string) {
    const mongoQuery: any[] = [];

    for (const filter of groupFilters) {
      const filterQuery = filter.stage.map((stage) => {
        switch (stage.entityType) {
          case 'user':
            return { _id: stage.entityId };
          case 'role':
            const role_value = stage.entityValue;
            if (Number(role_value)) return { orgRole: role_value };
            const roles = {
              ADMIN: OrgRole.ADMIN,
              USER: OrgRole.USER,
              CONTRIBUTOR: OrgRole.CONTRIBUTOR,
              APPROVER: OrgRole.APPROVER,
            };
            return { orgRole: roles[role_value] };
          case 'designation':
            return { designation: stage.entityValue };
          case 'ex_at':
            return { ex_at: stage.entityValue };
          case 'department':
            return { department: stage.entityValue };
          default:
            return {};
        }
      });

      // console.log(filterQuery);

      if (filter.condition === 'AND') {
        mongoQuery.push({ $and: filterQuery });
      } else if (filter.condition === 'OR') {
        mongoQuery.push({ $or: filterQuery });
      }
    }

    const finalQuery =
      mongoQuery.length > 1 ? { $and: mongoQuery } : mongoQuery[0];

    // console.log(finalQuery);

    const usersRes = (await this.usersModel.find(finalQuery)) as Users[];

    const users = usersRes.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      orgRole: user.orgRole as OrgRole,
      department: user.department,
      // designation: user.designation,
    }));

    return {
      users,
      count: users.length,
    };
  }

  async deleteAudienceGroup(groupId: string) {
    try {
      if (!groupId) {
        throw new Error('Group ID is required');
      }
      const deleteGroup =
        await this.audienceManagerModel.findByIdAndDelete(groupId);
      return deleteGroup;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async updateGroup(groupId: string, updatePayload: AudienceManager) {
    try {
      if (!groupId || !updatePayload) {
        throw new Error('Group ID and Updattion Payload is required');
      }
      const updatedGroup = await this.audienceManagerModel.findByIdAndUpdate(
        groupId,
        updatePayload,
      );
      return updatedGroup;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}
