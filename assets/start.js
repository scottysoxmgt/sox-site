(function () {
  var C = window.NB_CONFIG || {};
  document.querySelectorAll("[data-cfg]").forEach(function (el) { el.textContent = C[el.getAttribute("data-cfg")] || ""; });
  var P = { basic: "Basic · $199 setup + $19/month", elevate: "Elevate · $399 setup + $49/month", premium: "Premium · $599 setup + $99/month" };
  var plan = "", form = document.getElementById("form"), msg = document.getElementById("msg"), sum = document.getElementById("sum");
  function pick(p) {
    if (!P[p]) return; plan = p;
    document.querySelectorAll(".pick").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-plan") === p); });
    sum.textContent = "Your package: " + P[p];
  }
  document.getElementById("picks").addEventListener("click", function (e) { var b = e.target.closest(".pick"); if (b) pick(b.getAttribute("data-plan")); });
  pick((location.search.match(/plan=(\w+)/) || [])[1]);
  function say(t, ok) { msg.hidden = false; msg.className = ok ? "msg-ok" : "msg-err"; msg.textContent = t; msg.scrollIntoView({ block: "nearest" }); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    if (!plan) return say("Please pick a package first.");
    if (f.website.value) return say("Thanks.", true);
    var abn = f.abn.value.replace(/\s/g, "");
    if (!f.name.value.trim() || !f.business.value.trim() || !f.mobile.value.trim() || !f.trade.value) return say("Please fill in every box.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) return say("That email doesn't look right.");
    if (!/^\d{11}$/.test(abn)) return say("Your ABN should be 11 numbers.");
    for (var i = 1; i <= 6; i++) if (!f["t" + i].checked) return say("Please tick every box to continue.");
    if (!C.supabaseAnonKey) return say("Demo mode: the sign-up form isn't connected yet, so nothing was saved.");
    var btn = document.getElementById("go"); btn.disabled = true;
    var body = JSON.stringify({ plan: plan, name: f.name.value.trim(), business: f.business.value.trim(), email: f.email.value.trim(), mobile: f.mobile.value.trim(), abn: abn, trade: f.trade.value });
    var first = f.name.value.trim().split(" ")[0];
    function done(t) { form.hidden = true; document.getElementById("picks").hidden = true; var d = document.createElement("div"); d.className = "msg-ok"; d.textContent = t; form.parentNode.appendChild(d); }
    say("One moment, taking you to the payment page...", true);
    fetch(C.supabaseUrl + "/functions/v1/stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: C.supabaseAnonKey, Authorization: "Bearer " + C.supabaseAnonKey },
      body: body
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (x) {
      if (x.ok && x.j.url) { location.href = x.j.url; return; }
      btn.disabled = false;
      if (x.j && x.j.saved) return done("Thanks, " + first + ". We've got your details. The payment page isn't working right now, so we'll send you a payment link shortly.");
      say((x.j && x.j.error) || "Something went wrong. Please try again, or email us.");
    }).catch(function () { btn.disabled = false; say("Something went wrong. Please try again, or email us."); });
  });
})();
