import React, { useEffect, useState, FC, useCallback } from 'react';

import { useAppSelector } from 'hooks';
import { getAuthSelector } from 'features/auth/authSlice';
import { getTimerListSelector } from 'features/user_timers/userTimersSlice';
import { Spinner } from 'components/spinner';
import { Head } from './Head';
import { Body } from './Body';

import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import Styles from './AllTimersTable.module.scss';

const AllTimersTable: FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading: isLoadingAuth, isUserAuth } = authStatus;
    const timersState = useAppSelector(getTimerListSelector);
    const { timerList } = timersState;

    const [loadingTimers, setLoadingTimers] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { CurcleSpin } = Spinner();

    const handleChangePage = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        },
        [],
    );

    const handleLoadingStatus = useCallback((status: boolean) => {
        setLoadingTimers(status);
    }, []);

    useEffect(() => {
        if (!isUserAuth && !isLoadingAuth) {
            location.href = '/login';
        }
    }, [isUserAuth, isLoadingAuth]);

    if (isLoadingAuth || loadingTimers) {
        return (
            <div className={Styles.center}>
                {CurcleSpin(100, 'rgba(82, 0, 255, 0.9)')}
            </div>
        );
    }

    return (
        <div className={Styles.all_container}>
            <TableContainer component={Paper} className={Styles.table}>
                <Table
                    stickyHeader
                    sx={{ minWidth: 450 }}
                    aria-label='timers table'
                >
                    <Head />
                    <Body
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleLoadingStatus={handleLoadingStatus}
                    />
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component='div'
                count={timerList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className={Styles.table_pagination}
            />
        </div>
    );
};

export { AllTimersTable };
