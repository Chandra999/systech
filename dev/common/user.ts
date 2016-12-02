import {Preference} from './preference';
import {DisplayPreference} from './displayPreference';

export class User {
    username: string;
    password: string;
    preferenceList: Array<Preference> = [];
    roles: Array<String> = [];
    imagePath: string;
    currentRole: string;
    uniuid = '';
    displayPreference :DisplayPreference;

    constructor(username: string, password: string, roles: Array<string>, imagePath: string, currentRole: string) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.imagePath = imagePath;
        this.currentRole = currentRole;
    }

    setPreference(key: string, value: string) {
        let found: boolean = false;
        for (var i = 0; i < this.preferenceList.length; i++) {
            let p: Preference = this.preferenceList[i];
            if (p != null) {
                if (p.name == key) {
                    p.value = value;
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            this.preferenceList.push(new Preference(key, value));
        }

    }

    getPreferenceValue(key: string) {
        for (var i = 0; i < this.preferenceList.length; i++) {
            let p: Preference = this.preferenceList[i];
            if (p != null) {
                if (p.name == key) {
                    return p.value;
                }
            }
        }
        return null;
    }

    getPreference(key: string) :Preference {
        for (var i = 0; i < this.preferenceList.length; i++) {
            let p: Preference = this.preferenceList[i];
            if (p != null) {
                if (p.name == key) {
                    return p;
                }
            }
        }
        return null;
    }
}