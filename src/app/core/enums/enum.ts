export enum RegistrationType {
  Regular = 1,
  Composition = 2,
  Unregistered = 3
}


export enum TransportType
{
  Purchase = 1,
  Sales = 2,
  Both = 3
}

export enum ParcelStatus {
   Ready = 1,
   Packed = 2,
   InTransit = 3,
   Transport = 4,
   PackedAtLocation=5,
   Opened = 6,
   Returned = 7,
   Cancelled = 9,
   Other = 10,
   TallySynced=11
}
