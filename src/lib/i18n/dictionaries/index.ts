import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

export const dictionary = {
    en,
    fr,
    ar,
};

export type Language = keyof typeof dictionary;
export type Dictionary = typeof en;
