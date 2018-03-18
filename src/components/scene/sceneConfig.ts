export default {
    fog: {
        color: 0x020202,
        density: 0.003
    },

    renderer: 'webGL',

    particles: true,
    particlesOptions: {
        count: 256,
        color: '#B2BEB5'
    },

    reactToMouseMove: true,
    reactToMouseMoveOptions: {

        /**
         * defines ( in percentage ) the size of each side (
         * ( top / bottom, right / left)
         * of viewport, which triggers camera movement
         * @type Number
         */
        reactiveArea: 25,

        zoomThreshold: 50
    },
    observeIntsections: true,
}