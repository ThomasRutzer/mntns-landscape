import {expect} from 'chai';
import Factory from './CameraFactory';
import Types from './CameraFactoryTypes';

describe('CameraFactory', () => {
    it('creates ThreeJS Camera even with unmatching argument "type"', () => {
        let factory = new Factory('test', 1, 1, 1, 1);

        expect(factory.cameraElement.type).to.equal('Camera');
    });

    it('creates ThreeJS Camera even with unmatching argument "type"', () => {
        let factory = new Factory(Types.PERSPECTIVE, 1, 1, 1, 1);

        expect(factory.cameraElement.type).to.equal('PerspectiveCamera');
    });
});