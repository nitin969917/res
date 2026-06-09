async function generateCardDataUrl(qrCanvasEl, tableNumber, restaurantName, menuUrl) {
  const W = 380, H = 560, S = 3;
  const canvas = document.createElement('canvas');
  canvas.width = W * S; canvas.height = H * S;
  const ctx = canvas.getContext('2d');
  ctx.scale(S, S);

  // Dark background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Orange glow top-right
  const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 280);
  glow.addColorStop(0, 'rgba(249,115,22,0.20)');
  glow.addColorStop(1, 'rgba(249,115,22,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // Purple glow bottom-left
  const glow2 = ctx.createRadialGradient(0, H, 0, 0, H, 200);
  glow2.addColorStop(0, 'rgba(168,85,247,0.10)');
  glow2.addColorStop(1, 'rgba(168,85,247,0)');
  ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);

  // Orange gradient header with rounded bottom corners
  const hGrad = ctx.createLinearGradient(0, 0, W, 96);
  hGrad.addColorStop(0, '#c2410c');
  hGrad.addColorStop(0.5, '#ea580c');
  hGrad.addColorStop(1, '#f97316');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 64);
  ctx.quadraticCurveTo(W, 96, W - 32, 96);
  ctx.lineTo(32, 96);
  ctx.quadraticCurveTo(0, 96, 0, 64);
  ctx.closePath(); ctx.fill();

  // Decorative circles in header
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.beginPath(); ctx.arc(W - 28, 14, 42, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W - 12, 80, 24, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.beginPath(); ctx.arc(18, -8, 44, 0, Math.PI * 2); ctx.fill();

  // Header text
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '600 9.5px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('WELCOME TO', 22, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 23px system-ui, sans-serif';
  let name = restaurantName;
  while (ctx.measureText(name).width > W - 72 && name.length > 4) name = name.slice(0, -1);
  if (name !== restaurantName) name += '...';
  ctx.fillText(name, 22, 62);

  // Scan-to-order pill
  const pillY = 108, pillW = 178, pillX = (W - pillW) / 2;
  ctx.fillStyle = 'rgba(249,115,22,0.14)';
  roundRect(ctx, pillX, pillY, pillW, 24, 100); ctx.fill();
  ctx.strokeStyle = 'rgba(249,115,22,0.38)';
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, pillY, pillW, 24, 100); ctx.stroke();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath(); ctx.arc(pillX + 14, pillY + 12, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fb923c';
  ctx.font = '700 9px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN TO ORDER - NO APP NEEDED', W / 2 + 3, pillY + 16);

  // QR white card
  const qrSize = 196, qrX = (W - qrSize) / 2, qrY = 146, pad = 18;
  ctx.fillStyle = 'rgba(0,0,0,0.40)';
  roundRect(ctx, qrX - pad + 5, qrY - pad + 5, qrSize + pad * 2, qrSize + pad * 2, 22); ctx.fill();
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, 22); ctx.fill();

  // Orange corner squares
  const corners = [
    [qrX - pad, qrY - pad],
    [qrX + qrSize + pad - 13, qrY - pad],
    [qrX - pad, qrY + qrSize + pad - 13],
    [qrX + qrSize + pad - 13, qrY + qrSize + pad - 13],
  ];
  ctx.fillStyle = '#f97316';
  for (const [cx, cy] of corners) { roundRect(ctx, cx, cy, 13, 13, 3.5); ctx.fill(); }

  ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 2;
  roundRect(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 10); ctx.stroke();

  if (qrCanvasEl) ctx.drawImage(qrCanvasEl, qrX, qrY, qrSize, qrSize);

  // Divider
  const divY = qrY + qrSize + pad + 28;
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(32, divY); ctx.lineTo(W - 32, divY); ctx.stroke();

  // Table badge with glow
  ctx.font = '900 22px system-ui, sans-serif';
  const badgeW = Math.min(ctx.measureText(tableNumber).width + 90, W - 44);
  const badgeX = (W - badgeW) / 2, badgeY = divY + 14, badgeH = 56;
  ctx.shadowColor = 'rgba(249,115,22,0.55)';
  ctx.shadowBlur = 22;
  const bGrad = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  bGrad.addColorStop(0, '#ea580c'); bGrad.addColorStop(1, '#f97316');
  ctx.fillStyle = bGrad;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 100); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(tableNumber, W / 2, badgeY + 36);

  // Footer accent line + URL
  ctx.strokeStyle = 'rgba(249,115,22,0.28)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(70, H - 22); ctx.lineTo(W - 70, H - 22); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '500 7.5px monospace'; ctx.textAlign = 'center';
  const shortUrl = menuUrl.replace(/^https?:///, '').slice(0, 52);
  ctx.fillText(shortUrl, W / 2, H - 10);

  return canvas.toDataURL('image/png');
}