import { BehaviorSubject } from "rxjs";

export class SvelteSubject<T> extends BehaviorSubject<T> {
  set(value: T) {
    this.next(value);
  }
}

export default SvelteSubject;
