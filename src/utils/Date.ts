import { differenceInHours, differenceInMinutes, format, isAfter as _isAfter } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ValueOrNull } from './Typer';

const locale = { locale: nb };

export function formaterDateAndTime(sendtDate: ValueOrNull<string>): string {
    if (!sendtDate) return '';
    return format(new Date(sendtDate), 'dd.MM.yyyy HH:mm', locale);
}

export function formaterDate(dato: ValueOrNull<string>): string {
    if (!dato) return '';
    return format(new Date(dato), 'dd.MM.yyyy', locale);
}

export function getKlokkeslett(dato: ValueOrNull<string>): string {
    if (!dato) return '';
    return format(new Date(dato), 'HH:mm', locale);
}

export function getVarighet(fraDato: ValueOrNull<string>, tilDato: ValueOrNull<string>): string {
    if (!fraDato || !tilDato) return '';

    const padStart = (min: number) => (min < 10 ? `0${min}` : min);

    const fraDatoDate = new Date(fraDato);
    const tilDatoDate = new Date(tilDato);
    const hourDiff = differenceInHours(tilDatoDate, fraDatoDate);
    const minuteDiff = padStart(differenceInMinutes(tilDatoDate.setHours(0), fraDatoDate.setHours(0)));

    return `${hourDiff}:${minuteDiff}`;
}

export function isAfter(date?: ValueOrNull<string>, dateToCompare?: ValueOrNull<string>) {
    if (!date || !dateToCompare) return false;

    const dateDate = new Date(date);
    const dateToCompareDate = new Date(dateToCompare);

    return _isAfter(dateDate, dateToCompareDate);
}
