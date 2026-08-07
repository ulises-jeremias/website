export function useExample(initialValue = 0) {
  let count = initialValue;

  return {
    get count() {
      return count;
    },
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
  };
}
