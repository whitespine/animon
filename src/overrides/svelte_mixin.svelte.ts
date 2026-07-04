import type { EmptyObject, Mixin } from 'fvtt-types/utils';
import { mount, unmount, type Component } from 'svelte';

/*
 * The magic mixin to use for svelte reactive component mounting.
 * Props are minimal:
 * $props = {
 *   app: The Application being rendered
 *   context: The result of _prepareContext
 * } 
 * in general, focus on using _prepareContext, then extract from there the $derived
 */
type Constructable<T> = new (...args: any[]) => T;
type ConstructResult<T extends Constructable<any>> = T extends Constructable<infer U> ? U : never;

export type RenderContextFor<T extends foundry.applications.api.ApplicationV2<any, any, any>> = T extends foundry.applications.api.ApplicationV2<infer U, any, any> ? U : never;
type ConfigurationFor<T extends foundry.applications.api.ApplicationV2<any, any, any>> = T extends foundry.applications.api.ApplicationV2<any, infer U, any> ? U : never;
type RenderOptionsFor<T extends foundry.applications.api.ApplicationV2<any, any, any>> = T extends foundry.applications.api.ApplicationV2<any, any, infer U> ? U : never;


// The types our svelte application mixin provides
type SvelteMixin<RenderContext extends object> = Constructable<{
  props: RenderContext
}> & {
  //PARTS: never,
  //getSheetClassesForSubType: never,
  //getSheetThemeForDocument: never,
  //initializeSheets: never,
  //registerSheet: never,
  //unregisterSheet: never,
  //updateDefaultSheets: never
};

type AppBaseClass = Constructable<foundry.applications.api.ApplicationV2<any, any, any>>; 
type Mix<RenderContext extends object, BaseClass extends AppBaseClass> = Mixin<
  SvelteMixin<RenderContext>,
  BaseClass
>;

/* 
declare class FilePicker<
  RenderContext extends FilePicker.RenderContext = FilePicker.RenderContext,
  Configuration extends FilePicker.Configuration = FilePicker.Configuration,
  RenderOptions extends FilePicker.RenderOptions = FilePicker.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {

 declare function HandlebarsApplicationMixin<BaseClass extends HandlebarsApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): HandlebarsApplicationMixin.Mix<BaseClass>;

  type Mix<BaseClass extends HandlebarsApplicationMixin.BaseClass> = Mixin<typeof HandlebarsApplication, BaseClass>;
  type BaseClass = ApplicationV2.Internal.Constructor;
 */
// foundry.applications.apps.FilePicker

function SvelteApplicationMixin<
  RenderContext extends object,
  // Configuration extends object = EmptyObject,
  // RenderOptions extends object = EmptyObject,
  // BaseApp extends MixableApp<RenderContext> = typeof foundry.applications.api.ApplicationV2<RenderContext>
  // BaseApp extends AppBaseClass = typeof foundry.applications.api.ApplicationV2<RenderContext>
  BaseApp extends AppBaseClass
>(BaseApplication: BaseApp): Mix<RenderContext, BaseApp> {
  class SvelteApplication extends BaseApplication {
    #componentInstance: ReturnType<typeof mount> | null = null;
    props!: RenderContext

    constructor(...args: any[]) {
      super(...args);
    }

    // Provide svelte data via options.svelte
    // Should have .component
    get svelteComponent(): Component {
      // @ts-ignore
      if (!this.options.svelte) throw new Error('No Svelte data found');
      // @ts-ignore
      if (!this.options.svelte.component) throw new Error('No Svelte component found');
      // @ts-ignore
      return this.options.svelte.component;
    }

    // Only destroy component on teardown
    async _tearDown(options: Parameters<foundry.applications.api.ApplicationV2["_tearDown"]>[0] = {}) {
      // Destroy Component instance
      if (this.#componentInstance) {
        unmount(this.#componentInstance);
        this.#componentInstance = null;
      }

      return super._tearDown(options);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async _renderHTML(context: any, _options: any) {
      // Update context for props
      this.props = context;
      return '';
    }

    _replaceHTML(...args: any) { }

    async _renderFrame(options: any) {
      const frame = await super._renderFrame(options);

      const target = this.hasFrame ? frame.querySelector('.window-content') : frame;
      if (!target) return frame;

      const component = this.svelteComponent;

      // target.innerContent = '';
      target.innerHTML = '';
      // @ts-ignore  I don't get why this doesn't work
      this.props = await this._prepareContext(options);
      this.#componentInstance = mount(component, {
        target,
        props: this.props,
      });

      return frame;
    }
  }

  return SvelteApplication;
}

export { SvelteApplicationMixin };