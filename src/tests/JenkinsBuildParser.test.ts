import {JenkinsBuildParser} from "@/parser/JenkinsBuildParser";

describe('JenkinsBuildParser', () => {
  it('check (Citizens2)', async () => {
    const parser = new JenkinsBuildParser({
      domain: 'ci.citizensnpcs.co',
      jobName: 'Citizens2'
    })
    const result = await parser.parse()

    // id は必須で、1以上であること
    expect(result.latest.id).toBeGreaterThan(0)

    // version は必須で、整数であること
    expect(result.latest.version).toBe(parseInt(result.latest.version, 10).toString())

    // downloadUrl は必須で、Jenkins のダウンロード URL 正規表現にマッチすること
    expect(result.latest.downloadUrl).toMatch(/^https:\/\/ci\.citizensnpcs\.co\/job\/Citizens2\/lastSuccessfulBuild\/artifact\/target\/Citizens-.+\.jar$/)
  })
})
