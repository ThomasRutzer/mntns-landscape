import {expect} from 'chai';
import {spy, assert} from 'sinon';
import Mountain from './Mountain';

describe('Mountain', () => {
    describe('static method create()', () => {
        it('to return a new Mountain', () => {
            const mnt = Mountain.create(1, 1);
            expect(mnt.constructor.name).to.equal('Mountain');
        })
    });

    describe('constructor()', () => {
        it('calls method grow', () => {
            let mnt:Mountain;
            const growSpy = spy(Mountain.prototype, 'grow');

            mnt = new Mountain(1, 1);

            assert.called(growSpy);
        });
    });

    describe('method grow()', () => {
        it('returns promise', () => {
            let mnt:Mountain = new Mountain(1, 1);

            const returnValue = mnt.grow(false);
            expect(returnValue).to.have.property('then');
        });

        it('shrinks first, if necessary', () => {
            let mnt:Mountain = new Mountain(1, 1);
            const shrinkSpy = spy(Mountain.prototype, 'shrink');

            mnt = new Mountain(1, 1);

            assert.called(shrinkSpy);
        });

        it('updates internal state properly', () => {
            let mnt:Mountain = new Mountain(1, 1);

            mnt.grow(false);

            expect((<any>mnt).states.isShrunk).to.be.false;
        });

        it('updates vertices to same value as stored geometryData', () => {
            let mnt:Mountain = new Mountain(1, 1);

            mnt.grow(false);

            let geom: any = mnt.mesh.geometry;

            // use (<any> to access private member in tests
            // https://stackoverflow.com/questions/23435778/unit-test-private-method
            expect(geom.vertices[5].y).to.equal((<any>mnt).data.geometryData.vertices[5].y);
        });
    });

    describe('method shrink()', () => {
        it('returns promise', () => {
            let mnt:Mountain = new Mountain(1, 1);

            const returnValue = mnt.shrink(false);
            expect(returnValue).to.have.property('then');
        });

        it('updates internal state properly', () => {
            let mnt:Mountain = new Mountain(1, 1);

            mnt.shrink(false);

            expect((<any>mnt).states.isShrunk).to.be.true;
        });
    });
});