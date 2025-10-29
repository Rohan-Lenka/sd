import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestService } from '@nest-extended/core/lib/nest.service';
import { Formfields, FormfieldsDocument } from 'src/schemas/formfields.schema';
// import { formfield_UpdateDTO } from './dto/formfield.dto';

@Injectable()
export class FormfieldsService extends NestService<
  Formfields,
  FormfieldsDocument
> {
  constructor(
    @InjectModel(Formfields.name)
    private readonly formfieldsModel: Model<Formfields>,
  ) {
    super(formfieldsModel);
  }

  // async getFormFieldsByEventID(eventid: string) {
  //   const formFields: Formfields[] = await this.formfieldsModel.find({
  //     event: eventid,
  //   });
  //
  //   return formFields;
  // }

  async getNextKey(eventId) {
    const formfields = await this.formfieldsModel.find({
      event: eventId,
    });

    // const newKeys = [];
    const lastKeyID = formfields.length;

    return `EF${lastKeyID}`;

    // for (let i = 0; i < offset; i++) {
    //   newKeys.push(`EF${lastKeyID + i}`);
    // }
    //
    // return newKeys;
  }

  async appendFormFields(
    updateFormFieldsDTO: Partial<Formfields> & {
      createdBy: string;
      organisation: string;
    },
    eventid: string,
  ) {
    const key = await this.getNextKey(eventid);

    return await this.formfieldsModel.create({
      ...updateFormFieldsDTO,
      event: eventid,
      key,
    });
    //console.log(Object.keys(updateFormFieldsDTO).length - 2)
    // const createdBy = updateFormFieldsDTO.createdBy;
    // const organisation = updateFormFieldsDTO.organisation;

    // const _updateFormFieldsDTO = Object.fromEntries(
    //   Object.entries(updateFormFieldsDTO).filter(
    //     ([key, _]) => key !== 'organisation' && key !== 'createdBy',
    //   ),
    // );

    // try {
    //   await Promise.all(
    //     Object.keys(_updateFormFieldsDTO).map(
    //       (key: keyof formfield_UpdateDTO, index) => {
    //         const value = _updateFormFieldsDTO[key];
    //         const type =
    //           typeof value === 'object' && value !== null && 'type' in value
    //             ? (value as any).type
    //             : null;
    //         const options =
    //           typeof value === 'object' && value !== null && 'options' in value
    //             ? (value as any).options
    //             : null;
    //
    //         return this.formfieldsModel.create({
    //           event: eventid,
    //           organisation: organisation,
    //           key: keys[index],
    //           label: (updateFormFieldsDTO[key] as any).label,
    //           type: type,
    //           options: options,
    //           createdBy: createdBy,
    //         });
    //       },
    //     ),
    //   );
    //
    //   //return {keys}
    //   return { message: 'form fields created' };
    // } catch (error) {
    //   console.log(error);
    //   throw new Error(error.message);
    // }
  }
}
