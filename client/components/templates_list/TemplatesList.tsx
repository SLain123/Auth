import React, { FC } from 'react';
import { TemplateItem } from './TemplateItem';
import { templateData } from './templateData';

import Styles from './TemplatesList.module.scss';

export interface TemplatesListI {
    onChangeTime: (time: number) => void;
}

const TemplatesList: FC<TemplatesListI> = ({ onChangeTime }) => {
    return (
        <div className={Styles.template_container}>
            <p className={Styles.template_title}>Choose a template time:</p>
            <div className={Styles.template_list}>
                {templateData.map(({ title, time }) => (
                    <TemplateItem
                        time={time}
                        title={title}
                        onChangeTime={onChangeTime}
                    />
                ))}
            </div>
        </div>
    );
};

export { TemplatesList };
