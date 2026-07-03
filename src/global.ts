/*
import type {
  ActionTrackerOptions,
  AutomationOptions,
  CombatTrackerAppearance,
  StatusIconConfigOptions,
} from "./module/settings";
import type { TerrainHeightToolsAPI } from "./types/terrain-height-tools";
*/

import type { AnimonModel } from "./models/actors/animon";
import type { KidModel } from "./models/actors/kid";
import type { NpcModel } from "./models/actors/npc";
import type { NpcUpgradeEffectModel } from "./models/effects/npc_upgrade.svelte";
import type { UpgradeEffectModel } from "./models/effects/upgrade.svelte";
import type { GearModel } from "./models/items/gear.svelte";
import type { BasicTestModel } from "./models/messages/basic_test";
import type { ContestedTestModel } from "./models/messages/contested_test";

declare module "fvtt-types" {

}

declare module "fvtt-types/configuration" {
  interface SystemNameConfig {
    name: "animon";
  }

  interface SystemConfig {
    Item: {
      discriminate: "all";
    };
    Actor: {
      discriminate: "all";
    };
  }

  interface AssumeHookRan {
    ready: true;
  }

  // Things we have in window.game once `ready` fired
  interface ReadyGame {
    animon: Record<string, unknown>;
  }

  // Configuration options we supply to CONFIG
  interface CONFIG {
    // LancerInitiative: LancerInitiativeConfig<Game["system"]["id"]>;
  }

  interface DataModelConfig {
    Actor: {
      kid: typeof KidModel;
      animon: typeof AnimonModel;
      npc: typeof NpcModel;
    };
    Item: {
      gear: typeof GearModel;
    };
    ActiveEffect: {
      upgrade: typeof UpgradeEffectModel,
      npc_upgrade: typeof NpcUpgradeEffectModel
    },
    ChatMessage: {
      basic_test: typeof BasicTestModel,
      contested_test: typeof ContestedTestModel
    },
    Combatant: {
      //base: typeof LancerCombatantModel;
    };
  }

  interface FlagConfig {
    /*ChatMessage: {
      lancer: {
        attackData?: AttackFlag;
        damageData?: DamageFlag;
      };
    };*/
  }

  namespace Hooks {
    /*
    interface HookConfig {
      "lancer.statusesReady": () => boolean | void;
      "lancer.statusInitComplete": () => boolean | void;
    }
    */
  }

  interface SettingConfig {
    "animon.welcome": boolean,
    /*
    "lancer.actionManager": boolean;
    "lancer.actionManagerPlayersUse": boolean;
    "lancer.actionTracker": typeof ActionTrackerOptions;
    "lancer.attackSwitch": boolean;
    "lancer.autoCalcStructure": boolean;
    "lancer.autoOCHeat": boolean;
    "lancer.autoOKillHeat": boolean;
    "lancer.automationOptions": typeof AutomationOptions;
    "lancer.automationSwitch": boolean;
    "lancer.scanOutputs": string;
    "lancer.combat-tracker-appearance": typeof CombatTrackerAppearance;
    "lancer.combat-tracker-sort": boolean;
    "lancer.combatTrackerConfig": { sortTracker: boolean } | ClientSettings.Values["lancer.combatTrackerConfig"];
    "lancer.coreDataVersion": string;
    "lancer.dsnSetup": boolean;
    "lancer.floatingNumbers": boolean;
    "lancer.hideWelcome": boolean;
    "lancer.installedLCPs": { index: IContentPackManifest[] };
    "lancer.keepStockIcons": boolean;
    "lancer.squareGridDiagonals": "111" | "121" | "222" | "euc";
    "lancer.statusIconConfig": typeof StatusIconConfigOptions;
    "lancer.systemMigrationVersion": string;
    "lancer.tagConfig": Record<string, unknown>;
    "lancer.uiTheme": foundry.data.fields.StringField<{
      choices: {
        gms: "lancer.uiTheme.gms";
        gmsDark: "lancer.uiTheme.gmsDark";
        msmc: "lancer.uiTheme.msmc";
        horus: "lancer.uiTheme.horus";
        ha: "lancer.uiTheme.ha";
        ssc: "lancer.uiTheme.ssc";
        ipsn: "lancer.uiTheme.ipsn";
        gal: "lancer.uiTheme.gal";
      };
    }>;
    "lancer.pauseIcon": foundry.data.fields.StringField<{
      choices: {
        gms: "lancer.pauseIcon.gms";
        horus: "lancer.pauseIcon.horus";
        ha: "lancer.pauseIcon.ha";
        ssc: "lancer.pauseIcon.ssc";
        "ips-n": "lancer.pauseIcon.ipsn";
        albatross: "lancer.pauseIcon.albatross";
        aun: "lancer.pauseIcon.aun";
        barony: "lancer.pauseIcon.barony";
        horizon: "lancer.pauseIcon.horizon";
        ra: "lancer.pauseIcon.ra";
        sparri: "lancer.pauseIcon.sparri";
        voladores: "lancer.pauseIcon.voladores";
      };
    }>;
    // "lancer.warningFor120": boolean; // Old setting, currently unused.
    // "lancer.warningForBeta": boolean; // Old setting, currently unused.

    "dice-so-nice.enabledSimultaneousRollForMessage": boolean;

    "lancer-conditions.keepStockIcons": boolean;
    "lancer-conditions.cancerConditionsStatus": boolean;
    "lancer-conditions.cancerNPCTemplates": boolean;
    "lancer-conditions.hayleyConditionsStatus": boolean;
    "lancer-conditions.hayleyPC": boolean;
    "lancer-conditions.hayleyNPC": boolean;
    "lancer-conditions.hayleyUtility": boolean;
    "lancer-conditions.tommyConditionsStatus": boolean;
    */
  }
}
