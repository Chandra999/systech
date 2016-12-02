export class Message {
  public key: string = "";
  public src: string = "";
  constructor(public type: string, public message: string, public action: string, public suggestion: string, public prefix:string) { }
}