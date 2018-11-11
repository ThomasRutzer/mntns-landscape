const config = {
    parameters: {
        height: {
            min: 50,
            max: 100,
            default: 50
        },

        thickness: {
            min: 5,
            max: 40,
            default: 10
        },

        verticalSegments: {
            min: 4,
            max: 10,
            default: 10
        },

        radiusSegments: {
            min: 3,
            max: 5,
            default: 5
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
        color: '#2e2d2d',
        focusColor: '#6f1bc0'
    }
};

export default config;
