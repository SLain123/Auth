export interface TimerI {
    _id: string;
    label: string;
    total: number;
    createDate: Date;
    timeToEnd: Date | null;
    ownerNick: string;
    restTime: number;
    ownerId: string;
}
