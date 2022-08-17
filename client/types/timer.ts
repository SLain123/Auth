export interface ITimer {
    _id: string;
    label: string;
    total: number;
    activateDate: Date;
    timeToEnd: Date | null;
    ownerNick: string;
    restTime: number;
    ownerId: string;
}
