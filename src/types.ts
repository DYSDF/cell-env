import { PROTECTED_SYMBOL } from './const'

type FNoop = (...args: any[]) => void;

export type TOnlyStringKey<T> = {
  [K in keyof T]: K extends string ? T[K] : never;
};

export type TEnvCache<T> = {
  [K in keyof T]?: T[K] | FNoop;
};

export type TMockBrowser<T> = {
  url: string;
  global: Partial<T>;
};

export type TEnvOptionItem<V> = {
  def?: V;
  fit?: (value: any, ...args: Array<any>) => V;
};

export type TProtectedItem<V> = {
  [PROTECTED_SYMBOL]: boolean;
  value: V;
};

export type TSelf<V> = V;

export type TEnvOptions<T extends TOnlyStringKey<T>> = {
  [K in keyof T]:
    | TEnvOptionItem<T[K]>
    | TProtectedItem<T[K]>
    | TSelf<T[K]>;
};

type TProtect = <V>(value: V) => TProtectedItem<V>;

export type TEnv = {
  <T extends TOnlyStringKey<T>>(
    options: TEnvOptions<T>,
    name?: string | TMockBrowser<T>
  ): Required<T>;
  helper: {
    fit: {
      number: (value: any) => number;
      string: (value: any) => string;
      bool: (value: any) => boolean;
      strings: (value: any) => string[];
    };
  };
  protect: TProtect;
};
