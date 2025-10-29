import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { Content, ContentDocument } from 'src/schemas/content.schema';
import { Formfields } from 'src/schemas/formfields.schema';
import { defaultFormFields } from './constants/formFields.types';
// import { formfield_UpdateDTO } from '../formfields/dto/formfield.dto';
import { GooglechatService } from '../googlechat/googlechat.service';
import { ContentStatus, ContentStatusValues } from './constants/Content.status';
import { AudienceManagerService } from '../audienceManager/audienceManager.service';
import { AudienceManager } from 'src/schemas/audienceManager.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContentService extends NestService<Content, ContentDocument> {
  constructor(
    @InjectModel(Content.name) private readonly contentModel: Model<Content>,
    @InjectModel(Formfields.name)
    private readonly formfieldsModel: Model<Formfields>,
    private readonly googleChatService: GooglechatService,
    private readonly audienceManagerService: AudienceManagerService,
    private readonly userService: UsersService,
  ) {
    super(contentModel);
  }

  async find(query: Record<string, any>) {
    const res = await this._find(query);

    const $match: Record<string, any> = {
      organisation: new Types.ObjectId(query.organisation),
      deleted: {
        $ne: true,
      },
    };
    if (query.type) {
      $match.type = query.type;
    }

    const result = await this.contentModel.aggregate([
      { $match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          statusID: '$_id',
          count: 1,
        },
      },
    ]);

    const counts: Record<string, number> = {};
    let total = 0;
    //
    for (const r of result) {
      counts[ContentStatus[r.statusID]] = r.count;
    }

    ContentStatusValues.map((value: any) => {
      if (!counts[value]) {
        counts[value] = 0;
      }
      total = total + counts[value];
    });

    counts.total = total;

    return {
      ...res,
      counts,
    };
  }

  async createEvent(createEventDTO: Content) {
    try {
      const createdEvent = await this.contentModel.create(createEventDTO);

      if (!createEventDTO.needsRegistration) {
        return { createdEvent };
      }

      //filling default form fields in registration form
      await Promise.all(
        defaultFormFields.map(({ label, type, key }) =>
          this.formfieldsModel.create({
            event: createdEvent._id,
            organisation: createEventDTO.organisation,
            key: key,
            label: label,
            type: type,
            createdBy: createEventDTO.createdBy,
          }),
        ),
      );

      return {
        createdEvent,
        message: 'Default form fields created for reguistration',
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getEvent(id: string) {
    try {
      const event = await this.contentModel.findById(id);
      const formFields = (await this.formfieldsModel.find({
        event: event._id,
      })) as Formfields[];

      return { event, formFields };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async handleContentPublish(id: string) {
    try {
      const content = await this.contentModel.findById(id);
      if (!content) {
        throw new Error('Content not found');
      }
      content.status = ContentStatus.PUBLISHED;
      await content.save();

      const message = `Communication titled ${content.title} has been published: https://dev.skribe.app/communication/${id}`;

      const audM = (await this.audienceManagerService._get(
        String(content.audienceManager),
      )) as AudienceManager;

      const audience = JSON.parse(JSON.stringify(audM));

      // console.dir(audience);

      const response = await this.audienceManagerService.getUsersFromFilters(
        audience.filters,
        audience.organisation as unknown as string,
      );

      // console.log(response.users);

      for (const user of response.users) {
        const dmID = await this.googleChatService.findDMSpaceID_ByEmail(
          user.email,
        );
        console.log(dmID);
        if (dmID) await this.googleChatService.sendMessageToUser(dmID, message);
      }

      return {
        message: 'Conent Published and notifications sent',
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
