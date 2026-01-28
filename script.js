// Elements
const textEl = document.getElementById('text');
const sizeEl = document.getElementById('size');
const levelEl = document.getElementById('level');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById('qr-canvas');

// Create QRious instance that renders into our canvas
const qr = new QRious({
  element: canvas,
  value: '',
  size: parseInt(sizeEl.value, 10) || 256,
  level: levelEl.value || 'M'
});

function updatePreview() {
  const value = textEl.value.trim();
  const size = Math.max(64, Math.min(2048, parseInt(sizeEl.value, 10) || 256));
  const level = levelEl.value || 'M';

  qr.set({
    value: value || '',
    size,
    level
  });

  // If there's content enable download; otherwise disable
  downloadBtn.disabled = !value;
}

generateBtn.addEventListener('click', () => {
  if (!textEl.value.trim()) {
    alert('Please enter text or a URL to generate a QR code.');
    return;
  }
  updatePreview();
});

downloadBtn.addEventListener('click', () => {
  const value = textEl.value.trim();
  if (!value) return;

  // Ensure preview up to date
  updatePreview();

  // Convert canvas to data URL and trigger download
  canvas.toBlob((blob) => {
    if (!blob) {
      // fallback to toDataURL if toBlob unsupported
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `qr-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
});

// Optional: generate live as user types (debounced)
let debounceTimer = null;
textEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updatePreview();
  }, 300);
});

// Also update when size or level changes
sizeEl.addEventListener('change', updatePreview);
levelEl.addEventListener('change', updatePreview);

// Initialize preview (empty)
updatePreview();
