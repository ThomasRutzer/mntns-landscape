import chai, { expect } from 'chai';
import {stub} from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import CameraManager from './CameraManager';
import CameraFactoryTypes from './../factory/CameraFactoryTypes';

chai.use(chaiAsPromised);

describe('CameraManager', () => {
    let manager, windowStubWidth, windowStubHeight;

    before(() => {
        windowStubWidth = stub(window, 'innerWidth').value(1000);
        windowStubHeight = stub(window, 'innerHeight').value(800);

        manager = new CameraManager(
            {
                type: CameraFactoryTypes.PERSPECTIVE,
                nearPlane: 1,
                farPlane: 1,
                aspectRatio: 1,
                fieldOfView: 1,
            },
            {
                x: 50,
                y: 50,
                z: 50
            },
            {
                x: 0,
                y: 0,
                z: 0
            }
        );
    });

    after(() => {
        windowStubWidth.restore();
        windowStubHeight.restore();
    });

    it('holds an instance of requested type of CameraFactory element after construction', () => {
        expect(<any>manager.camera.type).to.equal('PerspectiveCamera');
    });

    it('can set Camera back to initial position', async () => {
        await manager.setPosition({x: 1, y: 1, z: 1}, null, false);
        await manager.setToStart();

        expect(<any>manager.camera.position.x).to.equal(50);
        expect(<any>manager.camera.position.y).to.equal(50);
        expect(<any>manager.camera.position.z).to.equal(50);
    });

    it('returns a Promise, when set back to initial position', async () => {
        return expect(manager.setToStart()).to.eventually.be.fulfilled;
    });

    it('can set Camera to any requested position', () => {
        manager.setPosition({x: 1, y: 1, z: 1}, null, false);
        expect(<any>manager.camera.position.x).to.equal(1);
        expect(<any>manager.camera.position.y).to.equal(1);
        expect(<any>manager.camera.position.z).to.equal(1);
    });

    it('returns a Promise, when set to any position', async () => {
        return expect(manager.setPosition({x: 1, y: 1, z: 1}, null, false)).to.eventually.be.fulfilled;
    });

    it('returns a Promise which fullfils with undefined value, when set to any position', async () => {
        const resolve = await manager.setPosition({x: 1, y: 1, z: 1}, null, false);
        expect(resolve).to.equal(undefined);
    });

    it('refreshes camera aspect on window resize, when camera type is "THREE.Perspective"', () => {
        <any>manager.handleResize();
        expect(<any>manager.camera.aspect).to.equal(1.25);
    });
});