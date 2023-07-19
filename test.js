var appvars = window.appvars || {}; $.autoload = function () { var a = []; return { add: function (d) { "function" === typeof d && a.push(d) }, ready: function () { for (var d = 0; d < a.length; d++)a[d]() } } }(); $.config = function () { return { get: function () { for (var a = appvars.config, d = 0; d < arguments.length; d++) { var b = arguments[d]; if ("object" === typeof a && b in a) a = a[b]; else { a = $.makeArray(arguments).join("."); $.js.event("config", "miss", a); return } } return a } } }();
$.include = function () {
    function a(a, b) { if (!c[a + b]) { c[a + b] = !0; -1 === a.indexOf("//") && (a = $.uri.assets(a)); var e = -1 === a.indexOf("?") ? "?" : "&"; return a + e + appvars.config.assetsVersions[b] } } function d(a, c) { a = $.uri.assets(a) + "/" + c + "/main.min." + c; appvars.config.dev && ".webcamtests.com" !== appvars.config.domainRoot && (a = a.replace(".min.", ".")); return a } function b(a, c) { a = document.createElement(a); for (var b in c) a[b] = c[b]; document.body.appendChild(a) } var c = {}; return {
        js: function (c, d, g) {
            if ("function" === typeof d && "function" ===
                typeof g) var e = setInterval(function () { !0 === d() && (clearInterval(e), $.js.run(g)) }, 500); (c = a(c, "js")) && b("script", { type: "text/javascript", src: c })
        }, css: function (c) { (c = a(c, "css")) && b("link", { type: "text/css", rel: "stylesheet", href: c }) }, main: function (c, a) { for (var b = 0; b < a.length; b++) { var e = a[b]; $.include[e](d(c, e)) } }, widget: function (a, c) {
            if (-1 < a.indexOf("=")) { var b = $.uri.parseQueryString(a); if (!b.name) return console.log("Invalid widget", b) } else b = { name: a }; a = "widgets/" + b.name; b.css && $.include.css(d(a, "css"));
            $.include.js(d(a, "js"), function () { return b.name in jQuery }, function () { if (b.call) if ("function" === typeof $[b.name][b.call]) { var a = {}; if (b.nodes) { b.nodes = b.nodes.split(","); for (var d = 0; d < b.nodes.length; d++) { var e = b.nodes[d]; a[e] = document.getElementById(b.name + "-" + e); a[e] && (a[e] = $(a[e])) } } $[b.name][b.call](a) } else console.error("Function $." + b.name + "." + b.call + "() is undefined"); "function" === typeof c && c() })
        }
    }
}();
$.lang = function () { return { get: function () { var a = Array.prototype.slice.call(arguments); a.unshift("lang"); return $.config.get.apply(this, a) } } }(); $.loader = function () { function a(b) { b.width("0%"); b.animate({ width: "100%" }, 2E3, function () { $.loader.stopped() || a(b) }) } var d, b; return { start: function () { d || (d = $('<div id="loader"/>').appendTo("body"), b = $('<div id="loader-progress"/>').appendTo(d)); d.show(); a(b) }, stop: function () { b && b.width("0%").stop(!0); d && d.hide() }, stopped: function () { return !d || !d.is(":visible") } } }();
$.msg = function () {
    function a(a, b) { c[a] || (c[a] = $('<div id="msg-' + a + '" />').appendTo(b)); return c[a] } function d() { return a("overlay", document.body) } function b() { return a("wrapper", d()) } var c = {}; return {
        close: function () { d().remove(); c = {} }, done: function (a, b) { $.msg.show(a, b, "done") }, fail: function (a) { $.msg.show("Error", a, "fail") }, instance: function (a) { return c[a] }, show: function (e, f, g) {
            c.closer || (c.closer = a("closer", b()).on("click", $.msg.close).attr("title", "Close").html("&times;")); a("title", b()).html(e);
            a("body", b()).html(f); d().show(); g && (a("title", b()).prepend('<span id="msg-icon"/>'), b().addClass("msg-icon-" + g))
        }
    }
}();
$.tpl = function () {
    $.autoload.add(function () { for (var a = ["css", "js", "widget"], d = 0; d < a.length; d++) { var b = a[d], c = "data-include-" + b; $("body *[" + c + "]").each(function () { var a = this.getAttribute(c); if ("widget" === b) $.include.widget(a); else if (-1 === a.indexOf("/")) $.include.main(a, [b]); else $.include[b]($.uri.assets(a)) }) } }); return {
        parse: function () {
            var a = "object" === typeof arguments[1] ? arguments[1] : arguments; return arguments[0].replace(/{{([\w\.]+)}}/g, function (d, b) {
                a: {
                    d = b.split("."); for (var c = a, e = 0; e < d.length; e++)if (d[e] in
                        c) c = c[d[e]]; else { d = void 0; break a } d = c
                } if (void 0 === d) $.js.event("tpl", "miss", b); else return d
            })
        }
    }
}(); $.uri = function () { return { parseQueryString: function (a) { if (!a) return {}; "?" === a[0] && (a = a.substr(1)); a = a.split("&"); if (!a) return {}; for (var d = {}, b = 0; b < a.length; ++b) { var c = a[b].split("=", 2); d[c[0]] = 1 === c.length ? "" : decodeURIComponent(c[1].replace(/\+/g, " ")) } return d }, hostname: function (a) { return (a || "") + appvars.config.domainRoot }, assets: function (a) { return appvars.config.staticUrl + a } } }();
$.tabs = function () { $.autoload.add(function () { $(".tabs").each(function () { var a = $(this), d = $('<div class="tabs-header"/>').prependTo(a); a.children(".tab").each(function (b) { var c = $(this), e = c.children("h3").first(); e.appendTo(d).on("click", function () { a.find("h3.tab-active").not(e).removeClass("tab-active"); a.find(".tab").not(c).hide(); e.addClass("tab-active"); c.show() }); 0 === b ? e.addClass("tab-active") : c.hide() }) }) }) }();
$.xhr = function () {
    function a(a) { var b = a.data("xhr"); return b ? ("object" !== typeof b && (b = $.uri.parseQueryString(b), a.data("xhr", b)), b) : {} } function d(a) { $.post("/xhr.json", { module: "csrf" }).always(function (b, d, f) { "object" === typeof b && "object" === typeof b.data && b.data.csrf ? a(b.data.csrf) : ($.msg.fail("Cannot load CSRF. Please report bugs at <b>info@webcamtests.com</b>"), $.js.event("xhr", "fail", "csrf - " + (f || {}).responseText), $.loader.stop()) }) } $.autoload.add(function () {
        $(".xhr").on("click", "*[data-xhr]", function (b) {
            var c =
                $(b.delegateTarget), d = $(b.target), f = $.extend({}, a(c), a(d)); f.form_fields && d.closest("form").find("*[name]").each(function () { f[this.name] = this.value }); b.target.parentNode.style.zIndex = 0; $.xhr.send(f, { htmlWrapper: c, showResultMsg: !0 }); return !1
        })
    }); return {
        send: function (a, c) {
            c = c || {}; c.quietlyRequest || $.loader.start(); d(function (b) {
                a = a || {}; a[b.name] = b.value; $.post("/xhr.json", a).done(function (a) {
                    "done" === a.state && (c.showResultMsg && null !== a.data && $.msg.done("Notice", a.data), "function" === typeof c.callback &&
                        c.callback(a), c.htmlWrapper && "html" in a && (c.htmlWrapper.get(0).scrollIntoView(), c.htmlWrapper.html(a.html || "")))
                }).always(function (b, d, e) { $.loader.stop(); b.event_action && $.js.event("xhr", b.event_action, a.module); b.state && "done" === b.state || (c.showResultMsg && $.msg.fail(b.data), b.event_action || (a.module || (a.module = this.type + " " + this.url), b.data || (b.data = "string" === typeof e ? e : e.responseText), $.js.event("xhr", "fail", a.module + " - " + b.data))) })
            })
        }
    }
}();
$.js = function () {
    return {
        count: function (a) { var d = 0; $.js.each(a, function () { d++ }); return d }, each: function (a, d) { if ("object" === typeof a) if (a instanceof Array) for (var b = 0; b < a.length; b++)d(a[b], b); else for (b in a) d(a[b], b) }, event: function (a, d, b) {
            var c = "function" !== typeof gtag || appvars.config.dev ? console.log.bind(console) : gtag; b && "object" === typeof b && (b = $.extend(!0, {}, b), b = JSON.stringify(b, function (a, b) { if ((0 !== a.indexOf("on") || null !== b) && "function" !== typeof b && !/^jQuery[0-9]+$/.test(a)) return b })); c("event",
                a + "." + d, { event_category: a, event_action: d, event_label: b })
        }, extend: function (a, d) { $.js.each(d, function (b, c) { c in a ? a instanceof Array ? a.push(b) : "object" === typeof b && "object" === typeof a[c] ? $.js.extend(a[c], b) : a[c] = b : a[c] = b }) }, on: function (a, d, b, c) { c = c ? "one" : "on"; return $(a)[c](d, function (a) { var c = this; $.js.run(function () { return b.call(c, a) }) }) }, one: function (a, d, b) { return $.js.on(a, d, b, !0) }, run: function (a) {
            try { return a() } catch (c) {
                a = [c.fileName || null, c.lineNumber || 0, c.columnNumber || 0]; var d = (c.name || "?") +
                    ":" + (c.message || "?"); if (!a[0] && c.stack && "string" === typeof c.stack) { var b = c.stack.match(/(https?:\/\/\S+):([0-9]+):([0-9]+)/i); b && (b.shift(), a = b) } appvars.config.dev && console.log(c); a = d + " at " + a.join(":"); a !== this.line && (this.line = a, $.js.event("JavaScript", "Error", a)); throw c;
            }
        }
    }
}(); $(function () { !0 !== $.autoload.registerComplete && ($.autoload.registerComplete = !0, $.js.run($.autoload.ready)) });
(function () {
    window.addEventListener && document.querySelectorAll && window.addEventListener("load", function () {
        function a(a) {
            var b = document.createElement("iframe"), d = Date.now(); 450 < a.clientWidth && (b.style.height = "90px"); b.style.width = "100%"; b.style.border = "none"; b.frameBorder = 0; b.src = "/MyShowroom/view.php?medium=noslot&size=" + a.clientWidth + "x" + a.clientHeight; b.title = "iframe"; b.xhide = function () { var a = "&delay=" + (Date.now() - d); b.src = b.src.replace("/view", "/hide") + a; b.style.display = "none" }; a.parentNode.insertBefore(b,
                a); a.MyShowroom.frame = b
        } var d = document.querySelectorAll(".adxbanner"); setTimeout(function () { if (d.length) { var b = setInterval(function () { for (var c = 0, e = 0; e < d.length; e++) { a: { var f = d[e]; var g = f.MyShowroom; if (g) { if (g.enabled) { f = !0; break a } } else g = f.MyShowroom = {}; var h = g.frame; g.enabled = 1 < (f.scrollHeight || f.clientHeight || f.offsetHeight); g.enabled ? (h && h.xhide(), f = !0) : (h || a(f), f = void 0) } !0 !== f && c++ } c || clearInterval(b) }, 50); setTimeout(function () { clearInterval(b) }, 1E4) } }, 1E3)
    })
})();