import { CantAgentWithLib } from "./cant-agent-with-lib";
import { CantLibMenuLc } from "./cant-lib-menu-lc";


export class CantRefMenuLc {
    id_ref_menu: any;
    id_menu: any;
    id_lib_menu: any;
    date_ref_menu: any;
    user_insert: any;
    date_insert: any;
    user_maj: any;
    date_maj: any;
    nb_repas: any;
    date_ref_menuFormatedFr: any;
    date_ref_menuFormatedFrShortDate: any;
    cantLibMenuLc: CantLibMenuLc | null = null;
    cantAgentWithLib: CantAgentWithLib | null = null;
    checked: any;
}