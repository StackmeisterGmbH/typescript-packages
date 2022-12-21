name: field
collection: fields
description: A field that specifies the structure of resources.
fields:
  name:
    description: The name of the field (unique across the site)
  description:
    description: The description of the field
  fields:
    type: structure
    description: The fields of the field
    of:
      type: field
