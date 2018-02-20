import VueRouter from 'vue-router';
import { Store } from 'vuex';

export type ProviderTypes = 'auth' | 'builder' | 'forms' | 'offline' | 'resource' | 'other';

export interface ProviderInterface {
  name: string;
  title?: string;
  form?: string;
  type?: ProviderTypes;
  titlePlural?: string;
}

export function registerProviders(providers: Provider[], router?: VueRouter, store?: Store<any>) {
  providers.forEach((provider) => {
    provider.name = 'test';
  });
}

export class Provider implements ProviderInterface {
  settings: ProviderInterface;

  public constructor(settings: ProviderInterface) {
    this.settings = settings;
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

  public get type(): ProviderTypes {
    return this.type || 'resource';
  }

  public set type(value: ProviderTypes) {
    this.settings.type = value;
  }
}
