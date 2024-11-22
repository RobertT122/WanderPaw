export const spriteAtlas = {
    sheep: {
        idle: {
            pattern: [0, 1, 0, 2], // order to play frames
            timing: [2000, 300, 100, 300], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [0, 16, 32], //face-side
            downLeft: [1, 17, 33],
            left: [2, 18, 34],
            upLeft: [3, 19, 35],
            up: [4, 20, 36], //back-side
        },
        waddle: {
            pattern: [1, 0, 1, 2], // order to play frames
            timing: [300, 100, 300, 100], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [48, 64, 80], //face-side
            downLeft: [49, 65, 81],
            left: [50, 66, 82],
            upLeft: [51, 67, 83],
            up: [52, 68, 84], //back-side
        },
        graze: {
            pattern: [0, 1], // order to play frames
            timing: [300, 300], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [96, 112], //face-side
            downLeft: [97, 113],
            left: [98, 114],
            upLeft: [99, 115],
            up: [100, 116], //back-side
        },
        prance: {
            pattern: [0, 1, 2], // order to play frames
            timing: [200, 300, 100], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [128, 144, 160], //face-side
            downLeft: [129, 145, 161],
            left: [130, 146, 162],
            upLeft: [131, 147, 163],
            up: [132, 148, 164], //back-side
        },
        sleep: {
            pattern: [0, 1], // order to play frames
            timing: [700, 1200], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [176, 192], //face-side
            downLeft: [177, 193],
            left: [178, 194],
            upLeft: [179, 195],
            up: [180, 196], //back-side
        },
    },
    dog: {
        idle: {
            pattern: [0, 1], // order to play frames
            timing: [500, 200], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [5, 21], //face-side
            downLeft: [6, 22],
            left: [7, 23],
            upLeft: [8, 24],
            up: [9, 25], //back-side
        },
        run: {
            pattern: [0, 1, 2], // order to play frames
            timing: [200, 100, 200], // in milliseconds when animation speed = 1
            /////////////////////////////////////////////////////////
            down: [37, 53, 69], //face-side
            downLeft: [38, 54, 70],
            left: [39, 55, 71],
            upLeft: [40, 56, 72],
            up: [41, 57, 73], //back-side
        },
    },
};
