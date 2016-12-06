
import { Error } from './error';

export class Config {
    constructor(public customError: boolean, public errors: Error) { }
}