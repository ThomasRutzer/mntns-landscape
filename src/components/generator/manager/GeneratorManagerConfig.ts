export default {
    // marks where second mountain
    // shall be placed
    initialSide: 'left',

    // each offset will be substracted
    // by this amount to have visuell overlapping
    overlapping: 10,

    // random z-shifting range
    shiftX: [1, 400],

    textureUrl: 'assets/texture.jpg',

    floor: {
        color: '#353535',
        dimensions: {
            width: 3200,
            height: 3200,
            depth: 36
        }
    },

    shadowLight: {
        position: {
            x: -100,
            y: 120,
            z: 100
        },
        type: 'directional',
        color: '#fff',
        density: 0.3
    },

    globalLight: {
        type: 'global',
        secondaryColor: '#fff',
        primaryColor: '#fff',
        density: 0.8
    }
};