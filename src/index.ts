import nodeMermaid from 'node-mermaid';
import type { PluginSimple } from 'markdown-it'

const mermaidChart = (code: string) => {
  try {
    mermaid.parse(code)
    return `<div class="mermaid">${code}</div>`
  } catch ({ str, hash }) {
    return `<pre>${str}</pre>`
  }
}

const MermaidPlugin: PluginSimple = (md) => {
  // md.mermaid = mermaid
  mermaid.loadPreferences = (preferenceStore) => {
    let mermaidTheme = preferenceStore.get('mermaid-theme') ?? 'default'
    let ganttAxisFormat = preferenceStore.get('gantt-axis-format') ?? '%Y-%m-%d'
    mermaid.initialize({
      theme: mermaidTheme,
      gantt: {
        axisFormatter: [
          [ganttAxisFormat, (d) => {
            return d.getDay() === 1
          }]
        ]
      }
    })
    return {
      'mermaid-theme': mermaidTheme,
      'gantt-axis-format': ganttAxisFormat
    }
  }

  const temp = md.renderer.rules.fence?.bind(md.renderer.rules)
  if (!temp) {
    throw new Error('md.renderer.rules.fence is null/undefined !')
  }
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    const firstLine = code.split(/\n/)[0].trim()
    if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
      return mermaidChart(code)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export default MermaidPlugin
