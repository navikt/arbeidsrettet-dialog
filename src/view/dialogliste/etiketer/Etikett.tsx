import React from 'react';
import styles from './Etiketter.module.less';
import classNames from 'classnames';

interface Props {
    visible: boolean;
}

interface EtiketProps {
    visible: boolean;
    children: string;
    clasName: string;
}

function Etiket(props: EtiketProps) {
    if (!props.visible) {
        return null;
    }
    const classname = classNames(styles.etikett, props.clasName);
    return <div className={classname}>{props.children}</div>;
}

export function VenterSvarFraBruker(props: Props) {
    return (
        <Etiket visible={props.visible} clasName={styles.venterPaBruker}>
            NAV venter på svar fra deg
        </Etiket>
    );
}

export function VenterSvarFraNAV(props: Props) {
    return (
        <Etiket visible={props.visible} clasName={styles.venterPaNav}>
            Venter på svar fra NAV
        </Etiket>
    );
}

export function ViktigMelding(props: Props) {
    return (
        <Etiket visible={props.visible} clasName={styles.viktigMelding}>
            Viktig melding
        </Etiket>
    );
}
