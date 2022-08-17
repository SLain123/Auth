import { ITimer } from './timer';

export interface IServerErrors {
    msg: string;
    value: string;
    param?: string;
}

export interface IMessageResponse {
    message: string;
    errors?: IServerErrors[];
}

export interface IResponseTimer extends IMessageResponse {
    timer: ITimer;
}
