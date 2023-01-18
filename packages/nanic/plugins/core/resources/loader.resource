name: loader
collection: loaders
description: A core mechanism for loading resources.
early: true
fields:
  name:
    description: The name of the loader
  description:
    description: The description of the loader
  scriptType:
    description: The resource type of the script.
    type: choice
    default: js
    options:
      - js
  script:
    description: The path to the script that will be executed when loader is triggered.
    type: resource
