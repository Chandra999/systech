export class DefaultConstants {
    public static get DEFAULT_IMAGE_FOLDER_PATH(): string { return 'public/img/'; }
    public static get DEFAULT_BASEURL(): string { return 'http://localhost:8080/images/public/uniSecure/'; }
}

export const ALLOWED_MIME_TYPES: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
];

export const DEFAULT_PASSWORD: string = '$1#2Aeiou@21';