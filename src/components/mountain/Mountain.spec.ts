import {expect} from 'chai';
import {spy, assert} from 'sinon';
import Mountain from './Mountain';
import MountainDataModel from './MountainDataModel';
import config from './mountainConfig';
import eventBus from './../event-bus/event-bus';
import sceneEvents from './../scene/sceneEvents';

describe.only('Mountain', () => {
    describe('static method create()', () => {
        it('to return a new Mountain', () => {
            const mnt = new Mountain("id", 1, 1);
            expect(mnt.constructor.name).to.equal('Mountain');
        })
    });

    describe('constructor()', () => {
        it('calls method grow', () => {
            let mnt:Mountain;
            const growSpy = spy(Mountain.prototype, 'grow');

            mnt = new Mountain("id", 1, 1);

            assert.called(growSpy);
        });

        it('creates MountainDataModel from given arguments', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);;

            expect((<any>mnt).data.parameters.constructor.name).to.equal('MountainDataModel');
        });

        it('normalizes arguments based on config', () => {
            let mnt:Mountain = new Mountain("id", config.parameters.height.max + 10, config.parameters.thickness.max  + 10);

            expect((<any>mnt).data.parameters.thickness).to.equal(config.parameters.thickness.max);
            expect((<any>mnt).data.parameters.height).to.equal(config.parameters.height.max);
        });
    });

    describe('method grow()', () => {
        it('returns promise', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);

            const returnValue = mnt.grow(false);
            expect(returnValue).to.have.property('then');
        });

        it('shrinks first, if necessary', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);
            const shrinkSpy = spy(Mountain.prototype, 'shrink');

            mnt = new Mountain("id", 1, 1);

            assert.called(shrinkSpy);
        });

        it('updates internal state properly', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);

            mnt.grow(false);

            expect((<any>mnt).states.isShrunk).to.be.false;
        });

        it('updates vertices to same value as stored geometryData', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);

            mnt.grow(false);

            let geom: any = mnt.mesh.geometry;

            // use (<any> to access private member in tests
            // https://stackoverflow.com/questions/23435778/unit-test-private-method
            expect(geom.vertices[5].y).to.equal((<any>mnt).data.geometryData.vertices[5].y);
        });
    });

    describe('method shrink()', () => {
        it('returns promise', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);

            const returnValue = mnt.shrink(false);
            expect(returnValue).to.have.property('then');
        });

        it('updates internal state properly', () => {
            let mnt:Mountain = new Mountain("id", 1, 1);

            mnt.shrink(false);

            expect((<any>mnt).states.isShrunk).to.be.true;
        });
    });

    describe('method onIntersection()', () => {
        it('starts a tween when id matches', () => {
            let mnt: Mountain = new Mountain("id", 1, 1);
            eventBus.$emit(sceneEvents.INTERSECTION, { id: 'id' });

            expect((<any>mnt).materialTween).not.to.be.undefined;
        });
    })
});
