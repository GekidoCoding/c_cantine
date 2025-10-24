import { AnnuaireElectronique } from "./annuaire-electronique";
import { CantLibMenuLc } from "./cant-lib-menu-lc";
import { CantRefMenuLc } from "./cant-ref-menu-lc";

export class CantAgent {
    id_cant_agent: any ;
    id_ref_menu: any;
    agent_matricule: any;
    flag_recu: any;
    evaluation: any;
    user_eval: any;
    date_eval: any;
    user_insert: any;
    date_insert: any;
    user_maj: any;
    date_maj: any;
    observation: any;
    nb_repas: any;
    cantRefMenuLc: CantRefMenuLc | null = null;
    cantLibMenuLc: CantLibMenuLc | null = null;
    annuaireElectronique: AnnuaireElectronique | null = null;
    check: any;
    
}