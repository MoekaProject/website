<script setup lang="ts">
import { useHead, useRoute, useRouter, useRuntimeConfig } from '#imports'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import logo from '../assets/logo.svg'
import logoEn from '../assets/logo-en.svg'

// Nine cut-out stamps fanned out in a central arc over the background.
const runtimeConfig = useRuntimeConfig()
const appBaseURL = runtimeConfig.app.baseURL
const siteURL = runtimeConfig.public.siteURL.replace(/\/$/, '')
const sitePath = (path: string) => appBaseURL === '/' ? path : `${appBaseURL.replace(/\/$/, '')}${path}`
const absoluteSiteURL = (path: string) => `${siteURL}${sitePath(path)}`
const imagePath = (name: string) => sitePath(`/images/${name}`)
const stamps = Array.from({ length: 9 }, (_, index) => imagePath(`stamp-${index + 1}.webp`))
const circles = Array.from({ length: 9 }, (_, index) => imagePath(`screenshots/circle-${index + 1}.png`))

const navItemKeys = ['intro', 'features', 'requirements', 'download'] as const
const localeOptions = [
  { key: 'zhHans', slug: 'zh-cn', path: '/zh-cn', htmlLang: 'zh-CN', hreflang: 'zh-CN', ogLocale: 'zh_CN' },
  { key: 'zhHant', slug: 'zh-tw', path: '/zh-tw', htmlLang: 'zh-Hant', hreflang: 'zh-Hant', ogLocale: 'zh_TW' },
  { key: 'ja', slug: 'ja', path: '/ja', htmlLang: 'ja', hreflang: 'ja', ogLocale: 'ja_JP' },
  { key: 'ko', slug: 'ko', path: '/ko', htmlLang: 'ko', hreflang: 'ko', ogLocale: 'ko_KR' },
  { key: 'en', slug: 'en', path: '/en', htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US' },
] as const
const navHashes = {
  intro: '#intro',
  features: 'https://github.com/MoekaProject/community/releases',
  requirements: 'https://github.com/MoekaProject/community/issues',
  download: '#faq',
} as const
const route = useRoute()
const router = useRouter()
const routeLocale = computed(() => String(route.params.locale || '').toLowerCase())
const activeLocale = computed(() => localeOptions.find((locale) => locale.slug === routeLocale.value) ?? localeOptions[0])
const activeLanguageKey = computed(() => activeLocale.value.key)
const localeFontFiles = {
  zhHans: 'NotoSerifSC-subset.woff2',
  zhHant: 'NotoSerifTC-subset.woff2',
  ja: 'NotoSerifJP-subset.woff2',
  ko: 'NotoSerifKR-subset.woff2',
  en: 'NotoSerif-subset.woff2',
} as const
const activeFontHref = computed(() => sitePath(`/fonts/${localeFontFiles[activeLanguageKey.value]}`))
const macosArm64DownloadUrl = 'https://github.com/MoekaProject/community/releases/latest/download/Moeka-macos-arm64.dmg'
const macosX64DownloadUrl = 'https://github.com/MoekaProject/community/releases/latest/download/Moeka-macos-x86_64.dmg'

const translations = {
  zhHans: {
    seo: {
      title: '小语文稿 - Moeka',
      description: '小语文稿 - Moeka，优雅流畅的高性能 Markdown 编辑体验。',
      ogDescription: '言渡四海，意会千山，适合文本创作，也适合高密内容记录。',
    },
    languageLabel: '简体中文',
    languageAria: '切换语言',
    nav: {
      intro: '简介',
      features: '更新',
      requirements: '问题',
      download: '答疑',
    },
    topbarAria: '主导航',
    heroName: '小语文稿',
    tagline: ['言渡四海', '意会千山'],
    actions: {
      download: '应用下载',
      help: '问题报告',
    },
    featureAria: '滚动切换特性文案',
    actionsAria: '主要操作',
    screenshotAlt: '小语文稿应用界面截图',
    showcase: {
      lead: '本地优先，简洁流畅的',
      leadTitle: '高性能 Markdown 编辑体验',
      performance: ['适合文本创作，', '也适合高密内容记录。'],
      zeroConfig: ['上手零配置，', '可爱又专业。'],
      themes: ['持续迭代，', '但始终保持简单优雅。'],
      copyright: '©2026 小语文稿制作委员会',
    },
    faqTitle: '问题解答',
    faqIssues: {
      before: '你可以在 GitHub 仓库的 ',
      link: 'Issues 页面',
      after: '提交问题或需求，合理的反馈都会被采纳集成。',
    },
    downloadOptions: [
      { label: 'macOS (M 芯片)', href: macosArm64DownloadUrl },
      { label: 'macOS (Intel)', href: macosX64DownloadUrl },
      { label: 'Windows (稍后推出)', disabled: true },
      { label: 'Linux (稍后推出)', disabled: true },
    ],
    features: [
      {
        title: '自研编辑器内核',
        description: '基于 Rust + GPUI 渲染的 UI 与编辑器，流畅跟手。',
      },
      {
        title: '高密度内容友好的排版',
        description: '代码式纯文本编辑体验，格式之上也能掌控每个字符。',
      },
      {
        title: '扩展语法支持',
        description: '双向链接，表格，上下标，脚注，公式与图表。',
      },
      {
        title: '实时 Git 与 Diff 集成',
        description: '支持文件历史回滚，内容改动实时 Diff。',
      },
      {
        title: 'Agent 终端集成',
        description: '可 @文件或选区，和喜爱的 Agent CLI 聊天。',
      },
      {
        title: '完全无联网的本地文件管理',
        description: '支持代码文本编辑，图片预览，文件粘贴与拖拽。',
      },
      {
        title: '多样的主题配色',
        description: 'UI 与高亮风格调整，提供多样复古风格主题。',
      },
      {
        title: '多工作区与文件树',
        description: '工作区与文件树即时切换，超快的检索与命令响应。',
      },
      {
        title: '多光标与操作快捷键',
        description: '多光标选择，编辑与替换，兼容大多数代码行操作。',
      },
    ],
    faqItems: [
      {
        question: '小语文稿是什么，它免费吗？',
        answer: '完全免费的 Markdown 编辑应用，所有操作均在离线本地完成，未来也仅针对外观增强等提供付费选项。',
      },
      {
        question: '它和 Obsidian，Typora 等本地编辑器有什么不同？',
        answer: '集成了简单但高频使用率的功能，基于 GPU 的渲染技术让应用流畅而低资源占用，在细节上做到极致打磨，但不堆叠功能。',
      },
      {
        question: '应用是否需要联网使用？',
        answer: '所有操作包括文件管理完全在本地完成，纯离线无网络交互，仅在应用自动更新时（访问 GitHub）会联网。',
      },
      {
        question: '小语文稿是基于什么技术实现的？',
        answer: '它基于 Rust + GPUI，不使用 Web 技术，在各平台上使用 GPU 渲染以达到原生应用的性能与低资源占用。',
      },
      {
        question: '会支持 Windows 和 Linux 以及移动端吗？',
        answer: '我们在计划逐步提供更多平台版本，目前仍在完善 macOS 系统下的体验和细节。',
      },
      {
        question: '我可以在哪里反馈问题或提出需求呢？',
        answer: '',
      },
    ],
  },
  zhHant: {
    seo: {
      title: '小語文稿 - Moeka',
      description: '小語文稿 - Moeka，優雅流暢的高效能 Markdown 編輯體驗。',
      ogDescription: '言渡四海，意會千山，適合文字創作，也適合高密度內容記錄。',
    },
    languageLabel: '繁体中文',
    languageAria: '切換語言',
    nav: {
      intro: '簡介',
      features: '更新',
      requirements: '問題',
      download: '問答',
    },
    topbarAria: '主導覽',
    heroName: '小語文稿',
    tagline: ['言渡四海', '意會千山'],
    actions: {
      download: '應用下載',
      help: '問題回報',
    },
    featureAria: '捲動切換特性文案',
    actionsAria: '主要操作',
    screenshotAlt: '小語文稿應用程式介面截圖',
    showcase: {
      lead: '本機優先，簡潔流暢的',
      leadTitle: '高效能 Markdown 編輯體驗',
      performance: ['適合文字創作，', '也適合高密度內容記錄。'],
      zeroConfig: ['上手零設定，', '可愛又專業。'],
      themes: ['持續迭代，', '但始終簡單優雅。'],
      copyright: '©2026 小語文稿製作委員會',
    },
    faqTitle: '問題解答',
    faqIssues: {
      before: '可在 GitHub 的 ',
      link: 'Issues 頁面',
      after: '提交問題或需求，合理的回饋都會被採納整合。',
    },
    downloadOptions: [
      { label: 'macOS (M 晶片)', href: macosArm64DownloadUrl },
      { label: 'macOS (Intel)', href: macosX64DownloadUrl },
      { label: 'Windows (即將推出)', disabled: true },
      { label: 'Linux (即將推出)', disabled: true },
    ],
    features: [
      {
        title: '自研編輯器核心',
        description: '以 Rust + GPUI 渲染 UI 與編輯器，流暢跟手。',
      },
      {
        title: '適合高密度內容的排版',
        description: '程式碼式純文字體驗，格式之上也能掌控每個字元。',
      },
      {
        title: '擴充語法支援',
        description: '雙向連結、表格、上下標、腳註、公式與圖表。',
      },
      {
        title: '即時 Git 與 Diff 整合',
        description: '支援檔案歷史回滾，內容改動即時 Diff。',
      },
      {
        title: 'Agent 終端整合',
        description: '可 @檔案或選區，和喜愛的 Agent CLI 聊天。',
      },
      {
        title: '完全離線的本機檔案管理',
        description: '支援程式碼文字編輯、圖片預覽、檔案貼上與拖放',
      },
      {
        title: '多樣的主題配色',
        description: '調整 UI 與醒目提示，提供多樣復古風格主題。',
      },
      {
        title: '多工作區與檔案樹',
        description: '工作區與檔案樹即時切換，快速搜尋與命令回應。',
      },
      {
        title: '多游標與編輯快捷鍵',
        description: '多游標選取、編輯與取代，相容多數程式碼編輯操作。',
      },
    ],
    faqItems: [
      {
        question: '小語文稿是什麼，免費嗎？',
        answer: '完全免費的 Markdown 編輯器，所有操作都在離線本機完成，未來僅針對新增外觀增強提供付費選項。',
      },
      {
        question: '和 Obsidian、Typora 有何不同？',
        answer: '整合簡單且高頻的功能，GPU 渲染讓應用流暢且低耗能，細節精緻但不堆疊功能。',
      },
      {
        question: '需要連網使用嗎？',
        answer: '所有操作與檔案管理都在本機完成，純離線無網路互動，僅自動更新時會連線到 GitHub。',
      },
      {
        question: '它用什麼技術實作？',
        answer: '基於 Rust + GPUI，不使用 Web 技術，並在各平台以 GPU 渲染取得原生效能與低資源占用。',
      },
      {
        question: '會支援 Windows、Linux 和行動端嗎？',
        answer: '更多平台版本正在規劃中，目前仍專注打磨 macOS 體驗與細節。',
      },
      {
        question: '在哪裡回報問題或需求？',
        answer: '',
      },
    ],
  },
  ja: {
    seo: {
      title: '小語文稿 - Moeka',
      description: '小語文稿 - Moeka。優雅でなめらかな高性能 Markdown 編集体験。',
      ogDescription: '言葉は海を渡り、想いは山を越える。文章制作にも、高密度な記録にも。',
    },
    languageLabel: '日本語',
    languageAria: '言語を切り替え',
    nav: {
      intro: '概要',
      features: '更新',
      requirements: '問題',
      download: 'Q&A',
    },
    topbarAria: 'メインナビゲーション',
    heroName: '小語文稿',
    tagline: ['言葉は海を渡り', '想いは山を越える'],
    actions: {
      download: '入手',
      help: '問題を報告',
    },
    featureAria: 'スクロールで機能コピーを切り替え',
    actionsAria: '主な操作',
    screenshotAlt: '小語文稿アプリ画面のスクリーンショット',
    showcase: {
      lead: 'ローカル優先、シンプルでなめらかな',
      leadTitle: '高速 Markdown 編集体験',
      performance: ['文章にも、', '高密度な記録にも。'],
      zeroConfig: ['設定いらずで、', 'かわいく本格的。'],
      themes: ['進化を続けても、', 'シンプルで上品。'],
      copyright: '©2026 小語文稿制作委員会',
    },
    faqTitle: 'Q&A',
    faqIssues: {
      before: 'GitHub の ',
      link: 'Issues ページ',
      after: 'から報告できます。妥当な提案は順次反映します。',
    },
    downloadOptions: [
      { label: 'macOS (M チップ)', href: macosArm64DownloadUrl },
      { label: 'macOS (Intel)', href: macosX64DownloadUrl },
      { label: 'Windows (近日)', disabled: true },
      { label: 'Linux (近日)', disabled: true },
    ],
    features: [
      {
        title: '独自エディターコア',
        description: 'Rust + GPUI 製の UI とエディターで軽快に動作。',
      },
      {
        title: '密な文書も読みやすく',
        description: 'コード感覚のプレーンテキストで文字単位に制御。',
      },
      {
        title: '拡張記法',
        description: '双方向リンク、表、上下付き文字、脚注、数式、図表。',
      },
      {
        title: 'Git / Diff 連携',
        description: '履歴を復元し、内容の変更をリアルタイム表示。',
      },
      {
        title: 'Agent ターミナル連携',
        description: 'ファイルや選択範囲を @ して Agent CLI と対話。',
      },
      {
        title: 'オフラインファイル管理',
        description: 'テキスト編集、画像表示、貼り付け、ドラッグ',
      },
      {
        title: '多彩なテーマ',
        description: 'UI とハイライトを調整したレトロテーマ。',
      },
      {
        title: '複数ワークスペースとファイルツリー',
        description: '即時切り替え、高速検索、素早いコマンド応答。',
      },
      {
        title: 'マルチカーソルと編集ショートカット',
        description: '選択、編集、置換など一般的なコード編集操作に対応。',
      },
    ],
    faqItems: [
      {
        question: '小語文稿とは？無料ですか？',
        answer: '無料の Markdown エディターです。操作はすべてローカルで完結し、将来は外観強化など一部のみ有料予定です。',
      },
      {
        question: 'Obsidian や Typora との違いは？',
        answer: 'よく使う機能を絞って統合。GPU 描画で軽くなめらかに動き、細部を磨きながら機能を増やしすぎません。',
      },
      {
        question: 'ネット接続は必要ですか？',
        answer: 'ファイル管理を含む操作はすべてローカルです。通常はオフラインで、自動更新時のみ GitHub に接続します。',
      },
      {
        question: 'どんな技術で作られていますか？',
        answer: 'Rust + GPUI 製です。Web 技術は使わず、各プラットフォームで GPU 描画し、ネイティブ性能と低負荷を目指します。',
      },
      {
        question: 'Windows、Linux、モバイル対応は？',
        answer: '対応版を順次計画中です。現在は macOS 版の体験と細部を磨いています。',
      },
      {
        question: '不具合や要望はどこへ？',
        answer: '',
      },
    ],
  },
  ko: {
    seo: {
      title: '소어문고 - Moeka',
      description: '소어문고 - Moeka, 우아하고 매끄러운 고성능 Markdown 편집 경험.',
      ogDescription: '말은 바다를 건너고, 뜻은 산을 넘는다. 글쓰기에도, 고밀도 기록에도.',
    },
    languageLabel: '한국어',
    languageAria: '언어 전환',
    nav: {
      intro: '소개',
      features: '업데이트',
      requirements: '문제',
      download: 'FAQ',
    },
    topbarAria: '주요 내비게이션',
    heroName: '소어문고',
    tagline: ['말은 바다를 건너고', '뜻은 산을 넘는다'],
    actions: {
      download: '앱 받기',
      help: '문제 신고',
    },
    featureAria: '스크롤로 기능 문구 전환',
    actionsAria: '주요 작업',
    screenshotAlt: '소어문고 앱 화면 스크린샷',
    showcase: {
      lead: '로컬 우선, 단순하고 매끄러운',
      leadTitle: '고성능 Markdown 편집 경험',
      performance: ['글쓰기에도,', '고밀도 기록에도.'],
      zeroConfig: ['설정 없이 바로,', '귀엽고 전문적으로.'],
      themes: ['계속 발전해도,', '단순하고 우아하게.'],
      copyright: '©2026 소어문고 제작위원회',
    },
    faqTitle: '질문 답변',
    faqIssues: {
      before: 'GitHub의 ',
      link: 'Issues 페이지',
      after: '에서 문제나 요청을 남길 수 있습니다. 합리적인 의견은 반영합니다.',
    },
    downloadOptions: [
      { label: 'macOS (M 칩)', href: macosArm64DownloadUrl },
      { label: 'macOS (Intel)', href: macosX64DownloadUrl },
      { label: 'Windows (예정)', disabled: true },
      { label: 'Linux (예정)', disabled: true },
    ],
    features: [
      {
        title: '자체 편집기 코어',
        description: 'Rust + GPUI 기반 UI와 편집기로 매끄럽게 반응합니다.',
      },
      {
        title: '밀도 높은 문서 조판',
        description: '코드형 순수 텍스트로 문자 단위까지 제어합니다.',
      },
      {
        title: '확장 문법',
        description: '양방향 링크, 표, 위첨자, 아래첨자, 각주, 수식, 차트.',
      },
      {
        title: 'Git / Diff 연동',
        description: '파일 기록 복원과 내용 변경 Diff를 실시간 확인합니다.',
      },
      {
        title: 'Agent 터미널 연동',
        description: '파일이나 선택 영역을 @해 Agent CLI와 대화합니다.',
      },
      {
        title: '오프라인 파일 관리',
        description: '텍스트 편집, 이미지 보기, 붙여넣기, 드래그',
      },
      {
        title: '다양한 테마 색상',
        description: 'UI와 강조 스타일을 다듬은 여러 레트로 테마.',
      },
      {
        title: '다중 작업 공간과 파일 트리',
        description: '즉시 전환하고 빠르게 검색하며 명령에 응답합니다.',
      },
      {
        title: '다중 커서와 편집 단축키',
        description: '선택, 편집, 바꾸기 등 일반적인 코드 편집 작업을 지원합니다.',
      },
    ],
    faqItems: [
      {
        question: '소어문고는 무엇이며 무료인가요?',
        answer: '완전 무료 Markdown 편집기입니다. 모든 작업은 로컬 오프라인에서 완료되며, 향후 일부 외관 강화만 유료 옵션으로 제공됩니다.',
      },
      {
        question: 'Obsidian, Typora와 무엇이 다른가요?',
        answer: '단순하지만 자주 쓰는 기능을 통합했습니다. GPU 렌더링으로 부드럽고 가볍게 동작하며, 기능을 쌓기보다 세부를 다듬습니다.',
      },
      {
        question: '인터넷 연결이 필요한가요?',
        answer: '파일 관리를 포함한 모든 작업은 로컬에서 처리됩니다. 평소에는 완전 오프라인이며, 자동 업데이트 때만 GitHub에 접속합니다.',
      },
      {
        question: '어떤 기술로 만들었나요?',
        answer: 'Rust + GPUI 기반입니다. Web 기술을 쓰지 않고 각 플랫폼에서 GPU로 렌더링해 네이티브 성능과 낮은 자원 사용을 지향합니다.',
      },
      {
        question: 'Windows, Linux, 모바일도 지원하나요?',
        answer: '더 많은 플랫폼 버전을 차례로 계획 중이며, 현재는 macOS 경험과 세부를 다듬고 있습니다.',
      },
      {
        question: '문제나 요청은 어디에 남기나요?',
        answer: '',
      },
    ],
  },
  en: {
    seo: {
      title: 'Moeka - Markdown Editor',
      description: 'Moeka offers an elegant, fluid, high-performance Markdown editing experience.',
      ogDescription: 'Words travel far. Meaning crosses mountains. Built for writing and dense notes.',
    },
    languageLabel: 'English',
    languageAria: 'Switch language',
    nav: {
      intro: 'Intro',
      features: 'Updates',
      requirements: 'Issues',
      download: 'FAQ',
    },
    topbarAria: 'Primary navigation',
    heroName: 'Moeka',
    tagline: ['WRITE LOCAL', 'THINK CLEAR'],
    actions: {
      download: 'DOWNLOAD',
      help: 'REPORT ISSUE',
    },
    featureAria: 'Scroll to switch feature copy',
    actionsAria: 'Primary actions',
    screenshotAlt: 'Moeka app interface screenshot',
    showcase: {
      lead: 'Local-first, simple and fluid',
      leadTitle: 'High-performance Markdown editing',
      performance: ['Built for writing,', 'ready for dense notes.'],
      zeroConfig: ['Zero setup,', 'playful yet professional.'],
      themes: ['Always evolving,', 'still simple and elegant.'],
      copyright: '©2026 Moeka Project',
    },
    faqTitle: 'FAQ',
    faqIssues: {
      before: 'Report issues or requests on the GitHub ',
      link: 'Issues page',
      after: '. Clear, reasonable feedback will be considered.',
    },
    downloadOptions: [
      { label: 'macOS (M Chip)', href: macosArm64DownloadUrl },
      { label: 'macOS (Intel)', href: macosX64DownloadUrl },
      { label: 'Windows (Soon)', disabled: true },
      { label: 'Linux (Soon)', disabled: true },
    ],
    features: [
      {
        title: 'Custom editor core',
        description: 'A responsive Rust + GPUI interface and editor.',
      },
      {
        title: 'Dense writing layout',
        description: 'Code-like plain text control down to each character.',
      },
      {
        title: 'Extended syntax',
        description: 'Backlinks, tables, superscript, subscript, footnotes, formulas, and charts.',
      },
      {
        title: 'Live Git and Diff',
        description: 'Restore file history and inspect changes live.',
      },
      {
        title: 'Agent terminal',
        description: '@ files or selections and chat with your Agent CLI.',
      },
      {
        title: 'Offline files',
        description: 'Edit text, preview images, paste and drag files',
      },
      {
        title: 'Varied theme palettes',
        description: 'Polished UI and syntax colors in vintage themes.',
      },
      {
        title: 'Workspaces and file trees',
        description: 'Switch instantly with fast search and commands.',
      },
      {
        title: 'Multiple cursors and editing shortcuts',
        description: 'Select, edit, and replace with familiar code editor operations.',
      },
    ],
    faqItems: [
      {
        question: 'What is Moeka? Is it free?',
        answer: 'Moeka is a free Markdown editor. Everything runs offline and local. Future paid options may cover extra visual upgrades only.',
      },
      {
        question: 'How is it different from Obsidian or Typora?',
        answer: 'It focuses on simple, frequent tools. GPU rendering keeps it smooth and light, with polished details instead of feature bloat.',
      },
      {
        question: 'Does it need internet?',
        answer: 'No. File work and editing stay local. It only connects to GitHub for app updates.',
      },
      {
        question: 'What is it built with?',
        answer: 'Moeka is built with Rust + GPUI. It avoids Web tech and uses GPU rendering for native speed and low resource use.',
      },
      {
        question: 'Will Windows, Linux, and mobile be supported?',
        answer: 'More platforms are planned. For now, the macOS experience is still being refined.',
      },
      {
        question: 'Where can I report issues or requests?',
        answer: '',
      },
    ],
  },
}

const activeCopy = computed(() => translations[activeLanguageKey.value])
const activeLogo = computed(() => activeLanguageKey.value === 'en' ? logoEn : logo)
const navItems = computed(() => navItemKeys.map((key) => ({
  key,
  href: navHashes[key].startsWith('https://')
    ? navHashes[key]
    : sitePath(`${activeLocale.value.path}${navHashes[key]}`),
  label: activeCopy.value.nav[key],
  external: navHashes[key].startsWith('https://github.com/'),
})))
const activeLanguage = computed(() => activeCopy.value.languageLabel)
const activePageURL = computed(() => absoluteSiteURL(activeLocale.value.path))
const socialImageURL = absoluteSiteURL('/images/social-preview.png')

useHead(() => ({
  title: activeCopy.value.seo.title,
  htmlAttrs: {
    lang: activeLocale.value.htmlLang,
  },
  link: [
    {
      rel: 'preload',
      href: activeFontHref.value,
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    { rel: 'canonical', href: activePageURL.value },
    ...localeOptions.map((locale) => ({
      rel: 'alternate',
      hreflang: locale.hreflang,
      href: absoluteSiteURL(locale.path),
    })),
    { rel: 'alternate', hreflang: 'x-default', href: absoluteSiteURL('/zh-cn') },
  ],
  meta: [
    { name: 'description', content: activeCopy.value.seo.description },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Moeka' },
    { property: 'og:title', content: activeCopy.value.seo.title },
    { property: 'og:description', content: activeCopy.value.seo.ogDescription },
    { property: 'og:url', content: activePageURL.value },
    { property: 'og:locale', content: activeLocale.value.ogLocale },
    ...localeOptions
      .filter((locale) => locale.key !== activeLanguageKey.value)
      .map((locale) => ({ property: 'og:locale:alternate', content: locale.ogLocale })),
    { property: 'og:image', content: socialImageURL },
    { property: 'og:image:secure_url', content: socialImageURL },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${activeCopy.value.heroName} icon` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: activeCopy.value.seo.title },
    { name: 'twitter:description', content: activeCopy.value.seo.ogDescription },
    { name: 'twitter:image', content: socialImageURL },
    { name: 'twitter:image:alt', content: `${activeCopy.value.heroName} icon` },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: activeCopy.value.heroName,
        alternateName: 'Moeka',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'macOS',
        url: activePageURL.value,
        image: socialImageURL,
        description: activeCopy.value.seo.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    },
  ],
}))

const performanceFeatureIndexes = [0, 1, 4] as const
const zeroConfigFeatureIndexes = [2, 6, 3] as const
const themeFeatureIndexes = [7, 8, 5] as const
const fanSpread = ref(false)
const stampFanRef = ref<HTMLElement | null>(null)
const downloadMenuOpen = ref(false)
const downloadMenuRef = ref<HTMLElement | null>(null)

// Touch has no hover: tapping a stamp both selects it and spreads the fan.
// Desktop spread stays purely :hover driven so it collapses on mouse leave.
function handleStampPointerDown(event: PointerEvent) {
  if (event.pointerType !== 'mouse') {
    fanSpread.value = true
  }
}

function toggleDownloadMenu() {
  downloadMenuOpen.value = !downloadMenuOpen.value
}

function closeDownloadMenu() {
  downloadMenuOpen.value = false
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (fanSpread.value && !stampFanRef.value?.contains(event.target as Node)) {
    fanSpread.value = false
  }

  if (!downloadMenuOpen.value || downloadMenuRef.value?.contains(event.target as Node)) {
    return
  }

  closeDownloadMenu()
}

function handleDocumentClick(event: MouseEvent) {
  if (!downloadMenuOpen.value || downloadMenuRef.value?.contains(event.target as Node)) {
    return
  }

  closeDownloadMenu()
}

function cycleLanguage() {
  const activeIndex = localeOptions.findIndex((locale) => locale.key === activeLanguageKey.value)
  const nextLocale = localeOptions[(activeIndex + 1) % localeOptions.length]!

  router.push(nextLocale.path)
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <main
    class="site-shell"
    :data-language="activeLanguageKey"
  >
    <section class="hero" aria-labelledby="hero-title">
      <header class="topbar" :aria-label="activeCopy.topbarAria">
        <nav class="nav-pill">
          <a
            v-for="item in navItems"
            :key="item.key"
            :class="['nav-link', { active: item.key === 'intro' }]"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
          >
            {{ item.label }}
          </a>
        </nav>

        <button
          class="language-pill"
          type="button"
          :aria-label="activeCopy.languageAria"
          @click="cycleLanguage"
          @keydown.enter.prevent="cycleLanguage"
          @keydown.space.prevent="cycleLanguage"
        >
          <img :src="imagePath('icon-lang.svg')" alt="" aria-hidden="true" decoding="async">
          {{ activeLanguage }}
        </button>
      </header>

      <div id="intro" class="hero-content">
        <img class="flower flower-left" :src="imagePath('flower-left.svg')" alt="" aria-hidden="true" decoding="async">
        <img class="brand-logo" :src="activeLogo" :alt="activeCopy.heroName" aria-describedby="hero-tagline" fetchpriority="high" decoding="async">
        <img class="flower flower-right" :src="imagePath('flower-right.svg')" alt="" aria-hidden="true" decoding="async">

        <h1 id="hero-title" class="sr-only">{{ activeCopy.heroName }}</h1>

        <p id="hero-tagline" class="tagline">
          <span>{{ activeCopy.tagline[0] }}</span>
          <span>{{ activeCopy.tagline[1] }}</span>
        </p>

        <div class="hero-actions" :aria-label="activeCopy.actionsAria">
          <div
            id="download"
            ref="downloadMenuRef"
            :class="['button', 'button-dark', 'button-download', { 'is-open': downloadMenuOpen }]"
            @keydown.escape.stop="closeDownloadMenu"
          >
            <button
              class="button-label download-trigger"
              type="button"
              :aria-expanded="downloadMenuOpen"
              aria-controls="download-options"
              @click.stop="toggleDownloadMenu"
            >
              <img :src="imagePath('icon-download.svg')" alt="" aria-hidden="true" decoding="async">
              {{ activeCopy.actions.download }}
            </button>
            <span id="download-options" class="download-options" :aria-hidden="!downloadMenuOpen">
              <template v-for="option in activeCopy.downloadOptions">
                <a
                  v-if="option.href"
                  :key="option.label"
                  class="download-option"
                  :href="option.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ option.label }}
                </a>
                <span
                  v-else
                  :key="option.label"
                  class="download-option is-disabled"
                  aria-disabled="true"
                >
                  {{ option.label }}
                </span>
              </template>
            </span>
          </div>
          <a
            class="button button-red"
            href="https://github.com/MoekaProject/community/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="imagePath('icon-help.svg')" alt="" aria-hidden="true" decoding="async">
            {{ activeCopy.actions.help }}
          </a>
        </div>
        <span id="issues" class="anchor-target" aria-hidden="true"></span>
      </div>
    </section>

    <div ref="stampFanRef" :class="['stamp-fan', { 'is-spread': fanSpread }]" aria-hidden="true">
      <img
        v-for="(stamp, index) in stamps"
        :key="index"
        class="stamp"
        :class="`stamp-${index + 1}`"
        :src="stamp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        @pointerdown="handleStampPointerDown($event)"
      >
    </div>

    <section id="release-notes" class="feature-one" aria-labelledby="feature-title">
      <div class="feature-heading intro-feature-heading">
        <div class="feature-step">
          <img
            :src="imagePath('feature-icon-1.webp')"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          >
          <div class="feature-copy">
            <p>{{ activeCopy.showcase.lead }}</p>
            <h2 id="feature-title">{{ activeCopy.showcase.leadTitle }}</h2>
          </div>
        </div>
      </div>

      <div class="product-screenshot-frame">
        <img
          class="product-screenshot"
          :src="imagePath('screenshots/head.webp')"
          :srcset="`${imagePath('screenshots/head-960.webp')} 960w, ${imagePath('screenshots/head-1440.webp')} 1440w, ${imagePath('screenshots/head.webp')} 2880w`"
          sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1024px) 720px, 1280px"
          :alt="activeCopy.screenshotAlt"
          width="2880"
          height="1837"
          loading="eager"
          fetchpriority="low"
          decoding="async"
        >
      </div>
    </section>

    <section class="showcase-section performance-showcase" aria-labelledby="performance-title">
      <header class="showcase-heading">
        <img :src="imagePath('feature-icon-2.webp')" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <h2 id="performance-title">
          <span>{{ activeCopy.showcase.performance[0] }}</span>
          <span>{{ activeCopy.showcase.performance[1] }}</span>
        </h2>
      </header>

      <div class="feature-grid feature-grid-performance">
        <article v-for="(featureIndex, index) in performanceFeatureIndexes" :key="activeCopy.features[featureIndex].title" class="feature-card">
          <img :src="circles[index]" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <div class="feature-card-copy">
            <h3>{{ activeCopy.features[featureIndex].title }}</h3>
            <p>{{ activeCopy.features[featureIndex].description }}</p>
          </div>
        </article>
      </div>

      <div class="showcase-screenshot showcase-screenshot-wide">
        <img
          :src="imagePath('screenshots/feature-1.webp')"
          :srcset="`${imagePath('screenshots/feature-1-960.webp')} 960w, ${imagePath('screenshots/feature-1-1440.webp')} 1440w, ${imagePath('screenshots/feature-1.webp')} 2605w`"
          sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1024px) 760px, 1280px"
          :alt="activeCopy.screenshotAlt"
          width="2605"
          height="1702"
          loading="lazy"
          decoding="async"
        >
      </div>
    </section>

    <section class="showcase-section zero-config-showcase" aria-labelledby="zero-config-title">
      <header class="showcase-heading">
        <img :src="imagePath('feature-icon-3.webp')" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <h2 id="zero-config-title">
          <span>{{ activeCopy.showcase.zeroConfig[0] }}</span>
          <span>{{ activeCopy.showcase.zeroConfig[1] }}</span>
        </h2>
      </header>

      <div class="interactive-showcase zero-config-interactive">
        <div class="feature-choice-list feature-choice-list-vertical">
          <article
            v-for="(featureIndex, index) in zeroConfigFeatureIndexes"
            :key="activeCopy.features[featureIndex].title"
            class="feature-choice"
          >
            <img :src="circles[index + 3]" alt="" aria-hidden="true" loading="lazy" decoding="async">
            <span class="feature-choice-copy">
              <strong>{{ activeCopy.features[featureIndex].title }}</strong>
              <span>{{ activeCopy.features[featureIndex].description }}</span>
            </span>
          </article>
        </div>

        <div class="interactive-screenshot zero-config-screenshot">
          <img
            :src="imagePath('screenshots/feature-mini-1.webp')"
            :srcset="`${imagePath('screenshots/feature-mini-1-960.webp')} 960w, ${imagePath('screenshots/feature-mini-1-1440.webp')} 1440w, ${imagePath('screenshots/feature-mini-1.webp')} 1696w`"
            sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1024px) 55vw, 780px"
            :alt="activeCopy.screenshotAlt"
            width="1696"
            height="1513"
            loading="lazy"
            decoding="async"
          >
        </div>
      </div>
    </section>

    <section class="showcase-section themes-showcase" aria-labelledby="themes-title">
      <header class="showcase-heading themes-heading">
        <img :src="imagePath('feature-icon-5.webp')" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <h2 id="themes-title">
          <span>{{ activeCopy.showcase.themes[0] }}</span>
          <span>{{ activeCopy.showcase.themes[1] }}</span>
        </h2>
        <div class="theme-swatches" aria-hidden="true">
          <img v-for="circle in circles.slice(6, 9)" :key="circle" :src="circle" alt="" loading="lazy" decoding="async">
        </div>
      </header>

      <div class="interactive-showcase themes-interactive">
        <div class="feature-choice-list feature-choice-list-horizontal">
          <article
            v-for="(featureIndex, index) in themeFeatureIndexes"
            :key="activeCopy.features[featureIndex].title"
            class="theme-feature-choice"
          >
            <span :class="['feature-shape', `feature-shape-${index + 1}`]" aria-hidden="true"></span>
            <span class="feature-choice-copy">
              <strong>{{ activeCopy.features[featureIndex].title }}</strong>
              <span>{{ activeCopy.features[featureIndex].description }}</span>
            </span>
          </article>
        </div>

        <div class="interactive-screenshot theme-screenshot">
          <img
            :src="imagePath('screenshots/feature-2.webp')"
            :srcset="`${imagePath('screenshots/feature-2-960.webp')} 960w, ${imagePath('screenshots/feature-2-1440.webp')} 1440w, ${imagePath('screenshots/feature-2.webp')} 2686w`"
            sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 64px), 1280px"
            :alt="activeCopy.screenshotAlt"
            width="2686"
            height="1694"
            loading="lazy"
            decoding="async"
          >
        </div>
      </div>
    </section>

    <section id="faq" class="faq-section" aria-labelledby="faq-title">
      <img class="faq-illustration" :src="imagePath('feature-icon-5.webp')" alt="" aria-hidden="true" loading="lazy" decoding="async">
      <h2 id="faq-title">{{ activeCopy.faqTitle }}</h2>
      <div class="faq-list">
        <article v-for="(item, index) in activeCopy.faqItems" :key="item.question" class="faq-item">
          <div class="faq-copy">
            <h3>{{ item.question }}</h3>
            <p v-if="index === activeCopy.faqItems.length - 1">
              {{ activeCopy.faqIssues.before }}<a
                class="faq-link"
                href="https://github.com/MoekaProject/community/issues"
                target="_blank"
                rel="noopener noreferrer"
              >{{ activeCopy.faqIssues.link }}</a>{{ activeCopy.faqIssues.after }}
            </p>
            <p v-else>{{ item.answer }}</p>
          </div>
        </article>
      </div>
    </section>

    <footer class="site-footer">

      <p class="footer-copyright">{{ activeCopy.showcase.copyright }}</p>
    </footer>
  </main>
</template>
