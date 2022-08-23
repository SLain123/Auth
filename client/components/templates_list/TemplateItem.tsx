import React, { FC } from 'react';

import Styles from './TemplatesList.module.scss';

export interface ITemplateItem {
    title: string;
    time: number;
    onChangeTime: (time: number) => void;
}

const TemplateItem: FC<ITemplateItem> = ({ title, time, onChangeTime }) => {
    return (
        <button
            type='button'
            onClick={() => onChangeTime(time)}
            className={Styles.template_btn}
        >
            {title}
        </button>
    );
};

export { TemplateItem };
