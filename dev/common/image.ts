export class UserImage {
  imageId: number;
  imageURL: string;
  imageJsonObject: any;
  constructor(imageId: number, imageURL: string) {
    this.imageId = imageId;
    this.imageURL = imageURL;
    this.imageJsonObject = {};

  }

}
