import TextureProvider from './TextureProvider';
import {expect, should} from 'chai';
import {stub, spy, assert} from 'sinon';
import * as THREE from 'THREE';

describe('TextureProvider', () => {

    describe('static method loadByUrl', () => {
        let loadMethodStub, loadMethodStubCallsCounter = 0;

        beforeEach(() => {
            let prototype: any = TextureProvider.prototype;

            loadMethodStub = stub(TextureProvider, 'load').callsFake(() => {
                loadMethodStubCallsCounter++;
                TextureProvider.addToCache('test', new THREE.Texture());
                return Promise.resolve({id: 'test'});
            });
        });

        /**
         * @idea: static method load should only be called once when
         * requested url is same
         */
        it('caches loading request', () => {
            let url = 'test';

            return TextureProvider.loadByUrl(url).then(() => {
                return TextureProvider.loadByUrl(url).then(() => {
                    expect(loadMethodStubCallsCounter).to.equal(1);
                })
            })
        })
    })
});