import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import {
  Organisation,
  OrganisationDocument,
} from 'src/schemas/organisation.schema';

@Injectable()
export class OrganisationService extends NestService<
  Organisation,
  OrganisationDocument
> {
  constructor(
    @InjectModel(Organisation.name)
    private readonly organisationModel: Model<Organisation>,
  ) {
    super(organisationModel);
  }

  async upsert(org: Record<string, any>) {
    const payload = org;
    const savedOrg = await this.organisationModel.findOneAndUpdate(
      { primaryDomain: payload.primaryDomain },
      { $set: payload },
      { new: true, upsert: true },
    );

    return savedOrg;
  }
}
