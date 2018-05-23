export default {
    // random z-shifting range
    shiftX: [1, 400],

    layout: {
        position: {
            x: {
                min: -50,
                max: 50
            },

            y: {
                min: 0,
                max: 0
            },

            z: {
                min: -50,
                max: 50
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
        randomShift: 10,
    },

    shadowLight: {
        position: {
            x: -100,
            y: 120,
            z: 100
        },
        type: 'directional',
        color: '#fff',
        density: 0.6
    },

    globalLight: {
        type: 'global',
        secondaryColor: '#fff',
        primaryColor: '#fff',
        density: 0.9
    }
};