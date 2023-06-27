> **This repo is archived, because I found it technically impossible to run mermaid synchronously as a MarkdownIt plugin. So I will write a Rollup/Vite plugin to render mermaid in comptime.**

# node-markdown-it-mermaid

Node-mermaid plugin for markdown-it.


## Installation

```
npm install node-markdown-it-mermaid
```


## Usage

```js
import markdownIt from 'markdown-it'
import nodeMarkdownItMermaid from 'node-markdown-it-mermaid'
const mdi = markdownIt()
mdi.use(nodeMarkdownItMermaid)
mdi.render(`\`\`\`mermaid
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[Car]
\`\`\``)
```

### Customize mermaid

```js
mdi.mermaid.loadPreferences({
  get: key => {
    if (key === 'mermaid-theme') {
      return 'forest'
    } else if (key === 'gantt-axis-format') {
      return '%Y/%m/%d'
    } else {
      return undefined
    }
  }
})
```

You can `loadPreferences` from any preferences store as long as it supports the `get` method. For example, you can use `js-cookie` library as a preferences store. Or you can write your own preferences store to achieve more flexibility.

`mdi.mermaid.loadPreferences` not only applies the preferences, it also return the preferences loaded. Just in case you need to access the loaded preferences.

`mdi.mermaid.loadPreferences` could be invoked multiple times. And the preferences applied later will override ones applied earlier.
