export default {
    // random z-shifting range
    shiftX: [1, 400],

    layout: {
        position: {
            x: {
                min: -100,
                max: 100
            },

            y: {
                min: -30,
                max: -30
            },

            z: {
                min: -100,
                max: 100
            }
        }
    },

    floor: {
        color: '#2e2d2d',
        dimensions: {
            width: 3200,
            height: 3200,
            depth: 36
        },

        // value for random heights
        randomShift: 20,
    },

    shadowLight: {
        position: {
            x: -100,
            y: 120,
            z: 100
        },
        type: 'directional',
        color: '#f8f8f8',
        density: 0.6
    },

    globalLight: {
        type: 'global',
        secondaryColor: '#f8f8f8',
        primaryColor: '#f8f8f8',
        density: 0.9
    }
};
