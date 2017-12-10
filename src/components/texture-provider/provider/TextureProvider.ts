import * as THREE from 'THREE';
import errorMessages from './providerErrorMessages';

let loadedUrlCache = {};
let loader:any = new THREE.TextureLoader();

class TextureProvider {

    /**
     * specifiec method to determine it´s an url
     * @param url
     * @returns {Promise<Texture>}
     */
    static loadByUrl(url: string): Promise<any> {
        if (!url) {
            return Promise.reject(errorMessages.URL_MISSING);
        }

        if (loadedUrlCache[url]) {
            return Promise.resolve(loadedUrlCache[url]);
        }

        return TextureProvider.load(url);
    }

    /**
     * general load method
     * @param loadingRequest
     * @returns {Promise<Texture>}
     */
    static load(loadingRequest) {
        let returnPromiseResolve = new Function();
        const returnPromise = new Promise((res) => {
            returnPromiseResolve = res;
        });

        loader.load(loadingRequest, (texture) => {
            this.addToCache(loadingRequest, texture);
            returnPromiseResolve(texture);
        });

        return returnPromise;
    }

    static addToCache(id: string, texture: THREE.Texture) {
        loadedUrlCache[id] = texture;
    }
}

export default TextureProvider;