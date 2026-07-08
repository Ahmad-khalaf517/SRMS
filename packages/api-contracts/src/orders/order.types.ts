import { OrderStatus, OrderType } from './constants';

export type OrderType = (typeof OrderType)[keyof typeof OrderType];
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
