import { describe, expect, it } from "vitest";

import { findDangerousKeys, hasExecutableCode } from "./index.js";

describe("contract safety runtime", () => {
  it("finds dangerous keys recursively", () => {
    expect(
      findDangerousKeys({
        props: {
          params: {
            constructor: { polluted: true }
          }
        }
      }).map((item) => item.key)
    ).toEqual(["constructor"]);
  });

  it("detects executable schema code attempts", () => {
    expect(hasExecutableCode({ props: { validator: "function validate() { return true; }" } })).toBe(
      true
    );
    expect(hasExecutableCode({ props: { label: "Safe text" } })).toBe(false);
  });
});
