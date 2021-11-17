import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getAuthSelector } from '../../auth/authSlice';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import BeatLoader from 'react-spinners/BeatLoader';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Styles from '../Main.module.scss';

const CreateTimerForm: React.FC = () => {
    const authStatus = useAppSelector(getAuthSelector);
    const { isLoading, isUserAuth } = authStatus;

    const spinnerWhite = <BeatLoader color='white' loading size={10} />;

    const formik = useFormik({
        initialValues: {
            label: '',
            hour: '',
            minute: '',
            second: '',
        },
        validationSchema: Yup.object({
            label: Yup.string()
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <div className={Styles.container}>
            <form className={Styles.form} onSubmit={formik.handleSubmit}>
                <h3 className={Styles.title}>Create new timer:</h3>
                <TextField
                    name='label'
                    id='label'
                    label='Timer name'
                    variant='outlined'
                    fullWidth
                    margin='dense'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.label && Boolean(formik.errors.label)}
                    helperText={formik.touched.label && formik.errors.label}
                    disabled={isLoading || !isUserAuth}
                />
                <h4 className={Styles.subtitle}>
                    Specify the required time before completion:
                </h4>
                <div className={Styles.time_container}>
                    <TextField
                        className={Styles.time_input}
                        name='hour'
                        id='hour'
                        label=''
                        variant='outlined'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.hour && Boolean(formik.errors.hour)
                        }
                        helperText={formik.touched.hour && formik.errors.hour}
                        disabled={isLoading || !isUserAuth}
                    />
                    <span className={Styles.time_dotted}>:</span>
                    <TextField
                        className={Styles.time_input}
                        name='minute'
                        id='minute'
                        label=''
                        variant='outlined'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.minute &&
                            Boolean(formik.errors.minute)
                        }
                        helperText={
                            formik.touched.minute && formik.errors.minute
                        }
                        disabled={isLoading || !isUserAuth}
                    />
                    <span className={Styles.time_dotted}>:</span>
                    <TextField
                        className={Styles.time_input}
                        name='second'
                        id='second'
                        label=''
                        variant='outlined'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.second &&
                            Boolean(formik.errors.second)
                        }
                        helperText={
                            formik.touched.second && formik.errors.second
                        }
                        disabled={isLoading || !isUserAuth}
                    />
                </div>

                <Button
                    className={Styles.create_btn}
                    variant='contained'
                    color='success'
                    size='large'
                    type='submit'
                    disabled={!isUserAuth}
                >
                    {isLoading ? spinnerWhite : 'Create timer'}
                </Button>
            </form>
        </div>
    );
};

export default CreateTimerForm;
