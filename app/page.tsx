import fs from 'fs';
import path from 'path';
import InteractiveClient from '../components/InteractiveClient';

function getBodyHtml(): string {
  const filePath = path.join(process.cwd(), 'index.html');
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const bodyStart = html.indexOf('<body');
    if (bodyStart === -1) {
      return '';
    }
    const openTagEnd = html.indexOf('>', bodyStart);
    const bodyEnd = html.lastIndexOf('</body>');
    if (openTagEnd === -1 || bodyEnd === -1) {
      return '';
    }
    return html.slice(openTagEnd + 1, bodyEnd);
  } catch {
    return '';
  }
}

export default function Page() {
  const bodyHtml = getBodyHtml();
  return <InteractiveClient html={bodyHtml} />;
}
