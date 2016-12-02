import { AssetType } from './assetType';
import { AssetItem } from './assetItem';
import { DefaultConstants } from './default_values';
import { DescriptionEntry } from './extendedDescriptionEntry';

export class FamilyItem extends AssetItem {

  constructor(name: string, description: string, imageUrl: string, descritonJson: string) {
    super(AssetType.Family, name, description, imageUrl, descritonJson);
  }
}