import { ApiBuilder } from '../../api'
import { Pet, PetList } from './schemas'

const param = () => {}
const get = () => {}

class PetStoreController {
  getPetById() {}
}

const api = new ApiBuilder()
  .mount('/', new PetStoreController())
  .listen(1556)
  .then(() => console.log('Listening on port 1556'))
