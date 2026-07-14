import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private manualLoading = signal(false);
  private activeRequests = signal(0);
  loading = computed(() => this.manualLoading() || this.activeRequests() > 0);

  show() {
    this.manualLoading.set(true);
  }

  hide() {
    this.manualLoading.set(false);
  }

  requestStarted() {
    this.activeRequests.update(count => count + 1);
  }

  requestFinished() {
    this.activeRequests.update(count => Math.max(0, count - 1));
  }
}
