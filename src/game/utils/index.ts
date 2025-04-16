import Game from '..';

export const GAME_CONTROLS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
};

export class Base2dObject {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;

  draw(ctx: CanvasRenderingContext2D) {}
  update() {}
}

export class GameObject extends Base2dObject {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
  foodType: string = 'apple';
  foodTypes: string[] = ['apple', 'banana', 'orange'];
  foodImage: HTMLImageElement | null = null;

  constructor(
    game: Game,
    {
      x = 300,
      y = 300,
      width = 100,
      height = 100,
    }: { x?: number; y?: number; width?: number; height?: number } = {
      x: 300,
      y: 300,
      width: 100,
      height: 100,
    }
  ) {
    super();

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.game = game;
    
    // Randomly select a food type
    this.foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Try to get the food image from the resource loader
    const foodImage = this.game.resourceLoader.getResource<HTMLImageElement>(`food${this.foodType.charAt(0).toUpperCase() + this.foodType.slice(1)}`);
    
    if (foodImage) {
      // Draw the food image
      ctx.drawImage(foodImage, this.x, this.y, this.width, this.height);
    } else {
      // Fallback if image not loaded
      ctx.fillStyle = this.getFoodColor();
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  getFoodColor(): string {
    switch (this.foodType) {
      case 'apple':
        return 'red';
      case 'banana':
        return 'yellow';
      case 'orange':
        return 'orange';
      default:
        return 'green';
    }
  }
  
  update(): void {
    // Check for collision with player
    const player = this.game.player;
    const dx = (player.x + player.radius) - (this.x + this.width/2);
    const dy = (player.y + player.radius) - (this.y + this.height/2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < player.radius + this.width/2) {
      // Collision detected, player eats the food
      this.onEaten();
    }
  }
  
  onEaten(): void {
    // Play eat sound
    const eatSound = this.game.resourceLoader.getResource<HTMLAudioElement>('eatSound');
    if (eatSound) {
      eatSound.currentTime = 0;
      eatSound.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Make the player grow
    this.game.player.grow();
    
    // Move food to a new random position
    this.x = Math.random() * (this.game.width - this.width);
    this.y = Math.random() * (this.game.height - this.height);
    
    // Change food type
    this.foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
  }
}
