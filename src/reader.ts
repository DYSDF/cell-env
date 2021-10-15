import isUndefined from "lodash/isUndefined";
import isFunction from "lodash/isFunction";
import noop from "lodash/noop";
import { PROTECTED_SYMBOL } from './const'
import split from "./split";
import {
  TOnlyStringKey,
  TEnvOptions,
  TEnvCache,
  TEnvOptionItem,
  TProtectedItem
} from "./types";

const { keys, defineProperty } = Object;

/**
 * 配置值读取器.
 *
 * @class Reader
 * @private
 */
export default class Reader<T extends TOnlyStringKey<T>> {
  private global: Partial<T>;
  private url_conf: Partial<T>;
  private options: TEnvOptions<T>;
  private cache: TEnvCache<T>;
  private fit_context: Partial<T>;

  /**
   * 构造函数.
   *
   * @param {Partial} global 全局变量
   * @param {string} url url字符串
   * @param {TEnvOptions} options 配置项
   *
   * @memberof Reader
   */
  constructor(
    global: Partial<T>,
    url: string,
    options: TEnvOptions<T>
  ) {
    this.global = global;
    this.url_conf = split<T>(url);
    this.options = options;

    const cache: TEnvCache<T> = (this.cache = {});
    const fitContext = (this.fit_context = {});

    keys(options).forEach(key => {
      const _k = key.toLowerCase().trim();

      (cache as any)[_k] = noop;
      defineProperty(fitContext, _k, {
        get: () => this.get(_k as keyof T)
      });
    });
  }

  /**
   * 读取配置项.
   *
   * @param {string} key 配置项名称(不区分大小写)，两边的空格会被trim掉.
   * @returns {any} 配置项的值.
   *
   * @memberof Reader
   * @instance
   */
  get<K extends keyof T>(key: K): T[K] {
    const _k = (typeof key === "string" ? key.toLowerCase().trim() : key) as K;
    const cached = this.cache[_k];

    // 命中缓存
    if (cached !== noop) return cached as T[K];

    // 当前项的配置
    const item = this.options[_k];

    if (typeof item === "undefined" || item === null) {
      throw new Error(`Bad key: ${_k}.`);
    }

    if (["string", "number", "boolean"].includes(typeof item)) {
      return item as any;
    }

    // 私有配置
    if ((item as TProtectedItem<T[K]>)[PROTECTED_SYMBOL]) {
      return (item as TProtectedItem<T[K]>).value;
    }

    const { def, fit } = item as TEnvOptionItem<T[K]>;

    // url参数的优先级最高
    let value = this.url_conf[_k];

    if (isUndefined(value)) {
      // 全局变量优先级次之
      value = this.global[_k];
    }

    if (isUndefined(value)) {
      // 默认值优先级最低
      value = def;
    }

    if (isFunction(fit)) {
      // 由于url参数总是字符串, 所以如果必要的话, 这里需要使用一个fit函数转型
      // 如果需要对配置值做一些特殊处理, 也可在fit执行
      value = fit.call(null, value, this.fit_context);
    }

    this.cache[_k] = value;

    return value!;
  }
}
