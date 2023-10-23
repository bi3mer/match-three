export const SCREEN_HEIGHT = 880;
export const SCREEN_WIDTH = 640;

export const BOARD_WIDTH: bigint = BigInt(6);
export const BOARD_HEIGHT: bigint = BigInt(7);
export const BOARD_SIZE: bigint = BOARD_WIDTH * BOARD_HEIGHT;

export const IMAGE_WIDTH = SCREEN_WIDTH / Number(BOARD_WIDTH);
export const IMAGE_HEIGHT = IMAGE_WIDTH;

export const STATE_PLAYER = 0;
export const STATE_MOUSE_MOVEMENT = 1;
export const STATE_ANIMATION = 2;
export const STATE_CHECK_BOARD = 4;
export const STATE_TIME_OUT = 5;

export const MATCH_TYPES = 7;
