import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const frontendRoot = path.resolve(__dirname, "../../..");
const scriptPath = path.join(frontendRoot, "scripts/auditor-de-interface.mjs");

describe("auditor_de_interface", () => {
  it("executa em modo advisory e retorna exit code 0", () => {
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: frontendRoot,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("auditor_de_interface advisory");
    expect(result.stdout).toContain("mode: advisory");
    expect(result.stdout).toContain("critical-advisory: 0");
    expect(result.stdout).toContain("warning: 0");
  });

  it("falha apenas em erro operacional de leitura", () => {
    const result = spawnSync(
      process.execPath,
      [scriptPath, "--root", path.join(frontendRoot, "src", "__tests__")],
      {
        cwd: frontendRoot,
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("auditor_de_interface operational-error");
  });
});
