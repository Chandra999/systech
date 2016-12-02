export class EnumUtil {
    static getNames(e: any) {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    static getValues(e: any, key: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getValue(e: any, key: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getEnumAsString(enumObject: any, key: any): string {
        return enumObject[enumObject[key]];
    }

    static getEnumForString(enumObject: any, value: any) {
        return enumObject[<string>value];
    }
}
