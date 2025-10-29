import { Model, Types } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { Users, UsersDocument } from 'src/schemas/users.schema';
import { UserRole } from './constants/users.role';
import { Organisation } from '../../schemas/organisation.schema';
import { OrgRole } from './constants/user.orgRole';

@Injectable()
export class UsersService extends NestService<Users, UsersDocument> {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    @InjectModel(Organisation.name)
    private readonly organisationModel: Model<Organisation>,
  ) {
    super(usersModel);
  }

  sanitizeUser(user: any) {
    const sanitized = user?.toObject?.() || user;
    const fieldsToRemove = [
      'password',
      'googleUserMetadata',
      'microsoftUserMetadata',
      'googleTenant',
      'microsoftTenant',
    ];

    for (const field of fieldsToRemove) {
      delete sanitized[field];
    }

    return sanitized;
  }

  async getUserWithOrg(user: any) {
    const organisation = await this.organisationModel
      .findById(user.organisation)
      .lean();

    const sanitisedUser = this.sanitizeUser(user);

    if (organisation) {
      sanitisedUser.organisation = organisation;
    }
    return sanitisedUser;
  }

  async upsertUser(
    userData: Partial<Users>,
    identifierField: 'email' | 'phone' = 'email',
  ): Promise<UsersDocument> {
    if (!userData[identifierField]) {
      throw new Error(`Cannot upsert user: missing ${identifierField}`);
    }

    try {
      const filter = { [identifierField]: userData[identifierField] };
      const update = { $set: userData };
      const options = { new: true, upsert: true };

      const user = await this.usersModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return user;
    } catch (err) {
      console.error('[UsersService.upsertUser] Failed:', err);
      throw new InternalServerErrorException(
        `Failed to upsert user: ${err.message || err}`,
      );
    }
  }

  async getRoleCounts(organisation: string) {
    const org = (await this.organisationModel
      .findById(organisation)
      .lean()) as Organisation;

    const result = await this.usersModel.aggregate([
      {
        $match: { organisation: new Types.ObjectId(organisation) },
      },
      {
        $group: {
          _id: '$orgRole',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          roleID: '$_id',
          count: 1,
        },
      },
    ]);

    const counts: Record<string, number> = {};

    for (const r of result) {
      const roleName = OrgRole[r.roleID];
      counts[roleName] = r.count;
    }

    const departments = await this.usersModel.aggregate([
      {
        $match: {
          department: { $ne: null }, // exclude empty/null values
        },
      },
      {
        $sort: {
          department: 1, // optional: sort alphabetically
        },
      },
      {
        $group: {
          _id: null,
          departments: { $addToSet: '$department' }, // collect unique values
        },
      },
      {
        $project: {
          _id: 0,
          departments: 1,
        },
      },
    ]);

    return {
      counts,
      lastSynced: org?.lastSynced,
      departments: departments?.[0]?.departments || [],
    };
  }
}
