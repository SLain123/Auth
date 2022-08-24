import React, { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { convertFromMilliSeconds, addTimeFormat } from 'utils/timeConverter';
import { useAppSelector, useRefreshTimers } from 'hooks';
import { getTimerListSelector } from 'features/user_timers/userTimersSlice';
import { useRemoveTimer } from 'service/timers/RemoveTimerService';
import { IServerErrors } from 'types/serviceType';
import { Spinner } from 'components/spinner';

import Styles from './AllTimersTable.module.scss';
import linkIcon from 'public/icons/link.svg';
import binIcon from 'public/icons/bin.svg';
import problemIcon from 'public/icons/problem.svg';

export interface IBody {
    page: number;
    rowsPerPage: number;
    handleLoadingStatus: (status: boolean) => void;
}

const Body: FC<IBody> = ({ page, rowsPerPage, handleLoadingStatus }) => {
    const timersState = useAppSelector(getTimerListSelector);
    const { timerList } = timersState;

    const [serverErrors, setServerErrors] = useState<IServerErrors[]>([]);
    const [currentActiveItem, setCurrentActiveItem] = useState<string | null>(
        null,
    );

    const { refreshTimers } = useRefreshTimers();
    const { removeTimer } = useRemoveTimer();

    const { CurcleSpin } = Spinner();

    const displayDefaultError = () => {
        setServerErrors([
            {
                msg: 'Something was wrong',
                value: 'Something was wrong',
            },
        ]);
    };

    const handleRemoveTimer =
        (id: string) =>
        (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setCurrentActiveItem(id);
            handleLoadingStatus(true);
            removeTimer(id)
                .then((result) => {
                    if (result && result.message) {
                        refreshTimers();
                    } else {
                        displayDefaultError();
                    }

                    !result || (result.errors && displayDefaultError());
                })
                .catch(() => displayDefaultError())
                .finally(() => handleLoadingStatus(false));
        };

    return (
        <TableBody className={Styles.table_body}>
            {timerList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(({ _id, label, total, timeToEnd }) => {
                    const { hour, minute, second } =
                        convertFromMilliSeconds(total);

                    const statusStyle =
                        timeToEnd &&
                        new Date(timeToEnd).getTime() >= new Date().getTime()
                            ? Styles.active
                            : Styles.unactive;

                    const getBtnContent = () => {
                        if (currentActiveItem === _id) {
                            return CurcleSpin(20, 'black');
                        } else if (serverErrors && currentActiveItem === _id) {
                            return (
                                <div className={Styles.problem_container}>
                                    <Image
                                        width={28}
                                        height={40}
                                        src={problemIcon}
                                        alt='some problem'
                                    />
                                    <span className={Styles.problem_message}>
                                        Something was wrong
                                    </span>
                                </div>
                            );
                        } else {
                            return (
                                <Image
                                    width={28}
                                    height={40}
                                    src={binIcon}
                                    alt='bin'
                                />
                            );
                        }
                    };

                    return (
                        <TableRow
                            key={_id}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component='th' scope='row'>
                                {label}
                            </TableCell>
                            <TableCell align='center'>
                                {addTimeFormat(hour)}
                            </TableCell>
                            <TableCell align='center'>
                                {addTimeFormat(minute)}
                            </TableCell>
                            <TableCell align='center'>
                                {addTimeFormat(second)}
                            </TableCell>
                            <TableCell align='center'>
                                <span className={statusStyle}>
                                    {timeToEnd &&
                                    new Date(timeToEnd).getTime() >=
                                        new Date().getTime()
                                        ? 'active'
                                        : 'unactive'}
                                </span>
                            </TableCell>
                            <TableCell align='center'>
                                <Link href={`/timer/${_id}`}>
                                    <a className={Styles.open_btn}>
                                        <Image
                                            width={18}
                                            height={18}
                                            src={linkIcon}
                                            alt='link'
                                        />
                                    </a>
                                </Link>
                            </TableCell>
                            <TableCell align='center'>
                                <button
                                    type='button'
                                    className={Styles.remove_btn}
                                    onClick={handleRemoveTimer(_id)}
                                >
                                    {getBtnContent()}
                                </button>
                            </TableCell>
                        </TableRow>
                    );
                })}
        </TableBody>
    );
};

export { Body };
