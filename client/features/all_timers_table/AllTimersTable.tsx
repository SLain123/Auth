import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getAuthSelector } from '../auth/authSlice';
import { getTimerListSelector } from '../user_timers/userTimersSlice';
import {
    convertFromMilliSeconds,
    addTimeFormat,
} from '../../utils/timeConverter';
import Link from 'next/link';
import { Spinner } from '../../components/spinner';
import Image from 'next/image';
import { useRemoveTimer } from '../../service/TimerService';
import { useGetUserTimers } from '../../service/TimerService';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import Styles from './AllTimersTable.module.scss';
import linkIcon from '../../public/icons/link.svg';
import binIcon from '../../public/icons/bin.svg';
import problemIcon from '../../public/icons/problem.svg';

const AllTimersTable: React.FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading: isLoadingAuth, isUserAuth } = authStatus;

    const getUserTimersService = useGetUserTimers();
    const { getUserTimers } = getUserTimersService;

    const timersState = useAppSelector(getTimerListSelector);
    const {
        isLoading: isLoadingTimers,
        isError: isErrorTimers,
        timerList,
    } = timersState;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const removeTimerService = useRemoveTimer();
    const { removeTimer, loading, serverErrors } = removeTimerService;
    const [currentActiveItem, setCurrentActiveItem] = useState<string | null>(
        null,
    );

    const { curcleSpin } = Spinner();

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (!isUserAuth && !isLoadingAuth) {
            location.href = '/login';
        }
    }, [isUserAuth, isLoadingAuth]);

    useEffect(() => {
        isUserAuth && getUserTimers();
    }, [isUserAuth]);

    if (isLoadingAuth || isLoadingTimers) {
        return <div className={Styles.center}>{curcleSpin(100, 'green')}</div>;
    }

    if (isErrorTimers || !timerList) {
        return (
            <div className={Styles.center}>
                Something was wrong. Please refresh the page.
            </div>
        );
    }

    return (
        <div className={Styles.all_container}>
            <TableContainer component={Paper}>
                <Table
                    stickyHeader
                    sx={{ minWidth: 450 }}
                    aria-label='timers table'
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Timer label</TableCell>
                            <TableCell align='center'>Hour(s)</TableCell>
                            <TableCell align='center'>Minute(s)</TableCell>
                            <TableCell align='center'>Second(s)</TableCell>
                            <TableCell align='center'>
                                Timer active right now?
                            </TableCell>
                            <TableCell align='center'>
                                Open timer page
                            </TableCell>
                            <TableCell align='center'>Remove timer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timerList
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage,
                            )
                            .map(({ _id, label, total, timeToEnd }) => {
                                const { hour, minute, second } =
                                    convertFromMilliSeconds(total);

                                const statusStyle =
                                    timeToEnd &&
                                    new Date(timeToEnd).getTime() >=
                                        new Date().getTime()
                                        ? Styles.active
                                        : Styles.unactive;

                                const getBtnContent = () => {
                                    if (loading && currentActiveItem === _id) {
                                        return curcleSpin(20, 'black');
                                    } else if (
                                        serverErrors &&
                                        currentActiveItem === _id
                                    ) {
                                        return (
                                            <div
                                                className={
                                                    Styles.problem_container
                                                }
                                            >
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    src={problemIcon}
                                                    alt='some problem'
                                                />
                                                <span
                                                    className={
                                                        Styles.problem_message
                                                    }
                                                >
                                                    Something was wrong
                                                </span>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <Image
                                                width={20}
                                                height={20}
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
                                            '&:last-child td, &:last-child th':
                                                {
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
                                                        width={24}
                                                        height={24}
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
                                                onClick={() => {
                                                    setCurrentActiveItem(_id);
                                                    removeTimer(_id);
                                                }}
                                            >
                                                {getBtnContent()}
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={timerList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default AllTimersTable;
