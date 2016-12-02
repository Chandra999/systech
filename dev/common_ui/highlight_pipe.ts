import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'highlight'
})

export class HighlightPipe {
  transform(text: string, args: string): any {
    var filter: string = args;
    if (filter) {
      text = text.replace(new RegExp('(' + filter + ')', 'gi'), '<span class="highlightText">$1</span>');
    }
    return text;
  }
}