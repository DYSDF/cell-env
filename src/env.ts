import get from 'lodash/get'
import { DEFAULT_GLOBAL_NAME, PROTECTED_SYMBOL } from './const'
import Reader from "./reader";
import helper from "./helper";
import {
  TOnlyStringKey,
  TMockBrowser,
  TProtectedItem,
  TEnvOptions,
  TEnv
} from "./types";

/**
 * 读取配置数据.
 *
 * @param {TEnvOptions<T>} options 配置项, 键为env字段名(不区分大小写, 两边的空格会被trim掉),
 *   值为相应的读取配置, 支持fit, deps, def.
 * @param {string | TMockBrowser<T>} name 全局配置变量名, 默认为`__env__`,
 *   如果传入一个对象, 则不读取全局变量和url参数,
 *   而是直接读传入对象的url和global字段, 用来在非浏览器环境中测试.
 * @returns {Required<T>} 配置读取结果, 格式为键值对.
 * @function
 */
function EnvCreator<T extends TOnlyStringKey<T>>(
  options: TEnvOptions<T>,
  name?: string | TMockBrowser<T>
): Required<T> {
  let global;
  let url;
  const g: any = globalThis;

  if (!name) name = DEFAULT_GLOBAL_NAME;

  if (typeof name === "string") {
    global = g[name] ?? {};
    url = get(globalThis, ['location', 'search'], '');
  } else {
    global = name.global ?? {};
    url = name.url ?? "";
  }

  const reader = new Reader(global, url, options);

  return Object.keys(options)
    .map(key => key.trim().toLowerCase())
    .map(key => {
      return { key, value: reader.get(key as keyof T) };
    })
    .reduce((prev, item) => {
      (prev as any)[item.key] = item.value;
      return prev;
    }, {} as Required<T>);
}

const protect = <T>(value: T): TProtectedItem<T> => {
  return {
    [PROTECTED_SYMBOL]: true,
    value
  };
};

const Env: TEnv = (() => {
  const creator: any = EnvCreator;
  creator.helper = helper;
  creator.protect = protect;
  return creator;
})();

export default Env;
