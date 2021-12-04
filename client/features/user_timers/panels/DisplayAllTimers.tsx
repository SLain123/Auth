import React, { useEffect } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getAuthSelector } from '../../auth/authSlice';
import { getTimerListSelector } from '../userTimersSlice';
import { convertFromMilliSeconds } from '../../../utils/timeConverter';
import Link from 'next/link';
import { Spinner } from '../../../components/spinner';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import Styles from '../Timers.module.scss';

const DisplayAllTimers: React.FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading: isLoadingAuth, isUserAuth } = authStatus;

    const timersState = useAppSelector(getTimerListSelector);
    const {
        isLoading: isLoadingTimers,
        isError: isErrorTimers,
        timerList,
    } = timersState;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                            .map(({ _id, label, total }) => {
                                const { hour, minute, second } =
                                    convertFromMilliSeconds(total);

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
                                            {hour}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {minute}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {second}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {true ? 'active' : 'unactive'}
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Link href={`/timer/${_id}`}>
                                                <a>Open</a>
                                            </Link>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Link href='#'>
                                                <a>Remove (bin)</a>
                                            </Link>
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

export default DisplayAllTimers;
