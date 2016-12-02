import { User } from './User';
import { Preference } from './Preference';

export class DisplayPreference {
    location: string = 'Upper Right';
    numOfCards: number;
    maxMessages: number;
    actionsLayout: string;
    enableMessages: boolean;
    enableAnimation: boolean;
    enablePrefix: boolean;
    prefereceNames: string[] = ["MessageBarLocation", "MessageBeforeScroll", "EnableHiddenMessages", "CardsPerPage", "DisableAnimation", "DefaultLayout", "EnablePrefix"];
    preferenceList: Preference[] = [];
    currentUser: User;

    constructor(currentUser: User) {
        this.currentUser = currentUser;
        if (currentUser != null) {
            for (var i = 0; i < this.prefereceNames.length; i++) {
                this.preferenceList = currentUser.preferenceList;
                this.location = currentUser.getPreferenceValue("MessageBarLocation");
                this.numOfCards = +currentUser.getPreferenceValue("CardsPerPage");
                this.maxMessages = 5;
                this.actionsLayout = currentUser.getPreferenceValue("DefaultLayout");
                this.enableMessages = currentUser.getPreferenceValue("EnableHiddenMessages") == 'True';
                this.enableAnimation = currentUser.getPreferenceValue("DisableAnimation") == 'False';
                this.enablePrefix = currentUser.getPreferenceValue("EnablePrefix") == 'True';
            }

        } else {
            if (sessionStorage.getItem('preferences') != "" || sessionStorage.getItem('preferences') != null) {
                var pref = sessionStorage.getItem('preferences');
                this.location = (JSON.parse(pref))[0].value;
                this.maxMessages = (JSON.parse(pref))[1].value;
                this.enableMessages = (JSON.parse(pref))[2].value;
                this.numOfCards = (JSON.parse(pref))[3].value;
                this.actionsLayout = (JSON.parse(pref))[5].value;
                this.enablePrefix = (JSON.parse(pref))[6].value;
            }
        }

        // this.updateLocalPreference();
    }

    updatePreferenceJSONObject() {
        if (this.currentUser != null) {
            for (var i = 0; i < this.preferenceList.length; i++) {
                let p: Preference = this.preferenceList[i];
                if (p != null) {
                    switch (p.name) {
                        case 'MessageBarLocation':
                            p.value = this.location;
                            break;
                        case 'MessageBeforeScroll':
                            p.value = String(this.maxMessages);
                            break;
                        case 'EnableHiddenMessages':
                            p.value = this.enableMessages ? 'True' : 'False';
                            break;
                        case 'CardsPerPage':
                            p.value = String(this.numOfCards);
                            break;
                        case 'DisableAnimation':
                            p.value = this.enableAnimation ? 'False' : 'True';
                            break;
                        case 'EnablePrefix':
                            p.value = this.enablePrefix ? 'True' : 'False';
                            break;
                        case 'DefaultLayout':
                            p.value = this.actionsLayout;
                    }
                }
            }
        }
    }
}