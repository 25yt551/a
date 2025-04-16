import Player from './Player';
import { GameObject } from './utils';
import { ResourceLoader } from './utils/ResourceLoader';

export default class Game {
  width: number;
  height: number;
  DEBUG = true;

  map = {
    width: 3000,
    height: 3000,
  };

  player: Player;
  object: GameObject;
  resourceLoader: ResourceLoader;
  isResourcesLoaded: boolean = false;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.resourceLoader = ResourceLoader.getInstance();
    this.loadResources();

    this.player = new Player(this);
    this.object = new GameObject(this);
  }

  async loadResources() {
    try {
      // Load wormate.io resources
      await this.resourceLoader.loadImage('skins/default/head.png', 'wormHead');
      await this.resourceLoader.loadImage('skins/default/body.png', 'wormBody');
      await this.resourceLoader.loadImage('food/apple.png', 'foodApple');
      await this.resourceLoader.loadImage('food/banana.png', 'foodBanana');
      await this.resourceLoader.loadImage('food/orange.png', 'foodOrange');
      
      // Load sounds
      await this.resourceLoader.loadSound('sounds/eat.mp3', 'eatSound');
      await this.resourceLoader.loadSound('sounds/grow.mp3', 'growSound');
      await this.resourceLoader.loadSound('sounds/gameover.mp3', 'gameOverSound');
      
      this.isResourcesLoaded = true;
      console.log('All resources loaded successfully');
    } catch (error) {
      console.error('Failed to load resources:', error);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    // draw game objects here
    // Object :
    this.object.draw(ctx);
    this.object.update();

    // Player :
    this.player.draw(ctx);
    this.player.update();

    ctx.restore();
  }
}
