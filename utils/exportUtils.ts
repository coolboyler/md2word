/**
 * Wraps HTML content in a standard Microsoft Word XML namespace wrapper.
 * This trick allows Word to open the HTML file as a document and interpret MathML correctly.
 */
export const generateWordDoc = (htmlContent: string, title: string = 'Document'): string => {
  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.5; font-size: 12pt; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Arial', sans-serif; }
        .math-display { text-align: center; margin: 1em 0; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
        td, th { border: 1px solid #000; padding: 0.5em; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};