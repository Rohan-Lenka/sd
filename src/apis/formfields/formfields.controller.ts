import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FormfieldsService } from './formfields.service';
import { User } from '@nest-extended/core/common/decorators/User.decorator';
import { Formfields } from 'src/schemas/formfields.schema';
import {
  ModifyBody,
  setCreatedBy,
} from '@nest-extended/core/common/decorators/ModifyBody.decorator';
// import { formfield_UpdateDTO } from './dto/formfield.dto';
import {
  SetOrganisation,
  SetOrganisationQuery,
} from 'src/decorators/SetOrganisation';
import { ModifyQuery } from '@nest-extended/core/common/decorators/ModifyQuery.decorator';
// import { identity } from 'rxjs';

@Controller('formfields')
export class FormfieldsController {
  constructor(private readonly formfieldsService: FormfieldsService) {}

  //create form fields for an event
  @Post('/:id')
  async patchEvent(
    @ModifyBody([setCreatedBy(), SetOrganisation()])
    updateFormFieldsDTO: Partial<Formfields> & {
      createdBy: string;
      organisation: string;
    },
    @Param('id') id: string,
  ) {
    return await this.formfieldsService.appendFormFields(
      updateFormFieldsDTO,
      id,
    );
  }

  //get form fields for an event
  @Get('/:id')
  async get(
    @ModifyQuery(SetOrganisationQuery()) query: Record<string, any>,
    @Param('id') id: string,
  ) {
    //return await this.formfieldsService.getFormFieldsByEventID(id)

    query['event'] = id;
    return await this.formfieldsService._find(query);
  }

  @Patch('/:id')
  async updateFormField(
    @Body() updateFormFieldDTO: Partial<Formfields>,
    @Param('id') id: string,
  ) {
    return await this.formfieldsService._patch(id, updateFormFieldDTO);
  }

  //delete a form field
  @Delete('/:id?')
  async delete(@Param('id') id, @Query() query, @User() user) {
    return await this.formfieldsService._remove(id, query, user);
  }
}
