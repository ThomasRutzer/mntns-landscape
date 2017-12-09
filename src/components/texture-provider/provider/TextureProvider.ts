import * as THREE from 'THREE';
import errorMessages from './providerErrorMessages';

let loadedUrlCache = {};
let loader:any = new THREE.TextureLoader();

class TextureProvider {

    static loadByUrl(url: string): Promise<any> {
        if (!url) {
            return Promise.reject(errorMessages.URL_MISSING);
        }

        if (loadedUrlCache[url]) {
            return Promise.resolve(loadedUrlCache[url]);
        }

        return load(url);
    }
}

function load(url) {
    let returnPromiseResolve = new Function();
    const returnPromise = new Promise((res) => {
        returnPromiseResolve = res;
    });

    loader.load(url, (texture) => {
        loadedUrlCache[url] = texture;
        returnPromiseResolve(texture);
    });

    return returnPromise;
}

export default TextureProvider;