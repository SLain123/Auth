export const convertToMilliSeconds = (
    hour: number,
    minute: number,
    second: number,
) => {
    return hour * 3600000 + minute * 60000 + second * 1000;
};

export const convertFromMilliSeconds = (msec: number) => {
    const hour = Math.floor(msec / 1000 / 3600);
    const minute = Math.floor(((msec / 1000) % 3600) / 60);
    const second = Math.floor(((msec / 1000) % 3600) % 60);

    return { hour, minute, second };
};

export const addTimeFormat = (num: number): string =>
    String(num).length < 2 ? `0${num}` : String(num);
