import { ParcelStatus } from "../enums/enum";


export type TagSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

export class Helper {

  


  static getParcelStatusColor(status: ParcelStatus): TagSeverity {
  switch (status) {
    case ParcelStatus.Ready:
      return 'info';
    case ParcelStatus.Packed:
      return 'success';
    case ParcelStatus.InTransit:
      return 'warn';   
    case ParcelStatus.Transport:
      return 'secondary';
      case ParcelStatus.PackedAtLocation:
      return 'secondary';
    case ParcelStatus.Opened:
      return 'contrast';
    case ParcelStatus.Returned:
    case ParcelStatus.Cancelled:
      return 'danger';
    case ParcelStatus.TallySynced:
      return 'success';
    default:
      return 'secondary';
  }
}


   static getParcelStatusText(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.Ready:
        return 'Ready';
      case ParcelStatus.Packed:
        return 'Packed';
      case ParcelStatus.InTransit:
        return 'In Transit';
      case ParcelStatus.Transport:
        return 'Transport';
      case ParcelStatus.PackedAtLocation:
        return 'Packed at Location';
      case ParcelStatus.Opened:
        return 'Opened';
      case ParcelStatus.Returned:
        return 'Returned';
      case ParcelStatus.Cancelled:
        return 'Cancelled';
      case ParcelStatus.Other:
        return 'Other';
      case ParcelStatus.TallySynced:
        return 'Tally Synced'
      default:
        return 'Unknown';
    }
  }
}
