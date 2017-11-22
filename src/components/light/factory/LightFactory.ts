import DirectionalLight from './../DirectionalLight';
import GlobalLight from './../GlobalLight';

class LightFactory {
    static create(type, ...args) {
        let light = null;

        switch (type) {
            case 'global':
                light = GlobalLight.create(args[0], args[1], args[2]);
                break;
            case 'directional':
                light = DirectionalLight.create(args[0], args[1], args[2]);
                break;
        }

        return light;
    }
}

export default LightFactory;