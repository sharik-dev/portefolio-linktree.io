import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

export async function downloadCvAsPdf(mdContent: string, filename: string): Promise<void> {
  const html = await marked(mdContent);

  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.cssText = [
    'width:794px',
    'padding:56px 64px',
    'background:white',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
    'font-size:13px',
    'line-height:1.65',
    'color:#1D1D1F',
    'position:fixed',
    'top:-99999px',
    'left:-99999px',
    'box-sizing:border-box',
  ].join(';');

  const style = document.createElement('style');
  style.textContent = `
    h1 { font-size:22px; font-weight:700; margin:0 0 4px; color:#1D1D1F; }
    h2 { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.09em;
         color:#86868B; margin:28px 0 10px; padding-bottom:6px;
         border-bottom:1px solid rgba(0,0,0,.08); }
    h3 { font-size:13px; font-weight:600; margin:14px 0 3px; color:#1D1D1F; display:flex; align-items:center; gap:8px; }
    p  { margin:0 0 7px; color:#6E6E73; }
    ul { margin:0 0 10px; padding-left:18px; }
    li { margin-bottom:3px; color:#6E6E73; }
    strong { font-weight:600; color:#1D1D1F; }
    em  { font-style:normal; color:#86868B; font-size:12px; }
    hr  { border:none; border-top:1px solid rgba(0,0,0,.07); margin:18px 0; }
    code { font-size:10px; background:rgba(0,113,227,.07); color:#0071E3;
           padding:1px 5px; border-radius:4px; font-family:monospace; }
    a   { color:#0071E3; text-decoration:none; }
    table { width:100%; border-collapse:collapse; margin-bottom:12px; }
    td, th { vertical-align:middle; padding:6px 10px 6px 0; font-size:12px; color:#6E6E73; }
    th { font-weight:600; color:#1D1D1F; }
    img { border-radius:8px; object-fit:cover; display:inline-block; vertical-align:middle; }
  `;
  container.prepend(style);
  document.body.appendChild(container);

  // Wait for all images to load before capturing
  await Promise.all(
    Array.from(container.querySelectorAll('img')).map(
      img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
    )
  );

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, allowTaint: false, logging: false });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    let remaining = imgH;
    let offset = 0;

    pdf.addImage(imgData, 'PNG', 0, offset, imgW, imgH);
    remaining -= pageH;

    while (remaining > 0) {
      offset -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, offset, imgW, imgH);
      remaining -= pageH;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
