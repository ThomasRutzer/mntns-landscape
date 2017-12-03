import { inBetween } from './../math-utils';
import config from './MountainConfig';

class MountainDataModel {
    public thickness: number;
    public height: number;

    static create(w, h): MountainDataModel {
        return new MountainDataModel(w, h);
    }
    constructor(thickness = config.parameters.thickness.default,
                height = config.parameters.height.default ) {
        this.thickness = inBetween(thickness, config.parameters.thickness.min, config.parameters.thickness.max);
        this.height = inBetween(height, config.parameters.height.min, config.parameters.height.max);
    }
}

export default MountainDataModel;