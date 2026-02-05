import { ParcelStatus } from "../enums/enum";


export class Helper {

 

  static getParcelStatusColor(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.Ready:
        return 'info';
      case ParcelStatus.Packed:
        return 'success';
      case ParcelStatus.InTransit:
        return 'warning';
      case ParcelStatus.InWareHouse:
        return 'secondary';
      case ParcelStatus.Opened:
        return 'contrast';
      case ParcelStatus.Returned:
      case ParcelStatus.Cancelled:
        return 'danger';
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
      case ParcelStatus.InWareHouse:
        return 'In Warehouse';
      case ParcelStatus.Opened:
        return 'Opened';
      case ParcelStatus.Returned:
        return 'Returned';
      case ParcelStatus.Cancelled:
        return 'Cancelled';
      case ParcelStatus.Other:
        return 'Other';
      default:
        return 'Unknown';
    }
  }
}
