import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  // theme transition complete flag
  private _transitionComplete = signal(true);

  // expose as readonly computed
  transitionComplete = computed(() => this._transitionComplete());

  constructor() {}

  // call this when theme changes
  startTransition() {
    this._transitionComplete.set(false);
  }

  completeTransition() {
    this._transitionComplete.set(true);
  }
}