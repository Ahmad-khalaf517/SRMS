import { ORDER_STATUS, ORDER_TYPE } from './constants';

export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
