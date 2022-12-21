name: endpoint
collection: endpoints
description: A HTTP endpoint.
fields:
  method:
    description: The method of the api endpoint.
    type: choice
    default: get
    options:
      - get
      - post
      - put
      - delete
  path:
    description: The path of the api endpoint.
  scriptText:
    description: The script that will be executed when the endpoint is called.
    type: codeblock
  script:
    description: The path to the script that will be executed when the endpoint is called.
    type: resource
