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

type MakesProps = { genProps(): any };
type PropType<T extends MakesProps> = T extends { genProps(): infer U } ? Awaited<U> : never;


// The types our svelte application mixin provides
type SAMixin<T extends Constructable<MakesProps>> = new (...args: any) => {
  props: PropType<ConstructResult<T>>
};

type MixableApp = Constructable<
  foundry.applications.api.ApplicationV2 &
  MakesProps
>;
type Mix<T extends MixableApp> = Mixin<SAMixin<T>, T>;

function SvelteApplicationMixin<
  BaseApp extends MixableApp
>(BaseApplication: BaseApp): Mix<BaseApp> {
  class SvelteApplication extends BaseApplication {
    #componentInstance: ReturnType<typeof mount> | null = null;
    props!: PropType<ConstructResult<BaseApp>>;

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
    async _tearDown(options = {}) {
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
      this.props.context = context;
      return '';
    }

    _replaceHTML(...args: any) { }

    async _renderFrame(options: any) {
      const frame = await super._renderFrame(options);

      const target = this.hasFrame ? frame.querySelector('.window-content') : frame;
      if (!target) return frame;

      const component = this.svelteComponent;

      //@ts-ignore
      target.innerContent = '';
      this.props = await this.genProps();
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