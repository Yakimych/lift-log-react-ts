// @vitest-environment node

import { afterEach, describe, expect, it } from "vitest";
import { adminEmails, isAdminEmail } from "./auth";

const originalSuperuserEmail = process.env.SUPERUSER_EMAIL;

afterEach(() => {
  if (originalSuperuserEmail === undefined) {
    delete process.env.SUPERUSER_EMAIL;
  } else {
    process.env.SUPERUSER_EMAIL = originalSuperuserEmail;
  }
});

describe("master admin designation", () => {
  it("nobody is an admin when SUPERUSER_EMAIL is unset or blank", () => {
    delete process.env.SUPERUSER_EMAIL;
    expect(adminEmails()).toEqual([]);
    expect(isAdminEmail("anyone@example.com")).toBe(false);

    process.env.SUPERUSER_EMAIL = "  , ,";
    expect(adminEmails()).toEqual([]);
    expect(isAdminEmail("anyone@example.com")).toBe(false);
  });

  it("matches case-insensitively and ignores surrounding whitespace", () => {
    process.env.SUPERUSER_EMAIL = " Admin@Example.com , second@example.com ";

    expect(adminEmails()).toEqual(["admin@example.com", "second@example.com"]);
    expect(isAdminEmail("ADMIN@EXAMPLE.COM")).toBe(true);
    expect(isAdminEmail("  admin@example.com  ")).toBe(true);
    expect(isAdminEmail("second@example.com")).toBe(true);
    expect(isAdminEmail("member@example.com")).toBe(false);
  });

  it("treats a missing email as not an admin", () => {
    process.env.SUPERUSER_EMAIL = "admin@example.com";

    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });

  // A substring of a configured address must not pass for it.
  it("does not match a partial address", () => {
    process.env.SUPERUSER_EMAIL = "admin@example.com";

    expect(isAdminEmail("admin@example.com.attacker.test")).toBe(false);
    expect(isAdminEmail("notadmin@example.com")).toBe(false);
  });
});
