name: resource
collection: resources
description: The very basic building block of a site.
early: true
fields:
  name:
    description: The name of the resource, also it's file suffix. Unique across the site.
  description:
    description: The description of the resource
  collection:
    description: The name of the collection of resources of this type, mostly just the pural of the name.
  loader:
    description: The loader that will be used to load the resource
    type: text
    default: yaml
  fields:
    description: The fields of the resource
    type: structure
    of:
      type: field
