import * as ol from 'openlayers';
import { Md5 } from 'ts-md5/dist/md5';

import { uuid } from '../../../utils';
import { DataSource } from './datasource';
import { FeatureDataSourceOptions } from './feature-datasource.interface';


export class FeatureDataSource extends DataSource {

  public options: FeatureDataSourceOptions;
  public ol: ol.source.Vector;

  protected createOlSource(): ol.source.Vector {
    const sourceOptions = {
      format: this.getSourceFormatFromOptions(this.options)
    };

    return new ol.source.Vector(Object.assign(sourceOptions, this.options));
  }

  protected generateId() {
    if (!this.options.url) {
      return uuid();
    }
    const chain = 'feature' + this.options.url;
    return Md5.hashStr(chain) as string;
  }

  private getSourceFormatFromOptions(options: FeatureDataSourceOptions) {
    let olFormatCls;
    const formatType = options.formatType;
    if (!formatType) {
      olFormatCls = ol.format.GeoJSON;
    } else {
      olFormatCls = ol.format[formatType];
      if (olFormatCls === undefined) {
        throw new Error('Invalid vector source format ${formatType}.');
      }
    }

    const formatOptions = options.formatOptions;
    let format;
    if (formatOptions) {
      format = new olFormatCls(formatOptions);
    } else {
      format = new olFormatCls();
    }

    return format;
  }

}
