/**
 * 将url参数分割为键值对.
 *
 * @param {string} url search部分, 可以通过window.location.search取得.
 * @returns {Record<string, string>} url参数表.
 * @private
 */
export default function split<T extends {}>(searchStr: string): Partial<T> {
  const queries = searchStr.replace(/^\?/, "").split("&");

  return queries.map(query => {
    let [key, value] = query.split("=", 2);

    key = key.trim().toLowerCase(); // 不分大小写

    if (!key.length) return

    value = decodeURIComponent(value || "").trim(); // value忽略两端空格

    return { key, value };
  }).reduce((prev, item) => {
    if (item) {
      (prev as any)[item.key] = item.value;
    }
    return prev;
  }, {} as Partial<T>);
}
