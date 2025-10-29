import { ModifyBodyFn } from '@nest-extended/core/common/decorators/ModifyBody.decorator';

export const SetOrganisation =
  (key = 'organisation'): ModifyBodyFn =>
  (request) => {
    request.body[key] = request.user?.organisation;
    return request;
  };

export const SetOrganisationQuery =
  (key = 'organisation'): ((request: Request) => Request) =>
  (request: Request) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    request.query[key] = request.user?.organisation;
    return request;
  };
