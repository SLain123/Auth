import React, { FC } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Styles from './AllTimersTable.module.scss';

const Head: FC = () => {
    return (
        <TableHead className={Styles.table_head}>
            <TableRow>
                <TableCell>Timer label</TableCell>
                <TableCell align='center'>Hour(s)</TableCell>
                <TableCell align='center'>Minute(s)</TableCell>
                <TableCell align='center'>Second(s)</TableCell>
                <TableCell align='center'>Status</TableCell>
                <TableCell align='center'>Go to timer</TableCell>
                <TableCell align='center'>Remove timer</TableCell>
            </TableRow>
        </TableHead>
    );
};

export { Head };
