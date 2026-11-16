(function () {
  var C = window.NB_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  document.querySelectorAll("[data-cfg]").forEach(function (el) { el.textContent = C[el.getAttribute("data-cfg")] || ""; });
  document.querySelectorAll("[data-app]").forEach(function (a) { if (C.appUrl) { a.setAttribute("href", C.appUrl); a.setAttribute("rel", "noopener"); } });
  var menu = $("#menuBtn"), nav = $("#nav");
  menu.addEventListener("click", function () { var o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });

  NBCommand($("#bigCmd"));

  $("#hrsRing").innerHTML = window.NBRing(75, { label: "Hours lost", stroke: 10 }) + '<div class="ring-mid"><b>6–12</b><span>hrs a week</span></div>';
  var hrs = [["Writing quotes", "2–4 hrs", 4], ["Chasing quotes and invoices", "1–3 hrs", 3], ["Missed calls and enquiries", "1–2 hrs", 2], ["Safety paperwork", "1–2 hrs", 2], ["Various admin", "1–2 hrs", 2]];
  $("#hrsList").innerHTML = hrs.map(function (h) { return '<div class="hrs-row"><div class="row"><span>' + h[0] + '</span><b>' + h[1] + '</b></div><div class="bar"><i style="width:' + (h[2] / 4 * 100) + '%"></i></div></div>'; }).join("");

  var trades = [["Electricians", "Quotes, invoices, chasing"], ["Plumbers", "Call-outs and hot water jobs"], ["Builders", "Quotes and progress invoices"], ["Arborists", "Site quotes and follow-ups"], ["Landscapers", "Quotes and reminders"], ["Roofers", "Quotes and chasing"], ["Painters", "Quotes and invoices"], ["HVAC techs", "Install quotes and invoices"]];
  $("#tradeGrid").innerHTML = trades.map(function (t) { return '<div class="trade"><h3>' + t[0] + '</h3><p>' + t[1] + '</p></div>'; }).join("");

  var X = [
    { tab: "Quote", title: "Hartley Plumbing", sub: "Quote #0142 · Good for 30 days", kind: "quote",
      scope: "Remove old hot water unit, supply and install new 250L electric storage unit, new valves, test and tidy up.",
      rows: [["250L hot water unit", "1", "$1,200.00"], ["Labour, licensed plumber", "3 hrs", "$360.00"], ["Valves and fittings", "1", "$150.00"], ["Old unit removal", "1", "$80.00"], ["Total", "", "$1,790.00"]],
      why: ["Built from the job details you type in", "Your logo, ABN and terms on every one", "Add any extra line you need", "\"Reply Approved to go ahead\" makes saying yes easy"] },
    { tab: "Quote follow-ups", title: "Quote follow-ups", sub: "Premium · arborist, three touches", kind: "msgs",
      msgs: [["Day 2 · Text", "Hi Mark, Jess from Ridgeback Tree Services here. Just checking the quote for the gum tree removal came through OK. Any questions, give us a buzz."], ["Day 5 · Text", "Hi Mark, just a quick follow-up on the tree removal quote. Happy to adjust anything if it helps."], ["Day 10 · Text", "Hi Mark, last check-in on the quote. If you've gone another way, no worries at all. Cheers, Jess"]],
      why: ["Most quotes are never chased", "Three short messages win back jobs that would have gone cold", "It stops the moment they say yes"] },
    { tab: "Invoice reminders", title: "Invoice reminders", sub: "Premium · firmer at every step, no awkward calls", kind: "msgs",
      msgs: [["Day 1 · Friendly", "Hi Sam, quick reminder that invoice 0087 for $640 was due yesterday. Payment details are on the invoice. Thanks heaps!"], ["Day 7 · Nudge", "Hi Sam, invoice 0087 is now a week overdue. When can we expect payment?"], ["Day 14 · Firm", "Hi Sam, invoice 0087 is now 14 days overdue. Please arrange payment within 7 days. If there's an issue, let's sort it now."]],
      why: ["Gets firmer on its own", "Stops the moment the invoice is marked paid", "You never have to make the awkward call"] },
    { tab: "Safety check", title: "The safety check", sub: "Premium · sent to you, the day before any chase", kind: "msgs",
      msgs: [["To you · Text", "Has Dave Collins paid the $2,400 invoice (0091)? Tap here to say Yes, they've paid, or No, send the reminder."], ["If you tap Yes", "The invoice is marked paid and no reminder is sent."], ["If you don't answer", "Nothing is sent. It never chases without a clear go-ahead."]],
      why: ["No more chasing someone who already paid", "You stay in control", "You can pause everything with one button"] },
    { tab: "Review texts", title: "Review texts", sub: "Premium · after each paid job", kind: "msgs",
      msgs: [["Same day · Text", "Hey Mark, thanks for choosing Ridgeback Tree Services. If you're happy with the work, a quick Google review really helps a business like ours. (review link) Cheers, Jess"]],
      why: ["Ask the same day, while the customer is happy", "Sent automatically once the invoice is paid", "Only on Premium"] }
  ];
  var tabs = $("#tabs"), body = $("#exampleBody");
  tabs.innerHTML = X.map(function (x, i) { return '<button class="tab" role="tab" id="tab' + i + '" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + x.tab + '</button>'; }).join("");
  function show(i) {
    var x = X[i], h = '<div class="doc"><h3>' + x.title + '</h3><div class="sub">' + x.sub + '</div>';
    if (x.kind === "quote") {
      h += '<p class="muted" style="margin-bottom:14px;font-size:14px">' + x.scope + '</p><div class="scroll"><table><thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Total</th></tr></thead><tbody>' +
        x.rows.map(function (r, k) { var b = k === x.rows.length - 1 ? ' style="font-weight:700"' : ""; return "<tr" + b + "><td>" + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + "</td></tr>"; }).join("") + "</tbody></table></div>";
    } else {
      h += '<div class="msgs">' + x.msgs.map(function (m) { return '<div class="msg"><div class="lab">' + m[0] + "</div><p>" + m[1] + "</p></div>"; }).join("") + "</div>";
    }
    h += '</div><aside class="why"><h4>Why it works</h4><ul>' + x.why.map(function (w) { return "<li>" + w + "</li>"; }).join("") + "</ul></aside>";
    body.setAttribute("aria-labelledby", "tab" + i); body.innerHTML = h;
    tabs.querySelectorAll(".tab").forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("data-i") == i); });
  }
  tabs.addEventListener("click", function (e) { var b = e.target.closest(".tab"); if (b) show(+b.getAttribute("data-i")); });
  show(0);
})();
