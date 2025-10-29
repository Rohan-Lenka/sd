import {
  formfields_lables,
  formFieldTypes,
} from '../../content/constants/formFields.types';

export type formfield_UpdateDTO = {
  checkbox: {
    label: formfields_lables.CHECKBOX;
    options: string[];
  };
  dropdown: {
    label: formfields_lables.DROPDOWN;
    options: string[];
  };
  date: {
    label: formFieldTypes.DATE;
    type: formFieldTypes.DATE;
  };
};
