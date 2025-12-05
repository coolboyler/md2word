import React, { useState, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { Preview } from './components/Preview';
import { repairContent, convertToWordCompatibleHtml } from './services/geminiService';
import { generateWordDoc, downloadFile } from './utils/exportUtils';
import { EditorStatus } from './types';

// Initial problematic content from the prompt to demonstrate capabilities
const DEFAULT_CONTENT = `## 非气象回波判识

设雷达反射率因子原始观测值为 $Z_{\\text{obs}}(r,\\theta,\\phi,t)$，其中 $(r,\\theta,\\phi)$ 分别为距离、方位角和仰角，$t$ 为时间。

通过构建非气象回波判识函数：

$$
\\mathcal{F}_{\\text{non-met}}(Z_{\\text{obs}}, \\nabla_{\\text{spatial}} Z, \\nabla_{\\text{temporal}} Z, \\rho_{HV}, Z_{DR}) = \\begin{cases}
1, & \\text{非气象回波} \\\\
0, & \\text{气象回波}
\\end{cases}
$$

其中 $\\nabla_{\\text{spatial}} Z$ 和 $\\nabla_{\\text{temporal}} Z$ 分别表示空间梯度和时间梯度，$\\rho_{HV}$ 为相关系数，$Z_{DR}$ 为差分反射率因子。`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_CONTENT);
  const [status, setStatus] = useState<EditorStatus>(EditorStatus.IDLE);
  const [message, setMessage] = useState<string>('');

  const handleRepair = useCallback(async () => {
    setStatus(EditorStatus.PROCESSING);
    setMessage('AI is analyzing and fixing your LaTeX...');
    try {
      const fixed = await repairContent(markdown);
      setMarkdown(fixed);
      setStatus(EditorStatus.SUCCESS);
      setMessage('Content repaired successfully!');
      setTimeout(() => {
        setStatus(EditorStatus.IDLE);
        setMessage('');
      }, 3000);
    } catch (e) {
      setStatus(EditorStatus.ERROR);
      setMessage('Failed to repair content. Check API Key.');
    }
  }, [markdown]);

  const handleExport = useCallback(async () => {
    setStatus(EditorStatus.PROCESSING);
    setMessage('Converting to Word compatible format...');
    try {
      // Step 1: Convert Markdown to HTML with MathML using Gemini
      // We use Gemini for the export step to ensure high-fidelity equation conversion to MathML
      // which allows Word to edit the equations natively.
      const htmlBody = await convertToWordCompatibleHtml(markdown);
      
      // Step 2: Wrap in Word XML
      const fullDoc = generateWordDoc(htmlBody, 'Exported Document');
      
      // Step 3: Trigger Download
      // using .doc extension and correct mime type triggers Word to open it correctly
      downloadFile(fullDoc, 'document_export.doc', 'application/msword');
      
      setStatus(EditorStatus.SUCCESS);
      setMessage('Download started!');
      setTimeout(() => {
        setStatus(EditorStatus.IDLE);
        setMessage('');
      }, 3000);
    } catch (e) {
      setStatus(EditorStatus.ERROR);
      setMessage('Export failed. Please try again.');
    }
  }, [markdown]);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Toolbar 
        onRepair={handleRepair} 
        onExport={handleExport} 
        status={status}
        statusMessage={message}
      />
      
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
            <span>Markdown Input</span>
            <span className="text-slate-400">Supports LaTeX ($ and $$)</span>
          </div>
          <textarea
            className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-800"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Preview Section */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live Preview
          </div>
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm min-h-full border border-slate-100">
              <Preview content={markdown} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;