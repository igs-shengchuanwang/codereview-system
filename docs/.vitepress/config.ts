import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============================================
// 從 config/project.yaml 讀取所有專案設定（純 regex，無需額外套件）
// ============================================
const configPath = path.resolve(__dirname, '../../review-system/config/project.yaml')
const configRaw = fs.readFileSync(configPath, 'utf-8')

// 簡易 section-aware YAML 讀取：先定位 section，再匹配 key
function yamlVal(section: string, key: string): string {
  const secRe = new RegExp(`^${section}:\\s*$`, 'm')
  const secMatch = secRe.exec(configRaw)
  if (!secMatch) return ''
  // 從 section 開始，截到下一個頂層 key（行首非空白）
  const rest = configRaw.slice(secMatch.index + secMatch[0].length)
  const block = rest.split(/^\S/m)[0] // 只保留此 section 的縮排內容
  const m = block.match(new RegExp(`^\\s+${key}:\\s*"?([^"\\n#]+)"?`, 'm'))
  return m ? m[1].trim() : ''
}

const PROJECT_TITLE = yamlVal('site', 'title')
const PROJECT_DESCRIPTION = yamlVal('project', 'description')
const SITE_BASE = yamlVal('site', 'base')
const GITHUB_REPO = yamlVal('git', 'repo_url')
const GITHUB_BRANCH = yamlVal('git', 'branch')
const SOURCE_DIR = yamlVal('paths', 'source_dir').replace(/\/$/, '') // e.g. "src"
// ============================================

function getSidebarItems(dir: string, linkPrefix: string) {
  const docsDir = path.resolve(__dirname, '..', dir)
  if (!fs.existsSync(docsDir)) return []
  return fs.readdirSync(docsDir)
    .filter((f: string) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((f: string) => {
      const name = f.replace('.md', '')
      return { text: name, link: `/${linkPrefix}/${name}` }
    })
}

export default withMermaid(defineConfig({
  title: PROJECT_TITLE,
  description: PROJECT_DESCRIPTION,
  base: SITE_BASE,

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Classes', link: '/classes' },
      { text: 'Concepts', link: '/concepts' },
    ],

    sidebar: {
      '/knowledge/classes/': [
        {
          text: 'Classes',
          items: getSidebarItems('knowledge/classes', 'knowledge/classes')
        }
      ],
      '/knowledge/concepts/': [
        {
          text: 'Concepts',
          items: getSidebarItems('knowledge/concepts', 'knowledge/concepts')
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: GITHUB_REPO }
    ]
  },

  // 將 knowledge 文件的 class/concept frontmatter 欄位自動設為頁面標題
  // 並將 file 欄位轉為 GitHub 連結
  transformPageData(pageData) {
    if (pageData.frontmatter.class) {
      pageData.title = pageData.frontmatter.class
    } else if (pageData.frontmatter.concept) {
      pageData.title = pageData.frontmatter.concept
    }
    if (pageData.frontmatter.file) {
      pageData.frontmatter.github_url = `${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${pageData.frontmatter.file}`
    }
  },

  markdown: {
    config: (md) => {
      // 自動將內文中 source 路徑的 inline code 轉為 GitHub 超連結
      const defaultRender = md.renderer.rules.code_inline ||
        function (tokens: any, idx: any, options: any, _env: any, self: any) {
          return self.renderToken(tokens, idx, options)
        }
      md.renderer.rules.code_inline = function (tokens: any, idx: any, options: any, env: any, self: any) {
        const token = tokens[idx]
        const content = token.content
        // 匹配 source file 路徑模式（根據 project.yaml 的 source_dir 動態產生）
        const srcPattern = new RegExp(`^(${SOURCE_DIR}|lib|app|assets)\\/.*\\.(ts|js|py|java|go|rs)$`)
        if (srcPattern.test(content)) {
          const url = `${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${content}`
          return `<a href="${url}" target="_blank" rel="noreferrer"><code>${content}</code></a>`
        }
        return defaultRender(tokens, idx, options, env, self)
      }
    }
  },

  mermaid: {
    theme: 'default'
  }
}))
