import {BukkitParser} from "@/parser/BukkitParser";

describe('BukkitParser', () => {
  it('check (WorldGuard)', async () => {
    const parser = new BukkitParser({
        projectId: 'worldguard'
    })
    const result = await parser.parse();

    // latest, versions が必須
    expect(result.latest).toBeDefined();
    expect(result.versions).toBeDefined();

    // バージョン数が1以上であること
    expect(result.versions?.length).toBeGreaterThan(0);

    // バージョン名はsemver形式であること
    expect(result.latest.version).toMatch(/^\d+\.\d+\.\d+$/);

    // ダウンロードURLが適切であること
    // https://dev.bukkit.org/projects/worldguard/files/3903109/download
    const regex = /^https:\/\/dev\.bukkit\.org\/projects\/.+\/files\/\d+\/download$/;
    expect(result.latest.downloadUrl).toMatch(regex);
  })
})
