/* Percentage wheel as inline SVG */
window.NBRing = function (pct, o) {
  o = o || {};
  var r = 42, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct)), sw = o.stroke || 9;
  var col = o.color || "var(--accent)";
  return '<svg class="ring" viewBox="0 0 100 100" role="img" aria-label="' + (o.label || "") + " " + Math.round(p) + ' percent">' +
    '<circle cx="50" cy="50" r="' + r + '" fill="none" stroke="var(--ring-dim)" stroke-width="' + sw + '"/>' +
    '<circle class="ring-fg" cx="50" cy="50" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + sw +
    '" stroke-linecap="round" stroke-dasharray="' + (c * p / 100).toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg>';
};
