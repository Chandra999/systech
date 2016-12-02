import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs } from "@angular/http";
import { DEFAULT_OPERATOR_INTEGRATION_PREVIEW } from '../common/defaultHost';
import { UsersService } from './User.service';
import 'rxjs/Rx';


@Injectable()
export class OperatorIntegraionService {
    previewResoruce: string;


    constructor(private _http: Http, private userSvc: UsersService) {
        console.log("DataService");
        this.previewResoruce = DEFAULT_OPERATOR_INTEGRATION_PREVIEW;
    }

    postPreview(data: any) {
        const body = JSON.stringify(data);
        const headers = this.createAuthorizationHeader();
        headers.append("Content-Type", 'application/json');
        return this._http.post(this.previewResoruce, body, { headers: headers })
            .map(response => response.json());
    }

    createAuthorizationHeader() {
        const headers = new Headers();
        return headers;
    }

}
