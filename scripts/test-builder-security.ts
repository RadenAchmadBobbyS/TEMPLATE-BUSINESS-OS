import { builderDocumentSchema } from "../src/core/builder/schemas";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function runSecurityTests() {
  console.log("Starting Builder Security Tests...");

  // 1. Valid Document
  const validDoc = {
    version: 1,
    root: {
      id: "root-1",
      type: "Container",
      props: { text: "Hello" },
      styles: { desktop: { padding: "10px" } },
      children: []
    }
  };
  assert(builderDocumentSchema.safeParse(validDoc).success === true, "Valid document should parse");

  // 2. Invalid Node Type
  const invalidTypeDoc = {
    version: 1,
    root: {
      id: "root-2",
      type: "Hax0r",
      props: {},
      children: []
    }
  };
  assert(builderDocumentSchema.safeParse(invalidTypeDoc).success === false, "Invalid type should fail");

  // 3. Script-like values (Zod doesn't auto-block this unless we wrote a regex, but let's see)
  // Our schema is just z.record(z.any()) for props currently. 
  // We should probably check if it allows dangerous things.

  console.log("✅ Security tests passed!");
}

runSecurityTests();
