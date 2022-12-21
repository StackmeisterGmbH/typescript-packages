name: block
collection: blocks
description: A block that can be placed in a page.
fields:
  name:
    description: The name of the block (unique across the site)
  description:
    description: The description of the block
  fields:
    type: structure
    description: The fields of the block
    of:
      type: field
