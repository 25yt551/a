import Game from '.';
import { Base2dObject } from './utils';

export default class Player extends Base2dObject {
  x = 250;
  y = 250;
  radius = 50;
  headImage: HTMLImageElement | null = null;
  bodyImage: HTMLImageElement | null = null;
  angle = 0;
  canvasWidth: number;
  canvasHeight: number;
  game: Game;
  segments: { x: number; y: number; angle: number }[] = [];
  segmentCount = 5;

  constructor(game: Game) {
    super();

    this.game = game;
    this.canvasWidth = game.width;
    this.canvasHeight = game.height;
    
    // Initialize segments
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        x: this.x - (i + 1) * 30,
        y: this.y,
        angle: this.angle
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw body segments
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const segment = this.segments[i];
      
      // Save the current canvas state
      ctx.save();

      // Translate to the center of the segment
      ctx.translate(segment.x + this.radius, segment.y + this.radius);

      // Rotate the canvas based on the segment angle
      ctx.rotate(segment.angle);

      // Draw the segment image
      if (this.game.resourceLoader.getResource<HTMLImageElement>('wormBody')) {
        ctx.drawImage(
          this.game.resourceLoader.getResource<HTMLImageElement>('wormBody')!,
          -this.radius,
          -this.radius,
          this.radius * 2,
          this.radius * 2
        );
      } else {
        // Fallback if image not loaded
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Restore the canvas state
      ctx.restore();
    }

    // Save the current canvas state
    ctx.save();

    // Translate to the center of the player image
    ctx.translate(this.x + this.radius, this.y + this.radius);

    // Rotate the canvas based on the player angle
    ctx.rotate(this.angle);

    // Draw the player head image
    if (this.game.resourceLoader.getResource<HTMLImageElement>('wormHead')) {
      ctx.drawImage(
        this.game.resourceLoader.getResource<HTMLImageElement>('wormHead')!,
        -this.radius,
        -this.radius,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      // Fallback if image not loaded
      ctx.fillStyle = '#388E3C';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Restore the canvas state
    ctx.restore();
  }

  update() {
    // Update the player
    const dx = this.x - window.mouse.x + this.radius;
    const dy = this.y - window.mouse.y + this.radius;

    this.angle = Math.atan2(dy, dx);

    // Move the player
    if (window.mouse.x !== this.x) {
      this.x -= dx / 30;
    }
    if (window.mouse.y !== this.y) {
      this.y -= dy / 30;
    }

    // Update segments
    if (this.segments.length > 0) {
      // Update first segment to follow head
      this.segments[0].x = this.x - Math.cos(this.angle) * 30;
      this.segments[0].y = this.y - Math.sin(this.angle) * 30;
      this.segments[0].angle = this.angle;

      // Update other segments to follow the one in front
      for (let i = 1; i < this.segments.length; i++) {
        const prevSegment = this.segments[i - 1];
        const segment = this.segments[i];
        
        const segDx = segment.x - prevSegment.x;
        const segDy = segment.y - prevSegment.y;
        
        segment.angle = Math.atan2(segDy, segDx);
        
        segment.x = prevSegment.x + Math.cos(segment.angle) * 30;
        segment.y = prevSegment.y + Math.sin(segment.angle) * 30;
      }
    }
  }

  grow() {
    // Add a new segment
    const lastSegment = this.segments[this.segments.length - 1];
    this.segments.push({
      x: lastSegment.x,
      y: lastSegment.y,
      angle: lastSegment.angle
    });
    
    // Play grow sound
    const growSound = this.game.resourceLoader.getResource<HTMLAudioElement>('growSound');
    if (growSound) {
      growSound.currentTime = 0;
      growSound.play().catch(e => console.error('Error playing sound:', e));
    }
  }
}
