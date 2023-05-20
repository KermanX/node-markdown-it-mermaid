//import nodeMermaid from "node-mermaid";
import mermaid, { MermaidConfig } from "mermaid";
import type { PluginSimple } from "markdown-it";

export default function NodeMermaidPlugin(
  mermaidConfig: Omit<MermaidConfig, "startOnLoad"> = {}
): PluginSimple {
  const mermaidChart = async (code: string) => {
    try {
      return (await mermaid.render("graphDiv", code)).svg;
    } catch (e) {
      return `<pre>${e}</pre>`;
    }
  };

  return (md) => {
    mermaid.initialize({
      ...mermaidConfig,
      startOnLoad: false,
    });

    const temp = md.renderer.rules.fence?.bind(md.renderer.rules);
    if (!temp) {
      throw new Error("md.renderer.rules.fence is null/undefined !");
    }
    md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
      const token = tokens[idx];
      const code = token.content.trim();
      if (token.info === "mermaid") {
        return mermaidChart(code);
      }
      const firstLine = code.split(/\n/)[0].trim();
      if (
        firstLine === "gantt" ||
        firstLine === "sequenceDiagram" ||
        firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)
      ) {
        return mermaidChart(code);
      }
      return temp(tokens, idx, options, env, slf);
    };
  };
}
