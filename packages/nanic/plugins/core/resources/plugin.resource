name: plugin
collection: plugins
description: A plugin.
extensible: true
fields:
  name:
    description: The name of the plugin (unique across the site)
  description:
    description: The description of the plugin
  version:
    description: The version of the plugin
  author:
    description: The author of the plugin
  license:
    description: The license of the plugin

  resources:
   type: list
  
  fields:
   type: list

  blocks:
   type: list
