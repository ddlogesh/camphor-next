import moment from 'moment';
import {faker} from '@faker-js/faker';
import {ImportConfig, ImportField, ImportFieldOptions} from "@/src/types/import-config";

const generateFieldValue = (field: ImportField, options: ImportFieldOptions) => {
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

    case 'object':
      const nested: Record<string, unknown> = {};

      for (const nestedField of fields || []) {
        nested[nestedField.id] = generateFieldValue(nestedField, options);
      }

      return nested;

    default:
      return null;
  }
}

const fetchSampleData = (importConfig: ImportConfig, options: ImportFieldOptions = {}) => {
  const data: Record<string, unknown>[] = [];

  for (let i = 0; i < 5; i++) {
    const row: Record<string, unknown> = {};

    for (const field of importConfig.fields || []) {
      if (field.multi) {
        row[field.id] = Array.from({ length: 3 }).map(() => {
          return generateFieldValue(field, options);
        });
      } else {
        row[field.id] = generateFieldValue(field, options);
      }

      if (options.serializeObject && (field.multi || field.type === 'object')) {
        row[field.id] = JSON.stringify(row[field.id]);
      }
    }
    data.push(row);
  }

  return data;
}

export {
  fetchSampleData,
}
