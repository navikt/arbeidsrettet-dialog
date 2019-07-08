import React from "react";
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as AppContext from "../Context";
import {Dialog} from "../view/Dialog";
import {Bruker, PeriodeData} from "../utils/typer";
import {HenvendelseList} from "../view/HenvendelseList";
import {DialogInputBox} from "../view/DialogInputBox";
import {DialogHeader} from "../view/DialogHeader";
import {AlertStripeContainer} from "../view/AlertStripeContainer";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import {DialogOverview} from "../view/DialogOverview";
import {DialogOverviewHeader} from "../view/DialogOverviewHeader";
import {DialogPreview} from "../view/DialogPreview";
import {DialogHeaderCheckboxes} from "../view/DialogHeaderCheckboxes";

Enzyme.configure({ adapter: new Adapter() });

const userInfo: Bruker = {id:"010101", erVeileder: true,erBruker:false};
const oppfPerioder: PeriodeData[] = [];
const oppfolgingData = {
    fnr: null,
    veilederId: "101010",
    reservasjonKRR: false,
    manuell: false,
    underOppfolging: true, //eller false
    underKvp: false,
    oppfolgingUtgang: null,
    gjeldendeEskaleringsvarsel: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: oppfPerioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
};

const dialoger = [
    {
        id: '1',
        aktivitetId: '1',
        overskrift: 'Memes',
        sisteTekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: true,
        venterPaSvar: false,
        ferdigBehandlet: false,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        henvendelser: [
            {
                id: '1',
                dialogId: '1',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-27T12:48:56.097+01:00',
                lest: true,
                tekst:
                    'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
            },
            {
                id: '2',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: true,
                tekst: 'Hei. Leter enda på sjøen :)',
            },
        ],
        egenskaper: [],
    }];

describe('<AlertStripeContainer/>', () => {

    test("Bruker uten oppf.perioder og ikke under oppf. viser en advarsel - veileder.", () => {
        userInfo.erVeileder=true;
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [];
        jest.spyOn(AppContext, 'useUserInfoContext').mockImplementation(() => userInfo);
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = shallow(<AlertStripeContainer/>);
        expect(wrapper.prop("data-ikke-reg-veileder")).toBeTruthy()
    });
    test("Bruker uten oppf.perioder og ikke under oppf. viser en advarsel - bruker. ", () => {
        userInfo.erVeileder = false;
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [];
        jest.spyOn(AppContext, 'useUserInfoContext').mockImplementation(() => userInfo);
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = shallow(<AlertStripeContainer/>);
        expect(wrapper.prop("data-ikke-reg-bruker")).toBeTruthy()
    });
    test("Bruker med oppf.perioder og ikke under oppf. viser en advarsel - bruker. ", () => {
        userInfo.erVeileder = false;
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [{
            aktorId: '1234567988888',
            veileder: false,
            startDato: '2017-01-30T10:46:10.971+01:00',
            sluttDato: '2017-12-31T10:46:10.971+01:00',
            begrunnelse: null,
        }];
        jest.spyOn(AppContext, 'useUserInfoContext').mockImplementation(() => userInfo);
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = shallow(<AlertStripeContainer/>);
        expect(wrapper.prop("data-har-oppfP-bruker")).toBeTruthy()
    });
    test("Bruker med oppf.perioder, ikke under oppf. gir ingen feilmelding - veileder", () => {
        userInfo.erVeileder = true;
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [{
            aktorId: '1234567988888',
            veileder: false,
            startDato: '2017-01-30T10:46:10.971+01:00',
            sluttDato: '2017-12-31T10:46:10.971+01:00',
            begrunnelse: null,
        }];
        jest.spyOn(AppContext, 'useUserInfoContext').mockImplementation(() => userInfo);
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = shallow(<AlertStripeContainer/>);
        expect(wrapper.find(AlertStripeAdvarsel).exists()).toBeFalsy()
    })

});

describe( '<DialogOverview/>', () => {

    test("Bruker uten oppf.perioder og ikke under oppf skjuler store deler av appen", () => {
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [];
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = mount(<DialogOverview dialogData={dialoger} />);
        expect(wrapper.find(DialogOverviewHeader).exists()).toBeFalsy();
        expect(wrapper.find(DialogPreview).exists()).toBeFalsy();
    });
    test("Bruker ikke under oppf. skjuler knapper/checkbox", () => {
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [{
            aktorId: '1234567988888',
            veileder: false,
            startDato: '2017-01-30T10:46:10.971+01:00',
            sluttDato: '2017-12-31T10:46:10.971+01:00',
            begrunnelse: null,
        }];
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = mount(<DialogOverview dialogData={dialoger} />);
        expect(wrapper.find(DialogOverviewHeader).exists()).toBeFalsy();
        expect(wrapper.find(DialogPreview).exists()).toBeTruthy();
    });
    test("Bruker under oppf, elementer synes", () => {
        oppfolgingData.underOppfolging = true;
        oppfolgingData.oppfolgingsPerioder = [{
            aktorId: '1234567988888',
            veileder: false,
            startDato: '2017-01-30T10:46:10.971+01:00',
            sluttDato: '2017-12-31T10:46:10.971+01:00',
            begrunnelse: null,
        }];
        const wrapper = mount(<DialogOverview dialogData={dialoger} />);
        expect(wrapper.find(DialogOverviewHeader).exists()).toBeTruthy();
        expect(wrapper.find(DialogPreview).exists()).toBeTruthy();
    })
});

describe('<Dialog/>', () => {
    test("Bruker ikke under oppf. skjuler dialogcontroller og viser fortsatt henvendelser", () =>{
        oppfolgingData.underOppfolging = false;
        oppfolgingData.oppfolgingsPerioder = [{
            aktorId: '1234567988888',
            veileder: false,
            startDato: '2017-01-30T10:46:10.971+01:00',
            sluttDato: '2017-12-31T10:46:10.971+01:00',
            begrunnelse: null,
        }];
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = mount(<Dialog dialog={dialoger[0]}/>);
        expect(wrapper.find(DialogHeaderCheckboxes).exists()).toBeFalsy();
        expect(wrapper.find(DialogInputBox).exists()).toBeFalsy();
        expect(wrapper.find(HenvendelseList).exists()).toBeTruthy();
    });
    test("Bruker under oppf. viser komponenter i Dialog", () => {
        oppfolgingData.underOppfolging = true;
        oppfolgingData.oppfolgingsPerioder = [{
            aktorId: '1234567988888',
            veileder: false,
            startDato: '2017-01-30T10:46:10.971+01:00',
            sluttDato: '2017-12-31T10:46:10.971+01:00',
            begrunnelse: null,
        }];
        jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => oppfolgingData);
        const wrapper = mount(<Dialog dialog={dialoger[0]}/>);
        expect(wrapper.find(DialogHeader).exists()).toBeTruthy();
        expect(wrapper.find(DialogInputBox).exists()).toBeTruthy();
        expect(wrapper.find(HenvendelseList).exists()).toBeTruthy();
    })
});