(function () {
  var C = window.NB_CONFIG || {};
  document.querySelectorAll("[data-cfg]").forEach(function (el) { el.textContent = C[el.getAttribute("data-cfg")] || ""; });
  var form = document.getElementById("form"), msg = document.getElementById("msg");
  function say(t, ok) { msg.hidden = false; msg.className = ok ? "msg-ok" : "msg-err"; msg.textContent = t; msg.scrollIntoView({ block: "nearest" }); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    if (f.website.value) return say("Thanks.", true);
    if (!f.name.value.trim() || !f.business.value.trim() || !f.phone.value.trim()) return say("Please fill in your name, business name and mobile.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) return say("That email doesn't look right.");
    if (!C.supabaseAnonKey) return say("Demo mode: the form isn't connected yet, so nothing was saved.");
    var btn = document.getElementById("go"); btn.disabled = true;
    fetch(C.supabaseUrl + "/rest/v1/call_requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: C.supabaseAnonKey, Authorization: "Bearer " + C.supabaseAnonKey, Prefer: "return=minimal" },
      body: JSON.stringify({ name: f.name.value.trim(), business: f.business.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), trade: f.trade.value || null, best_time: f.best_time.value || null, note: f.note.value.trim() || null })
    }).then(function (r) {
      btn.disabled = false;
      if (!r.ok) throw new Error("bad");
      form.hidden = true;
      var d = document.createElement("div"); d.className = "msg-ok"; d.textContent = "Thanks, " + f.name.value.trim().split(" ")[0] + ". We've got your details and we'll call you back soon.";
      form.parentNode.appendChild(d);
    }).catch(function () { btn.disabled = false; say("Something went wrong. Please try again in a moment."); });
  });
})();
