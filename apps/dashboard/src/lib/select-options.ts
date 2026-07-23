export const getSelectOptions = <T, Label extends keyof T, Value extends keyof T>(
  items: T[],
  propsMap: { label: Label; value: Value },
): { label: T[Label]; value: T[Value] }[] => {
  return items.map((item) => ({
    label: item[propsMap.label],
    value: item[propsMap.value],
  }));
};
