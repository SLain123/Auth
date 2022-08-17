import { ITimer } from '../types/timer';

const findLastActiveTimer = (timerList: ITimer[]) => {
    let result: null | ITimer = null;

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
