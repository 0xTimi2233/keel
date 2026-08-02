import assert from "node:assert/strict";
import test from "node:test";

import { validateSkillName } from "../../lib/skills.mjs";

test("skill names cannot escape the installation directory", () => {
  assert.equal(validateSkillName("grill-with-docs"), "grill-with-docs");
  assert.throws(() => validateSkillName("../../outside"), /safe path segment/u);
  assert.throws(() => validateSkillName("nested/skill"), /safe path segment/u);
  assert.throws(() => validateSkillName("nested\\skill"), /safe path segment/u);
});

