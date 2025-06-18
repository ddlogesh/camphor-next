import moment from 'moment';
import {faker} from '@faker-js/faker';

type ImportField = {
  id: string;
  type: string;
  format?: string;
  enum?: { id: string; label: string }[];
  required?: boolean;
  unique?: boolean;
  min?: number;
  max?: number;
  fixed?: number;
  length?: number;
  fields?: ImportField[];
};

const generateFieldValue = (field: ImportField): any => {
  const {
    type,
    format,
    enum: enumValues,
    min,
    max,
    fixed,
    length,
    fields,
  } = field;

  switch (type) {
    case 'number':
      return faker.number.int({ min: min ?? 0, max: max ?? 9999 });

    case 'float':
      return faker.number.float({ min: min ?? 0, max: max ?? 9999, fractionDigits: fixed ?? 2 });

    case 'string':
      switch (format) {
        case 'email':
          return faker.internet.email();
        case 'phone':
          return faker.phone.number({ style: 'national' });
        case 'url':
          return faker.internet.url();
        case 'gender':
          return faker.person.sex();
        case 'color':
          return faker.color.rgb();
        case 'alpha':
          return faker.string.alpha({ length: length ?? { min: min ?? 1, max: max ?? 10 } });
        case 'alphanumeric':
          return faker.string.alphanumeric({ length: length ?? { min: min ?? 1, max: max ?? 10 } });
        case 'uuid':
          return faker.string.uuid();
        case 'firstname':
          return faker.person.firstName();
        case 'lastname':
          return faker.person.lastName();
        case 'fullname':
          return faker.person.fullName();
        case 'city':
          return faker.location.city();
        case 'state':
          return faker.location.state();
        case 'country':
          return faker.location.countryCode(length === 3 ? 'alpha-3' : 'alpha-2');
        case 'slug':
          return faker.lorem.slug(3);
        case 'number':
          return faker.string.numeric({ length: length ?? { min: min ?? 1, max: max ?? 999999 } });
        default:
          return faker.word.words({ count: { min: 1, max: 2 } });
      }

    case 'long_text':
      return faker.lorem.paragraph(2);

    case 'date':
      return moment(faker.date.past()).format(format ?? 'DD-MM-YYYY');

    case 'time':
      return moment(faker.date.past()).format(format ?? 'HH:mm:ss');

    case 'datetime':
      return moment(faker.date.past()).format(format);

    case 'bool':
      return faker.datatype.boolean();

    case 'select':
      return faker.helpers.arrayElement(enumValues?.map((e) => e.id) || []);

    case 'array':
      return Array.from({ length: 3 }).map(() => {
        const row: any = {};

        for (const field of fields || []) {
          row[field.id] = generateFieldValue(field);
        }

        return row;
      });

    case 'object':
      const nested: any = {};

      for (const nestedField of fields || []) {
        nested[nestedField.id] = generateFieldValue(nestedField);
      }

      return nested;

    default:
      return null;
  }
}

const fetchSampleData = (importConfig: { id?: string; name?: string; fields: ImportField[]; }) => {
  const data: any[] = [];

  for (let i = 0; i < 5; i++) {
    const row: any = {};

    for (const field of importConfig.fields || []) {
      row[field.id] = generateFieldValue(field);
    }
    data.push(row);
  }

  return data;
}

export {
  fetchSampleData,
}