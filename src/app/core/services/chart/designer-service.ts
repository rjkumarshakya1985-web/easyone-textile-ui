import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {

  private _preset = signal(true);

  preset() {
    return this._preset();
  }

  setPreset(value: boolean) {
    this._preset.set(value);
  }
}