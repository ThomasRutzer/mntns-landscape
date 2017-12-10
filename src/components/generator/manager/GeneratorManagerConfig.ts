export default {
    // marks where second mountain
    // shall be placed
    initialSide: 'left',

    // each offset will be substracted
    // by this amount to have visuell overlapping
    overlapping: 10,

    // random z-shifting range
    shiftX: [1, 10],

    textureUrl: 'assets/texture.jpg',

    floor: {
        color: '#00ffff'
    },

    shadowLight: {
        position: {
            x: 100,
            y: 150,
            z: 100
        },
        type: 'directional',
        color: '#fff',
        density: 0.5
    },

    globalLight: {
        type: 'global',
        secondaryColor: '#fff',
        primaryColor: '#fff',
        density: 0.8
    }
};