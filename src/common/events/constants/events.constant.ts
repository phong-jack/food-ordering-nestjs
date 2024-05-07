export enum SERVER_EVENTS {
  FRIEND_REQUEST_ACCEPTED = 'friendrequest.accepted',
  FRIEND_REQUEST_REJECTED = 'friendrequest.rejected',
  FRIEND_REQUEST_CANCELLED = 'friendrequest.cancelled',
  FRIEND_REMOVED = 'friend.removed',

  ORDER_CREATE = 'order.create',
  ORDER_ACCEPTED = 'order.accepted',
  ORDER_SHIPPING = 'order.shipping',
  ORDER_FINISHED = 'order.finished',
  ORDER_REJECTED = 'order.rejected',
  ORDER_CANCEL = 'order.cancel',
}
