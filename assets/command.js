/* The Command dashboard, drawn with sample numbers. Same look as the real app. */
window.NBCommand = function (el, o) {
  o = o || {};
  var d = { rev: 40020, goal: 50000, rows: [["QUOTES SENT", 64, "32"], ["JOBS WON", 44, "14"], ["INVOICES PAID", 79, "$31,600"], ["INVOICES UNPAID", 21, "$8,420", "hot"]],
    feed: ["ENQUIRY  Kitchen reno, Rawai", "QUOTE SENT  #0143  $4,200", "JOB WON  Deck rebuild", "INVOICE PAID  $2,400", "QUOTE SENT  #0144  $1,150"] };
  var GX = 160, GY = 168, GR = 132, f = d.rev / d.goal, uid = "g" + Math.random().toString(36).slice(2, 7);
  function gp(a, r) { var t = a * Math.PI / 180; return [GX + r * Math.cos(t), GY + r * Math.sin(t)]; }
  function arc(a1, a2, r) { var p = gp(a1, r), q = gp(a2, r); return "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " A" + r + " " + r + " 0 0 1 " + q[0].toFixed(1) + " " + q[1].toFixed(1); }
  var ticks = "", i;
  for (i = 0; i <= 40; i++) { var a = 180 + 180 * i / 40, p1 = gp(a, GR - 16), p2 = gp(a, GR - (i % 10 ? 21 : 27)); ticks += '<line class="gtk' + (i % 10 ? "" : " big") + '" x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '"/>'; }
  var rows = d.rows.map(function (r) {
    var C = 2 * Math.PI * 15, tone = r[3] || "";
    return '<div class="cm-row"><svg class="cm-ring ' + tone + '" viewBox="0 0 40 40" aria-hidden="true"><circle class="rt" cx="20" cy="20" r="15"/><circle class="rv" cx="20" cy="20" r="15" stroke-dasharray="' + (C * r[1] / 100).toFixed(1) + " " + C.toFixed(1) + '" transform="rotate(-90 20 20)"/></svg><div class="cm-l"><div class="cm-k">' + r[0] + '</div><div class="cm-p ' + tone + '">' + r[1] + '%</div></div><div class="cm-v">' + r[2] + '</div></div>';
  }).join("");
  var feed = d.feed.join("     ·     ");
  el.innerHTML = '<div class="cm' + (o.compact ? " compact" : "") + '"><div class="cm-h"><span class="eyebrow">COMMAND</span><span class="chip">Sample data</span></div>' +
    '<div class="cm-g"><svg viewBox="0 0 320 190" role="img" aria-label="Revenue 80 percent of goal"><defs><linearGradient id="' + uid + '" x1="0" x2="1"><stop offset="0" stop-color="#1d5df0"/><stop offset="1" stop-color="#3fd0ff"/></linearGradient></defs>' +
    '<path class="gtrack" d="' + arc(180, 360, GR) + '"/>' + ticks + '<path class="gval" stroke="url(#' + uid + ')" d="' + arc(180, 180.01, GR) + '"/></svg>' +
    '<div class="cm-read"><div class="cm-big">$0</div><div class="cm-cap">REVENUE · 80% OF $50,000 GOAL</div></div></div>' +
    '<div class="cm-rows">' + rows + '</div><div class="cm-tick"><span class="live">● LIVE</span><div class="tk-win"><div class="tk-run">' + feed + '     ·     ' + feed + '</div></div></div></div>';
  var path = el.querySelector(".gval"), big = el.querySelector(".cm-big");
  function set(x) { path.setAttribute("d", arc(180, 180 + Math.max(180 * x, .01), GR)); big.textContent = "$" + Math.round(d.rev * (f ? Math.min(x / f, 1) : 0)).toLocaleString("en-AU"); }
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return set(f);
  set(0);
  var started = false, t0;
  function frame(now) { var e = (now - t0) / 1000, pk = Math.min(1, f + .15), ez = function (k) { return 1 - Math.pow(1 - k, 3); };
    if (e < .8) set(pk * ez(e / .8)); else if (e < 1.5) set(pk + (f - pk) * ez((e - .8) / .7)); else return set(f);
    requestAnimationFrame(frame); }
  var go = function () { if (started) return; started = true; t0 = performance.now(); requestAnimationFrame(frame); };
  if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { go(); io.disconnect(); } }, { threshold: .4 }); io.observe(el); } else go();
};
