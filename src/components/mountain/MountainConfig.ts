const config = {
    parameters: {
        height: {
            min: 10,
            max: 100,
            default: 50
        },

        thickness: {
            min: 5,
            max: 20,
            default: 10
        },

        verticalSegments: {
            min: 2,
            max: 10,
            default: 10
        },

        radiusSegments: {
            min: 2,
            max: 10,
            default: 8
        },

        shapeAngleStart: {
            min: 0,
            max: 1,
            default: 0.9
        },

        shapeAmplitude: {
            min: 0,
            max: 180,
            default: 45
        }
    },

    appearance: {
        color: '#212121'
    }
};

export default config;
