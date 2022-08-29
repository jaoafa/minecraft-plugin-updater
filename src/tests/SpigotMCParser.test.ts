import {SpigotMCParser} from "@/parser/SpigotMCParser";

describe('SpigotMCParser', () => {
  it('check (Dynmap)', async () => {
    const parser = new SpigotMCParser({
      resourceId: 274
    })
    const result = await parser.parse()

    // latest, versions が必須
    expect(result.latest).toBeDefined()
    expect(result.versions).toBeDefined()

    // Id は必須で数値であること
    expect(result.latest.id).toBeGreaterThan(0)
    // バージョンはX.Y形式であること
    expect(result.latest.version).toMatch(/^v\d+\.\d+$/)
  })
})
