import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

import Styles from './TemplatesList.module.scss';

export interface TemplatesListI {
    onChangeSelect: (total: number) => void;
}

const TemplatesList: React.FC<TemplatesListI> = ({ onChangeSelect }) => {
    const [total, setTotal] = useState(0);

    const handleChange = () => (evt: SelectChangeEvent) => {
        const totalTime = +evt.target.value;
        setTotal(totalTime);
    };

    useEffect(() => {
        total && onChangeSelect(total);
    }, [total]);

    return (
        <div className={Styles.template_container}>
            <FormControl fullWidth>
                <InputLabel id='template-select'>
                    Choose a template time
                </InputLabel>
                <Select
                    labelId='template-select'
                    id='template-select'
                    label='Select the required time'
                    onChange={handleChange()}
                    value={String(total)}
                >
                    <MenuItem disabled value={0}></MenuItem>
                    <MenuItem value={300000}>Five minites</MenuItem>
                    <MenuItem value={900000}>Fifteen minites</MenuItem>
                    <MenuItem value={1800000}>Half an hour</MenuItem>
                    <MenuItem value={2700000}>Forty-five minutes</MenuItem>
                    <MenuItem value={3600000}>An hour</MenuItem>
                    <MenuItem value={5400000}>An hour and a half</MenuItem>
                    <MenuItem value={7200000}>Two hours</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default TemplatesList;
