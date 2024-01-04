import { harIkkeNivaa4 } from './demo/localstorage';

export const harNivaa4Data = (req: Request) => {
    return {
        harbruktnivaa4: !harIkkeNivaa4(),
        personidentifikator: 'IKKE BRUKT TIL NOE?'
    };
};
