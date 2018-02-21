import { Store } from 'vuex';
import { expose } from 'vue-expose-inject';

export type ProviderTypes = 'auth' | 'builder' | 'forms' | 'offline' | 'resource' | 'other';

export interface ProviderInterface {
  name: string;
  title?: string;
  form?: string;
  type?: ProviderTypes;
  titlePlural?: string;
  routes?: any[]
  store?: any,
  children?: Provider[],
  views?: any
}

export class Provider implements ProviderInterface {
  settings: ProviderInterface;
  parent?: Provider;

  public constructor(settings: ProviderInterface, parent?: Provider) {
    this.settings = settings;
    this.parent = parent;
  }

  protected capitalize(value: string): string {
    return value[0].toUpperCase() + value.substring(1);
  }

  protected pluralize(value: string): string {
    return value + 's';
  }

  public get name(): string {
    return this.settings.name;
  }

  public set name(value: string) {
    this.settings.name = value;
  }

  public get title(): string {
    return this.settings.title || this.capitalize(this.name);
  }

  public set title(value: string) {
    this.settings.title = value;
  }

  public get titlePlural(): string {
    return this.settings.titlePlural || this.pluralize(this.title);
  }

  public set titlePlural(value: string) {
    this.settings.titlePlural = value;
  }

  public get form(): string {
    return this.settings.form || this.name.toLowerCase();
  }

  public set form(value: string) {
    this.settings.form = value;
  }

  // public get type(): ProviderTypes {
  //   return this.type || 'resource';
  // }
  //
  // public set type(value: ProviderTypes) {
  //   this.settings.type = value;
  // }
  //
  public get children(): Provider[] {
    return this.settings.children || [];
  }

  public get rootPath(): string {
    return (this.parent ? this.parent.path : '') + '/' + this.name;
  }

  public get path(): string {
    return this.rootPath + '/:id';
  }

  public init(Vue: any) {
    this.children.forEach(child => {
      child.init(Vue);
    });
  }

  public registerRoutes(router: any) {
    router.addRoutes([
      {
        path: this.rootPath,
        component: {
          mixins: [expose],
          expose: () => ({
            $provider: this
          }),
          render(createElement: any) {
            return createElement('router-view')
          }
        },
        children: this.settings.routes
      }
    ]);

    this.children.forEach(child => {
      child.registerRoutes(router);
    });
  }

  public registerStore(store: any) {
    this.children.forEach(child => {
      child.registerStore(store);
    });
  }
}
