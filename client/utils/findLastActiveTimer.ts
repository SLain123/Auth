import { TimerI } from '../types/timer';

const findLastActiveTimer = (timerList: TimerI[]) => {
    let result: null | TimerI = null;

    timerList.forEach((timer) => {
        const { activateDate } = timer;

        if (result?.activateDate) {
            if (
                new Date(activateDate).getTime() >
                new Date(result.activateDate).getTime()
            ) {
                result = timer;
            } else {
                return;
            }
        } else {
            result = timer;
        }
    });

    return result;
};

export default findLastActiveTimer;
