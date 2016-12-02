
import {DEFAULT_IMAGE_URL} from '../common/defaultHost';
export class UserList {
    id: number;
    userName: string;
    imageURL: string;

    constructor(id: number, userName: string, imageURL: string) {
        this.id = id;
        this.userName = userName;
        this.imageURL = imageURL;
    }

    static parse(object: Object): UserList {
        var id_value: number = object.hasOwnProperty("id") ? object["id"] : '';
        var u_value: string = object.hasOwnProperty("userName") ? object["userName"] : '';
        var img_value: string = object.hasOwnProperty("imagePath") ? object["imagePath"] : '';
        var userItem: UserList = new UserList(id_value, u_value, img_value);
        return userItem;
    }
}
