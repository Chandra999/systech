import { Injectable, Pipe } from '@angular/core';

@Pipe({
    name: 'filterBy',
    pure: false
})

export class FilterPipe {

    transform(allUsers: any[], args: any, filterCriteria): any {
        if (args != null && args != undefined) {
            switch (filterCriteria) {
                case 'Username':
                    return allUsers.filter(allUsers => (allUsers.userName == null ? false : allUsers.userName.toLowerCase().indexOf(args.toLowerCase()) !== -1));
                case 'First Name':
                    return allUsers.filter(allUsers => (allUsers.firstName == null ? false : allUsers.firstName.toLowerCase().indexOf(args.toLowerCase()) !== -1));
                case 'Last Name':
                    return allUsers.filter(allUsers => (allUsers.lastName == null ? false : allUsers.lastName.toLowerCase().indexOf(args.toLowerCase()) !== -1));
            }
        }
        else {
            return allUsers;
        }
    }
}