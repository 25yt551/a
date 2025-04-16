/**
 * ResourceLoader - Utility for loading game resources
 * This class handles loading images, sounds, and other assets
 */

export class ResourceLoader {
  private static instance: ResourceLoader;
  private resources: Map<string, HTMLImageElement | HTMLAudioElement> = new Map();
  private loadingPromises: Promise<void>[] = [];
  private baseUrl: string = 'https://resources.wormate.io/static/assets/images/100700_abilities.png';

  private constructor() {}

  public static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  /**
   * Load an image from wormate.io resources
   * @param path - Path to the image resource
   * @param id - Unique identifier for the resource
   * @returns Promise that resolves when the image is loaded
   */
  public loadImage(path: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = `${this.baseUrl}/${path}`;
      
      image.onload = () => {
        this.resources.set(id, image);
        resolve();
      };
      
      image.onerror = (error) => {
        console.error(`Failed to load image: ${path}`, error);
        reject(error);
      };
      
      this.loadingPromises.push(Promise.resolve());
    });
  }

  /**
   * Load a sound from wormate.io resources
   * @param path - Path to the sound resource
   * @param id - Unique identifier for the resource
   * @returns Promise that resolves when the sound is loaded
   */
  public loadSound(path: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = `${this.baseUrl}/${path}`;
      
      audio.oncanplaythrough = () => {
        this.resources.set(id, audio);
        resolve();
      };
      
      audio.onerror = (error) => {
        console.error(`Failed to load sound: ${path}`, error);
        reject(error);
      };
      
      this.loadingPromises.push(Promise.resolve());
    });
  }

  /**
   * Get a loaded resource by ID
   * @param id - The resource identifier
   * @returns The loaded resource or undefined if not found
   */
  public getResource<T extends HTMLImageElement | HTMLAudioElement>(id: string): T | undefined {
    return this.resources.get(id) as T | undefined;
  }

  /**
   * Wait for all resources to load
   * @returns Promise that resolves when all resources are loaded
   */
  public async waitForAll(): Promise<void> {
    await Promise.all(this.loadingPromises);
  }
} 