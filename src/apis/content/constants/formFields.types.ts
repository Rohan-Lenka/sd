export enum formfields_lables {
  NAME = 'name',
  EMAIL = 'email',
  DESIGNATION = 'designation',
  ORGANISATION = 'orgnaisation',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  DATE = 'date',
}

export enum formFieldTypes {
  TEXT = 'text',
  EMAIL = 'email',
  NUMBER = 'number',
  DATE = 'date',
}

export const defaultFormFields = [
  { label: formfields_lables.NAME, type: formFieldTypes.TEXT, key: 'EF0' },
  { label: formfields_lables.EMAIL, type: formFieldTypes.EMAIL, key: 'EF1' },
  {
    label: formfields_lables.DESIGNATION,
    type: formFieldTypes.TEXT,
    key: 'EF2',
  },
  {
    label: formfields_lables.ORGANISATION,
    type: formFieldTypes.TEXT,
    key: 'EF3',
  },
];

export const formfields_lables_values = [
  formfields_lables.NAME,
  formfields_lables.EMAIL,
  formfields_lables.DESIGNATION,
  formfields_lables.ORGANISATION,
  formfields_lables.DROPDOWN,
  formfields_lables.CHECKBOX,
  formfields_lables.DATE,
];

export const formfieldTypesValues = [
  formFieldTypes.TEXT,
  formFieldTypes.EMAIL,
  formFieldTypes.NUMBER,
  formFieldTypes.DATE,
];
