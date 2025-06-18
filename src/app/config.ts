const appConfig = {
  FILE_EXTENSIONS: ['csv', 'xls', 'xlsx'],
  MAX_FILE_SIZE_MB: 2,
  imports: [
    {
      id: 'employees',
      label: 'Employees',
      fields: [
        {
          id: 'id',
          label: 'Employee ID',
          type: 'number',
          required: true,
          unique: true,
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'string',
          format: 'email',
          required: true,
        },
        {
          id: 'phone',
          label: 'Phone Number',
          type: 'string',
          format: 'phone',
          required: true,
        },
        {
          id: 'mobile',
          label: 'Mobile Number',
          type: 'string',
          format: 'number',
          length: 10,
          required: true,
        },
        {
          id: 'first_name',
          label: 'First Name',
          type: 'string',
          format: 'firstname',
        },
        {
          id: 'last_name',
          label: 'Last Name',
          type: 'string',
          format: 'lastname',
        },
        {
          id: 'full_name',
          label: 'Full Name',
          type: 'string',
          format: 'fullname',
        },
        {
          id: 'address',
          label: 'Address',
          type: 'long_text',
        },
        {
          id: 'city',
          label: 'City',
          type: 'string',
          format: 'city',
        },
        {
          id: 'state',
          label: 'State',
          type: 'string',
          format: 'state',
        },
        {
          id: 'country',
          label: 'Country',
          type: 'string',
          format: 'country',
          length: 2,
        },
        {
          id: 'zipcode',
          label: 'Zip Code',
          type: 'string',
          format: 'number',
          length: 6,
        },
        {
          id: 'joining_date',
          label: 'Joining Date',
          type: 'date',
          format: 'DD-MM-YYYY',
        },
        {
          id: 'joining_time',
          label: 'Joining Date',
          type: 'time',
          format: 'hh:mm:ss a',
        },
        {
          id: 'updated_at',
          label: 'Last Updated',
          type: 'datetime',
          format: 'DD-MM-YYYY HH:mm:ss',
        },
        {
          id: 'price',
          label: 'Price',
          type: 'float',
          fixed: 2,
        },
        {
          id: 'gender',
          label: 'Gender',
          type: 'string',
          format: 'gender',
        },
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          min: 1,
          max: 100,
          required: true,
        },
        {
          id: 'active',
          label: 'Active',
          type: 'bool',
        },
        {
          id: 'color',
          label: 'Color',
          type: 'string',
          format: 'color',
        },
        {
          id: 'level',
          label: 'Experience level',
          type: 'select',
          enum: [
            {
              id: 'junior',
              label: 'Junior',
            },
            {
              id: 'associate',
              label: 'Associate',
            },
            {
              id: 'senior',
              label: 'Senior',
            },
            {
              id: 'lead',
              label: 'Lead',
            },
            {
              id: 'manager',
              label: 'Manager',
            }
          ]
        },
        {
          id: 'skills',
          label: 'Skills',
          type: 'array',
          fields: [
            {
              id: 'skill',
              label: 'Skill',
              type: 'string',
            },
            {
              id: 'experience',
              label: 'Experience',
              type: 'number',
              min: 1,
              max: 10,
            }
          ]
        },
        {
          id: 'links',
          label: 'Links',
          type: 'object',
          fields: [
            {
              id: 'website',
              label: 'Website',
              type: 'string',
              format: 'url',
            },
            {
              id: 'github',
              label: 'Github',
              type: 'string',
              format: 'url',
            },
          ]
        },
      ]
    }
  ]
}

export default appConfig;
