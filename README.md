# Quicksilver System Template for FoundryVTT

An generic system template for Svelte foundry systems

This system is compatible with v13+ only, as unfortunately v12's ui code was so painful I just did not want to deal with it.



# Everything below here might be useful for an actual system 

## Acknowledgements

Who might you thank?

## Installing

The package will (ideally) be available directly via the foundry vtt module installer, under the id `MY_SYSTEM_ID`.

Alternatively, it can be installed via the manifest url:

```
https://github.com/MY_GITHUB/MY_SYSTEM_ID/releases/latest/download/system.json
```

## Contributing

How might people contribute?

### Publishing new versions
Is accomplished by github actions. You must configure 
`Settings -> Secrets and variables -> Actions -> PACKAGE_TOKEN`
to be the one provided by the foundry portal

### Development

The project can be built and run locally via the following steps.
1. To link the developer build directory to the 
   `npm run build`
   `ln -s $(pwd)/dist /path/to/vtt/data/Data/systems/MY_SYSTEM_ID`
2. Perform an initial `npm ci` and `npm run build` to populate the dist directory.
   This will also need to be run to populate any asset files stored in the public directory,
   if you should ever change those.
3. As a start to setup, replace all instances of the following strings with appropriate values:
- MY_SYSTEM_ID -> dnd5e, or whatever
- MY_SYSTEM_CONSTS -> DND5E, or whatever
- MY_GITHUB -> whitespine, or whatever
4. Then, to run the vite development server, edit `vite.config.js` to match whatever port you 
   are running foundry on on your local machine. 
   While running, all code changes should be hot (or at least lukewarm) reloaded in the vite proxy server.

#### Adding a new actor / item type
To add a new actor / item:
- Modify `public/template.json` to include it in the "Actor"."types" field
   - For biography and other rich text fields, augment "htmlFields"
- Modify `public/languages/en.json` to properly name the type in "TYPES"
- Add an appropriate new svelte component to `src/components/sheets`
   - This is what will be rendered in the sheet. Do whatever structure you like!
- Add a new sheet class to `src/sheets/ActorSheet.js` or `src/sheets/ItemSheet.js`
- Add proper registration of new sheet to `src/sheets/config.js`
- Add a new model class to `src/models` extending the appropriate supertype
- Add proper model registration of new model to `src/models/config.js`

#### Showing an arbitrary svelte component window
To show a generic svelte component (say, a welcome window, a damage calculator, whatever), you can use the `GenericComponentApp` in `src/apps/generic_app.js`, supplying
- The class of the svelte component as the first argument
- Initial props of the svelte component as the second argument
This should be fine for most cases that don't need custom toolbar buttons etcetera

#### Overriding a sidebar tab
To override a sidebar tab
- Add a line to `Hooks.once('init', async function ()` in `src/system.mjs`
   - EX: `CONFIG.ui.combat = CustomCombatTracker;`
   - The specific `CONFIG.ui` property will depend on the tab you are editing
- The sidebar tab should slot in automagically

To add a new sidebar tab, e.x. a dedicated region for face cams
- TODO: Polish this more
- Add a new CustomSidebarTab class
```js
export class CustomSidebarTab extends SvelteApplicationMixin(foundry.applications.sidebar.AbstractSidebarTab) {
    static DEFAULT_OPTIONS = {
        window: {
            title: "Whatever"
        },
        svelte: {
            component: CustomSidebarComponent
        },
        classes: ["MY_SYSTEM_ID"]
    }

    static tabName = "whatever";

    async _prepareContext() {
      // Yield some state
      return {
      "foo": "bar"
      };
    }
}
export class CustomSidebarTab extends foundry.applications.sidebar.AbstractSidebarTab {
    static DEFAULT_OPTIONS = {
        window: {
            title: "Whatever"
        },
        svelte: {
            component: CustomSidebarComponent
        },
        classes: ["MY_SYSTEM_ID"]
    }

    static tabName = "whatever";

    async _prepareContext() {
      // Yield some state
      return {
      "foo": "bar"
      };
    }
}
```
- Add a new custom sidebar class to override the base behavior
```js
class CustomSidebar extends SvelteApplicationMixin(foundry.applications.sidebar.AbstractSidebarTab)  {
   getData(options={}) {
      let base = super.getData(options);
      base.tabs.custom = {
         tooltip: "foo",
         icon: "bar"
      }
      return base;
   }
}
```
- Register it: `CONFIG.ui.sidebar = CustomSidebar`

#### Overriding combat logic
To override combat logic
- Follow above sidebar logic with the following caveats
   - Edit `src/system.mjs` to no longer comment `CONFIG.ui.combat = CustomCombatTracker;`
- Edit `src/documents/token.js` to not comment out `_refreshTurnMarker`
- In the above, correct logic to properly decide when to / when not to show a turn marker
- Edit `src/documents/combat.js` to include combat rules 
   - The links therein should have most of what you need as examples on how to do this



#### Registering a new socket event
- `src/consts.js` add a new constant to the `sockets` sub object representing your new socket event
- `src/utils/socket.svelte.js` modify initSockets to handle your new constant with a special handler

### Suggested contributions

What do you need help with?