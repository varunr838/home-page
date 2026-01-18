import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeDisplay({ snippets }) {
  const [lang, setLang] = React.useState("java");

  return (
    <section className="section-card" id="code">
      <div className="section-header">
        <h2 className="section-title">Solution Code</h2>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="language-selector">
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="code-editor">
        <SyntaxHighlighter language={lang} style={vscDarkPlus}>
          {snippets[lang]}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}