import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';
import JSZip from 'jszip';
import {
  QrCode, Download, Trash2, Plus, Copy, Check,
  Eye, X, ExternalLink, ScanLine, Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Draw QR card onto an offscreen Canvas and
   return a PNG data-URL. This avoids the
   html-to-image / tainted-canvas problem.
───────────────────────────────────────────── */
async function generateCardDataUrl(qrCanvasEl, tableNumber, restaurantName, menuUrl) {
  const W = 360;
  const H = 500;
  const canvas = document.createElement('canvas');
  canvas.width = W * 3;   // 3× for 300 DPI print quality
  canvas.height = H * 3;
  const ctx = canvas.getContext('2d');
  const S = 3; // scale factor

  ctx.scale(S, S);

  // --- White background ---
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // --- Orange header stripe ---
  const grad = ctx.createLinearGradient(0, 0, W, 60);
  grad.addColorStop(0, '#ea580c');
  grad.addColorStop(1, '#f97316');
  ctx.fillStyle = grad;
  roundRect(ctx, 20, 20, W - 40, 70, 16);
  ctx.fill();

  // --- Restaurant name ---
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '700 10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('WELCOME TO', W / 2, 44);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 20px system-ui';
  ctx.fillText(restaurantName, W / 2, 68);

  // --- QR code (from the already-rendered hidden canvas) ---
  const qrSize = 180;
  const qrX = (W - qrSize) / 2;
  const qrY = 112;

  // White card behind QR
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  roundRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 20);
  ctx.fill();
  ctx.stroke();

  // Draw the QR canvas pixels
  if (qrCanvasEl) {
    ctx.drawImage(qrCanvasEl, qrX, qrY, qrSize, qrSize);
  }

  // --- "Scan to Order" label ---
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(W / 2 - 40, qrY + qrSize + 28, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.font = '700 10px system-ui';
  ctx.letterSpacing = '1px';
  ctx.fillText('SCAN TO ORDER', W / 2 + 5, qrY + qrSize + 32);

  // --- Table number badge ---
  const badgeY = qrY + qrSize + 55;
  const badgeW = Math.min(tableNumber.length * 14 + 48, W - 60);
  const badgeX = (W - badgeW) / 2;

  ctx.fillStyle = '#0f172a';
  roundRect(ctx, badgeX, badgeY, badgeW, 46, 100);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(tableNumber, W / 2, badgeY + 30);

  // --- Footer hint ---
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 9px system-ui';
  ctx.fillText('Scan with your camera · No app needed', W / 2, H - 28);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 8px monospace';
  const shortUrl = `${menuUrl.replace(/^https?:\/\//, '').slice(0, 48)}…`;
  ctx.fillText(shortUrl, W / 2, H - 14);

  return canvas.toDataURL('image/png');
}

// Helper: rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─────────────────────────────────────────────
   Hidden QR canvas (for data extraction only)
───────────────────────────────────────────── */
function HiddenQRCanvas({ id, value }) {
  return (
    <div
      style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <QRCodeCanvas
        id={id}
        value={value}
        size={180}
        level="H"
        fgColor="#0f172a"
        bgColor="#ffffff"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Preview Modal
───────────────────────────────────────────── */
function PreviewModal({ table, menuUrl, restaurantName, onClose, onDownload }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-orange-100 uppercase tracking-widest block">QR Card Preview</span>
            <h3 className="font-black text-white text-lg">{table.number}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4 bg-slate-50">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col items-center gap-3 w-full max-w-[260px]">
            <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{restaurantName}</div>
            <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-xl">
              <QRCodeCanvas value={menuUrl} size={160} level="H" fgColor="#0f172a" bgColor="#ffffff" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scan to Order</span>
            </div>
            <div className="bg-slate-900 text-white font-black text-base px-6 py-2 rounded-full">
              {table.number}
            </div>
          </div>
          <div className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <ExternalLink size={12} className="text-slate-400 flex-shrink-0" />
            <span className="text-[10px] text-slate-500 font-mono break-all leading-relaxed">{menuUrl}</span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Smartphone size={13} /> Test Menu
          </a>
          <button
            onClick={() => { onClose(); onDownload(table._id, table.number); }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Download size={13} /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main QR Tab Section
───────────────────────────────────────────── */
export default function QRTabSection({ tables, settings, addTable, deleteTable }) {
  const [tableName, setTableName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewTable, setPreviewTable] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [bulkCount, setBulkCount] = useState(1);
  const [bulkPrefix, setBulkPrefix] = useState('Table');

  const restaurantName = settings.restaurantName || 'BiteQR Cafe';

  // Always use the current domain — no manual override needed in production
  const baseUrl = window.location.origin;

  const getMenuUrl = (tableNumber) =>
    `${baseUrl}/menu?table=${encodeURIComponent(tableNumber)}`;

  // ── Get the hidden QR canvas element for a table ──
  const getQRCanvas = (tableId) =>
    document.getElementById(`hidden-qr-${tableId}`);

  // ── Single PNG download ──────────────────────────
  const downloadQR = async (tableId, tableNumber) => {
    setDownloadingId(tableId);
    try {
      // Give React a tick to ensure the hidden canvas is painted
      await new Promise(r => setTimeout(r, 100));
      const qrEl = getQRCanvas(tableId);
      const menuUrl = getMenuUrl(tableNumber);
      const dataUrl = await generateCardDataUrl(qrEl, tableNumber, restaurantName, menuUrl);
      const link = document.createElement('a');
      link.download = `${tableNumber.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Downloaded QR card for ${tableNumber}`);
    } catch (err) {
      console.error(err);
      toast.error('Download failed. Please try again.');
    }
    setDownloadingId(null);
  };

  // ── Bulk ZIP download ────────────────────────────
  const downloadAllZip = async () => {
    if (tables.length === 0) return;
    setIsGenerating(true);
    const toastId = toast.loading(`Generating ${tables.length} QR cards…`);
    const zip = new JSZip();
    try {
      for (const table of tables) {
        await new Promise(r => setTimeout(r, 80));
        const qrEl = getQRCanvas(table._id);
        const menuUrl = getMenuUrl(table.number);
        const dataUrl = await generateCardDataUrl(qrEl, table.number, restaurantName, menuUrl);
        const b64 = dataUrl.split(',')[1];
        zip.file(`${table.number.toLowerCase().replace(/\s+/g, '-')}.png`, b64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${restaurantName.toLowerCase().replace(/\s+/g, '-')}-table-qrs.zip`;
      link.click();
      toast.success(`Downloaded ${tables.length} QR cards as ZIP!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('ZIP generation failed', { id: toastId });
    }
    setIsGenerating(false);
  };

  // ── Copy URL ────────────────────────────────────
  const handleCopyUrl = (tableNumber, tableId) => {
    navigator.clipboard.writeText(getMenuUrl(tableNumber));
    setCopiedId(tableId);
    toast.success('Menu URL copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Add single table ─────────────────────────────
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!tableName.trim()) return;
    const success = await addTable(tableName.trim());
    if (success) setTableName('');
  };

  // ── Bulk add ─────────────────────────────────────
  const handleBulkAdd = async () => {
    const count = parseInt(bulkCount, 10);
    if (!count || count < 1 || count > 50) {
      toast.error('Enter a count between 1 and 50');
      return;
    }
    const existingNums = tables
      .map(t => {
        const m = t.number.match(new RegExp(`^${bulkPrefix}\\s*(\\d+)$`, 'i'));
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter(n => n > 0);
    let start = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;

    const toastId = toast.loading(`Adding ${count} tables…`);
    let added = 0;
    for (let i = start; i < start + count; i++) {
      const success = await addTable(`${bulkPrefix} ${i}`);
      if (success) added++;
    }
    toast.success(`Added ${added} tables!`, { id: toastId });
  };

  // ── Delete ───────────────────────────────────────
  const handleDelete = (table) => {
    if (window.confirm(`Remove QR code for "${table.number}"?`)) {
      deleteTable(table._id);
    }
  };

  const previewUrl = previewTable ? getMenuUrl(previewTable.number) : '';

  return (
    <>
      {/* Hidden QR canvases — mounted via portal at body root */}
      {ReactDOM.createPortal(
        <div aria-hidden="true">
          {tables.map(table => (
            <HiddenQRCanvas
              key={table._id}
              id={`hidden-qr-${table._id}`}
              value={getMenuUrl(table.number)}
            />
          ))}
        </div>,
        document.body
      )}

      {/* Preview modal */}
      {previewTable && (
        <PreviewModal
          table={previewTable}
          menuUrl={previewUrl}
          restaurantName={restaurantName}
          onClose={() => setPreviewTable(null)}
          onDownload={downloadQR}
        />
      )}

      <div className="animate-fade-in flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <QrCode size={20} className="text-orange-500" />
              Table QR Manager
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Generate, preview, and download printable QR cards for every table.
            </p>
          </div>
          {tables.length > 0 && (
            <button
              onClick={downloadAllZip}
              disabled={isGenerating}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer transition whitespace-nowrap"
            >
              <Download size={15} className="text-orange-400" />
              {isGenerating ? 'Generating…' : `Download All (${tables.length}) as ZIP`}
            </button>
          )}
        </div>

        {/* Add table forms */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Single */}
          <form onSubmit={handleAddTable} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-3">
            <h3 className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Add Single Table</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Table 6 or VIP Room"
                value={tableName}
                onChange={e => setTableName(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </form>

          {/* Bulk */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-3">
            <h3 className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Bulk Add Tables</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Prefix (Table)"
                value={bulkPrefix}
                onChange={e => setBulkPrefix(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <input
                type="number"
                min={1}
                max={50}
                placeholder="Count"
                value={bulkCount}
                onChange={e => setBulkCount(e.target.value)}
                className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <button
                onClick={handleBulkAdd}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap"
              >
                Add All
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Auto-continues from existing numbers for that prefix.
            </p>
          </div>
        </div>


        {/* Stats bar */}
        {tables.length > 0 && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ScanLine size={16} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-800">
                {tables.length} Table{tables.length !== 1 ? 's' : ''} Active
              </span>
            </div>
            <div className="text-[11px] text-orange-600 hidden sm:block">
              QRs link to: <span className="font-mono font-bold">{baseUrl}/menu?table=…</span>
            </div>
          </div>
        )}

        {/* Table grid */}
        {tables.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center gap-3">
            <QrCode size={48} className="text-slate-300" />
            <h3 className="font-bold text-slate-600 text-base">No Tables Yet</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Add table names above to generate scannable QR codes. Customers scan them to open the digital menu.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tables.map(table => {
              const menuUrl = getMenuUrl(table.number);
              const isDown = downloadingId === table._id;
              return (
                <div
                  key={table._id}
                  className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Colour band header */}
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 flex items-center justify-between">
                    <span className="text-white font-black text-sm truncate max-w-[75%]">
                      {table.number}
                    </span>
                    <button
                      onClick={() => handleDelete(table)}
                      className="p-1 bg-white/20 hover:bg-red-500 text-white rounded-lg transition cursor-pointer"
                      title="Delete table"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* QR preview */}
                  <div className="flex flex-col items-center gap-3 p-5 flex-1">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <QRCodeCanvas
                        value={menuUrl}
                        size={110}
                        level="M"
                        fgColor="#0f172a"
                        bgColor="#ffffff"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono text-center break-all leading-relaxed max-w-full px-1">
                      {menuUrl}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="px-4 pb-4 grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setPreviewTable(table)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Preview card"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(table.number, table._id)}
                      className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Copy menu URL"
                    >
                      {copiedId === table._id
                        ? <Check size={12} className="text-emerald-600" />
                        : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => downloadQR(table._id, table.number)}
                      disabled={isDown}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
                      title="Download PNG"
                    >
                      {isDown
                        ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-3 h-3 block" />
                        : <Download size={12} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Print guide */}
        {tables.length > 0 && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 grid sm:grid-cols-3 gap-5 mt-2">
            {[
              ['1', 'Download PNG', 'Click the orange download button on each card, or grab all as a single ZIP.'],
              ['2', 'Print & Laminate', 'Print at 300 DPI on card stock. Laminate for long-lasting durability.'],
              ['3', 'Place on Tables', 'Customers scan → browse menu → order via WhatsApp. Commission-free.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="flex gap-3">
                <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0">
                  {step}
                </div>
                <div>
                  <div className="font-bold text-sm">{title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
