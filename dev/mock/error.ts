export class Error {
    constructor(public key?: string, public message?: string) {
        if (!key && !message) {
            this.key = 'default';
            this.message = 'Something went wrong';
        }
    }
}