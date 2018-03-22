export default {
    /**
     * scene fog settings
     */
    fog: {
        color: 0x020202,
        density: 0.003
    },

    renderer: 'webGL',

    particles: true,
    particlesOptions: {
        /**
         * amount of particles
         * @type Number
         */
        count: 256,

        /**
         * each particles color
         * @type: String
         */
        color: '#B2BEB5'
    },

    reactToMouseMove: true,
    reactToMouseMoveOptions: {

        /**
         * defines ( in percentage ) the size of each side (
         * ( top / bottom, right / left)
         * of viewport, which triggers camera movement
         * @type number
         */
        reactiveArea: 25,

        /**
         * defines (in px) min or max zoom of camera,
         * taking initial position in account
         * @type: number
         */
        zoomThreshold: 100
    },

    observeIntsections: true,
};