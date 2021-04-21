export default class Semaphore {
  private readonly capacity: number;

  private resolveList: Function[] = []

  private curCount: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  public acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.curCount >= this.capacity) {
        this.resolveList.push(resolve);
      } else {
        this.curCount += 1;
        resolve();
      }
    });
  }

  public release(): void {
    this.curCount -= 1;
    if (this.resolveList.length > 0) {
      this.curCount += 1;
      const nextResolve = this.resolveList.shift();
      nextResolve();
    }
  }
}
