import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frequencyTransform'
})
export class FrequencyTransformPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }
    let frequency = value.split('_');
    frequency = frequency.join(" ");
    return frequency;
  }

}
