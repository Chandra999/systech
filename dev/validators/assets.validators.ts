import {Observable} from 'rxjs/Rx';

export function notEmptyValidator(control) {
    if (control.value == null || control.value.length === 0) {
        return {
            notEmpty: true
        }
    }
    return null;
}

export function createUniqueNameValidator(component) {
    return function(control) {
        return new Promise((resolve, reject) => {
            console.log("enter unique");
            setTimeout(function(){
                if(control.value == "test"){
                     resolve({uniqueName: true});
                }else{
                     resolve(null);    
                }
                
            }, 1000);
            console.log("after unique");
            
        });
    };
}



 