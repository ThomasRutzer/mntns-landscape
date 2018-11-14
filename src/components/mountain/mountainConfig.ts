const config = {
    parameters: {
        height: {
            min: 1,
            max: 120,
            default: 50
        },

        thickness: {
            min: 1,
            max: 2,
            default: 2
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
        focusColor: '#3F3E3E'
    }
};

export default config;
