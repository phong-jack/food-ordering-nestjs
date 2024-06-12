import { registerEnumType } from '@nestjs/graphql';

export enum ShipperStatus {
  SHIPPING = 'shipping',
  READY = 'ready',
}

registerEnumType(ShipperStatus, {
  name: 'ShipperStatus',
  description: 'Shipper status :))',
});
