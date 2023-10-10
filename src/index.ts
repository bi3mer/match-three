import { Assets } from "./assets";
import { Game } from "./game";


Assets.init();
const game = new Game();
const loop = () => {
    game.update();
    game.render();
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);