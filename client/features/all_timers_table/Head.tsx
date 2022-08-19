import React, { FC } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const Head: FC = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell>Timer label</TableCell>
                <TableCell align='center'>Hour(s)</TableCell>
                <TableCell align='center'>Minute(s)</TableCell>
                <TableCell align='center'>Second(s)</TableCell>
                <TableCell align='center'>Timer active right now?</TableCell>
                <TableCell align='center'>Open timer page</TableCell>
                <TableCell align='center'>Remove timer</TableCell>
            </TableRow>
        </TableHead>
    );
};

export { Head };
