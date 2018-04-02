import {expect} from 'chai';
import Factory from './CameraFactory';
import Types from './CameraFactoryTypes';

describe('CameraFactory', () => {
    it('creates ThreeJS.Camera object, no matter if argument "type" is matching', () => {
        let factory = Factory.create('test', 1, 1, 1, 1);

        expect(factory.cameraElement.type).to.equal('Camera');
    });

    it('creates ThreeJS.PerspectiveCamera, when "type" matches "PERSPECTIVE"', () => {
        let factory = Factory.create(Types.PERSPECTIVE, 1, 1, 1, 1);

        expect(factory.cameraElement.type).to.equal('PerspectiveCamera');
    });
});