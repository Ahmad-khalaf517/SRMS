import { PaymentMethod, PaymentStatus } from './constants';

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
