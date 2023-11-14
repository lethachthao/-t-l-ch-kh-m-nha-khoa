import { Router } from 'express';
import { getSearch } from './search.controller';

const searchRoute = Router();

searchRoute.get('/', getSearch);

export { searchRoute };
