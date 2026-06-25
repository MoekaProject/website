// 在 release 构建前运行：收集站点用到的字符，
// 按语言从 Noto Serif 字体集生成精确子集，避免日/韩字符被 SC 字体遗漏。
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import subsetFont from 'subset-font'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const fontSourceDir = join(root, '.fontsource')
const fontOutDir = join(root, 'public', 'fonts')
const DOWNLOAD_TIMEOUT_MS = 120_000

// OFL 授权的 Noto Serif 源字体，仅在缓存缺失时下载一次。
const fonts = [
  {
    name: 'NotoSerif',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/NotoSerif%5Bwdth,wght%5D.ttf',
    sourceFile: 'NotoSerif.ttf',
    outFile: 'NotoSerif-subset.woff2',
    includes: isLatinText,
  },
  {
    name: 'NotoSerifSC',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf',
    sourceFile: 'NotoSerifSC.ttf',
    outFile: 'NotoSerifSC-subset.woff2',
    includes: isChineseText,
  },
  {
    name: 'NotoSerifTC',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoseriftc/NotoSerifTC%5Bwght%5D.ttf',
    sourceFile: 'NotoSerifTC.ttf',
    outFile: 'NotoSerifTC-subset.woff2',
    includes: isChineseText,
  },
  {
    name: 'NotoSerifJP',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifjp/NotoSerifJP%5Bwght%5D.ttf',
    sourceFile: 'NotoSerifJP.ttf',
    outFile: 'NotoSerifJP-subset.woff2',
    includes: isJapaneseText,
  },
  {
    name: 'NotoSerifKR',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifkr/NotoSerifKR%5Bwght%5D.ttf',
    sourceFile: 'NotoSerifKR.ttf',
    outFile: 'NotoSerifKR-subset.woff2',
    includes: isKoreanText,
  },
]

// 收集用到字符的源文件（衬线字体用于这些可见文案）
const textSources = [
  'app.vue',
  'pages/index.vue',
  'components/SiteHome.vue',
  'nuxt.config.ts',
]

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function ensureSourceFont(font) {
  const sourcePath = join(fontSourceDir, font.sourceFile)
  if (await exists(sourcePath)) {
    return readFile(sourcePath)
  }
  console.log(`[subset-font] 下载源字体 ${font.name} ...`)
  const signal = AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS)
  const res = await fetch(font.url, { signal })
  if (!res.ok) {
    throw new Error(`下载 ${font.name} 失败: ${res.status} ${res.statusText}`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  await mkdir(fontSourceDir, { recursive: true })
  await writeFile(sourcePath, buffer)
  return buffer
}

async function collectSourceText() {
  let text = ''
  for (const rel of textSources) {
    const file = join(root, rel)
    if (!(await exists(file))) continue
    text += await readFile(file, 'utf8')
  }
  return text
}

function baseCharacters() {
  const chars = new Set()
  for (let code = 0x20; code <= 0x7e; code += 1) {
    chars.add(String.fromCodePoint(code))
  }
  for (const ch of '，。！？、：；（）《》「」『』【】—–…·　') {
    chars.add(ch)
  }
  return chars
}

function collectCharacters(sourceText, includes) {
  const chars = baseCharacters()
  for (const ch of sourceText) {
    if (includes(ch)) {
      chars.add(ch)
    }
  }
  return [...chars].join('')
}

function codePoint(ch) {
  return ch.codePointAt(0)
}

function inRange(value, min, max) {
  return value >= min && value <= max
}

function isLatinText(ch) {
  const code = codePoint(ch)
  return inRange(code, 0x20, 0x7e) || inRange(code, 0xa0, 0x024f)
}

function isHan(ch) {
  const code = codePoint(ch)
  return (
    inRange(code, 0x3400, 0x4dbf) ||
    inRange(code, 0x4e00, 0x9fff) ||
    inRange(code, 0xf900, 0xfaff)
  )
}

function isCjkPunctuation(ch) {
  const code = codePoint(ch)
  return inRange(code, 0x3000, 0x303f) || inRange(code, 0xff00, 0xffef)
}

function isKana(ch) {
  const code = codePoint(ch)
  return inRange(code, 0x3040, 0x30ff) || inRange(code, 0x31f0, 0x31ff)
}

function isHangul(ch) {
  const code = codePoint(ch)
  return (
    inRange(code, 0x1100, 0x11ff) ||
    inRange(code, 0x3130, 0x318f) ||
    inRange(code, 0xac00, 0xd7af)
  )
}

function isChineseText(ch) {
  return isHan(ch) || isCjkPunctuation(ch)
}

function isJapaneseText(ch) {
  return isHan(ch) || isKana(ch) || isCjkPunctuation(ch)
}

function isKoreanText(ch) {
  return isHangul(ch) || isCjkPunctuation(ch)
}

async function subsetOneFont(font, sourceText) {
  const text = collectCharacters(sourceText, font.includes)
  const source = await ensureSourceFont(font)
  const subset = await subsetFont(source, text, { targetFormat: 'woff2' })
  await mkdir(fontOutDir, { recursive: true })
  await writeFile(join(fontOutDir, font.outFile), subset)
  const kb = (subset.length / 1024).toFixed(1)
  console.log(
    `[subset-font] 已生成 public/fonts/${font.outFile}` +
    ` （${[...new Set(text)].length} 个字符，${kb} KB）`,
  )
}

async function main() {
  const sourceText = await collectSourceText()
  for (const font of fonts) {
    await subsetOneFont(font, sourceText)
  }
}

main().catch((error) => {
  console.error('[subset-font] 失败：', error.message)
  process.exitCode = 1
})
