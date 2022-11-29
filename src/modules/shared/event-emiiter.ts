export class EventEmitter<T> {
  callbacks: Array<(event: T) => void> = [];

  subscribe(callback: (event: T) => void) {
    this.callbacks.push(callback);
  }

  next(event: T) {
    this.callbacks.forEach(c => c(event));
  }
}