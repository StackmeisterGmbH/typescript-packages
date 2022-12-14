import { arrayOf, number, objectOf, string } from '@stackmeister/json-schema'
import {
  addParameter,
  addResponse,
  addSchema,
  schemaRef,
  withParameterRef,
  withResponseRef,
} from '../../factories/components'
import { document } from '../../factories/documents'
import { withSchema } from '../../factories/generic'
import { contact, license, title, version } from '../../factories/infos'
import {
  get,
  json,
  onInternalServerError,
  onOk,
  post,
  queryParameter,
  response,
  withParameter,
} from '../../factories/operations'

const spec = document(
  title('Petstore API'),
  version('1.0.0'),
  license('MIT'),
  contact('Torben Köhn', 't.koehn@outlook.com', 'https://stackmeister.com'),

  // Schemas
  addSchema('Pet')(() => objectOf({ id: number(), name: string() })),
  addSchema('PetInput')(() => objectOf({ name: string() })),
  addSchema('PetOutput')(() => objectOf({ id: number(), name: string() })),
  addSchema('PetList')(() => arrayOf(objectOf({ id: number(), name: string() }))),

  // Responses
  addResponse('PetListResponse')(
    response('A list of pets')(json(withSchema(schemaRef('PetList')))),
  ),

  // Parameters
  addParameter('QueryLimit')(
    queryParameter('limit', 'The amount of items to retrieve')(withSchema(number())),
  ),
  addParameter('QueryOffset')(
    queryParameter('offset', 'The offset to start the limit at')(withSchema(number())),
  ),

  // Operations
  get('/pets')(
    // Operation Parameters
    withParameter(withParameterRef('QueryLimit')),
    withParameter(withParameterRef('QueryOffset')),
    withParameter(
      queryParameter('ids', 'The ids of the pets to retrieve')(withSchema(arrayOf(number()))),
    ),

    // Operation Responses
    onOk(withResponseRef('PetListResponse')),
    onInternalServerError(),
  ),
  post('/pets')(),
  get('/pets/{id}')(),
)

export default spec
