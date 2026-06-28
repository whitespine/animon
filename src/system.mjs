import './system.scss';
import { setupSettings } from './settings';
import { ANIMON } from './consts';
import { setupModels } from './models/config';
import { setupDocuments } from './documents/config';
import { mount } from 'svelte';
import RollerApp from "./components/rolls/Roller.svelte";
import { CustomCombatTracker } from './overrides/CustomCombatTracker.svelte';
import { setupSheets } from './sheets/config';
import { injectAllCoreDocumentsReactivity, injectEmbeddedCollectionsReactivity } from './utils/reactor.svelte';
import { initSockets } from './utils/socket.svelte';
import { GenericComponentApp } from './apps/generic_app';
import { ControlState } from './utils/control.svelte';
import { RollerState } from './components/rolls/roller_modes/roller_state.svelte';

Hooks.once('init', async function () {
  console.log("Initializing ANIMON RPG")
  injectAllCoreDocumentsReactivity();
  injectEmbeddedCollectionsReactivity();
  setupDocuments();
  setupModels();
  setupSettings();
  setupSheets();
  // CONFIG.ui.combat = CustomCombatTracker;
  // CONFIG.debug.hooks = true;

  // Also setup a animon namespace for macros to use
  game.animon = {
    combat: {},
    apps: {
    },
    state: {
      control: ControlState,
      roller: RollerState
    }
  };
});

function maybeShowWelcome() {
  if(game.settings.get(ANIMON.settings.init.welcome)) {
    new GenericComponentApp(WelcomeComponent, {}, {
      width: 400,
      height: 400
    }).render(true);
  }
}


// Init sockets
Hooks.once("ready", async function () {
  initSockets();
});

// HMR reload of various components
if (import.meta.hot) {
  /*
  import.meta.hot.accept("./hooks/hotbar.mjs", module => {
    Hooks.off("hotbarDrop", hot_hooks.hotbar);
    hot_hooks.hotbar = Hooks.on("hotbarDrop", module.onHotbarDrop);
  });
  */
}

Hooks.on('renderHotbar', function (_hotbar, element, _what, _meta) {
  let ui_bottom = document.querySelector("#hotbar");
  mount(RollerApp, {
    target: ui_bottom
  });
});

