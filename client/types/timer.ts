export interface TimerI {
    _id: number | string;
    label: string;
    total: number;
    startTime: Date;
    endTime?: Date;
    ownerNick: string;
}

