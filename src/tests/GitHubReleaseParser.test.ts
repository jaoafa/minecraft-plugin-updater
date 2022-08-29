import { GitHubReleaseParser } from '@/parser/GitHubReleaseParser'

describe('GitHubReleaseParser', () => {
  it('check (jaoafa/MyMaid4)', async () => {
    const parser = new GitHubReleaseParser({
      repository: 'jaoafa/MyMaid4'
    })
    const result = await parser.parse()

    // latest, versions が必須
    expect(result.latest).toBeDefined()
    expect(result.versions).toBeDefined()

    // バージョン数が1以上であること
    expect(result.versions.length).toBeGreaterThan(0)
    // バージョン名はsemver形式であること
    expect(result.latest.version).toMatch(/^v\d+\.\d+\.\d+$/)
  })
})
