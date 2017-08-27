import { Context, defaultProps } from "../../dist/yodata-context";

describe(`helpers and utilities`, () => {
  test(`calculated values`, () => {
    let context = new Context({
      type: () => ["a", "b"]
    });
    let data = {
      type: "a",
      b: "type"
    };
    let result = {
      type: ["a", "b"],
      b: ["a", "b"]
    };
    expect(context.map(data)).toEqual(result);

    let deep = {
      items: {
        type: "test"
      }
    };
    expect(context.map(deep)).toEqual({
      items: {
        type: ["a", "b"]
      }
    });
    let arr = {
      items: [
        {
          type: "a"
        },
        {
          type: "b"
        }
      ]
    };
    expect(context.map(arr)).toEqual({
      items: [
        {
          type: ["a", "b"]
        },
        {
          type: ["a", "b"]
        }
      ]
    });
  });

  test(`defaultProps - object value`, () => {
    let context = new Context({
      item: defaultProps({
        type: "Thing"
      })
    });
    let data = { item: { id: 1 } };
    let expected = {
      item: {
        id: 1,
        type: "Thing"
      }
    };
    expect(context.map(data)).toEqual(expected);
  });

  test(`defaultProps - array of objects`, () => {
    let context = new Context({
      item: defaultProps({
        type: "Thing"
      })
    });
    let data = { item: [{ id: 1 }] };
    let expected = {
      item: [
        {
          id: 1,
          type: "Thing"
        }
      ]
    };
    expect(context.map(data)).toEqual(expected);
  });

  test(`defaultProps - called on non-objects returns value`, () => {
    let context = new Context({
      a: defaultProps({ type: "Thing" })
    });
    let data = {
      a: "string"
    };
    expect(context.map(data)).toEqual({ a: "string" });
  });

  test(`use a value reducer to create a calculated field`, () => {
    let data = {
      key: 1,
      nextKey: 0
    };
    let context = new Context({
      nextKey: ({ last }) => last.key + 1
    });
    expect(context.map(data)).toEqual({
      key: 1,
      nextKey: 2
    });
  });

  test(`context functions can mutate the root object`, () => {
    let data = {
      event: {
        primary: "Add",
        secondary: ["Update"]
      }
    };
    let context = new Context({
      event: {
        key: "action",
        val: ({ value, last }) => ({ type: value.primary })
      }
    });
    let result = context.map(data);
    expect(result).toMatchObject({
      action: {
        type: "Add"
      }
    });
  });

  test(`extend source or set defaults with initialValue`, () => {
    let data = {
      key: 1
    };
    let context = new Context({
      key: "id"
    });
    let initialValue = {
      type: "Person",
      name: "Dave"
    };
    expect(context.map(data, initialValue)).toEqual({
      id: 1,
      type: "Person",
      name: "Dave"
    });
  });
});
