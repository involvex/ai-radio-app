function fm(e, t) {
	for (var r = 0; r < t.length; r++) {
		const n = t[r]
		if (typeof n != 'string' && !Array.isArray(n)) {
			for (const i in n)
				if (i !== 'default' && !(i in e)) {
					const s = Object.getOwnPropertyDescriptor(n, i)
					s &&
						Object.defineProperty(
							e,
							i,
							s.get ? s : {enumerable: !0, get: () => n[i]},
						)
				}
		}
	}
	return Object.freeze(
		Object.defineProperty(e, Symbol.toStringTag, {value: 'Module'}),
	)
}
;(function () {
	const t = document.createElement('link').relList
	if (t && t.supports && t.supports('modulepreload')) return
	for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i)
	new MutationObserver(i => {
		for (const s of i)
			if (s.type === 'childList')
				for (const l of s.addedNodes)
					l.tagName === 'LINK' && l.rel === 'modulepreload' && n(l)
	}).observe(document, {childList: !0, subtree: !0})
	function r(i) {
		const s = {}
		return (
			i.integrity && (s.integrity = i.integrity),
			i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy),
			i.crossOrigin === 'use-credentials'
				? (s.credentials = 'include')
				: i.crossOrigin === 'anonymous'
					? (s.credentials = 'omit')
					: (s.credentials = 'same-origin'),
			s
		)
	}
	function n(i) {
		if (i.ep) return
		i.ep = !0
		const s = r(i)
		fetch(i.href, s)
	}
})()
const cm = 'modulepreload',
	dm = function (e) {
		return '/' + e
	},
	nd = {},
	El = function (t, r, n) {
		let i = Promise.resolve()
		if (r && r.length > 0) {
			let l = function (m) {
				return Promise.all(
					m.map(y =>
						Promise.resolve(y).then(
							g => ({status: 'fulfilled', value: g}),
							g => ({status: 'rejected', reason: g}),
						),
					),
				)
			}
			document.getElementsByTagName('link')
			const f = document.querySelector('meta[property=csp-nonce]'),
				c = f?.nonce || f?.getAttribute('nonce')
			i = l(
				r.map(m => {
					if (((m = dm(m)), m in nd)) return
					nd[m] = !0
					const y = m.endsWith('.css'),
						g = y ? '[rel="stylesheet"]' : ''
					if (document.querySelector(`link[href="${m}"]${g}`)) return
					const v = document.createElement('link')
					if (
						((v.rel = y ? 'stylesheet' : cm),
						y || (v.as = 'script'),
						(v.crossOrigin = ''),
						(v.href = m),
						c && v.setAttribute('nonce', c),
						document.head.appendChild(v),
						y)
					)
						return new Promise((_, S) => {
							;(v.addEventListener('load', _),
								v.addEventListener('error', () =>
									S(new Error(`Unable to preload CSS for ${m}`)),
								))
						})
				}),
			)
		}
		function s(l) {
			const f = new Event('vite:preloadError', {cancelable: !0})
			if (((f.payload = l), window.dispatchEvent(f), !f.defaultPrevented))
				throw l
		}
		return i.then(l => {
			for (const f of l || []) f.status === 'rejected' && s(f.reason)
			return t().catch(s)
		})
	},
	hm = '5'
typeof window < 'u' && ((window.__svelte ??= {}).v ??= new Set()).add(hm)
const vm = 1,
	pm = 2,
	Kv = 4,
	gm = 8,
	_m = 16,
	mm = 1,
	ym = 4,
	bm = 8,
	wm = 16,
	Sm = 1,
	Em = 2,
	or = Symbol('uninitialized'),
	km = Symbol('filename'),
	xm = 'http://www.w3.org/1999/xhtml',
	id = globalThis.process?.env?.NODE_ENV,
	De = id && !id.toLowerCase().startsWith('prod')
var pc = Array.isArray,
	Am = Array.prototype.indexOf,
	Ho = Array.prototype.includes,
	kl = Array.from,
	la = Object.defineProperty,
	ra = Object.getOwnPropertyDescriptor,
	Tm = Object.getOwnPropertyDescriptors,
	Im = Object.prototype,
	Rm = Array.prototype,
	Wv = Object.getPrototypeOf,
	ad = Object.isExtensible
const Cm = () => {}
function Om(e) {
	for (var t = 0; t < e.length; t++) e[t]()
}
function Gv() {
	var e,
		t,
		r = new Promise((n, i) => {
			;((e = n), (t = i))
		})
	return {promise: r, resolve: e, reject: t}
}
function Dm(e, t) {
	if (Array.isArray(e)) return e
	if (!(Symbol.iterator in e)) return Array.from(e)
	const r = []
	for (const n of e) if ((r.push(n), r.length === t)) break
	return r
}
const Er = 2,
	ja = 4,
	xl = 8,
	Hv = 1 << 24,
	Tn = 16,
	On = 32,
	Ii = 64,
	$f = 128,
	vn = 512,
	lr = 1024,
	pr = 2048,
	Kn = 4096,
	jr = 8192,
	en = 16384,
	Qa = 32768,
	Vf = 1 << 25,
	Ua = 65536,
	$o = 1 << 17,
	Pm = 1 << 18,
	Ja = 1 << 19,
	Lm = 1 << 20,
	jn = 1 << 25,
	Ri = 65536,
	Vo = 1 << 21,
	na = 1 << 22,
	xi = 1 << 23,
	ia = Symbol('$state'),
	Mm = Symbol('legacy props'),
	Nm = Symbol(''),
	$v = Symbol('proxy path'),
	Vv = Symbol('attributes'),
	Zf = Symbol('class'),
	Yf = Symbol('style'),
	Xf = Symbol('text'),
	Js = Symbol('form reset'),
	Bm = Symbol('hmr anchor'),
	Al = new (class extends Error {
		name = 'StaleReactionError'
		message =
			'The reaction that called `getAbortSignal()` was re-run or destroyed'
	})()
function Fm(e) {
	if (De) {
		const t = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`)
		throw ((t.name = 'Svelte error'), t)
	} else throw new Error('https://svelte.dev/e/invariant_violation')
}
function Zv(e) {
	if (De) {
		const t = new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`)
		throw ((t.name = 'Svelte error'), t)
	} else throw new Error('https://svelte.dev/e/lifecycle_outside_component')
}
function jm() {
	if (De) {
		const e = new Error(
			'async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/async_derived_orphan')
}
function od() {
	if (De) {
		const e = new Error(
			'bind_invalid_checkbox_value\nUsing `bind:value` together with a checkbox input is not allowed. Use `bind:checked` instead\nhttps://svelte.dev/e/bind_invalid_checkbox_value',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/bind_invalid_checkbox_value')
}
function Um() {
	if (De) {
		const e = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/derived_references_self')
}
function Yv(e, t, r) {
	if (De) {
		const n = new Error(`each_key_duplicate
${r ? `Keyed each block has duplicate key \`${r}\` at indexes ${e} and ${t}` : `Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`)
		throw ((n.name = 'Svelte error'), n)
	} else throw new Error('https://svelte.dev/e/each_key_duplicate')
}
function zm(e, t, r) {
	if (De) {
		const n = new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${e} was \`${t}\` but is now \`${r}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`)
		throw ((n.name = 'Svelte error'), n)
	} else throw new Error('https://svelte.dev/e/each_key_volatile')
}
function qm(e) {
	if (De) {
		const t = new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`)
		throw ((t.name = 'Svelte error'), t)
	} else throw new Error('https://svelte.dev/e/effect_in_teardown')
}
function Km() {
	if (De) {
		const e = new Error(
			'effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/effect_in_unowned_derived')
}
function Wm(e) {
	if (De) {
		const t = new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`)
		throw ((t.name = 'Svelte error'), t)
	} else throw new Error('https://svelte.dev/e/effect_orphan')
}
function Gm() {
	if (De) {
		const e = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/effect_update_depth_exceeded')
}
function Hm(e) {
	if (De) {
		const t = new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`)
		throw ((t.name = 'Svelte error'), t)
	} else throw new Error('https://svelte.dev/e/props_invalid_value')
}
function $m(e) {
	if (De) {
		const t = new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`)
		throw ((t.name = 'Svelte error'), t)
	} else throw new Error('https://svelte.dev/e/rune_outside_svelte')
}
function Vm() {
	if (De) {
		const e = new Error(
			'state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/state_descriptors_fixed')
}
function Zm() {
	if (De) {
		const e = new Error(
			'state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/state_prototype_fixed')
}
function Ym() {
	if (De) {
		const e = new Error(
			'state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/state_unsafe_mutation')
}
function Xm() {
	if (De) {
		const e = new Error(
			'svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror',
		)
		throw ((e.name = 'Svelte error'), e)
	} else throw new Error('https://svelte.dev/e/svelte_boundary_reset_onerror')
}
var is = 'font-weight: bold',
	as = 'font-weight: normal'
function Qm(e) {
	De
		? console.warn(
				`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,
				is,
				as,
			)
		: console.warn('https://svelte.dev/e/await_reactivity_loss')
}
function Jm() {
	De
		? console.warn(
				`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,
				is,
				as,
			)
		: console.warn('https://svelte.dev/e/derived_inert')
}
function e0() {
	De
		? console.warn(
				'%c[svelte] select_multiple_invalid_value\n%cThe `value` property of a `<select multiple>` element should be an array, but it received a non-array value. The selection will be kept as is.\nhttps://svelte.dev/e/select_multiple_invalid_value',
				is,
				as,
			)
		: console.warn('https://svelte.dev/e/select_multiple_invalid_value')
}
function Eu(e) {
	De
		? console.warn(
				`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,
				is,
				as,
			)
		: console.warn('https://svelte.dev/e/state_proxy_equality_mismatch')
}
function t0() {
	De
		? console.warn(
				'%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop',
				is,
				as,
			)
		: console.warn('https://svelte.dev/e/svelte_boundary_reset_noop')
}
function Xv(e) {
	return e === this.v
}
function r0(e, t) {
	return e != e
		? t == t
		: e !== t || (e !== null && typeof e == 'object') || typeof e == 'function'
}
function Qv(e) {
	return !r0(e, this.v)
}
let n0 = !1
function xn(e, t) {
	return ((e.label = t), Jv(e.v, t), e)
}
function Jv(e, t) {
	return (e?.[$v]?.(t), e)
}
function ep(e) {
	const t = new Error(),
		r = i0()
	return r.length === 0
		? null
		: (r.unshift(`
`),
			la(t, 'stack', {
				value: r.join(`
`),
			}),
			la(t, 'name', {value: e}),
			t)
}
function i0() {
	const e = Error.stackTraceLimit
	Error.stackTraceLimit = 1 / 0
	const t = new Error().stack
	if (((Error.stackTraceLimit = e), !t)) return []
	const r = t.split(`
`),
		n = []
	for (let i = 0; i < r.length; i++) {
		const s = r[i],
			l = s.replaceAll('\\', '/')
		if (s.trim() !== 'Error') {
			if (s.includes('validate_each_keys')) return []
			l.includes('svelte/src/internal') ||
				l.includes('node_modules/.vite') ||
				n.push(s)
		}
	}
	return n
}
function a0(e, t) {
	if (!De) throw new Error('invariant(...) was not guarded by if (DEV)')
	e || Fm(t)
}
let ur = null
function za(e) {
	ur = e
}
let Zo = null
function ol(e) {
	Zo = e
}
let os = null
function sd(e) {
	os = e
}
function da(e, t = !1, r) {
	;((ur = {p: ur, i: !1, c: null, e: null, s: e, x: null, r: gt, l: null}),
		De && ((ur.function = r), (os = r)))
}
function ha(e) {
	var t = ur,
		r = t.e
	if (r !== null) {
		t.e = null
		for (var n of r) wp(n)
	}
	return ((t.i = !0), (ur = t.p), De && (os = ur?.function ?? null), {})
}
function tp() {
	return !0
}
let Ji = []
function rp() {
	var e = Ji
	;((Ji = []), Om(e))
}
function zn(e) {
	if (Ji.length === 0 && !Lo) {
		var t = Ji
		queueMicrotask(() => {
			t === Ji && rp()
		})
	}
	Ji.push(e)
}
function o0() {
	for (; Ji.length > 0;) rp()
}
const Qf = new WeakMap()
function np(e) {
	var t = gt
	if (t === null) return ((bt.f |= xi), e)
	if (
		(De && e instanceof Error && !Qf.has(e) && Qf.set(e, s0(e, t)),
		(t.f & Qa) === 0 && (t.f & ja) === 0)
	)
		throw (De && !t.parent && e instanceof Error && ip(e), e)
	wi(e, t)
}
function wi(e, t) {
	if (!(t !== null && (t.f & en) !== 0)) {
		for (; t !== null;) {
			if ((t.f & $f) !== 0) {
				if ((t.f & Qa) === 0) throw e
				try {
					t.b.error(e)
					return
				} catch (r) {
					e = r
				}
			}
			t = t.parent
		}
		throw (De && e instanceof Error && ip(e), e)
	}
}
function s0(e, t) {
	const r = ra(e, 'message')
	if (!(r && !r.configurable)) {
		for (
			var n = wc ? '  ' : '	',
				i = `
${n}in ${t.fn?.name || '<unknown>'}`,
				s = t.ctx;
			s !== null;
		)
			((i += `
${n}in ${s.function?.[km].split('/').pop()}`),
				(s = s.p))
		return {
			message:
				e.message +
				`
${i}
`,
			stack: e.stack
				?.split(
					`
`,
				)
				.filter(l => !l.includes('svelte/src/internal')).join(`
`),
		}
	}
}
function ip(e) {
	const t = Qf.get(e)
	t && (la(e, 'message', {value: t.message}), la(e, 'stack', {value: t.stack}))
}
const l0 = -7169
function Jt(e, t) {
	e.f = (e.f & l0) | t
}
function gc(e) {
	;(e.f & vn) !== 0 || e.deps === null ? Jt(e, lr) : Jt(e, Kn)
}
function ap(e) {
	if (e !== null)
		for (const t of e)
			(t.f & Er) === 0 || (t.f & Ri) === 0 || ((t.f ^= Ri), ap(t.deps))
}
function op(e, t, r) {
	;((e.f & pr) !== 0 ? t.add(e) : (e.f & Kn) !== 0 && r.add(e),
		ap(e.deps),
		Jt(e, lr))
}
let Bs = !1
function u0(e) {
	var t = Bs
	try {
		return ((Bs = !1), [e(), Bs])
	} finally {
		Bs = t
	}
}
function f0(e) {
	let t = 0,
		r = ua(0),
		n
	return (
		De && xn(r, 'createSubscriber version'),
		() => {
			Sc() &&
				(I(r),
				ls(
					() => (
						t === 0 && (n = va(() => e(() => Mo(r)))),
						(t += 1),
						() => {
							zn(() => {
								;((t -= 1), t === 0 && (n?.(), (n = void 0), Mo(r)))
							})
						}
					),
				))
		}
	)
}
var c0 = Ua | Ja
function d0(e, t, r, n) {
	new h0(e, t, r, n)
}
class h0 {
	parent
	is_pending = !1
	transform_error
	#t
	#o = null
	#e
	#l
	#i
	#a = null
	#r = null
	#s = null
	#n = null
	#v = 0
	#f = 0
	#c = !1
	#d = new Set()
	#g = new Set()
	#u = null
	#m = f0(
		() => (
			(this.#u = ua(this.#v)),
			De && xn(this.#u, '$effect.pending()'),
			() => {
				this.#u = null
			}
		),
	)
	constructor(t, r, n, i) {
		;((this.#t = t),
			(this.#e = r),
			(this.#l = s => {
				var l = gt
				;((l.b = this), (l.f |= $f), n(s))
			}),
			(this.parent = gt.b),
			(this.transform_error = i ?? this.parent?.transform_error ?? (s => s)),
			(this.#i = Ec(() => {
				this.#y()
			}, c0)))
	}
	#_() {
		try {
			this.#a = fn(() => this.#l(this.#t))
		} catch (t) {
			this.error(t)
		}
	}
	#w(t) {
		const r = this.#e.failed
		r &&
			(this.#s = fn(() => {
				r(
					this.#t,
					() => t,
					() => () => {},
				)
			}))
	}
	#S() {
		const t = this.#e.pending
		t &&
			((this.is_pending = !0),
			(this.#r = fn(() => t(this.#t))),
			zn(() => {
				var r = (this.#n = document.createDocumentFragment()),
					n = Ai()
				;(r.append(n),
					(this.#a = this.#b(() => fn(() => this.#l(n)))),
					this.#f === 0 &&
						(this.#t.before(r),
						(this.#n = null),
						oa(this.#r, () => {
							this.#r = null
						}),
						this.#h(ut)))
			}))
	}
	#y() {
		try {
			if (
				((this.is_pending = this.has_pending_snippet()),
				(this.#f = 0),
				(this.#v = 0),
				(this.#a = fn(() => {
					this.#l(this.#t)
				})),
				this.#f > 0)
			) {
				var t = (this.#n = document.createDocumentFragment())
				xc(this.#a, t)
				const r = this.#e.pending
				this.#r = fn(() => r(this.#t))
			} else this.#h(ut)
		} catch (r) {
			this.error(r)
		}
	}
	#h(t) {
		;((this.is_pending = !1), t.transfer_effects(this.#d, this.#g))
	}
	defer_effect(t) {
		op(t, this.#d, this.#g)
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered())
	}
	has_pending_snippet() {
		return !!this.#e.pending
	}
	#b(t) {
		var r = gt,
			n = bt,
			i = ur
		;(Rn(this.#i), pn(this.#i), za(this.#i.ctx))
		try {
			return (Ci.ensure(), t())
		} catch (s) {
			return (np(s), null)
		} finally {
			;(Rn(r), pn(n), za(i))
		}
	}
	#p(t, r) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#p(t, r)
			return
		}
		;((this.#f += t),
			this.#f === 0 &&
				(this.#h(r),
				this.#r &&
					oa(this.#r, () => {
						this.#r = null
					}),
				this.#n && (this.#t.before(this.#n), (this.#n = null))))
	}
	update_pending_count(t, r) {
		;(this.#p(t, r),
			(this.#v += t),
			!(!this.#u || this.#c) &&
				((this.#c = !0),
				zn(() => {
					;((this.#c = !1), this.#u && Ka(this.#u, this.#v))
				})))
	}
	get_effect_pending() {
		return (this.#m(), I(this.#u))
	}
	error(t) {
		if (!this.#e.onerror && !this.#e.failed) throw t
		ut?.is_fork
			? (this.#a && ut.skip_effect(this.#a),
				this.#r && ut.skip_effect(this.#r),
				this.#s && ut.skip_effect(this.#s),
				ut.oncommit(() => {
					this.#E(t)
				}))
			: this.#E(t)
	}
	#E(t) {
		;(this.#a && (Yr(this.#a), (this.#a = null)),
			this.#r && (Yr(this.#r), (this.#r = null)),
			this.#s && (Yr(this.#s), (this.#s = null)))
		var r = this.#e.onerror
		let n = this.#e.failed
		var i = !1,
			s = !1
		const l = () => {
				if (i) {
					t0()
					return
				}
				;((i = !0),
					s && Xm(),
					this.#s !== null &&
						oa(this.#s, () => {
							this.#s = null
						}),
					this.#b(() => {
						this.#y()
					}))
			},
			f = c => {
				try {
					;((s = !0), r?.(c, l), (s = !1))
				} catch (m) {
					wi(m, this.#i && this.#i.parent)
				}
				n &&
					(this.#s = this.#b(() => {
						try {
							return fn(() => {
								var m = gt
								;((m.b = this),
									(m.f |= $f),
									n(
										this.#t,
										() => c,
										() => l,
									))
							})
						} catch (m) {
							return (wi(m, this.#i.parent), null)
						}
					}))
			}
		zn(() => {
			var c
			try {
				c = this.transform_error(t)
			} catch (m) {
				wi(m, this.#i && this.#i.parent)
				return
			}
			c !== null && typeof c == 'object' && typeof c.then == 'function'
				? c.then(f, m => wi(m, this.#i && this.#i.parent))
				: f(c)
		})
	}
}
function v0(e, t, r, n) {
	const i = Yo
	var s = e.filter(_ => !_.settled),
		l = t.map(i)
	if (
		(De &&
			l.forEach((_, S) => {
				_.label = t[S].toString()
					.replace('() => ', '')
					.replaceAll('$.eager(() => ', '$state.eager(')
					.replace(/\$\.get\((.+?)\)/g, (x, R) => R)
			}),
		r.length === 0 && s.length === 0)
	) {
		n(l)
		return
	}
	var f = gt,
		c = p0(),
		m =
			s.length === 1
				? s[0].promise
				: s.length > 1
					? Promise.all(s.map(_ => _.promise))
					: null
	function y(_) {
		if ((f.f & en) === 0) {
			c()
			try {
				n([...l, ..._])
			} catch (S) {
				wi(S, f)
			}
			sl()
		}
	}
	var g = sp()
	if (r.length === 0) {
		m.then(() => y([])).finally(g)
		return
	}
	function v() {
		Promise.all(r.map(_ => _0(_)))
			.then(y)
			.catch(_ => wi(_, f))
			.finally(g)
	}
	m
		? m.then(() => {
				;(c(), v(), sl())
			})
		: v()
}
function p0() {
	var e = gt,
		t = bt,
		r = ur,
		n = ut
	if (De) var i = Zo
	return function (l = !0) {
		;(Rn(e),
			pn(t),
			za(r),
			l && (e.f & en) === 0 && (n?.activate(), n?.apply()),
			De && (lp(null), ol(i)))
	}
}
function sl(e = !0) {
	;(Rn(null),
		pn(null),
		za(null),
		e && ut?.deactivate(),
		De && (lp(null), ol(null)))
}
function sp() {
	var e = gt,
		t = e.b,
		r = ut,
		n = !!t?.is_rendered()
	return (
		t?.update_pending_count(1, r),
		r.increment(n, e),
		() => {
			;(t?.update_pending_count(-1, r), r.decrement(n, e))
		}
	)
}
let cn = null
function lp(e) {
	cn = e
}
const g0 = new Set()
function Yo(e) {
	var t = Er | pr
	return (
		gt !== null && (gt.f |= Ja),
		{
			ctx: ur,
			deps: null,
			effects: null,
			equals: Xv,
			f: t,
			fn: e,
			reactions: null,
			rv: 0,
			v: or,
			wv: 0,
			parent: gt,
			ac: null,
		}
	)
}
const Io = Symbol('obsolete')
function _0(e, t, r) {
	let n = gt
	n === null && jm()
	var i = void 0,
		s = ua(or)
	De && (s.label = e.toString())
	var l = !bt,
		f = new Set()
	return (
		M0(() => {
			var c = gt
			De && (cn = {effect: c, effect_deps: new Set(), warned: !1})
			var m = Gv()
			i = m.promise
			try {
				Promise.resolve(e())
					.then(m.resolve, _ => {
						_ !== Al && m.reject(_)
					})
					.finally(sl)
			} catch (_) {
				;(m.reject(_), sl())
			}
			if (De) {
				if (cn) {
					if (c.deps !== null)
						for (let _ = 0; _ < Hr; _ += 1) cn.effect_deps.add(c.deps[_])
					if (Sr !== null)
						for (let _ = 0; _ < Sr.length; _ += 1) cn.effect_deps.add(Sr[_])
				}
				cn = null
			}
			var y = ut
			if (l) {
				if ((c.f & Qa) !== 0) var g = sp()
				if (n.b?.is_rendered()) y.async_deriveds.get(c)?.reject(Io)
				else for (const _ of f.values()) _.reject(Io)
				;(f.add(m), y.async_deriveds.set(c, m))
			}
			const v = (_, S = void 0) => {
				;(De && (cn = null),
					g?.(),
					f.delete(m),
					S !== Io &&
						(y.activate(),
						S
							? ((s.f |= xi), Ka(s, S))
							: ((s.f & xi) !== 0 && (s.f ^= xi), Ka(s, _)),
						y.deactivate()))
			}
			m.promise.then(v, _ => v(null, _ || 'unknown'))
		}),
		Rl(() => {
			for (const c of f) c.reject(Io)
		}),
		De && (s.f |= na),
		new Promise(c => {
			function m(y) {
				function g() {
					y === i ? c(s) : m(i)
				}
				y.then(g, g)
			}
			m(i)
		})
	)
}
function dn(e) {
	const t = Yo(e)
	return (Tp(t), t)
}
function up(e) {
	const t = Yo(e)
	return ((t.equals = Qv), t)
}
function ld(e) {
	var t = e.effects
	if (t !== null) {
		e.effects = null
		for (var r = 0; r < t.length; r += 1) Yr(t[r])
	}
}
let ku = []
function _c(e) {
	var t,
		r = gt,
		n = e.parent
	if (!ii && n !== null && e.v !== or && (n.f & (en | jr)) !== 0)
		return (Jm(), e.v)
	if ((Rn(n), De)) {
		let i = qa
		cd(new Set())
		try {
			;(Ho.call(ku, e) && Um(), ku.push(e), (e.f &= ~Ri), ld(e), (t = ec(e)))
		} finally {
			;(Rn(r), cd(i), ku.pop())
		}
	} else
		try {
			;((e.f &= ~Ri), ld(e), (t = ec(e)))
		} finally {
			Rn(r)
		}
	return t
}
function fp(e) {
	var t = _c(e)
	if (
		!e.equals(t) &&
		((e.wv = Rp()),
		(!ut?.is_fork || e.deps === null) &&
			(ut !== null ? (ut.capture(e, t, !0), ll?.capture(e, t, !0)) : (e.v = t),
			e.deps === null))
	) {
		Jt(e, lr)
		return
	}
	ii || (In !== null ? (Sc() || ut?.is_fork) && In.set(e, t) : gc(e))
}
function m0(e) {
	if (e.effects !== null)
		for (const t of e.effects)
			(t.teardown || t.ac) &&
				(t.teardown?.(),
				t.ac?.abort(Al),
				t.fn !== null && (t.teardown = Cm),
				(t.ac = null),
				Xo(t, 0),
				kc(t))
}
function cp(e) {
	if (e.effects !== null)
		for (const t of e.effects) t.teardown && t.fn !== null && Wa(t)
}
let xu = null,
	Aa = null,
	ut = null,
	ll = null,
	In = null,
	Jf = null,
	Lo = !1,
	Au = !1,
	La = null,
	el = null
var ud = 0,
	Tu = new Set()
let y0 = 1
class Ci {
	id = y0++
	#t = !1
	linked = !0
	#o = null
	#e = null
	async_deriveds = new Map()
	current = new Map()
	previous = new Map()
	#l = new Set()
	#i = new Set()
	#a = 0
	#r = new Map()
	#s = null
	#n = []
	#v = []
	#f = new Set()
	#c = new Set()
	#d = new Map()
	#g = new Set()
	is_fork = !1
	#u = !1
	constructor() {
		;(Aa === null ? (xu = Aa = this) : ((Aa.#e = this), (this.#o = Aa)),
			(Aa = this))
	}
	#m() {
		if (this.is_fork) return !0
		for (const n of this.#r.keys()) {
			for (var t = n, r = !1; t.parent !== null;) {
				if (this.#d.has(t)) {
					r = !0
					break
				}
				t = t.parent
			}
			if (!r) return !0
		}
		return !1
	}
	skip_effect(t) {
		;(this.#d.has(t) || this.#d.set(t, {d: [], m: []}), this.#g.delete(t))
	}
	unskip_effect(t, r = n => this.schedule(n)) {
		var n = this.#d.get(t)
		if (n) {
			this.#d.delete(t)
			for (var i of n.d) (Jt(i, pr), r(i))
			for (i of n.m) (Jt(i, Kn), r(i))
		}
		this.#g.add(t)
	}
	#_() {
		if (((this.#t = !0), ud++ > 1e3 && (this.#p(), w0()), De))
			for (const c of this.current.keys()) Tu.add(c)
		for (const c of this.#f) (this.#c.delete(c), Jt(c, pr), this.schedule(c))
		for (const c of this.#c) (Jt(c, Kn), this.schedule(c))
		const t = this.#n
		;((this.#n = []), this.apply())
		var r = (La = []),
			n = [],
			i = (el = [])
		for (const c of t)
			try {
				this.#w(c, r, n)
			} catch (m) {
				throw (vp(c), this.#m() || this.discard(), m)
			}
		if (((ut = null), i.length > 0)) {
			var s = Ci.ensure()
			for (const c of i) s.schedule(c)
		}
		if (((La = null), (el = null), this.#m())) {
			;(this.#h(n), this.#h(r))
			for (const [c, m] of this.#d) hp(c, m)
			i.length > 0 && ut.#_()
			return
		}
		const l = this.#S()
		if (l) {
			;(this.#h(n), this.#h(r), l.#y(this))
			return
		}
		;(this.#f.clear(), this.#c.clear())
		for (const c of this.#l) c(this)
		;(this.#l.clear(),
			(ll = this),
			fd(n),
			fd(r),
			(ll = null),
			this.#s?.resolve())
		var f = ut
		if (
			(this.#a === 0 && (this.#n.length === 0 || f !== null) && this.#p(),
			this.#n.length > 0)
		)
			if (f !== null) {
				const c = f
				c.#n.push(...this.#n.filter(m => !c.#n.includes(m)))
			} else f = this
		f !== null && f.#_()
	}
	#w(t, r, n) {
		t.f ^= lr
		for (var i = t.first; i !== null;) {
			var s = i.f,
				l = (s & (On | Ii)) !== 0,
				f = l && (s & lr) !== 0,
				c = f || (s & jr) !== 0 || this.#d.has(i)
			if (!c && i.fn !== null) {
				l
					? (i.f ^= lr)
					: (s & ja) !== 0
						? r.push(i)
						: us(i) && ((s & Tn) !== 0 && this.#c.add(i), Wa(i))
				var m = i.first
				if (m !== null) {
					i = m
					continue
				}
			}
			for (; i !== null;) {
				var y = i.next
				if (y !== null) {
					i = y
					break
				}
				i = i.parent
			}
		}
	}
	#S() {
		for (var t = this.#o; t !== null;) {
			if (!t.is_fork) {
				for (const [r, [, n]] of this.current)
					if (t.current.has(r) && !n) return t
			}
			t = t.#o
		}
		return null
	}
	#y(t) {
		for (const [n, i] of t.current)
			(!this.previous.has(n) &&
				t.previous.has(n) &&
				this.previous.set(n, t.previous.get(n)),
				this.current.set(n, i))
		for (const [n, i] of t.async_deriveds) {
			const s = this.async_deriveds.get(n)
			s && i.promise.then(s.resolve).catch(s.reject)
		}
		;(t.async_deriveds.clear(), this.transfer_effects(t.#f, t.#c))
		const r = n => {
			var i = n.reactions
			if (i !== null)
				for (const f of i) {
					var s = f.f
					if ((s & Er) !== 0) r(f)
					else {
						var l = f
						s & (na | Tn) &&
							!this.async_deriveds.has(l) &&
							(this.#c.delete(l), Jt(l, pr), this.schedule(l))
					}
				}
		}
		for (const n of this.current.keys()) r(n)
		;(this.oncommit(() => t.discard()), t.#p(), (ut = this), this.#_())
	}
	#h(t) {
		for (var r = 0; r < t.length; r += 1) op(t[r], this.#f, this.#c)
	}
	capture(t, r, n = !1) {
		;(t.v !== or && !this.previous.has(t) && this.previous.set(t, t.v),
			(t.f & xi) === 0 && (this.current.set(t, [r, n]), In?.set(t, r)),
			this.is_fork || (t.v = r))
	}
	activate() {
		ut = this
	}
	deactivate() {
		;((ut = null), (In = null))
	}
	flush() {
		try {
			;(De && Tu.clear(), (Au = !0), (ut = this), this.#_())
		} finally {
			if (
				((ud = 0),
				(Jf = null),
				(La = null),
				(el = null),
				(Au = !1),
				(ut = null),
				(In = null),
				aa.clear(),
				De)
			)
				for (const t of Tu) t.updated = null
		}
	}
	discard() {
		for (const t of this.#i) t(this)
		this.#i.clear()
		for (const t of this.async_deriveds.values()) t.reject(Io)
		;(this.#p(), this.#s?.resolve())
	}
	register_created_effect(t) {
		this.#v.push(t)
	}
	#b() {
		for (let g = xu; g !== null; g = g.#e) {
			var t = g.id < this.id,
				r = []
			for (const [v, [_, S]] of this.current) {
				if (g.current.has(v)) {
					var n = g.current.get(v)[0]
					if (t && _ !== n) g.current.set(v, [_, S])
					else continue
				}
				r.push(v)
			}
			if (t)
				for (const [v, _] of this.async_deriveds) {
					const S = g.async_deriveds.get(v)
					S && _.promise.then(S.resolve).catch(S.reject)
				}
			var i = [...g.current.keys()].filter(v => !g.current.get(v)[1])
			if (!(!g.#t || i.length === 0)) {
				var s = i.filter(v => !this.current.has(v))
				if (s.length === 0) t && g.discard()
				else if (r.length > 0) {
					if (
						(De && !g.#u && a0(g.#n.length === 0, 'Batch has scheduled roots'),
						t)
					)
						for (const v of this.#g)
							g.unskip_effect(v, _ => {
								;(_.f & (Tn | na)) !== 0 ? g.schedule(_) : g.#h([_])
							})
					g.activate()
					var l = new Set(),
						f = new Map()
					for (var c of r) dp(c, s, l, f)
					f = new Map()
					var m = [...g.current]
						.filter(([v, _]) => {
							const S = this.current.get(v)
							return S ? S[0] !== _[0] || S[1] !== _[1] : !0
						})
						.map(([v]) => v)
					if (m.length > 0)
						for (const v of this.#v)
							(v.f & (en | jr | $o)) === 0 &&
								mc(v, m, f) &&
								((v.f & (na | Tn)) !== 0
									? (Jt(v, pr), g.schedule(v))
									: g.#f.add(v))
					if (g.#n.length > 0 && !g.#u) {
						g.apply()
						for (var y of g.#n) g.#w(y, [], [])
						g.#n = []
					}
					g.deactivate()
				}
			}
		}
	}
	increment(t, r) {
		if (((this.#a += 1), t)) {
			let n = this.#r.get(r) ?? 0
			this.#r.set(r, n + 1)
		}
	}
	decrement(t, r) {
		if (((this.#a -= 1), t)) {
			let n = this.#r.get(r) ?? 0
			n === 1 ? this.#r.delete(r) : this.#r.set(r, n - 1)
		}
		this.#u ||
			((this.#u = !0),
			zn(() => {
				;((this.#u = !1), this.linked && this.flush())
			}))
	}
	transfer_effects(t, r) {
		for (const n of t) this.#f.add(n)
		for (const n of r) this.#c.add(n)
		;(t.clear(), r.clear())
	}
	oncommit(t) {
		this.#l.add(t)
	}
	ondiscard(t) {
		this.#i.add(t)
	}
	settled() {
		return (this.#s ??= Gv()).promise
	}
	static ensure() {
		if (ut === null) {
			const t = (ut = new Ci())
			!Au &&
				!Lo &&
				zn(() => {
					t.#t || t.flush()
				})
		}
		return ut
	}
	apply() {
		{
			In = null
			return
		}
	}
	schedule(t) {
		if (
			((Jf = t),
			t.b?.is_pending && (t.f & (ja | xl | Hv)) !== 0 && (t.f & Qa) === 0)
		) {
			t.b.defer_effect(t)
			return
		}
		for (var r = t; r.parent !== null;) {
			r = r.parent
			var n = r.f
			if (La !== null && r === gt && (bt === null || (bt.f & Er) === 0)) return
			if ((n & (Ii | On)) !== 0) {
				if ((n & lr) === 0) return
				r.f ^= lr
			}
		}
		this.#n.push(r)
	}
	#p() {
		if (this.linked) {
			var t = this.#o,
				r = this.#e
			;(t === null ? (xu = r) : (t.#e = r),
				r === null ? (Aa = t) : (r.#o = t),
				(this.linked = !1))
		}
	}
}
function b0(e) {
	var t = Lo
	Lo = !0
	try {
		for (var r; ;) {
			if ((o0(), ut === null)) return r
			ut.flush()
		}
	} finally {
		Lo = t
	}
}
function w0() {
	if (De) {
		var e = new Map()
		for (const r of ut.current.keys())
			for (const [n, i] of r.updated ?? []) {
				var t = e.get(n)
				;(t || ((t = {error: i.error, count: 0}), e.set(n, t)),
					(t.count += i.count))
			}
		for (const r of e.values()) r.error && console.error(r.error)
	}
	try {
		Gm()
	} catch (r) {
		;(De && la(r, 'stack', {value: ''}), wi(r, Jf))
	}
}
let Qn = null
function fd(e) {
	var t = e.length
	if (t !== 0) {
		for (var r = 0; r < t;) {
			var n = e[r++]
			if (
				(n.f & (en | jr)) === 0 &&
				us(n) &&
				((Qn = new Set()),
				Wa(n),
				n.deps === null &&
					n.first === null &&
					n.nodes === null &&
					n.teardown === null &&
					n.ac === null &&
					kp(n),
				Qn?.size > 0)
			) {
				aa.clear()
				for (const i of Qn) {
					if ((i.f & (en | jr)) !== 0) continue
					const s = [i]
					let l = i.parent
					for (; l !== null;)
						(Qn.has(l) && (Qn.delete(l), s.push(l)), (l = l.parent))
					for (let f = s.length - 1; f >= 0; f--) {
						const c = s[f]
						;(c.f & (en | jr)) === 0 && Wa(c)
					}
				}
				Qn.clear()
			}
		}
		Qn = null
	}
}
function dp(e, t, r, n) {
	if (!r.has(e) && (r.add(e), e.reactions !== null))
		for (const i of e.reactions) {
			const s = i.f
			;(s & Er) !== 0
				? dp(i, t, r, n)
				: (s & (na | Tn)) !== 0 &&
					(s & pr) === 0 &&
					mc(i, t, n) &&
					(Jt(i, pr), yc(i))
		}
}
function mc(e, t, r) {
	const n = r.get(e)
	if (n !== void 0) return n
	if (e.deps !== null)
		for (const i of e.deps) {
			if (Ho.call(t, i)) return !0
			if ((i.f & Er) !== 0 && mc(i, t, r)) return (r.set(i, !0), !0)
		}
	return (r.set(e, !1), !1)
}
function yc(e) {
	ut.schedule(e)
}
function hp(e, t) {
	if (!((e.f & On) !== 0 && (e.f & lr) !== 0)) {
		;((e.f & pr) !== 0 ? t.d.push(e) : (e.f & Kn) !== 0 && t.m.push(e),
			Jt(e, lr))
		for (var r = e.first; r !== null;) (hp(r, t), (r = r.next))
	}
}
function vp(e) {
	Jt(e, lr)
	for (var t = e.first; t !== null;) (vp(t), (t = t.next))
}
let qa = new Set()
const aa = new Map()
function cd(e) {
	qa = e
}
let bc = !1
function S0() {
	bc = !0
}
function ua(e, t) {
	var r = {f: 0, v: e, reactions: null, equals: Xv, rv: 0, wv: 0}
	return r
}
function qe(e, t) {
	const r = ua(e)
	return (Tp(r), r)
}
function E0(e, t = !1, r = !0) {
	const n = ua(e)
	return (t || (n.equals = Qv), n)
}
function q(e, t, r = !1) {
	bt !== null &&
		(!hn || (bt.f & $o) !== 0) &&
		tp() &&
		(bt.f & (Er | Tn | na | $o)) !== 0 &&
		(qn === null || !qn.has(e)) &&
		Ym()
	let n = r ? Br(t) : t
	return (De && Jv(n, e.label), Ka(e, n, el))
}
function Ka(e, t, r = null) {
	if (!e.equals(t)) {
		aa.set(e, ii ? t : e.v)
		var n = Ci.ensure()
		if ((n.capture(e, t), De)) {
			if (gt !== null) {
				e.updated ??= new Map()
				const i = (e.updated.get('')?.count ?? 0) + 1
				if ((e.updated.set('', {error: null, count: i}), i > 5)) {
					const s = ep('updated at')
					if (s !== null) {
						let l = e.updated.get(s.stack)
						;(l || ((l = {error: s, count: 0}), e.updated.set(s.stack, l)),
							l.count++)
					}
				}
			}
			gt !== null && (e.set_during_effect = !0)
		}
		if ((e.f & Er) !== 0) {
			const i = e
			;((e.f & pr) !== 0 && _c(i), In === null && gc(i))
		}
		;((e.wv = Rp()),
			gp(e, pr, r),
			gt !== null &&
				(gt.f & lr) !== 0 &&
				(gt.f & (On | Ii)) === 0 &&
				(ln === null ? F0([e]) : ln.push(e)),
			!n.is_fork && qa.size > 0 && !bc && pp())
	}
	return t
}
function pp() {
	bc = !1
	for (const e of qa) {
		;(e.f & lr) !== 0 && Jt(e, Kn)
		let t
		try {
			t = us(e)
		} catch {
			t = !0
		}
		t && Wa(e)
	}
	qa.clear()
}
function Mo(e) {
	q(e, e.v + 1)
}
function gp(e, t, r) {
	var n = e.reactions
	if (n !== null)
		for (var i = n.length, s = 0; s < i; s++) {
			var l = n[s],
				f = l.f,
				c = (f & pr) === 0
			if ((c && Jt(l, t), (f & $o) !== 0)) qa.add(l)
			else if ((f & Er) !== 0) {
				var m = l
				;(In?.delete(m),
					(f & Ri) === 0 &&
						(f & vn && (gt === null || (gt.f & Vo) === 0) && (l.f |= Ri),
						gp(m, Kn, r)))
			} else if (c) {
				var y = l
				;((f & Tn) !== 0 && Qn !== null && Qn.add(y),
					r !== null ? r.push(y) : yc(y))
			}
		}
}
const k0 = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/
function Br(e) {
	if (typeof e != 'object' || e === null || ia in e) return e
	const t = Wv(e)
	if (t !== Im && t !== Rm) return e
	var r = new Map(),
		n = pc(e),
		i = qe(0),
		s = sa,
		l = y => {
			if (sa === s) return y()
			var g = bt,
				v = sa
			;(pn(null), pd(s))
			var _ = y()
			return (pn(g), pd(v), _)
		}
	n && (r.set('length', qe(e.length)), De && (e = A0(e)))
	var f = ''
	let c = !1
	function m(y) {
		if (!c) {
			;((c = !0), (f = y), xn(i, `${f} version`))
			for (const [g, v] of r) xn(v, $i(f, g))
			c = !1
		}
	}
	return new Proxy(e, {
		defineProperty(y, g, v) {
			;(!('value' in v) ||
				v.configurable === !1 ||
				v.enumerable === !1 ||
				v.writable === !1) &&
				Vm()
			var _ = r.get(g)
			return (
				_ === void 0
					? l(() => {
							var S = qe(v.value)
							return (
								r.set(g, S),
								De && typeof g == 'string' && xn(S, $i(f, g)),
								S
							)
						})
					: q(_, v.value, !0),
				!0
			)
		},
		deleteProperty(y, g) {
			var v = r.get(g)
			if (v === void 0) {
				if (g in y) {
					const _ = l(() => qe(or))
					;(r.set(g, _), Mo(i), De && xn(_, $i(f, g)))
				}
			} else (q(v, or), Mo(i))
			return !0
		},
		get(y, g, v) {
			if (g === ia) return e
			if (De && g === $v) return m
			var _ = r.get(g),
				S = g in y
			if (
				(_ === void 0 &&
					(!S || ra(y, g)?.writable) &&
					((_ = l(() => {
						var R = Br(S ? y[g] : or),
							b = qe(R)
						return (De && xn(b, $i(f, g)), b)
					})),
					r.set(g, _)),
				_ !== void 0)
			) {
				var x = I(_)
				return x === or ? void 0 : x
			}
			return Reflect.get(y, g, v)
		},
		getOwnPropertyDescriptor(y, g) {
			var v = Reflect.getOwnPropertyDescriptor(y, g)
			if (v && 'value' in v) {
				var _ = r.get(g)
				_ && (v.value = I(_))
			} else if (v === void 0) {
				var S = r.get(g),
					x = S?.v
				if (S !== void 0 && x !== or)
					return {enumerable: !0, configurable: !0, value: x, writable: !0}
			}
			return v
		},
		has(y, g) {
			if (g === ia) return !0
			var v = r.get(g),
				_ = (v !== void 0 && v.v !== or) || Reflect.has(y, g)
			if (v !== void 0 || (gt !== null && (!_ || ra(y, g)?.writable))) {
				v === void 0 &&
					((v = l(() => {
						var x = _ ? Br(y[g]) : or,
							R = qe(x)
						return (De && xn(R, $i(f, g)), R)
					})),
					r.set(g, v))
				var S = I(v)
				if (S === or) return !1
			}
			return _
		},
		set(y, g, v, _) {
			var S = r.get(g),
				x = g in y
			if (n && g === 'length')
				for (var R = v; R < S.v; R += 1) {
					var b = r.get(R + '')
					b !== void 0
						? q(b, or)
						: R in y &&
							((b = l(() => qe(or))), r.set(R + '', b), De && xn(b, $i(f, R)))
				}
			if (S === void 0)
				(!x || ra(y, g)?.writable) &&
					((S = l(() => qe(void 0))),
					De && xn(S, $i(f, g)),
					q(S, Br(v)),
					r.set(g, S))
			else {
				x = S.v !== or
				var A = l(() => Br(v))
				q(S, A)
			}
			var L = Reflect.getOwnPropertyDescriptor(y, g)
			if ((L?.set && L.set.call(_, v), !x)) {
				if (n && typeof g == 'string') {
					var N = r.get('length'),
						U = Number(g)
					Number.isInteger(U) && U >= N.v && q(N, U + 1)
				}
				Mo(i)
			}
			return !0
		},
		ownKeys(y) {
			I(i)
			var g = Reflect.ownKeys(y).filter(S => {
				var x = r.get(S)
				return x === void 0 || x.v !== or
			})
			for (var [v, _] of r) _.v !== or && !(v in y) && g.push(v)
			return g
		},
		setPrototypeOf() {
			Zm()
		},
	})
}
function $i(e, t) {
	return typeof t == 'symbol'
		? `${e}[Symbol(${t.description ?? ''})]`
		: k0.test(t)
			? `${e}.${t}`
			: /^\d+$/.test(t)
				? `${e}[${t}]`
				: `${e}['${t}']`
}
function No(e) {
	try {
		if (e !== null && typeof e == 'object' && ia in e) return e[ia]
	} catch {}
	return e
}
function _p(e, t) {
	return Object.is(No(e), No(t))
}
const x0 = new Set([
	'copyWithin',
	'fill',
	'pop',
	'push',
	'reverse',
	'shift',
	'sort',
	'splice',
	'unshift',
])
function A0(e) {
	return new Proxy(e, {
		get(t, r, n) {
			var i = Reflect.get(t, r, n)
			return x0.has(r)
				? function (...s) {
						S0()
						var l = i.apply(this, s)
						return (pp(), l)
					}
				: i
		},
	})
}
function T0() {
	const e = Array.prototype,
		t = Array.__svelte_cleanup
	t && t()
	const {indexOf: r, lastIndexOf: n, includes: i} = e
	;((e.indexOf = function (s, l) {
		const f = r.call(this, s, l)
		if (f === -1) {
			for (let c = l ?? 0; c < this.length; c += 1)
				if (No(this[c]) === s) {
					Eu('array.indexOf(...)')
					break
				}
		}
		return f
	}),
		(e.lastIndexOf = function (s, l) {
			const f = n.call(this, s, l ?? this.length - 1)
			if (f === -1) {
				for (let c = 0; c <= (l ?? this.length - 1); c += 1)
					if (No(this[c]) === s) {
						Eu('array.lastIndexOf(...)')
						break
					}
			}
			return f
		}),
		(e.includes = function (s, l) {
			const f = i.call(this, s, l)
			if (!f) {
				for (let c = 0; c < this.length; c += 1)
					if (No(this[c]) === s) {
						Eu('array.includes(...)')
						break
					}
			}
			return f
		}),
		(Array.__svelte_cleanup = () => {
			;((e.indexOf = r), (e.lastIndexOf = n), (e.includes = i))
		}))
}
var dd, wc, mp, yp
function I0() {
	if (dd === void 0) {
		;((dd = window), (wc = /Firefox/.test(navigator.userAgent)))
		var e = Element.prototype,
			t = Node.prototype,
			r = Text.prototype
		;((mp = ra(t, 'firstChild').get),
			(yp = ra(t, 'nextSibling').get),
			ad(e) &&
				((e[Zf] = void 0), (e[Vv] = null), (e[Yf] = void 0), (e.__e = void 0)),
			ad(r) && (r[Xf] = void 0),
			De && ((e.__svelte_meta = null), T0()))
	}
}
function Ai(e = '') {
	return document.createTextNode(e)
}
function ul(e) {
	return mp.call(e)
}
function ss(e) {
	return yp.call(e)
}
function ie(e, t) {
	return ul(e)
}
function Ma(e, t = !1) {
	{
		var r = ul(e)
		return r instanceof Comment && r.data === '' ? ss(r) : r
	}
}
function oe(e, t = 1, r = !1) {
	let n = e
	for (; t--;) n = ss(n)
	return n
}
function R0(e) {
	e.textContent = ''
}
function bp() {
	return !1
}
function C0(e, t, r) {
	return r ? document.createElement(e, {is: r}) : document.createElement(e)
}
let hd = !1
function O0() {
	hd ||
		((hd = !0),
		document.addEventListener(
			'reset',
			e => {
				Promise.resolve().then(() => {
					if (!e.defaultPrevented) for (const t of e.target.elements) t[Js]?.()
				})
			},
			{capture: !0},
		))
}
function Tl(e) {
	var t = bt,
		r = gt
	;(pn(null), Rn(null))
	try {
		return e()
	} finally {
		;(pn(t), Rn(r))
	}
}
function Il(e, t, r, n = r) {
	e.addEventListener(t, () => Tl(r))
	const i = e[Js]
	;(i
		? (e[Js] = () => {
				;(i(), n(!0))
			})
		: (e[Js] = () => n(!0)),
		O0())
}
function D0(e) {
	;(gt === null && (bt === null && Wm(e), Km()), ii && qm(e))
}
function P0(e, t) {
	var r = t.last
	r === null
		? (t.last = t.first = e)
		: ((r.next = e), (e.prev = r), (t.last = e))
}
function oi(e, t) {
	var r = gt
	if (De) for (; r !== null && (r.f & $o) !== 0;) r = r.parent
	r !== null && (r.f & jr) !== 0 && (e |= jr)
	var n = {
		ctx: ur,
		deps: null,
		nodes: null,
		f: e | pr | vn,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: r,
		b: r && r.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null,
	}
	;(De && (n.component_function = os), ut?.register_created_effect(n))
	var i = n
	if ((e & ja) !== 0) La !== null ? La.push(n) : Ci.ensure().schedule(n)
	else if (t !== null) {
		try {
			Wa(n)
		} catch (l) {
			throw (Yr(n), l)
		}
		i.deps === null &&
			i.teardown === null &&
			i.nodes === null &&
			i.first === i.last &&
			(i.f & Ja) === 0 &&
			((i = i.first),
			(e & Tn) !== 0 && (e & Ua) !== 0 && i !== null && (i.f |= Ua))
	}
	if (
		i !== null &&
		((i.parent = r),
		r !== null && P0(i, r),
		bt !== null && (bt.f & Er) !== 0 && (e & Ii) === 0)
	) {
		var s = bt
		;(s.effects ??= []).push(i)
	}
	return n
}
function Sc() {
	return bt !== null && !hn
}
function Rl(e) {
	const t = oi(xl, null)
	return (Jt(t, lr), (t.teardown = e), t)
}
function Ti(e) {
	;(D0('$effect'), De && la(e, 'name', {value: '$effect'}))
	var t = gt.f,
		r = !bt && (t & On) !== 0 && ur !== null && !ur.i
	if (r) {
		var n = ur
		;(n.e ??= []).push(e)
	} else return wp(e)
}
function wp(e) {
	return oi(ja | Lm, e)
}
function L0(e) {
	Ci.ensure()
	const t = oi(Ii | Ja, e)
	return (r = {}) =>
		new Promise(n => {
			r.outro
				? oa(t, () => {
						;(Yr(t), n(void 0))
					})
				: (Yr(t), n(void 0))
		})
}
function Sp(e) {
	return oi(ja, e)
}
function M0(e) {
	return oi(na | Ja, e)
}
function ls(e, t = 0) {
	return oi(xl | t, e)
}
function At(e, t = [], r = [], n = []) {
	v0(n, t, r, i => {
		oi(xl, () => {
			e(...i.map(I))
		})
	})
}
function Ec(e, t = 0) {
	var r = oi(Tn | t, e)
	return (De && (r.dev_stack = Zo), r)
}
function fn(e) {
	return oi(On | Ja, e)
}
function Ep(e) {
	var t = e.teardown
	if (t !== null) {
		const r = ii,
			n = bt
		;(vd(!0), pn(null))
		try {
			t.call(null)
		} finally {
			;(vd(r), pn(n))
		}
	}
}
function kc(e, t = !1) {
	var r = e.first
	for (e.first = e.last = null; r !== null;) {
		const i = r.ac
		i !== null &&
			Tl(() => {
				i.abort(Al)
			})
		var n = r.next
		;((r.f & Ii) !== 0 ? (r.parent = null) : Yr(r, t), (r = n))
	}
}
function N0(e) {
	for (var t = e.first; t !== null;) {
		var r = t.next
		;((t.f & On) === 0 && Yr(t), (t = r))
	}
}
function Yr(e, t = !0) {
	var r = !1
	;((t || (e.f & Pm) !== 0) &&
		e.nodes !== null &&
		e.nodes.end !== null &&
		(B0(e.nodes.start, e.nodes.end), (r = !0)),
		(e.f |= Vf),
		kc(e, t && !r),
		Xo(e, 0))
	var n = e.nodes && e.nodes.t
	if (n !== null) for (const s of n) s.stop()
	;(Ep(e), (e.f ^= Vf), (e.f |= en))
	var i = e.parent
	;(i !== null && i.first !== null && kp(e),
		De && (e.component_function = null),
		(e.next =
			e.prev =
			e.teardown =
			e.ctx =
			e.deps =
			e.fn =
			e.nodes =
			e.ac =
			e.b =
				null))
}
function B0(e, t) {
	for (; e !== null;) {
		var r = e === t ? null : ss(e)
		;(e.remove(), (e = r))
	}
}
function kp(e) {
	var t = e.parent,
		r = e.prev,
		n = e.next
	;(r !== null && (r.next = n),
		n !== null && (n.prev = r),
		t !== null &&
			(t.first === e && (t.first = n), t.last === e && (t.last = r)))
}
function oa(e, t, r = !0) {
	var n = []
	xp(e, n, !0)
	var i = () => {
			;(r && Yr(e), t && t())
		},
		s = n.length
	if (s > 0) {
		var l = () => --s || i()
		for (var f of n) f.out(l)
	} else i()
}
function xp(e, t, r) {
	if ((e.f & jr) === 0) {
		e.f ^= jr
		var n = e.nodes && e.nodes.t
		if (n !== null) for (const f of n) (f.is_global || r) && t.push(f)
		for (var i = e.first; i !== null;) {
			var s = i.next
			if ((i.f & Ii) === 0) {
				var l = (i.f & Ua) !== 0 || ((i.f & On) !== 0 && (e.f & Tn) !== 0)
				xp(i, t, l ? r : !1)
			}
			i = s
		}
	}
}
function fl(e) {
	Ap(e, !0)
}
function Ap(e, t) {
	if ((e.f & jr) !== 0) {
		;((e.f ^= jr), (e.f & lr) === 0 && (Jt(e, pr), Ci.ensure().schedule(e)))
		for (var r = e.first; r !== null;) {
			var n = r.next,
				i = (r.f & Ua) !== 0 || (r.f & On) !== 0
			;(Ap(r, i ? t : !1), (r = n))
		}
		var s = e.nodes && e.nodes.t
		if (s !== null) for (const l of s) (l.is_global || t) && l.in()
	}
}
function xc(e, t) {
	if (e.nodes)
		for (var r = e.nodes.start, n = e.nodes.end; r !== null;) {
			var i = r === n ? null : ss(r)
			;(t.append(r), (r = i))
		}
}
let tl = !1,
	ii = !1
function vd(e) {
	ii = e
}
let bt = null,
	hn = !1
function pn(e) {
	bt = e
}
let gt = null
function Rn(e) {
	gt = e
}
let qn = null
function Tp(e) {
	bt !== null && (qn ??= new Set()).add(e)
}
let Sr = null,
	Hr = 0,
	ln = null
function F0(e) {
	ln = e
}
let Ip = 1,
	ea = 0,
	sa = ea
function pd(e) {
	sa = e
}
function Rp() {
	return ++Ip
}
function us(e) {
	var t = e.f
	if ((t & pr) !== 0) return !0
	if ((t & Er && (e.f &= ~Ri), (t & Kn) !== 0)) {
		for (var r = e.deps, n = r.length, i = 0; i < n; i++) {
			var s = r[i]
			if ((us(s) && fp(s), s.wv > e.wv)) return !0
		}
		;(t & vn) !== 0 && In === null && Jt(e, lr)
	}
	return !1
}
function Cp(e, t, r = !0) {
	var n = e.reactions
	if (n !== null && !(qn !== null && qn.has(e)))
		for (var i = 0; i < n.length; i++) {
			var s = n[i]
			;(s.f & Er) !== 0
				? Cp(s, t, !1)
				: t === s && (r ? Jt(s, pr) : (s.f & lr) !== 0 && Jt(s, Kn), yc(s))
		}
}
function ec(e) {
	var t = Sr,
		r = Hr,
		n = ln,
		i = bt,
		s = qn,
		l = ur,
		f = hn,
		c = sa,
		m = e.f
	;((Sr = null),
		(Hr = 0),
		(ln = null),
		(bt = (m & (On | Ii)) === 0 ? e : null),
		(qn = null),
		za(e.ctx),
		(hn = !1),
		(sa = ++ea),
		e.ac !== null &&
			(Tl(() => {
				e.ac.abort(Al)
			}),
			(e.ac = null)))
	try {
		e.f |= Vo
		var y = e.fn,
			g = y()
		e.f |= Qa
		var v = e.deps,
			_ = ut?.is_fork
		if (Sr !== null) {
			var S
			if ((_ || Xo(e, Hr), v !== null && Hr > 0))
				for (v.length = Hr + Sr.length, S = 0; S < Sr.length; S++)
					v[Hr + S] = Sr[S]
			else e.deps = v = Sr
			if (Sc() && (e.f & vn) !== 0)
				for (S = Hr; S < v.length; S++) (v[S].reactions ??= []).push(e)
		} else !_ && v !== null && Hr < v.length && (Xo(e, Hr), (v.length = Hr))
		if (
			tp() &&
			ln !== null &&
			!hn &&
			v !== null &&
			(e.f & (Er | Kn | pr)) === 0
		)
			for (S = 0; S < ln.length; S++) Cp(ln[S], e)
		if (i !== null && i !== e) {
			if ((ea++, i.deps !== null))
				for (let x = 0; x < r; x += 1) i.deps[x].rv = ea
			if (t !== null) for (const x of t) x.rv = ea
			ln !== null && (n === null ? (n = ln) : n.push(...ln))
		}
		return ((e.f & xi) !== 0 && (e.f ^= xi), g)
	} catch (x) {
		return np(x)
	} finally {
		;((e.f ^= Vo),
			(Sr = t),
			(Hr = r),
			(ln = n),
			(bt = i),
			(qn = s),
			za(l),
			(hn = f),
			(sa = c))
	}
}
function j0(e, t) {
	let r = t.reactions
	if (r !== null) {
		var n = Am.call(r, e)
		if (n !== -1) {
			var i = r.length - 1
			i === 0 ? (r = t.reactions = null) : ((r[n] = r[i]), r.pop())
		}
	}
	if (r === null && (t.f & Er) !== 0 && (Sr === null || !Ho.call(Sr, t))) {
		var s = t
		;((s.f & vn) !== 0 && ((s.f ^= vn), (s.f &= ~Ri)),
			s.v !== or && gc(s),
			m0(s),
			Xo(s, 0))
	}
}
function Xo(e, t) {
	var r = e.deps
	if (r !== null) for (var n = t; n < r.length; n++) j0(e, r[n])
}
function Wa(e) {
	var t = e.f
	if ((t & en) === 0) {
		Jt(e, lr)
		var r = gt,
			n = tl
		if (((gt = e), (tl = !0), De)) {
			var i = os
			sd(e.component_function)
			var s = Zo
			ol(e.dev_stack ?? Zo)
		}
		try {
			;((t & (Tn | Hv)) !== 0 ? N0(e) : kc(e), Ep(e))
			var l = ec(e)
			;((e.teardown = typeof l == 'function' ? l : null), (e.wv = Ip))
			var f
			De && n0 && (e.f & pr) !== 0 && e.deps
		} finally {
			;((tl = n), (gt = r), De && (sd(i), ol(s)))
		}
	}
}
async function U0() {
	;(await Promise.resolve(), b0())
}
function I(e) {
	var t = e.f,
		r = (t & Er) !== 0
	if (bt !== null && !hn) {
		var n = gt !== null && (gt.f & en) !== 0
		if (!n && (qn === null || !qn.has(e))) {
			var i = bt.deps
			if ((bt.f & Vo) !== 0)
				e.rv < ea &&
					((e.rv = ea),
					Sr === null && i !== null && i[Hr] === e
						? Hr++
						: Sr === null
							? (Sr = [e])
							: Sr.push(e))
			else {
				;((bt.deps ??= []), Ho.call(bt.deps, e) || bt.deps.push(e))
				var s = e.reactions
				s === null ? (e.reactions = [bt]) : Ho.call(s, bt) || s.push(bt)
			}
		}
	}
	if (De) {
		if (
			!hn &&
			cn &&
			ut === null &&
			ll === null &&
			!cn.warned &&
			(cn.effect.f & Vo) === 0 &&
			!cn.effect_deps.has(e)
		) {
			;((cn.warned = !0), Qm(e.label))
			var l = ep('traced at')
			l && console.warn(l)
		}
		g0.delete(e)
	}
	if (ii && aa.has(e)) return aa.get(e)
	if (r) {
		var f = e
		if (ii) {
			var c = f.v
			return (
				(((f.f & lr) === 0 && f.reactions !== null) || Dp(f)) && (c = _c(f)),
				aa.set(f, c),
				c
			)
		}
		var m = (f.f & vn) === 0 && !hn && bt !== null && (tl || (bt.f & vn) !== 0),
			y = (f.f & Qa) === 0
		;(us(f) && (m && (f.f |= vn), fp(f)), m && !y && (cp(f), Op(f)))
	}
	if (In?.has(e)) return In.get(e)
	if ((e.f & xi) !== 0) throw e.v
	return e.v
}
function Op(e) {
	if (((e.f |= vn), e.deps !== null))
		for (const t of e.deps)
			((t.reactions ??= []).push(e),
				(t.f & Er) !== 0 && (t.f & vn) === 0 && (cp(t), Op(t)))
}
function Dp(e) {
	if (e.v === or) return !0
	if (e.deps === null) return !1
	for (const t of e.deps)
		if (aa.has(t) || ((t.f & Er) !== 0 && Dp(t))) return !0
	return !1
}
function va(e) {
	var t = hn
	try {
		return ((hn = !0), e())
	} finally {
		hn = t
	}
}
const Ro = Symbol('events'),
	Pp = new Set(),
	tc = new Set()
function z0(e, t, r, n = {}) {
	function i(s) {
		if ((n.capture || rc.call(t, s), !s.cancelBubble))
			return Tl(() => r?.call(this, s))
	}
	return (
		e.startsWith('pointer') || e.startsWith('touch') || e === 'wheel'
			? zn(() => {
					t.addEventListener(e, i, n)
				})
			: t.addEventListener(e, i, n),
		i
	)
}
function Bo(e, t, r, n, i) {
	var s = {capture: n, passive: i},
		l = z0(e, t, r, s)
	;(t === document.body ||
		t === window ||
		t === document ||
		t instanceof HTMLMediaElement) &&
		Rl(() => {
			t.removeEventListener(e, l, s)
		})
}
function ct(e, t, r) {
	;(t[Ro] ??= {})[e] = r
}
function Cl(e) {
	for (var t = 0; t < e.length; t++) Pp.add(e[t])
	for (var r of tc) r(e)
}
let gd = null
function rc(e) {
	var t = this,
		r = t.ownerDocument,
		n = e.type,
		i = e.composedPath?.() || [],
		s = i[0] || e.target
	gd = e
	var l = 0,
		f = gd === e && e[Ro]
	if (f) {
		var c = i.indexOf(f)
		if (c !== -1 && (t === document || t === window)) {
			e[Ro] = t
			return
		}
		var m = i.indexOf(t)
		if (m === -1) return
		c <= m && (l = c)
	}
	if (((s = i[l] || e.target), s !== t)) {
		la(e, 'currentTarget', {
			configurable: !0,
			get() {
				return s || r
			},
		})
		var y = bt,
			g = gt
		;(pn(null), Rn(null))
		try {
			for (var v, _ = []; s !== null && s !== t;) {
				try {
					var S = s[Ro]?.[n]
					S != null && (!s.disabled || e.target === s) && S.call(s, e)
				} catch (x) {
					v ? _.push(x) : (v = x)
				}
				if (e.cancelBubble) break
				;(l++, (s = l < i.length ? i[l] : null))
			}
			if (v) {
				for (let x of _)
					queueMicrotask(() => {
						throw x
					})
				throw v
			}
		} finally {
			;((e[Ro] = t), delete e.currentTarget, pn(y), Rn(g))
		}
	}
}
const q0 =
	globalThis?.window?.trustedTypes &&
	globalThis.window.trustedTypes.createPolicy('svelte-trusted-html', {
		createHTML: e => e,
	})
function K0(e) {
	return q0?.createHTML(e) ?? e
}
function W0(e) {
	var t = C0('template')
	return ((t.innerHTML = K0(e.replaceAll('<!>', '<!---->'))), t.content)
}
function nc(e, t) {
	var r = gt
	r.nodes === null && (r.nodes = {start: e, end: t, a: null, t: null})
}
function ot(e, t) {
	var r = (t & Sm) !== 0,
		n = (t & Em) !== 0,
		i,
		s = !e.startsWith('<!>')
	return () => {
		i === void 0 && ((i = W0(s ? e : '<!>' + e)), r || (i = ul(i)))
		var l = n || wc ? document.importNode(i, !0) : i.cloneNode(!0)
		if (r) {
			var f = ul(l),
				c = l.lastChild
			nc(f, c)
		} else nc(l, l)
		return l
	}
}
function Lp() {
	var e = document.createDocumentFragment(),
		t = document.createComment(''),
		r = Ai()
	return (e.append(t, r), nc(t, r), e)
}
function et(e, t) {
	e !== null && e.before(t)
}
const G0 = ['touchstart', 'touchmove']
function H0(e) {
	return G0.includes(e)
}
function dt(e, t) {
	var r = t == null ? '' : typeof t == 'object' ? `${t}` : t
	r !== (e[Xf] ??= e.nodeValue) && ((e[Xf] = r), (e.nodeValue = `${r}`))
}
function $0(e, t) {
	return V0(e, t)
}
const Fs = new Map()
function V0(
	e,
	{
		target: t,
		anchor: r,
		props: n = {},
		events: i,
		context: s,
		intro: l = !0,
		transformError: f,
	},
) {
	I0()
	var c = void 0,
		m = L0(() => {
			var y = r ?? t.appendChild(Ai())
			d0(
				y,
				{pending: () => {}},
				_ => {
					da({})
					var S = ur
					;(s && (S.c = s), i && (n.$$events = i), (c = e(_, n) || {}), ha())
				},
				f,
			)
			var g = new Set(),
				v = _ => {
					for (var S = 0; S < _.length; S++) {
						var x = _[S]
						if (!g.has(x)) {
							g.add(x)
							var R = H0(x)
							for (const L of [t, document]) {
								var b = Fs.get(L)
								b === void 0 && ((b = new Map()), Fs.set(L, b))
								var A = b.get(x)
								A === void 0
									? (L.addEventListener(x, rc, {passive: R}), b.set(x, 1))
									: b.set(x, A + 1)
							}
						}
					}
				}
			return (
				v(kl(Pp)),
				tc.add(v),
				() => {
					for (var _ of g)
						for (const R of [t, document]) {
							var S = Fs.get(R),
								x = S.get(_)
							--x == 0
								? (R.removeEventListener(_, rc),
									S.delete(_),
									S.size === 0 && Fs.delete(R))
								: S.set(_, x)
						}
					;(tc.delete(v), y !== r && y.parentNode?.removeChild(y))
				}
			)
		})
	return (Z0.set(c, m), c)
}
let Z0 = new WeakMap()
class Y0 {
	anchor
	#t = new Map()
	#o = new Map()
	#e = new Map()
	#l = new Set()
	#i = !0
	constructor(t, r = !0) {
		;((this.anchor = t), (this.#i = r))
	}
	#a = t => {
		if (this.#t.has(t)) {
			var r = this.#t.get(t),
				n = this.#o.get(r)
			if (n) (fl(n), this.#l.delete(r))
			else {
				var i = this.#e.get(r)
				i &&
					(fl(i.effect),
					this.#o.set(r, i.effect),
					this.#e.delete(r),
					De && (i.fragment.lastChild[Bm] = this.anchor),
					i.fragment.lastChild.remove(),
					this.anchor.before(i.fragment),
					(n = i.effect))
			}
			for (const [s, l] of this.#t) {
				if ((this.#t.delete(s), s === t)) break
				const f = this.#e.get(l)
				f && (Yr(f.effect), this.#e.delete(l))
			}
			for (const [s, l] of this.#o) {
				if (s === r || this.#l.has(s)) continue
				const f = () => {
					if (Array.from(this.#t.values()).includes(s)) {
						var m = document.createDocumentFragment()
						;(xc(l, m),
							m.append(Ai()),
							this.#e.set(s, {effect: l, fragment: m}))
					} else Yr(l)
					;(this.#l.delete(s), this.#o.delete(s))
				}
				this.#i || !n ? (this.#l.add(s), oa(l, f, !1)) : f()
			}
		}
	}
	#r = t => {
		this.#t.delete(t)
		const r = Array.from(this.#t.values())
		for (const [n, i] of this.#e)
			r.includes(n) || (Yr(i.effect), this.#e.delete(n))
	}
	ensure(t, r) {
		var n = ut,
			i = bp()
		if (r && !this.#o.has(t) && !this.#e.has(t))
			if (i) {
				var s = document.createDocumentFragment(),
					l = Ai()
				;(s.append(l), this.#e.set(t, {effect: fn(() => r(l)), fragment: s}))
			} else
				this.#o.set(
					t,
					fn(() => r(this.anchor)),
				)
		if ((this.#t.set(n, t), i)) {
			for (const [f, c] of this.#o)
				f === t ? n.unskip_effect(c) : n.skip_effect(c)
			for (const [f, c] of this.#e)
				f === t ? n.unskip_effect(c.effect) : n.skip_effect(c.effect)
			;(n.oncommit(this.#a), n.ondiscard(this.#r))
		} else this.#a(n)
	}
}
if (De) {
	let e = function (t) {
		if (!(t in globalThis)) {
			let r
			Object.defineProperty(globalThis, t, {
				configurable: !0,
				get: () => {
					if (r !== void 0) return r
					$m(t)
				},
				set: n => {
					r = n
				},
			})
		}
	}
	var SS = e
	;(e('$state'),
		e('$effect'),
		e('$derived'),
		e('$inspect'),
		e('$props'),
		e('$bindable'))
}
function fs(e) {
	;(ur === null && Zv('onMount'),
		Ti(() => {
			const t = va(e)
			if (typeof t == 'function') return t
		}))
}
function X0(e) {
	;(ur === null && Zv('onDestroy'), fs(() => () => va(e)))
}
function It(e, t, r = !1) {
	var n = new Y0(e),
		i = r ? Ua : 0
	function s(l, f) {
		n.ensure(l, f)
	}
	Ec(() => {
		var l = !1
		;(t((f, c = 0) => {
			;((l = !0), s(c, f))
		}),
			l || s(-1, null))
	}, i)
}
function Bn(e, t) {
	return t
}
function Q0(e, t, r) {
	for (var n = [], i = t.length, s, l = t.length, f = 0; f < i; f++) {
		let g = t[f]
		oa(
			g,
			() => {
				if (s) {
					if ((s.pending.delete(g), s.done.add(g), s.pending.size === 0)) {
						var v = e.outrogroups
						;(ic(e, kl(s.done)),
							v.delete(s),
							v.size === 0 && (e.outrogroups = null))
					}
				} else l -= 1
			},
			!1,
		)
	}
	if (l === 0) {
		var c = n.length === 0 && r !== null
		if (c) {
			var m = r,
				y = m.parentNode
			;(R0(y), y.append(m), e.items.clear())
		}
		ic(e, t, !c)
	} else
		((s = {pending: new Set(t), done: new Set()}),
			(e.outrogroups ??= new Set()).add(s))
}
function ic(e, t, r = !0) {
	var n
	if (e.pending.size > 0) {
		n = new Set()
		for (const l of e.pending.values())
			for (const f of l) n.add(e.items.get(f).e)
	}
	for (var i = 0; i < t.length; i++) {
		var s = t[i]
		if (n?.has(s)) {
			s.f |= jn
			const l = document.createDocumentFragment()
			xc(s, l)
		} else Yr(t[i], r)
	}
}
var _d
function Fn(e, t, r, n, i, s = null) {
	var l = e,
		f = new Map(),
		c = (t & Kv) !== 0
	if (c) {
		var m = e
		l = m.appendChild(Ai())
	}
	var y = null,
		g = up(() => {
			var L = r()
			return pc(L) ? L : L == null ? [] : kl(L)
		})
	De && xn(g, '{#each ...}')
	var v,
		_ = new Map(),
		S = !0
	function x(L) {
		;(A.effect.f & en) === 0 &&
			(A.pending.delete(L),
			(A.fallback = y),
			J0(A, v, l, t, n),
			y !== null &&
				(v.length === 0
					? (y.f & jn) === 0
						? fl(y)
						: ((y.f ^= jn), Co(y, null, l))
					: oa(y, () => {
							y = null
						})))
	}
	function R(L) {
		A.pending.delete(L)
	}
	var b = Ec(() => {
			v = I(g)
			for (
				var L = v.length, N = new Set(), U = ut, ee = bp(), X = 0;
				X < L;
				X += 1
			) {
				var ve = v[X],
					ge = n(ve, X)
				if (De) {
					var ye = n(ve, X)
					ge !== ye && zm(String(X), String(ge), String(ye))
				}
				var Ne = S ? null : f.get(ge)
				;(Ne
					? (Ne.v && Ka(Ne.v, ve),
						Ne.i && Ka(Ne.i, X),
						ee && U.unskip_effect(Ne.e))
					: ((Ne = ey(f, S ? l : (_d ??= Ai()), ve, ge, X, i, t, r)),
						S || (Ne.e.f |= jn),
						f.set(ge, Ne)),
					N.add(ge))
			}
			if (
				(L === 0 &&
					s &&
					!y &&
					(S
						? (y = fn(() => s(l)))
						: ((y = fn(() => s((_d ??= Ai())))), (y.f |= jn))),
				L > N.size && (De ? ty(v, n) : Yv('', '', '')),
				!S)
			)
				if ((_.set(U, N), ee)) {
					for (const [je, Ee] of f) N.has(je) || U.skip_effect(Ee.e)
					;(U.oncommit(x), U.ondiscard(R))
				} else x(U)
			I(g)
		}),
		A = {effect: b, items: f, pending: _, outrogroups: null, fallback: y}
	S = !1
}
function wo(e) {
	for (; e !== null && (e.f & On) === 0;) e = e.next
	return e
}
function J0(e, t, r, n, i) {
	var s = (n & gm) !== 0,
		l = t.length,
		f = e.items,
		c = wo(e.effect.first),
		m,
		y = null,
		g,
		v = [],
		_ = [],
		S,
		x,
		R,
		b
	if (s)
		for (b = 0; b < l; b += 1)
			((S = t[b]),
				(x = i(S, b)),
				(R = f.get(x).e),
				(R.f & jn) === 0 && (R.nodes?.a?.measure(), (g ??= new Set()).add(R)))
	for (b = 0; b < l; b += 1) {
		if (((S = t[b]), (x = i(S, b)), (R = f.get(x).e), e.outrogroups !== null))
			for (const ye of e.outrogroups) (ye.pending.delete(R), ye.done.delete(R))
		if (
			((R.f & jr) !== 0 &&
				(fl(R), s && (R.nodes?.a?.unfix(), (g ??= new Set()).delete(R))),
			(R.f & jn) !== 0)
		)
			if (((R.f ^= jn), R === c)) Co(R, null, r)
			else {
				var A = y ? y.next : c
				;(R === e.effect.last && (e.effect.last = R.prev),
					R.prev && (R.prev.next = R.next),
					R.next && (R.next.prev = R.prev),
					pi(e, y, R),
					pi(e, R, A),
					Co(R, A, r),
					(y = R),
					(v = []),
					(_ = []),
					(c = wo(y.next)))
				continue
			}
		if (R !== c) {
			if (m !== void 0 && m.has(R)) {
				if (v.length < _.length) {
					var L = _[0],
						N
					y = L.prev
					var U = v[0],
						ee = v[v.length - 1]
					for (N = 0; N < v.length; N += 1) Co(v[N], L, r)
					for (N = 0; N < _.length; N += 1) m.delete(_[N])
					;(pi(e, U.prev, ee.next),
						pi(e, y, U),
						pi(e, ee, L),
						(c = L),
						(y = ee),
						(b -= 1),
						(v = []),
						(_ = []))
				} else
					(m.delete(R),
						Co(R, c, r),
						pi(e, R.prev, R.next),
						pi(e, R, y === null ? e.effect.first : y.next),
						pi(e, y, R),
						(y = R))
				continue
			}
			for (v = [], _ = []; c !== null && c !== R;)
				((m ??= new Set()).add(c), _.push(c), (c = wo(c.next)))
			if (c === null) continue
		}
		;((R.f & jn) === 0 && v.push(R), (y = R), (c = wo(R.next)))
	}
	if (e.outrogroups !== null) {
		for (const ye of e.outrogroups)
			ye.pending.size === 0 && (ic(e, kl(ye.done)), e.outrogroups?.delete(ye))
		e.outrogroups.size === 0 && (e.outrogroups = null)
	}
	if (c !== null || m !== void 0) {
		var X = []
		if (m !== void 0) for (R of m) (R.f & jr) === 0 && X.push(R)
		for (; c !== null;)
			((c.f & jr) === 0 && c !== e.fallback && X.push(c), (c = wo(c.next)))
		var ve = X.length
		if (ve > 0) {
			var ge = (n & Kv) !== 0 && l === 0 ? r : null
			if (s) {
				for (b = 0; b < ve; b += 1) X[b].nodes?.a?.measure()
				for (b = 0; b < ve; b += 1) X[b].nodes?.a?.fix()
			}
			Q0(e, X, ge)
		}
	}
	s &&
		zn(() => {
			if (g !== void 0) for (R of g) R.nodes?.a?.apply()
		})
}
function ey(e, t, r, n, i, s, l, f) {
	var c = (l & vm) !== 0 ? ((l & _m) === 0 ? E0(r, !1, !1) : ua(r)) : null,
		m = (l & pm) !== 0 ? ua(i) : null
	return (
		De &&
			c &&
			(c.trace = () => {
				f()[m?.v ?? i]
			}),
		{
			v: c,
			i: m,
			e: fn(
				() => (
					s(t, c ?? r, m ?? i, f),
					() => {
						e.delete(n)
					}
				),
			),
		}
	)
}
function Co(e, t, r) {
	if (e.nodes)
		for (
			var n = e.nodes.start,
				i = e.nodes.end,
				s = t && (t.f & jn) === 0 ? t.nodes.start : r;
			n !== null;
		) {
			var l = ss(n)
			if ((s.before(n), n === i)) return
			n = l
		}
}
function pi(e, t, r) {
	;(t === null ? (e.effect.first = r) : (t.next = r),
		r === null ? (e.effect.last = t) : (r.prev = t))
}
function ty(e, t) {
	const r = new Map(),
		n = e.length
	for (let i = 0; i < n; i++) {
		const s = t(e[i], i)
		if (r.has(s)) {
			const l = String(r.get(s)),
				f = String(i)
			let c = String(s)
			;(c.startsWith('[object ') && (c = null), Yv(l, f, c))
		}
		r.set(s, i)
	}
}
const md = [
	...` 	
\r\f \v\uFEFF`,
]
function ry(e, t, r) {
	var n = e == null ? '' : '' + e
	if (r) {
		for (var i of Object.keys(r))
			if (r[i]) n = n ? n + ' ' + i : i
			else if (n.length)
				for (var s = i.length, l = 0; (l = n.indexOf(i, l)) >= 0;) {
					var f = l + s
					;(l === 0 || md.includes(n[l - 1])) &&
					(f === n.length || md.includes(n[f]))
						? (n = (l === 0 ? '' : n.substring(0, l)) + n.substring(f + 1))
						: (l = f)
				}
	}
	return n === '' ? null : n
}
function ny(e, t) {
	return e == null ? null : String(e)
}
function An(e, t, r, n, i, s) {
	var l = e[Zf]
	if (l !== r || l === void 0) {
		var f = ry(r, n, s)
		;(f == null ? e.removeAttribute('class') : (e.className = f), (e[Zf] = r))
	} else if (s && i !== s)
		for (var c in s) {
			var m = !!s[c]
			;(i == null || m !== !!i[c]) && e.classList.toggle(c, m)
		}
	return s
}
function Si(e, t, r, n) {
	var i = e[Yf]
	if (i !== t) {
		var s = ny(t)
		;(s == null ? e.removeAttribute('style') : (e.style.cssText = s),
			(e[Yf] = t))
	}
	return n
}
function Mp(e, t, r = !1) {
	if (e.multiple) {
		if (t == null) return
		if (!pc(t)) return e0()
		for (var n of e.options) n.selected = t.includes(Fo(n))
		return
	}
	for (n of e.options) {
		var i = Fo(n)
		if (_p(i, t)) {
			n.selected = !0
			return
		}
	}
	;(!r || t !== void 0) && (e.selectedIndex = -1)
}
function iy(e) {
	var t = new MutationObserver(() => {
		Mp(e, e.__value)
	})
	;(t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ['value'],
	}),
		Rl(() => {
			t.disconnect()
		}))
}
function Iu(e, t, r = t) {
	var n = new WeakSet(),
		i = !0
	;(Il(e, 'change', s => {
		var l = s ? '[selected]' : ':checked',
			f
		if (e.multiple) f = [].map.call(e.querySelectorAll(l), Fo)
		else {
			var c = e.querySelector(l) ?? e.querySelector('option:not([disabled])')
			f = c && Fo(c)
		}
		;(r(f), (e.__value = f), ut !== null && n.add(ut))
	}),
		Sp(() => {
			var s = t()
			if (e === document.activeElement) {
				var l = ut
				if (n.has(l)) return
			}
			if ((Mp(e, s, i), i && s === void 0)) {
				var f = e.querySelector(':checked')
				f !== null && ((s = Fo(f)), r(s))
			}
			;((e.__value = s), (i = !1))
		}),
		iy(e))
}
function Fo(e) {
	return '__value' in e ? e.__value : e.value
}
const ay = Symbol('is custom element'),
	oy = Symbol('is html')
function sy(e, t) {
	var r = Np(e)
	r.checked !== (r.checked = t ?? void 0) && (e.checked = t)
}
function yi(e, t, r, n) {
	var i = Np(e)
	i[t] !== (i[t] = r) &&
		(t === 'loading' && (e[Nm] = r),
		r == null
			? e.removeAttribute(t)
			: typeof r != 'string' && ly(e).includes(t)
				? (e[t] = r)
				: e.setAttribute(t, r))
}
function Np(e) {
	return (e[Vv] ??= {
		[ay]: e.nodeName.includes('-'),
		[oy]: e.namespaceURI === xm,
	})
}
var yd = new Map()
function ly(e) {
	var t = e.getAttribute('is') || e.nodeName,
		r = yd.get(t)
	if (r) return r
	yd.set(t, (r = []))
	for (var n, i = e, s = Element.prototype; s !== i;) {
		n = Tm(i)
		for (var l in n)
			n[l].set &&
				l !== 'innerHTML' &&
				l !== 'textContent' &&
				l !== 'innerText' &&
				r.push(l)
		i = Wv(i)
	}
	return r
}
function Ru(e, t, r = t) {
	var n = new WeakSet()
	;(Il(e, 'input', async i => {
		De && e.type === 'checkbox' && od()
		var s = i ? e.defaultValue : e.value
		if (
			((s = Ou(e) ? Du(s) : s),
			r(s),
			ut !== null && n.add(ut),
			await U0(),
			s !== (s = t()))
		) {
			var l = e.selectionStart,
				f = e.selectionEnd,
				c = e.value.length
			if (((e.value = s ?? ''), f !== null)) {
				var m = e.value.length
				l === f && f === c && m > c
					? ((e.selectionStart = m), (e.selectionEnd = m))
					: ((e.selectionStart = l), (e.selectionEnd = Math.min(f, m)))
			}
		}
	}),
		va(t) == null &&
			e.value &&
			(r(Ou(e) ? Du(e.value) : e.value), ut !== null && n.add(ut)),
		ls(() => {
			De && e.type === 'checkbox' && od()
			var i = t()
			if (e === document.activeElement) {
				var s = ut
				if (n.has(s)) return
			}
			;(Ou(e) && i === Du(e.value)) ||
				(e.type === 'date' && !i && !e.value) ||
				(i !== e.value && (e.value = i ?? ''))
		}))
}
const Cu = new Set()
function So(e, t, r, n, i = n) {
	var s = r.getAttribute('type') === 'checkbox',
		l = e
	if (t !== null) for (var f of t) l = l[f] ??= []
	;(l.push(r),
		Il(
			r,
			'change',
			() => {
				var c = r.__value
				;(s && (c = uy(l, c, r.checked)), i(c))
			},
			() => i(s ? [] : null),
		),
		ls(() => {
			var c = n()
			s
				? ((c = c || []), (r.checked = c.includes(r.__value)))
				: (r.checked = _p(r.__value, c))
		}),
		Rl(() => {
			var c = l.indexOf(r)
			c !== -1 && l.splice(c, 1)
		}),
		Cu.has(l) ||
			(Cu.add(l),
			zn(() => {
				;(l.sort((c, m) => (c.compareDocumentPosition(m) === 4 ? -1 : 1)),
					Cu.delete(l))
			})),
		zn(() => {}))
}
function Bp(e, t, r = t) {
	;(Il(e, 'change', n => {
		var i = n ? e.defaultChecked : e.checked
		r(i)
	}),
		va(t) == null && r(e.checked),
		ls(() => {
			var n = t()
			e.checked = !!n
		}))
}
function uy(e, t, r) {
	for (var n = new Set(), i = 0; i < e.length; i += 1)
		e[i].checked && n.add(e[i].__value)
	return (r || n.delete(t), Array.from(n))
}
function Ou(e) {
	var t = e.type
	return t === 'number' || t === 'range'
}
function Du(e) {
	return e === '' ? null : +e
}
function Pu(e, t) {
	return e === t || e?.[ia] === t
}
function Na(e = {}, t, r, n) {
	var i = ur.r,
		s = gt
	return (
		Sp(() => {
			var l, f
			return (
				ls(() => {
					;((l = f),
						(f = []),
						va(() => {
							Pu(r(...f), e) ||
								(t(e, ...f), l && Pu(r(...l), e) && t(null, ...l))
						}))
				}),
				() => {
					let c = s
					for (; c !== i && c.parent !== null && c.parent.f & Vf;) c = c.parent
					const m = () => {
							f && Pu(r(...f), e) && t(null, ...f)
						},
						y = c.teardown
					c.teardown = () => {
						;(m(), y?.())
					}
				}
			)
		}),
		e
	)
}
function jo(e, t, r, n) {
	var i = !0,
		s = (r & bm) !== 0,
		l = (r & wm) !== 0,
		f = n,
		c = !0,
		m = void 0,
		y = () =>
			l && i ? ((m ??= Yo(n)), I(m)) : (c && ((c = !1), (f = l ? va(n) : n)), f)
	let g
	if (s) {
		var v = ia in e || Mm in e
		g = ra(e, t)?.set ?? (v && t in e ? N => (e[t] = N) : void 0)
	}
	var _,
		S = !1
	;(s ? ([_, S] = u0(() => e[t])) : (_ = e[t]),
		_ === void 0 && n !== void 0 && ((_ = y()), g && (Hm(t), g(_))))
	var x
	if (
		((x = () => {
			var N = e[t]
			return N === void 0 ? y() : ((c = !0), N)
		}),
		(r & ym) === 0)
	)
		return x
	if (g) {
		var R = e.$$legacy
		return function (N, U) {
			return arguments.length > 0 ? ((!U || R || S) && g(U ? x() : N), N) : x()
		}
	}
	var b = !1,
		A = ((r & mm) !== 0 ? Yo : up)(() => ((b = !1), x()))
	;(De && (A.label = t), s && I(A))
	var L = gt
	return function (N, U) {
		if (arguments.length > 0) {
			const ee = U ? I(A) : s ? Br(N) : N
			return (q(A, ee), (b = !0), f !== void 0 && (f = ee), N)
		}
		return (ii && b) || (L.f & en) !== 0 ? A.v : I(A)
	}
}
const Jn = [
		'idle',
		'researching',
		'writing-script',
		'generating-speech',
		'mixing-audio',
		'generating-metadata',
		'generating-cover',
		'complete',
	],
	bd = {
		idle: 'IDLE',
		researching: 'RESEARCHING',
		'writing-script': 'WRITING SCRIPT',
		'generating-speech': 'GENERATING SPEECH',
		'mixing-audio': 'MIXING AUDIO',
		'generating-metadata': 'GENERATING METADATA',
		'generating-cover': 'GENERATING COVER',
		complete: 'COMPLETE',
		error: 'ERROR',
	},
	fy = Jn.indexOf('generating-speech'),
	cy = 'speech.platform.bing.com/consumer/speech/synthesize/readaloud',
	dy = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
function wd() {
	return crypto.randomUUID().replaceAll('-', '')
}
function Fp(e) {
	return e.startsWith('de-') ? 'de-DE' : (e.startsWith('en-'), 'en-US')
}
async function hy(e, t = {}) {
	const {
		voice: r = 'de-DE-KillianNeural',
		rate: n = '+0%',
		pitch: i = '+0Hz',
	} = t
	return new Promise((s, l) => {
		if (!window.speechSynthesis) {
			l(new Error('SpeechSynthesis not available'))
			return
		}
		window.speechSynthesis.cancel()
		const f = new SpeechSynthesisUtterance(e),
			c = Fp(r)
		f.lang = c
		const m = parseFloat(n.replace('%', '')) / 100 + 1
		f.rate = Math.max(0.1, Math.min(10, m))
		const y = parseFloat(i.replace('Hz', ''))
		f.pitch = Math.max(0, Math.min(2, isNaN(y) ? 1 : y))
		const v = window.speechSynthesis
			.getVoices()
			.find(_ => _.lang.startsWith(c.split('-')[0]))
		;(v && (f.voice = v),
			(f.onend = () => s()),
			(f.onerror = _ => l(new Error(`Speech synthesis failed: ${_.error}`))),
			window.speechSynthesis.speak(f))
	})
}
async function vy(e, t = {}) {
	const {
			voice: r = 'de-DE-KillianNeural',
			volume: n = '+0%',
			rate: i = '+0%',
			pitch: s = '+0Hz',
		} = t,
		l = Fp(r),
		f = `wss://${cy}/edge/v1?TrustedClientToken=${dy}&ConnectionId=${wd()}`
	return new Promise((c, m) => {
		let y,
			g = !1
		const v = [],
			_ = () => {
				y && y.readyState === WebSocket.OPEN && y.close()
			},
			S = setTimeout(() => {
				;((g = !0), _(), m(new Error('TTS request timeout')))
			}, 3e4)
		try {
			;((y = new WebSocket(f)),
				(y.binaryType = 'arraybuffer'),
				(y.onmessage = x => {
					if (g) return
					if (typeof x.data == 'string') {
						x.data.includes('turn.end') && (clearTimeout(S), (g = !0), _())
						return
					}
					const R = new Uint8Array(x.data),
						b = new TextEncoder().encode(`Path:audio\r
`),
						A = gy(R, b)
					if (A !== -1) {
						const L = R.slice(A + b.length)
						v.push(L)
					}
				}),
				(y.onerror = () => {
					;(clearTimeout(S),
						g || ((g = !0), m(new Error('WebSocket connection failed'))))
				}),
				(y.onclose = () => {
					if ((clearTimeout(S), !g))
						if (((g = !0), v.length > 0)) {
							const x = v.reduce((A, L) => A + L.length, 0),
								R = new Uint8Array(x)
							let b = 0
							for (const A of v) (R.set(A, b), (b += A.length))
							c(R.buffer)
						} else m(new Error('No audio data received'))
				}),
				(y.onopen = () => {
					const x = JSON.stringify({
							context: {
								synthesis: {
									audio: {
										metadataoptions: {
											sentenceBoundaryEnabled: !1,
											wordBoundaryEnabled: !1,
										},
										outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
									},
								},
							},
						}),
						R = `X-Timestamp:${new Date().toISOString()}\r
Content-Type:application/json; charset=utf-8\r
Path:speech.config\r
\r
${x}`
					y.send(R)
					const b = `X-RequestId:${wd()}\r
Content-Type:application/ssml+xml\r
X-Timestamp:${new Date().toISOString()}Z\r
Path:ssml\r
\r
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${l}'><voice name='${r}'><prosody pitch='${s}' rate='${i}' volume='${n}'>${e}</prosody></voice></speak>`
					y.send(b)
				}))
		} catch (x) {
			;(clearTimeout(S), m(x))
		}
	})
}
async function py(e, t) {
	const {invoke: r} = await El(
			async () => {
				const {invoke: i} = await Promise.resolve().then(() => yy)
				return {invoke: i}
			},
			void 0,
		),
		n = await r('tts_http_fallback', {text: e, voice: t})
	return new Blob([new Uint8Array(n)], {type: 'audio/mp3'})
}
function gy(e, t) {
	for (let r = 0; r <= e.length - t.length; r++) {
		let n = !0
		for (let i = 0; i < t.length; i++)
			if (e[r + i] !== t[i]) {
				n = !1
				break
			}
		if (n) return r
	}
	return -1
}
const js = {
		HOST: 'de-DE-KillianNeural',
		GUEST: 'de-DE-FreyaNeural',
		CALLER: 'de-DE-ConradNeural',
	},
	Sd = {
		german: [
			{id: 'de-DE-KillianNeural', name: 'Killian (Male)', gender: 'Male'},
			{id: 'de-DE-ConradNeural', name: 'Conrad (Male)', gender: 'Male'},
			{id: 'de-DE-FreyaNeural', name: 'Freya (Female)', gender: 'Female'},
			{id: 'de-DE-AmalaNeural', name: 'Amala (Female)', gender: 'Female'},
			{
				id: 'de-DE-SeraphinaMultilingualNeural',
				name: 'Seraphina (Female, Multilingual)',
				gender: 'Female',
			},
		],
		english: [
			{id: 'en-US-GuyNeural', name: 'Guy (Male)', gender: 'Male'},
			{id: 'en-US-JennyNeural', name: 'Jenny (Female)', gender: 'Female'},
		],
	}
function _y(e) {
	const t = e
			.split(
				`
`,
			)
			.filter(l => l.trim().length > 0),
		r = []
	for (const l of t) {
		const f = l.match(/^HOST:\s*(.+)$/i),
			c = l.match(/^GUEST:\s*(.+)$/i),
			m = l.match(/^CALLER:\s*(.+)$/i)
		f
			? r.push({
					speaker: 'HOST',
					text: f[1].trim(),
					voice: js.HOST,
					effect: 'normal',
				})
			: c
				? r.push({
						speaker: 'GUEST',
						text: c[1].trim(),
						voice: js.GUEST,
						effect: 'normal',
					})
				: m
					? r.push({
							speaker: 'CALLER',
							text: m[1].trim(),
							voice: js.CALLER,
							effect: 'telephone',
						})
					: r.length > 0
						? (r[r.length - 1].text +=
								`
` + l.trim())
						: r.push({
								speaker: 'HOST',
								text: l.trim(),
								voice: js.HOST,
								effect: 'normal',
							})
	}
	const n = r.reduce((l, f) => l + my(f.text), 0),
		i = r[0]?.text.slice(0, 50) || 'AI Radio Episode',
		s = r
			.slice(0, 3)
			.map(l => l.text)
			.join(' ')
			.slice(0, 200)
	return {segments: r, totalDuration: n, title: i, summary: s}
}
function my(e) {
	return (e.trim().split(/\s+/).length / 150) * 60
}
function jp(e, t = !1) {
	return window.__TAURI_INTERNALS__.transformCallback(e, t)
}
async function eo(e, t = {}, r) {
	return window.__TAURI_INTERNALS__.invoke(e, t, r)
}
const yy = Object.freeze(
		Object.defineProperty(
			{__proto__: null, invoke: eo, transformCallback: jp},
			Symbol.toStringTag,
			{value: 'Module'},
		),
	),
	fa = 2
async function Up(e, t, r, n, i) {
	const s = n === 'similar' && i ? i : e
	if (t.apiProvider === 'local' && /android/i.test(navigator.userAgent)) {
		const {generateScript: f} = await El(
			async () => {
				const {generateScript: c} = await Promise.resolve().then(() => xw)
				return {generateScript: c}
			},
			void 0,
		)
		return f({
			topic: s,
			quality: t.quality,
			style: t.style,
			linkContent: r || void 0,
			mode: n || void 0,
		})
	}
	try {
		return await eo('generate_script', {
			req: {
				topic: s,
				provider: t.apiProvider,
				api_key: t.apiKey,
				link_content: r ?? null,
				quality: t.quality,
				style: t.style,
				mode: n ?? null,
			},
		})
	} catch (l) {
		console.error('[Tauri] generate_script failed:', l)
		const f = l instanceof Error ? l.message : String(l)
		throw new Error(f || 'LLM-Anfrage fehlgeschlagen', {cause: l})
	}
}
const ta = {
	apiKey: '',
	apiProvider: 'none',
	defaultVoice: 'de-DE-KillianNeural',
	autoPlay: !0,
	playbackSpeed: 1,
	quality: 'normal',
	style: 'tech',
	visualizerStyle: 'bars',
	quotaEnabled: !0,
	autoSaveCovers: !0,
}
function Ac(e, t) {
	const r = {...ta, ...e}
	return (
		t < 2 &&
			((r.visualizerStyle = e.visualizerStyle ?? ta.visualizerStyle),
			(r.quotaEnabled = e.quotaEnabled ?? ta.quotaEnabled),
			(r.autoSaveCovers = e.autoSaveCovers ?? ta.autoSaveCovers)),
		r
	)
}
function bi() {
	try {
		const t = localStorage.getItem('ai-radio-settings'),
			r = localStorage.getItem('ai-radio-settings-version'),
			n = r ? parseInt(r, 10) : 1
		if (t) {
			const i = JSON.parse(t)
			if (n < fa) {
				const s = Ac(i, n)
				return (
					to(s),
					localStorage.setItem('ai-radio-settings-version', String(fa)),
					s
				)
			}
			return {...ta, ...i}
		}
	} catch (t) {
		console.error('Failed to load settings:', t)
	}
	const e = {}
	return (
		(e.apiKey =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnYiOiJwcm9kdWN0aW9uIiwia2lsb1VzZXJJZCI6IjE4M2I4OTMxLTc1NzctNDE0Ny1hNjM0LWFlYjg0Mzk1MGRkZiIsImFwaVRva2VuUGVwcGVyIjpudWxsLCJ2ZXJzaW9uIjozLCJpYXQiOjE3NzY0NDczODcsImV4cCI6MTkzNDEyNzM4N30.Apip8LcovT4qMqXtzWMgB55EvGfhZhrhBRBJ6cvIgsQ'),
		(e.apiProvider = 'kilo'),
		(e.defaultVoice = 'de-DE-KillianNeural'),
		{...ta, ...e}
	)
}
function to(e) {
	;(localStorage.setItem('ai-radio-settings', JSON.stringify(e)),
		localStorage.setItem('ai-radio-settings-version', String(fa)))
}
function zp() {
	const e = localStorage.getItem('ai-radio-settings'),
		t = localStorage.getItem('ai-radio-settings-version'),
		r = {
			settings: e ? JSON.parse(e) : ta,
			version: t ? parseInt(t, 10) : fa,
			exportedAt: new Date().toISOString(),
		}
	return JSON.stringify(r, null, 2)
}
function qp(e) {
	try {
		const t = JSON.parse(e)
		if (!t.settings || typeof t.settings != 'object') return !1
		const r = Ac(t.settings, t.version || 1)
		return (to(r), !0)
	} catch {
		return !1
	}
}
function Kp() {
	;(localStorage.removeItem('ai-radio-settings'),
		localStorage.removeItem('ai-radio-settings-version'))
}
function by(e) {
	return `Hallo und willkommen bei AI Radio! Heute geht's um ${e.slice(0, 100)}. Hier ist dein persönlicher Radio-Beitrag. Viel Spaß beim Hören! Übrigens, das war's auch schon wieder für heute. Bis zum nächsten Mal, bleib dran!`
}
async function wy(e, t) {
	if (t.apiProvider === 'none' || t.apiProvider === 'local' || !t.apiKey)
		return ''
	try {
		return (
			(await eo('suggest_related_topic', {
				topic: e,
				provider: t.apiProvider,
				api_key: t.apiKey,
			})) || ''
		)
	} catch (r) {
		return (console.error('Failed to suggest related topic:', r), '')
	}
}
const Sy = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			SETTINGS_VERSION: fa,
			exportSettings: zp,
			generateScriptFallback: by,
			importSettings: qp,
			invokeGenerateScript: Up,
			loadSettings: bi,
			migrateSettings: Ac,
			resetSettings: Kp,
			saveSettings: to,
			suggestRelatedTopic: wy,
		},
		Symbol.toStringTag,
		{value: 'Module'},
	),
)
var br =
	typeof globalThis < 'u'
		? globalThis
		: typeof window < 'u'
			? window
			: typeof global < 'u'
				? global
				: typeof self < 'u'
					? self
					: {}
function Wp(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default')
		? e.default
		: e
}
function Ey(e) {
	if (Object.prototype.hasOwnProperty.call(e, '__esModule')) return e
	var t = e.default
	if (typeof t == 'function') {
		var r = function n() {
			return this instanceof n
				? Reflect.construct(t, arguments, this.constructor)
				: t.apply(this, arguments)
		}
		r.prototype = t.prototype
	} else r = {}
	return (
		Object.defineProperty(r, '__esModule', {value: !0}),
		Object.keys(e).forEach(function (n) {
			var i = Object.getOwnPropertyDescriptor(e, n)
			Object.defineProperty(
				r,
				n,
				i.get
					? i
					: {
							enumerable: !0,
							get: function () {
								return e[n]
							},
						},
			)
		}),
		r
	)
}
var rl = {exports: {}},
	ky = rl.exports,
	Ed
function xy() {
	return (
		Ed ||
			((Ed = 1),
			(function (e, t) {
				;(function (r, n) {
					e.exports = n()
				})(ky, function () {
					var r = function (a, o) {
						return (
							(r =
								Object.setPrototypeOf ||
								({__proto__: []} instanceof Array &&
									function (u, h) {
										u.__proto__ = h
									}) ||
								function (u, h) {
									for (var p in h)
										Object.prototype.hasOwnProperty.call(h, p) && (u[p] = h[p])
								}),
							r(a, o)
						)
					}
					function n(a, o) {
						if (typeof o != 'function' && o !== null)
							throw new TypeError(
								'Class extends value ' +
									String(o) +
									' is not a constructor or null',
							)
						r(a, o)
						function u() {
							this.constructor = a
						}
						a.prototype =
							o === null
								? Object.create(o)
								: ((u.prototype = o.prototype), new u())
					}
					var i = function () {
						return (
							(i =
								Object.assign ||
								function (o) {
									for (var u, h = 1, p = arguments.length; h < p; h++) {
										u = arguments[h]
										for (var w in u)
											Object.prototype.hasOwnProperty.call(u, w) &&
												(o[w] = u[w])
									}
									return o
								}),
							i.apply(this, arguments)
						)
					}
					function s(a, o, u) {
						for (var h = 0, p = o.length, w; h < p; h++)
							(w || !(h in o)) &&
								(w || (w = Array.prototype.slice.call(o, 0, h)), (w[h] = o[h]))
						return a.concat(w || Array.prototype.slice.call(o))
					}
					typeof SuppressedError == 'function' && SuppressedError
					var l =
							typeof globalThis < 'u'
								? globalThis
								: typeof self < 'u'
									? self
									: typeof window < 'u'
										? window
										: br,
						f = Object.keys,
						c = Array.isArray
					typeof Promise < 'u' && !l.Promise && (l.Promise = Promise)
					function m(a, o) {
						return (
							typeof o != 'object' ||
								f(o).forEach(function (u) {
									a[u] = o[u]
								}),
							a
						)
					}
					var y = Object.getPrototypeOf,
						g = {}.hasOwnProperty
					function v(a, o) {
						return g.call(a, o)
					}
					function _(a, o) {
						;(typeof o == 'function' && (o = o(y(a))),
							(typeof Reflect > 'u' ? f : Reflect.ownKeys)(o).forEach(
								function (u) {
									x(a, u, o[u])
								},
							))
					}
					var S = Object.defineProperty
					function x(a, o, u, h) {
						S(
							a,
							o,
							m(
								u && v(u, 'get') && typeof u.get == 'function'
									? {get: u.get, set: u.set, configurable: !0}
									: {value: u, configurable: !0, writable: !0},
								h,
							),
						)
					}
					function R(a) {
						return {
							from: function (o) {
								return (
									(a.prototype = Object.create(o.prototype)),
									x(a.prototype, 'constructor', a),
									{extend: _.bind(null, a.prototype)}
								)
							},
						}
					}
					var b = Object.getOwnPropertyDescriptor
					function A(a, o) {
						var u = b(a, o),
							h
						return u || ((h = y(a)) && A(h, o))
					}
					var L = [].slice
					function N(a, o, u) {
						return L.call(a, o, u)
					}
					function U(a, o) {
						return o(a)
					}
					function ee(a) {
						if (!a) throw new Error('Assertion Failed')
					}
					function X(a) {
						l.setImmediate ? setImmediate(a) : setTimeout(a, 0)
					}
					function ve(a, o) {
						return a.reduce(function (u, h, p) {
							var w = o(h, p)
							return (w && (u[w[0]] = w[1]), u)
						}, {})
					}
					function ge(a, o) {
						if (typeof o == 'string' && v(a, o)) return a[o]
						if (!o) return a
						if (typeof o != 'string') {
							for (var u = [], h = 0, p = o.length; h < p; ++h) {
								var w = ge(a, o[h])
								u.push(w)
							}
							return u
						}
						var k = o.indexOf('.')
						if (k !== -1) {
							var O = a[o.substr(0, k)]
							return O == null ? void 0 : ge(O, o.substr(k + 1))
						}
					}
					function ye(a, o, u) {
						if (
							!(!a || o === void 0) &&
							!('isFrozen' in Object && Object.isFrozen(a))
						)
							if (typeof o != 'string' && 'length' in o) {
								ee(typeof u != 'string' && 'length' in u)
								for (var h = 0, p = o.length; h < p; ++h) ye(a, o[h], u[h])
							} else {
								var w = o.indexOf('.')
								if (w !== -1) {
									var k = o.substr(0, w),
										O = o.substr(w + 1)
									if (O === '')
										u === void 0
											? c(a) && !isNaN(parseInt(k))
												? a.splice(k, 1)
												: delete a[k]
											: (a[k] = u)
									else {
										var D = a[k]
										if (!D || !v(a, k)) {
											if (u === void 0) return
											D = a[k] = {}
										}
										ye(D, O, u)
									}
								} else
									u === void 0
										? c(a) && !isNaN(parseInt(o))
											? a.splice(o, 1)
											: delete a[o]
										: (a[o] = u)
							}
					}
					function Ne(a, o) {
						typeof o == 'string'
							? ye(a, o, void 0)
							: 'length' in o &&
								[].map.call(o, function (u) {
									ye(a, u, void 0)
								})
					}
					function je(a) {
						var o = {}
						for (var u in a) v(a, u) && (o[u] = a[u])
						return o
					}
					var Ee = [].concat
					function Me(a) {
						return Ee.apply([], a)
					}
					var Qe =
							'BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey'
								.split(',')
								.concat(
									Me(
										[8, 16, 32, 64].map(function (a) {
											return ['Int', 'Uint', 'Float'].map(function (o) {
												return o + a + 'Array'
											})
										}),
									),
								)
								.filter(function (a) {
									return l[a]
								}),
						pt = new Set(
							Qe.map(function (a) {
								return l[a]
							}),
						)
					function j(a) {
						var o = {}
						for (var u in a)
							if (v(a, u)) {
								var h = a[u]
								o[u] =
									!h || typeof h != 'object' || pt.has(h.constructor) ? h : j(h)
							}
						return o
					}
					var G = null
					function $(a) {
						G = new WeakMap()
						var o = _e(a)
						return ((G = null), o)
					}
					function _e(a) {
						if (!a || typeof a != 'object') return a
						var o = G.get(a)
						if (o) return o
						if (c(a)) {
							;((o = []), G.set(a, o))
							for (var u = 0, h = a.length; u < h; ++u) o.push(_e(a[u]))
						} else if (pt.has(a.constructor)) o = a
						else {
							var p = y(a)
							;((o = p === Object.prototype ? {} : Object.create(p)),
								G.set(a, o))
							for (var w in a) v(a, w) && (o[w] = _e(a[w]))
						}
						return o
					}
					var Ie = {}.toString
					function xe(a) {
						return Ie.call(a).slice(8, -1)
					}
					var ze = typeof Symbol < 'u' ? Symbol.iterator : '@@iterator',
						ft =
							typeof ze == 'symbol'
								? function (a) {
										var o
										return a != null && (o = a[ze]) && o.apply(a)
									}
								: function () {
										return null
									}
					function it(a, o) {
						var u = a.indexOf(o)
						return (u >= 0 && a.splice(u, 1), u >= 0)
					}
					var Je = {}
					function P(a) {
						var o, u, h, p
						if (arguments.length === 1) {
							if (c(a)) return a.slice()
							if (this === Je && typeof a == 'string') return [a]
							if ((p = ft(a))) {
								for (u = []; (h = p.next()), !h.done;) u.push(h.value)
								return u
							}
							if (a == null) return [a]
							if (((o = a.length), typeof o == 'number')) {
								for (u = new Array(o); o--;) u[o] = a[o]
								return u
							}
							return [a]
						}
						for (o = arguments.length, u = new Array(o); o--;)
							u[o] = arguments[o]
						return u
					}
					var M =
							typeof Symbol < 'u'
								? function (a) {
										return a[Symbol.toStringTag] === 'AsyncFunction'
									}
								: function () {
										return !1
									},
						ue = [
							'Modify',
							'Bulk',
							'OpenFailed',
							'VersionChange',
							'Schema',
							'Upgrade',
							'InvalidTable',
							'MissingAPI',
							'NoSuchDatabase',
							'InvalidArgument',
							'SubTransaction',
							'Unsupported',
							'Internal',
							'DatabaseClosed',
							'PrematureCommit',
							'ForeignAwait',
						],
						me = [
							'Unknown',
							'Constraint',
							'Data',
							'TransactionInactive',
							'ReadOnly',
							'Version',
							'NotFound',
							'InvalidState',
							'InvalidAccess',
							'Abort',
							'Timeout',
							'QuotaExceeded',
							'Syntax',
							'DataClone',
						],
						Ge = ue.concat(me),
						be = {
							VersionChanged:
								'Database version changed by other database connection',
							DatabaseClosed: 'Database has been closed',
							Abort: 'Transaction aborted',
							TransactionInactive:
								'Transaction has already completed or failed',
							MissingAPI:
								'IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb',
						}
					function Te(a, o) {
						;((this.name = a), (this.message = o))
					}
					R(Te)
						.from(Error)
						.extend({
							toString: function () {
								return this.name + ': ' + this.message
							},
						})
					function Rt(a, o) {
						return (
							a +
							'. Errors: ' +
							Object.keys(o)
								.map(function (u) {
									return o[u].toString()
								})
								.filter(function (u, h, p) {
									return p.indexOf(u) === h
								}).join(`
`)
						)
					}
					function Ct(a, o, u, h) {
						;((this.failures = o),
							(this.failedKeys = h),
							(this.successCount = u),
							(this.message = Rt(a, o)))
					}
					R(Ct).from(Te)
					function kt(a, o) {
						;((this.name = 'BulkError'),
							(this.failures = Object.keys(o).map(function (u) {
								return o[u]
							})),
							(this.failuresByPos = o),
							(this.message = Rt(a, this.failures)))
					}
					R(kt).from(Te)
					var _t = Ge.reduce(function (a, o) {
							return ((a[o] = o + 'Error'), a)
						}, {}),
						tt = Te,
						Oe = Ge.reduce(function (a, o) {
							var u = o + 'Error'
							function h(p, w) {
								;((this.name = u),
									p
										? typeof p == 'string'
											? ((this.message = ''.concat(p).concat(
													w
														? `
 ` + w
														: '',
												)),
												(this.inner = w || null))
											: typeof p == 'object' &&
												((this.message = ''
													.concat(p.name, ' ')
													.concat(p.message)),
												(this.inner = p))
										: ((this.message = be[o] || u), (this.inner = null)))
							}
							return (R(h).from(tt), (a[o] = h), a)
						}, {})
					;((Oe.Syntax = SyntaxError),
						(Oe.Type = TypeError),
						(Oe.Range = RangeError))
					var er = me.reduce(function (a, o) {
						return ((a[o + 'Error'] = Oe[o]), a)
					}, {})
					function fr(a, o) {
						if (
							!a ||
							a instanceof Te ||
							a instanceof TypeError ||
							a instanceof SyntaxError ||
							!a.name ||
							!er[a.name]
						)
							return a
						var u = new er[a.name](o || a.message, a)
						return (
							'stack' in a &&
								x(u, 'stack', {
									get: function () {
										return this.inner.stack
									},
								}),
							u
						)
					}
					var Pt = Ge.reduce(function (a, o) {
						return (
							['Syntax', 'Type', 'Range'].indexOf(o) === -1 &&
								(a[o + 'Error'] = Oe[o]),
							a
						)
					}, {})
					;((Pt.ModifyError = Ct), (Pt.DexieError = Te), (Pt.BulkError = kt))
					function st() {}
					function Ft(a) {
						return a
					}
					function jt(a, o) {
						return a == null || a === Ft
							? o
							: function (u) {
									return o(a(u))
								}
					}
					function cr(a, o) {
						return function () {
							;(a.apply(this, arguments), o.apply(this, arguments))
						}
					}
					function zr(a, o) {
						return a === st
							? o
							: function () {
									var u = a.apply(this, arguments)
									u !== void 0 && (arguments[0] = u)
									var h = this.onsuccess,
										p = this.onerror
									;((this.onsuccess = null), (this.onerror = null))
									var w = o.apply(this, arguments)
									return (
										h &&
											(this.onsuccess = this.onsuccess
												? cr(h, this.onsuccess)
												: h),
										p &&
											(this.onerror = this.onerror ? cr(p, this.onerror) : p),
										w !== void 0 ? w : u
									)
								}
					}
					function Lt(a, o) {
						return a === st
							? o
							: function () {
									a.apply(this, arguments)
									var u = this.onsuccess,
										h = this.onerror
									;((this.onsuccess = this.onerror = null),
										o.apply(this, arguments),
										u &&
											(this.onsuccess = this.onsuccess
												? cr(u, this.onsuccess)
												: u),
										h &&
											(this.onerror = this.onerror ? cr(h, this.onerror) : h))
								}
					}
					function dr(a, o) {
						return a === st
							? o
							: function (u) {
									var h = a.apply(this, arguments)
									m(u, h)
									var p = this.onsuccess,
										w = this.onerror
									;((this.onsuccess = null), (this.onerror = null))
									var k = o.apply(this, arguments)
									return (
										p &&
											(this.onsuccess = this.onsuccess
												? cr(p, this.onsuccess)
												: p),
										w &&
											(this.onerror = this.onerror ? cr(w, this.onerror) : w),
										h === void 0 ? (k === void 0 ? void 0 : k) : m(h, k)
									)
								}
					}
					function Dn(a, o) {
						return a === st
							? o
							: function () {
									return o.apply(this, arguments) === !1
										? !1
										: a.apply(this, arguments)
								}
					}
					function C(a, o) {
						return a === st
							? o
							: function () {
									var u = a.apply(this, arguments)
									if (u && typeof u.then == 'function') {
										for (
											var h = this, p = arguments.length, w = new Array(p);
											p--;
										)
											w[p] = arguments[p]
										return u.then(function () {
											return o.apply(h, w)
										})
									}
									return o.apply(this, arguments)
								}
					}
					var se =
						typeof location < 'u' &&
						/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href)
					function we(a, o) {
						se = a
					}
					var Pe = {},
						z = 100,
						re =
							typeof Promise > 'u'
								? []
								: (function () {
										var a = Promise.resolve()
										if (typeof crypto > 'u' || !crypto.subtle)
											return [a, y(a), a]
										var o = crypto.subtle.digest('SHA-512', new Uint8Array([0]))
										return [o, y(o), a]
									})(),
						E = re[0],
						he = re[1],
						Ve = re[2],
						d = he && he.then,
						Y = E && E.constructor,
						Q = !!Ve
					function T() {
						queueMicrotask(pa)
					}
					var F = function (a, o) {
							;(ht.push([a, o]), Ue && (T(), (Ue = !1)))
						},
						Z = !0,
						Ue = !0,
						Ae = [],
						Le = [],
						vt = Ft,
						Yt = {
							id: 'global',
							global: !0,
							ref: 0,
							unhandleds: [],
							onunhandled: st,
							pgp: !1,
							env: {},
							finalize: st,
						},
						ke = Yt,
						ht = [],
						xt = 0,
						Kt = []
					function Se(a) {
						if (typeof this != 'object')
							throw new TypeError('Promises must be constructed via new')
						;((this._listeners = []), (this._lib = !1))
						var o = (this._PSD = ke)
						if (typeof a != 'function') {
							if (a !== Pe) throw new TypeError('Not a function')
							;((this._state = arguments[1]),
								(this._value = arguments[2]),
								this._state === !1 && hr(this, this._value))
							return
						}
						;((this._state = null), (this._value = null), ++o.ref, Mt(this, a))
					}
					var Pn = {
						get: function () {
							var a = ke,
								o = Pi
							function u(h, p) {
								var w = this,
									k = !a.global && (a !== ke || o !== Pi),
									O = k && !_n(),
									D = new Se(function (B, W) {
										xr(w, new Ln(Ze(h, a, k, O), Ze(p, a, k, O), B, W, a))
									})
								return (
									this._consoleTask && (D._consoleTask = this._consoleTask),
									D
								)
							}
							return ((u.prototype = Pe), u)
						},
						set: function (a) {
							x(
								this,
								'then',
								a && a.prototype === Pe
									? Pn
									: {
											get: function () {
												return a
											},
											set: Pn.set,
										},
							)
						},
					}
					;(_(Se.prototype, {
						then: Pn,
						_then: function (a, o) {
							xr(this, new Ln(null, null, a, o, ke))
						},
						catch: function (a) {
							if (arguments.length === 1) return this.then(null, a)
							var o = arguments[0],
								u = arguments[1]
							return typeof o == 'function'
								? this.then(null, function (h) {
										return h instanceof o ? u(h) : ma(h)
									})
								: this.then(null, function (h) {
										return h && h.name === o ? u(h) : ma(h)
									})
						},
						finally: function (a) {
							return this.then(
								function (o) {
									return Se.resolve(a()).then(function () {
										return o
									})
								},
								function (o) {
									return Se.resolve(a()).then(function () {
										return ma(o)
									})
								},
							)
						},
						timeout: function (a, o) {
							var u = this
							return a < 1 / 0
								? new Se(function (h, p) {
										var w = setTimeout(function () {
											return p(new Oe.Timeout(o))
										}, a)
										u.then(h, p).finally(clearTimeout.bind(null, w))
									})
								: this
						},
					}),
						typeof Symbol < 'u' &&
							Symbol.toStringTag &&
							x(Se.prototype, Symbol.toStringTag, 'Dexie.Promise'),
						(Yt.env = de()))
					function Ln(a, o, u, h, p) {
						;((this.onFulfilled = typeof a == 'function' ? a : null),
							(this.onRejected = typeof o == 'function' ? o : null),
							(this.resolve = u),
							(this.reject = h),
							(this.psd = p))
					}
					;(_(Se, {
						all: function () {
							var a = P.apply(null, arguments).map(wa)
							return new Se(function (o, u) {
								a.length === 0 && o([])
								var h = a.length
								a.forEach(function (p, w) {
									return Se.resolve(p).then(function (k) {
										;((a[w] = k), --h || o(a))
									}, u)
								})
							})
						},
						resolve: function (a) {
							if (a instanceof Se) return a
							if (a && typeof a.then == 'function')
								return new Se(function (u, h) {
									a.then(u, h)
								})
							var o = new Se(Pe, !0, a)
							return o
						},
						reject: ma,
						race: function () {
							var a = P.apply(null, arguments).map(wa)
							return new Se(function (o, u) {
								a.map(function (h) {
									return Se.resolve(h).then(o, u)
								})
							})
						},
						PSD: {
							get: function () {
								return ke
							},
							set: function (a) {
								return (ke = a)
							},
						},
						totalEchoes: {
							get: function () {
								return Pi
							},
						},
						newPSD: Mn,
						usePSD: Fe,
						scheduler: {
							get: function () {
								return F
							},
							set: function (a) {
								F = a
							},
						},
						rejectionMapper: {
							get: function () {
								return vt
							},
							set: function (a) {
								vt = a
							},
						},
						follow: function (a, o) {
							return new Se(function (u, h) {
								return Mn(
									function (p, w) {
										var k = ke
										;((k.unhandleds = []),
											(k.onunhandled = w),
											(k.finalize = cr(function () {
												var O = this
												ms(function () {
													O.unhandleds.length === 0 ? p() : w(O.unhandleds[0])
												})
											}, k.finalize)),
											a())
									},
									o,
									u,
									h,
								)
							})
						},
					}),
						Y &&
							(Y.allSettled &&
								x(Se, 'allSettled', function () {
									var a = P.apply(null, arguments).map(wa)
									return new Se(function (o) {
										a.length === 0 && o([])
										var u = a.length,
											h = new Array(u)
										a.forEach(function (p, w) {
											return Se.resolve(p)
												.then(
													function (k) {
														return (h[w] = {status: 'fulfilled', value: k})
													},
													function (k) {
														return (h[w] = {status: 'rejected', reason: k})
													},
												)
												.then(function () {
													return --u || o(h)
												})
										})
									})
								}),
							Y.any &&
								typeof AggregateError < 'u' &&
								x(Se, 'any', function () {
									var a = P.apply(null, arguments).map(wa)
									return new Se(function (o, u) {
										a.length === 0 && u(new AggregateError([]))
										var h = a.length,
											p = new Array(h)
										a.forEach(function (w, k) {
											return Se.resolve(w).then(
												function (O) {
													return o(O)
												},
												function (O) {
													;((p[k] = O), --h || u(new AggregateError(p)))
												},
											)
										})
									})
								}),
							Y.withResolvers && (Se.withResolvers = Y.withResolvers)))
					function Mt(a, o) {
						try {
							o(
								function (u) {
									if (a._state === null) {
										if (u === a)
											throw new TypeError(
												'A promise cannot be resolved with itself.',
											)
										var h = a._lib && li()
										;(u && typeof u.then == 'function'
											? Mt(a, function (p, w) {
													u instanceof Se ? u._then(p, w) : u.then(p, w)
												})
											: ((a._state = !0), (a._value = u), Wt(a)),
											h && ui())
									}
								},
								hr.bind(null, a),
							)
						} catch (u) {
							hr(a, u)
						}
					}
					function hr(a, o) {
						if ((Le.push(o), a._state === null)) {
							var u = a._lib && li()
							;((o = vt(o)),
								(a._state = !1),
								(a._value = o),
								ys(a),
								Wt(a),
								u && ui())
						}
					}
					function Wt(a) {
						var o = a._listeners
						a._listeners = []
						for (var u = 0, h = o.length; u < h; ++u) xr(a, o[u])
						var p = a._PSD
						;(--p.ref || p.finalize(),
							xt === 0 &&
								(++xt,
								F(function () {
									--xt === 0 && ga()
								}, [])))
					}
					function xr(a, o) {
						if (a._state === null) {
							a._listeners.push(o)
							return
						}
						var u = a._state ? o.onFulfilled : o.onRejected
						if (u === null) return (a._state ? o.resolve : o.reject)(a._value)
						;(++o.psd.ref, ++xt, F(Ar, [u, a, o]))
					}
					function Ar(a, o, u) {
						try {
							var h,
								p = o._value
							;(!o._state && Le.length && (Le = []),
								(h =
									se && o._consoleTask
										? o._consoleTask.run(function () {
												return a(p)
											})
										: a(p)),
								!o._state && Le.indexOf(p) === -1 && _a(o),
								u.resolve(h))
						} catch (w) {
							u.reject(w)
						} finally {
							;(--xt === 0 && ga(), --u.psd.ref || u.psd.finalize())
						}
					}
					function pa() {
						Fe(Yt, function () {
							li() && ui()
						})
					}
					function li() {
						var a = Z
						return ((Z = !1), (Ue = !1), a)
					}
					function ui() {
						var a, o, u
						do
							for (; ht.length > 0;)
								for (a = ht, ht = [], u = a.length, o = 0; o < u; ++o) {
									var h = a[o]
									h[0].apply(null, h[1])
								}
						while (ht.length > 0)
						;((Z = !0), (Ue = !0))
					}
					function ga() {
						var a = Ae
						;((Ae = []),
							a.forEach(function (h) {
								h._PSD.onunhandled.call(null, h._value, h)
							}))
						for (var o = Kt.slice(0), u = o.length; u;) o[--u]()
					}
					function ms(a) {
						function o() {
							;(a(), Kt.splice(Kt.indexOf(o), 1))
						}
						;(Kt.push(o),
							++xt,
							F(function () {
								--xt === 0 && ga()
							}, []))
					}
					function ys(a) {
						Ae.some(function (o) {
							return o._value === a._value
						}) || Ae.push(a)
					}
					function _a(a) {
						for (var o = Ae.length; o;)
							if (Ae[--o]._value === a._value) {
								Ae.splice(o, 1)
								return
							}
					}
					function ma(a) {
						return new Se(Pe, !1, a)
					}
					function Dt(a, o) {
						var u = ke
						return function () {
							var h = li(),
								p = ke
							try {
								return (Xr(u, !0), a.apply(this, arguments))
							} catch (w) {
								o && o(w)
							} finally {
								;(Xr(p, !1), h && ui())
							}
						}
					}
					var tr = {awaits: 0, echoes: 0, id: 0},
						bs = 0,
						ya = [],
						ba = 0,
						Pi = 0,
						Xl = 0
					function Mn(a, o, u, h) {
						var p = ke,
							w = Object.create(p)
						;((w.parent = p),
							(w.ref = 0),
							(w.global = !1),
							(w.id = ++Xl),
							Yt.env,
							(w.env = Q
								? {
										Promise: Se,
										PromiseProp: {value: Se, configurable: !0, writable: !0},
										all: Se.all,
										race: Se.race,
										allSettled: Se.allSettled,
										any: Se.any,
										resolve: Se.resolve,
										reject: Se.reject,
									}
								: {}),
							o && m(w, o),
							++p.ref,
							(w.finalize = function () {
								--this.parent.ref || this.parent.finalize()
							}))
						var k = Fe(w, a, u, h)
						return (w.ref === 0 && w.finalize(), k)
					}
					function fi() {
						return (
							tr.id || (tr.id = ++bs),
							++tr.awaits,
							(tr.echoes += z),
							tr.id
						)
					}
					function _n() {
						return tr.awaits
							? (--tr.awaits === 0 && (tr.id = 0),
								(tr.echoes = tr.awaits * z),
								!0)
							: !1
					}
					;('' + d).indexOf('[native code]') === -1 && (fi = _n = st)
					function wa(a) {
						return tr.echoes && a && a.constructor === Y
							? (fi(),
								a.then(
									function (o) {
										return (_n(), o)
									},
									function (o) {
										return (_n(), yt(o))
									},
								))
							: a
					}
					function Ql(a) {
						;(++Pi,
							(!tr.echoes || --tr.echoes === 0) &&
								(tr.echoes = tr.awaits = tr.id = 0),
							ya.push(ke),
							Xr(a, !0))
					}
					function Jl() {
						var a = ya[ya.length - 1]
						;(ya.pop(), Xr(a, !1))
					}
					function Xr(a, o) {
						var u = ke
						if (
							((o
								? tr.echoes && (!ba++ || a !== ke)
								: ba && (!--ba || a !== ke)) &&
								queueMicrotask(o ? Ql.bind(null, a) : Jl),
							a !== ke && ((ke = a), u === Yt && (Yt.env = de()), Q))
						) {
							var h = Yt.env.Promise,
								p = a.env
							;(u.global || a.global) &&
								(Object.defineProperty(l, 'Promise', p.PromiseProp),
								(h.all = p.all),
								(h.race = p.race),
								(h.resolve = p.resolve),
								(h.reject = p.reject),
								p.allSettled && (h.allSettled = p.allSettled),
								p.any && (h.any = p.any))
						}
					}
					function de() {
						var a = l.Promise
						return Q
							? {
									Promise: a,
									PromiseProp: Object.getOwnPropertyDescriptor(l, 'Promise'),
									all: a.all,
									race: a.race,
									allSettled: a.allSettled,
									any: a.any,
									resolve: a.resolve,
									reject: a.reject,
								}
							: {}
					}
					function Fe(a, o, u, h, p) {
						var w = ke
						try {
							return (Xr(a, !0), o(u, h, p))
						} finally {
							Xr(w, !1)
						}
					}
					function Ze(a, o, u, h) {
						return typeof a != 'function'
							? a
							: function () {
									var p = ke
									;(u && fi(), Xr(o, !0))
									try {
										return a.apply(this, arguments)
									} finally {
										;(Xr(p, !1), h && queueMicrotask(_n))
									}
								}
					}
					function wt(a) {
						Promise === Y && tr.echoes === 0
							? ba === 0
								? a()
								: enqueueNativeMicroTask(a)
							: setTimeout(a, 0)
					}
					var yt = Se.reject
					function Tr(a, o, u, h) {
						if (
							!a.idbdb ||
							(!a._state.openComplete && !ke.letThrough && !a._vip)
						) {
							if (a._state.openComplete)
								return yt(new Oe.DatabaseClosed(a._state.dbOpenError))
							if (!a._state.isBeingOpened) {
								if (!a._state.autoOpen) return yt(new Oe.DatabaseClosed())
								a.open().catch(st)
							}
							return a._state.dbReadyPromise.then(function () {
								return Tr(a, o, u, h)
							})
						} else {
							var p = a._createTransaction(o, u, a._dbSchema)
							try {
								;(p.create(), (a._state.PR1398_maxLoop = 3))
							} catch (w) {
								return w.name === _t.InvalidState &&
									a.isOpen() &&
									--a._state.PR1398_maxLoop > 0
									? (console.warn('Dexie: Need to reopen db'),
										a.close({disableAutoOpen: !1}),
										a.open().then(function () {
											return Tr(a, o, u, h)
										}))
									: yt(w)
							}
							return p
								._promise(o, function (w, k) {
									return Mn(function () {
										return ((ke.trans = p), h(w, k, p))
									})
								})
								.then(function (w) {
									if (o === 'readwrite')
										try {
											p.idbtrans.commit()
										} catch {}
									return o === 'readonly'
										? w
										: p._completion.then(function () {
												return w
											})
								})
						}
					}
					var Ir = '4.4.4',
						Ut = '￿',
						Nt = -1 / 0,
						Ot =
							'Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.',
						Rr = 'String expected.',
						Xt = 1e3,
						Tt = '__dbnames',
						Qt = 'readonly',
						nr = 'readwrite'
					function Ht(a, o) {
						return a
							? o
								? function () {
										return a.apply(this, arguments) && o.apply(this, arguments)
									}
								: a
							: o
					}
					var tn = {
						type: 3,
						lower: -1 / 0,
						lowerOpen: !1,
						upper: [[]],
						upperOpen: !1,
					}
					function qr(a) {
						return typeof a == 'string' && !/\./.test(a)
							? function (o) {
									return (
										o[a] === void 0 && a in o && ((o = $(o)), delete o[a]),
										o
									)
								}
							: function (o) {
									return o
								}
					}
					function mn() {
						throw Oe.Type(
							'Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.',
						)
					}
					function He(a, o) {
						try {
							var u = Pr(a),
								h = Pr(o)
							if (u !== h)
								return u === 'Array'
									? 1
									: h === 'Array'
										? -1
										: u === 'binary'
											? 1
											: h === 'binary'
												? -1
												: u === 'string'
													? 1
													: h === 'string'
														? -1
														: u === 'Date'
															? 1
															: h !== 'Date'
																? NaN
																: -1
							switch (u) {
								case 'number':
								case 'Date':
								case 'string':
									return a > o ? 1 : a < o ? -1 : 0
								case 'binary':
									return Kr($t(a), $t(o))
								case 'Array':
									return Gt(a, o)
							}
						} catch {}
						return NaN
					}
					function Gt(a, o) {
						for (
							var u = a.length, h = o.length, p = u < h ? u : h, w = 0;
							w < p;
							++w
						) {
							var k = He(a[w], o[w])
							if (k !== 0) return k
						}
						return u === h ? 0 : u < h ? -1 : 1
					}
					function Kr(a, o) {
						for (
							var u = a.length, h = o.length, p = u < h ? u : h, w = 0;
							w < p;
							++w
						)
							if (a[w] !== o[w]) return a[w] < o[w] ? -1 : 1
						return u === h ? 0 : u < h ? -1 : 1
					}
					function Pr(a) {
						var o = typeof a
						if (o !== 'object') return o
						if (ArrayBuffer.isView(a)) return 'binary'
						var u = xe(a)
						return u === 'ArrayBuffer' ? 'binary' : u
					}
					function $t(a) {
						return a instanceof Uint8Array
							? a
							: ArrayBuffer.isView(a)
								? new Uint8Array(a.buffer, a.byteOffset, a.byteLength)
								: new Uint8Array(a)
					}
					function Lr(a, o, u) {
						var h = a.schema.yProps
						return h
							? (o &&
									u.numFailures > 0 &&
									(o = o.filter(function (p, w) {
										return !u.failures[w]
									})),
								Promise.all(
									h.map(function (p) {
										var w = p.updatesTable
										return o
											? a.db.table(w).where('k').anyOf(o).delete()
											: a.db.table(w).clear()
									}),
								).then(function () {
									return u
								}))
							: u
					}
					var Qr = (function () {
						function a(o) {
							this['@@propmod'] = o
						}
						return (
							(a.prototype.execute = function (o) {
								var u,
									h = this['@@propmod']
								if (h.add !== void 0) {
									var p = h.add
									if (c(p)) return s(s([], c(o) ? o : [], !0), p).sort()
									if (typeof p == 'number') return (Number(o) || 0) + p
									if (typeof p == 'bigint')
										try {
											return BigInt(o) + p
										} catch {
											return BigInt(0) + p
										}
									throw new TypeError('Invalid term '.concat(p))
								}
								if (h.remove !== void 0) {
									var w = h.remove
									if (c(w))
										return c(o)
											? o
													.filter(function (O) {
														return !w.includes(O)
													})
													.sort()
											: []
									if (typeof w == 'number') return Number(o) - w
									if (typeof w == 'bigint')
										try {
											return BigInt(o) - w
										} catch {
											return BigInt(0) - w
										}
									throw new TypeError('Invalid subtrahend '.concat(w))
								}
								var k =
									(u = h.replacePrefix) === null || u === void 0 ? void 0 : u[0]
								return k && typeof o == 'string' && o.startsWith(k)
									? h.replacePrefix[1] + o.substring(k.length)
									: o
							}),
							a
						)
					})()
					function yn(a, o) {
						for (var u = f(o), h = u.length, p = !1, w = 0; w < h; ++w) {
							var k = u[w],
								O = o[k],
								D = ge(a, k)
							O instanceof Qr
								? (ye(a, k, O.execute(D)), (p = !0))
								: D !== O && (ye(a, k, O), (p = !0))
						}
						return p
					}
					var Li = (function () {
						function a() {}
						return (
							(a.prototype._trans = function (o, u, h) {
								var p = this._tx || ke.trans,
									w = this.name,
									k =
										se &&
										typeof console < 'u' &&
										console.createTask &&
										console.createTask(
											'Dexie: '
												.concat(o === 'readonly' ? 'read' : 'write', ' ')
												.concat(this.name),
										)
								function O(W, H, J) {
									if (!J.schema[w])
										throw new Oe.NotFound(
											'Table ' + w + ' not part of transaction',
										)
									return u(J.idbtrans, J)
								}
								var D = li()
								try {
									var B =
										p && p.db._novip === this.db._novip
											? p === ke.trans
												? p._promise(o, O, h)
												: Mn(
														function () {
															return p._promise(o, O, h)
														},
														{trans: p, transless: ke.transless || ke},
													)
											: Tr(this.db, o, [this.name], O)
									return (
										k &&
											((B._consoleTask = k),
											(B = B.catch(function (W) {
												return (console.trace(W), yt(W))
											}))),
										B
									)
								} finally {
									D && ui()
								}
							}),
							(a.prototype.get = function (o, u) {
								var h = this
								return o && o.constructor === Object
									? this.where(o).first(u)
									: o == null
										? yt(new Oe.Type('Invalid argument to Table.get()'))
										: this._trans('readonly', function (p) {
												return h.core
													.get({trans: p, key: o})
													.then(function (w) {
														return h.hook.reading.fire(w)
													})
											}).then(u)
							}),
							(a.prototype.where = function (o) {
								if (typeof o == 'string')
									return new this.db.WhereClause(this, o)
								if (c(o))
									return new this.db.WhereClause(
										this,
										'['.concat(o.join('+'), ']'),
									)
								var u = f(o)
								if (u.length === 1) return this.where(u[0]).equals(o[u[0]])
								var h = this.schema.indexes
									.concat(this.schema.primKey)
									.filter(function (W) {
										if (
											W.compound &&
											u.every(function (J) {
												return W.keyPath.indexOf(J) >= 0
											})
										) {
											for (var H = 0; H < u.length; ++H)
												if (u.indexOf(W.keyPath[H]) === -1) return !1
											return !0
										}
										return !1
									})
									.sort(function (W, H) {
										return W.keyPath.length - H.keyPath.length
									})[0]
								if (h && this.db._maxKey !== Ut) {
									var p = h.keyPath.slice(0, u.length)
									return this.where(p).equals(
										p.map(function (W) {
											return o[W]
										}),
									)
								}
								!h &&
									se &&
									console.warn(
										'The query '
											.concat(JSON.stringify(o), ' on ')
											.concat(this.name, ' would benefit from a ') +
											'compound index ['.concat(u.join('+'), ']'),
									)
								var w = this.schema.idxByName
								function k(W, H) {
									return He(W, H) === 0
								}
								var O = u.reduce(
										function (W, H) {
											var J = W[0],
												le = W[1],
												K = w[H],
												V = o[H]
											return [
												J || K,
												J || !K
													? Ht(
															le,
															K && K.multi
																? function (ne) {
																		var te = ge(ne, H)
																		return (
																			c(te) &&
																			te.some(function (pe) {
																				return k(V, pe)
																			})
																		)
																	}
																: function (ne) {
																		return k(V, ge(ne, H))
																	},
														)
													: le,
											]
										},
										[null, null],
									),
									D = O[0],
									B = O[1]
								return D
									? this.where(D.name).equals(o[D.keyPath]).filter(B)
									: h
										? this.filter(B)
										: this.where(u).equals('')
							}),
							(a.prototype.filter = function (o) {
								return this.toCollection().and(o)
							}),
							(a.prototype.count = function (o) {
								return this.toCollection().count(o)
							}),
							(a.prototype.offset = function (o) {
								return this.toCollection().offset(o)
							}),
							(a.prototype.limit = function (o) {
								return this.toCollection().limit(o)
							}),
							(a.prototype.each = function (o) {
								return this.toCollection().each(o)
							}),
							(a.prototype.toArray = function (o) {
								return this.toCollection().toArray(o)
							}),
							(a.prototype.toCollection = function () {
								return new this.db.Collection(new this.db.WhereClause(this))
							}),
							(a.prototype.orderBy = function (o) {
								return new this.db.Collection(
									new this.db.WhereClause(
										this,
										c(o) ? '['.concat(o.join('+'), ']') : o,
									),
								)
							}),
							(a.prototype.reverse = function () {
								return this.toCollection().reverse()
							}),
							(a.prototype.mapToClass = function (o) {
								var u = this,
									h = u.db,
									p = u.name
								;((this.schema.mappedClass = o),
									o.prototype instanceof mn &&
										(o = (function (D) {
											n(B, D)
											function B() {
												return (D !== null && D.apply(this, arguments)) || this
											}
											return (
												Object.defineProperty(B.prototype, 'db', {
													get: function () {
														return h
													},
													enumerable: !1,
													configurable: !0,
												}),
												(B.prototype.table = function () {
													return p
												}),
												B
											)
										})(o)))
								for (var w = new Set(), k = o.prototype; k; k = y(k))
									Object.getOwnPropertyNames(k).forEach(function (D) {
										return w.add(D)
									})
								var O = function (D) {
									if (!D) return D
									var B = Object.create(o.prototype)
									for (var W in D)
										if (!w.has(W))
											try {
												B[W] = D[W]
											} catch {}
									return B
								}
								return (
									this.schema.readHook &&
										this.hook.reading.unsubscribe(this.schema.readHook),
									(this.schema.readHook = O),
									this.hook('reading', O),
									o
								)
							}),
							(a.prototype.defineClass = function () {
								function o(u) {
									m(this, u)
								}
								return this.mapToClass(o)
							}),
							(a.prototype.add = function (o, u) {
								var h = this,
									p = this.schema.primKey,
									w = p.auto,
									k = p.keyPath,
									O = o
								return (
									k && w && (O = qr(k)(o)),
									this._trans('readwrite', function (D) {
										return h.core.mutate({
											trans: D,
											type: 'add',
											keys: u != null ? [u] : null,
											values: [O],
										})
									})
										.then(function (D) {
											return D.numFailures
												? Se.reject(D.failures[0])
												: D.lastResult
										})
										.then(function (D) {
											if (k)
												try {
													ye(o, k, D)
												} catch {}
											return D
										})
								)
							}),
							(a.prototype.upsert = function (o, u) {
								var h = this,
									p = this.schema.primKey.keyPath
								return this._trans('readwrite', function (w) {
									return h.core.get({trans: w, key: o}).then(function (k) {
										var O = k ?? {}
										return (
											yn(O, u),
											p && ye(O, p, o),
											h.core
												.mutate({
													trans: w,
													type: 'put',
													values: [O],
													keys: [o],
													upsert: !0,
													updates: {keys: [o], changeSpecs: [u]},
												})
												.then(function (D) {
													return D.numFailures ? Se.reject(D.failures[0]) : !!k
												})
										)
									})
								})
							}),
							(a.prototype.update = function (o, u) {
								if (typeof o == 'object' && !c(o)) {
									var h = ge(o, this.schema.primKey.keyPath)
									return h === void 0
										? yt(
												new Oe.InvalidArgument(
													'Given object does not contain its primary key',
												),
											)
										: this.where(':id').equals(h).modify(u)
								} else return this.where(':id').equals(o).modify(u)
							}),
							(a.prototype.put = function (o, u) {
								var h = this,
									p = this.schema.primKey,
									w = p.auto,
									k = p.keyPath,
									O = o
								return (
									k && w && (O = qr(k)(o)),
									this._trans('readwrite', function (D) {
										return h.core.mutate({
											trans: D,
											type: 'put',
											values: [O],
											keys: u != null ? [u] : null,
										})
									})
										.then(function (D) {
											return D.numFailures
												? Se.reject(D.failures[0])
												: D.lastResult
										})
										.then(function (D) {
											if (k)
												try {
													ye(o, k, D)
												} catch {}
											return D
										})
								)
							}),
							(a.prototype.delete = function (o) {
								var u = this
								return this._trans('readwrite', function (h) {
									return u.core
										.mutate({trans: h, type: 'delete', keys: [o]})
										.then(function (p) {
											return Lr(u, [o], p)
										})
										.then(function (p) {
											return p.numFailures ? Se.reject(p.failures[0]) : void 0
										})
								})
							}),
							(a.prototype.clear = function () {
								var o = this
								return this._trans('readwrite', function (u) {
									return o.core
										.mutate({trans: u, type: 'deleteRange', range: tn})
										.then(function (h) {
											return Lr(o, null, h)
										})
								}).then(function (u) {
									return u.numFailures ? Se.reject(u.failures[0]) : void 0
								})
							}),
							(a.prototype.bulkGet = function (o) {
								var u = this
								return this._trans('readonly', function (h) {
									return u.core.getMany({keys: o, trans: h}).then(function (p) {
										return p.map(function (w) {
											return u.hook.reading.fire(w)
										})
									})
								})
							}),
							(a.prototype.bulkAdd = function (o, u, h) {
								var p = this,
									w = Array.isArray(u) ? u : void 0
								h = h || (w ? void 0 : u)
								var k = h ? h.allKeys : void 0
								return this._trans('readwrite', function (O) {
									var D = p.schema.primKey,
										B = D.auto,
										W = D.keyPath
									if (W && w)
										throw new Oe.InvalidArgument(
											'bulkAdd(): keys argument invalid on tables with inbound keys',
										)
									if (w && w.length !== o.length)
										throw new Oe.InvalidArgument(
											'Arguments objects and keys must have the same length',
										)
									var H = o.length,
										J = W && B ? o.map(qr(W)) : o
									return p.core
										.mutate({
											trans: O,
											type: 'add',
											keys: w,
											values: J,
											wantResults: k,
										})
										.then(function (le) {
											var K = le.numFailures,
												V = le.results,
												ne = le.lastResult,
												te = le.failures,
												pe = k ? V : ne
											if (K === 0) return pe
											throw new kt(
												''
													.concat(p.name, '.bulkAdd(): ')
													.concat(K, ' of ')
													.concat(H, ' operations failed'),
												te,
											)
										})
								})
							}),
							(a.prototype.bulkPut = function (o, u, h) {
								var p = this,
									w = Array.isArray(u) ? u : void 0
								h = h || (w ? void 0 : u)
								var k = h ? h.allKeys : void 0
								return this._trans('readwrite', function (O) {
									var D = p.schema.primKey,
										B = D.auto,
										W = D.keyPath
									if (W && w)
										throw new Oe.InvalidArgument(
											'bulkPut(): keys argument invalid on tables with inbound keys',
										)
									if (w && w.length !== o.length)
										throw new Oe.InvalidArgument(
											'Arguments objects and keys must have the same length',
										)
									var H = o.length,
										J = W && B ? o.map(qr(W)) : o
									return p.core
										.mutate({
											trans: O,
											type: 'put',
											keys: w,
											values: J,
											wantResults: k,
										})
										.then(function (le) {
											var K = le.numFailures,
												V = le.results,
												ne = le.lastResult,
												te = le.failures,
												pe = k ? V : ne
											if (K === 0) return pe
											throw new kt(
												''
													.concat(p.name, '.bulkPut(): ')
													.concat(K, ' of ')
													.concat(H, ' operations failed'),
												te,
											)
										})
								})
							}),
							(a.prototype.bulkUpdate = function (o) {
								var u = this,
									h = this.core,
									p = o.map(function (O) {
										return O.key
									}),
									w = o.map(function (O) {
										return O.changes
									}),
									k = []
								return this._trans('readwrite', function (O) {
									return h
										.getMany({trans: O, keys: p, cache: 'clone'})
										.then(function (D) {
											var B = [],
												W = []
											o.forEach(function (J, le) {
												var K = J.key,
													V = J.changes,
													ne = D[le]
												if (ne) {
													for (
														var te = 0, pe = Object.keys(V);
														te < pe.length;
														te++
													) {
														var ce = pe[te],
															ae = V[ce]
														if (ce === u.schema.primKey.keyPath) {
															if (He(ae, K) !== 0)
																throw new Oe.Constraint(
																	'Cannot update primary key in bulkUpdate()',
																)
														} else ye(ne, ce, ae)
													}
													;(k.push(le), B.push(K), W.push(ne))
												}
											})
											var H = B.length
											return h
												.mutate({
													trans: O,
													type: 'put',
													keys: B,
													values: W,
													updates: {keys: p, changeSpecs: w},
												})
												.then(function (J) {
													var le = J.numFailures,
														K = J.failures
													if (le === 0) return H
													for (
														var V = 0, ne = Object.keys(K);
														V < ne.length;
														V++
													) {
														var te = ne[V],
															pe = k[Number(te)]
														if (pe != null) {
															var ce = K[te]
															;(delete K[te], (K[pe] = ce))
														}
													}
													throw new kt(
														''
															.concat(u.name, '.bulkUpdate(): ')
															.concat(le, ' of ')
															.concat(H, ' operations failed'),
														K,
													)
												})
										})
								})
							}),
							(a.prototype.bulkDelete = function (o) {
								var u = this,
									h = o.length
								return this._trans('readwrite', function (p) {
									return u.core
										.mutate({trans: p, type: 'delete', keys: o})
										.then(function (w) {
											return Lr(u, o, w)
										})
								}).then(function (p) {
									var w = p.numFailures,
										k = p.lastResult,
										O = p.failures
									if (w === 0) return k
									throw new kt(
										''
											.concat(u.name, '.bulkDelete(): ')
											.concat(w, ' of ')
											.concat(h, ' operations failed'),
										O,
									)
								})
							}),
							a
						)
					})()
					function Mi(a) {
						var o = {},
							u = function (O, D) {
								if (D) {
									for (var B = arguments.length, W = new Array(B - 1); --B;)
										W[B - 1] = arguments[B]
									return (o[O].subscribe.apply(null, W), a)
								} else if (typeof O == 'string') return o[O]
							}
						u.addEventType = w
						for (var h = 1, p = arguments.length; h < p; ++h) w(arguments[h])
						return u
						function w(O, D, B) {
							if (typeof O == 'object') return k(O)
							;(D || (D = Dn), B || (B = st))
							var W = {
								subscribers: [],
								fire: B,
								subscribe: function (H) {
									W.subscribers.indexOf(H) === -1 &&
										(W.subscribers.push(H), (W.fire = D(W.fire, H)))
								},
								unsubscribe: function (H) {
									;((W.subscribers = W.subscribers.filter(function (J) {
										return J !== H
									})),
										(W.fire = W.subscribers.reduce(D, B)))
								},
							}
							return ((o[O] = u[O] = W), W)
						}
						function k(O) {
							f(O).forEach(function (D) {
								var B = O[D]
								if (c(B)) w(D, O[D][0], O[D][1])
								else if (B === 'asap')
									var W = w(D, Ft, function () {
										for (var J = arguments.length, le = new Array(J); J--;)
											le[J] = arguments[J]
										W.subscribers.forEach(function (K) {
											X(function () {
												K.apply(null, le)
											})
										})
									})
								else throw new Oe.InvalidArgument('Invalid event config')
							})
						}
					}
					function ci(a, o) {
						return (R(o).from({prototype: a}), o)
					}
					function eu(a) {
						return ci(Li.prototype, function (u, h, p) {
							;((this.db = a),
								(this._tx = p),
								(this.name = u),
								(this.schema = h),
								(this.hook = a._allTables[u]
									? a._allTables[u].hook
									: Mi(null, {
											creating: [zr, st],
											reading: [jt, Ft],
											updating: [dr, st],
											deleting: [Lt, st],
										})))
						})
					}
					function $n(a, o) {
						return (
							!(a.filter || a.algorithm || a.or) &&
							(o ? a.justLimit : !a.replayFilter)
						)
					}
					function Ni(a, o) {
						a.filter = Ht(a.filter, o)
					}
					function Bi(a, o, u) {
						var h = a.replayFilter
						;((a.replayFilter = h
							? function () {
									return Ht(h(), o())
								}
							: o),
							(a.justLimit = u && !h))
					}
					function ao(a, o) {
						a.isMatch = Ht(a.isMatch, o)
					}
					function Fi(a, o) {
						if (a.isPrimKey) return o.primaryKey
						var u = o.getIndexByKeyPath(a.index)
						if (!u)
							throw new Oe.Schema(
								'KeyPath ' +
									a.index +
									' on object store ' +
									o.name +
									' is not indexed',
							)
						return u
					}
					function oo(a, o, u) {
						var h = Fi(a, o.schema)
						return o.openCursor({
							trans: u,
							values: !a.keysOnly,
							reverse: a.dir === 'prev',
							unique: !!a.unique,
							query: {index: h, range: a.range},
						})
					}
					function Sa(a, o, u, h) {
						var p = a.replayFilter ? Ht(a.filter, a.replayFilter()) : a.filter
						if (a.or) {
							var w = {},
								k = function (O, D, B) {
									if (
										!p ||
										p(
											D,
											B,
											function (J) {
												return D.stop(J)
											},
											function (J) {
												return D.fail(J)
											},
										)
									) {
										var W = D.primaryKey,
											H = '' + W
										;(H === '[object ArrayBuffer]' &&
											(H = '' + new Uint8Array(W)),
											v(w, H) || ((w[H] = !0), o(O, D, B)))
									}
								}
							return Promise.all([
								a.or._iterate(k, u),
								so(oo(a, h, u), a.algorithm, k, !a.keysOnly && a.valueMapper),
							])
						} else
							return so(
								oo(a, h, u),
								Ht(a.algorithm, p),
								o,
								!a.keysOnly && a.valueMapper,
							)
					}
					function so(a, o, u, h) {
						var p = h
								? function (k, O, D) {
										return u(h(k), O, D)
									}
								: u,
							w = Dt(p)
						return a.then(function (k) {
							if (k)
								return k.start(function () {
									var O = function () {
										return k.continue()
									}
									;((!o ||
										o(
											k,
											function (D) {
												return (O = D)
											},
											function (D) {
												;(k.stop(D), (O = st))
											},
											function (D) {
												;(k.fail(D), (O = st))
											},
										)) &&
										w(k.value, k, function (D) {
											return (O = D)
										}),
										O())
								})
						})
					}
					var lo = (function () {
							function a() {}
							return (
								(a.prototype._read = function (o, u) {
									var h = this._ctx
									return h.error
										? h.table._trans(null, yt.bind(null, h.error))
										: h.table._trans('readonly', o).then(u)
								}),
								(a.prototype._write = function (o) {
									var u = this._ctx
									return u.error
										? u.table._trans(null, yt.bind(null, u.error))
										: u.table._trans('readwrite', o, 'locked')
								}),
								(a.prototype._addAlgorithm = function (o) {
									var u = this._ctx
									u.algorithm = Ht(u.algorithm, o)
								}),
								(a.prototype._iterate = function (o, u) {
									return Sa(this._ctx, o, u, this._ctx.table.core)
								}),
								(a.prototype.clone = function (o) {
									var u = Object.create(this.constructor.prototype),
										h = Object.create(this._ctx)
									return (o && m(h, o), (u._ctx = h), u)
								}),
								(a.prototype.raw = function () {
									return ((this._ctx.valueMapper = null), this)
								}),
								(a.prototype.each = function (o) {
									var u = this._ctx
									return this._read(function (h) {
										return Sa(u, o, h, u.table.core)
									})
								}),
								(a.prototype.count = function (o) {
									var u = this
									return this._read(function (h) {
										var p = u._ctx,
											w = p.table.core
										if ($n(p, !0))
											return w
												.count({
													trans: h,
													query: {index: Fi(p, w.schema), range: p.range},
												})
												.then(function (O) {
													return Math.min(O, p.limit)
												})
										var k = 0
										return Sa(
											p,
											function () {
												return (++k, !1)
											},
											h,
											w,
										).then(function () {
											return k
										})
									}).then(o)
								}),
								(a.prototype.sortBy = function (o, u) {
									var h = o.split('.').reverse(),
										p = h[0],
										w = h.length - 1
									function k(B, W) {
										return W ? k(B[h[W]], W - 1) : B[p]
									}
									var O = this._ctx.dir === 'next' ? 1 : -1
									function D(B, W) {
										var H = k(B, w),
											J = k(W, w)
										return He(H, J) * O
									}
									return this.toArray(function (B) {
										return B.slice().sort(D)
									}).then(u)
								}),
								(a.prototype.toArray = function (o) {
									var u = this
									return this._read(function (h) {
										var p = u._ctx
										if ($n(p, !0) && p.limit > 0) {
											var w = p.valueMapper,
												k = Fi(p, p.table.core.schema)
											return p.table.core
												.query({
													trans: h,
													limit: p.limit,
													values: !0,
													direction: p.dir === 'prev' ? 'prev' : void 0,
													query: {index: k, range: p.range},
												})
												.then(function (D) {
													var B = D.result
													return w ? B.map(w) : B
												})
										} else {
											var O = []
											return Sa(
												p,
												function (D) {
													return O.push(D)
												},
												h,
												p.table.core,
											).then(function () {
												return O
											})
										}
									}, o)
								}),
								(a.prototype.offset = function (o) {
									var u = this._ctx
									return o <= 0
										? this
										: ((u.offset += o),
											$n(u)
												? Bi(u, function () {
														var h = o
														return function (p, w) {
															return h === 0
																? !0
																: h === 1
																	? (--h, !1)
																	: (w(function () {
																			;(p.advance(h), (h = 0))
																		}),
																		!1)
														}
													})
												: Bi(u, function () {
														var h = o
														return function () {
															return --h < 0
														}
													}),
											this)
								}),
								(a.prototype.limit = function (o) {
									return (
										(this._ctx.limit = Math.min(this._ctx.limit, o)),
										Bi(
											this._ctx,
											function () {
												var u = o
												return function (h, p, w) {
													return (--u <= 0 && p(w), u >= 0)
												}
											},
											!0,
										),
										this
									)
								}),
								(a.prototype.until = function (o, u) {
									return (
										Ni(this._ctx, function (h, p, w) {
											return o(h.value) ? (p(w), u) : !0
										}),
										this
									)
								}),
								(a.prototype.first = function (o) {
									return this.limit(1)
										.toArray(function (u) {
											return u[0]
										})
										.then(o)
								}),
								(a.prototype.last = function (o) {
									return this.reverse().first(o)
								}),
								(a.prototype.filter = function (o) {
									return (
										Ni(this._ctx, function (u) {
											return o(u.value)
										}),
										ao(this._ctx, o),
										this
									)
								}),
								(a.prototype.and = function (o) {
									return this.filter(o)
								}),
								(a.prototype.or = function (o) {
									return new this.db.WhereClause(this._ctx.table, o, this)
								}),
								(a.prototype.reverse = function () {
									return (
										(this._ctx.dir =
											this._ctx.dir === 'prev' ? 'next' : 'prev'),
										this._ondirectionchange &&
											this._ondirectionchange(this._ctx.dir),
										this
									)
								}),
								(a.prototype.desc = function () {
									return this.reverse()
								}),
								(a.prototype.eachKey = function (o) {
									var u = this._ctx
									return (
										(u.keysOnly = !u.isMatch),
										this.each(function (h, p) {
											o(p.key, p)
										})
									)
								}),
								(a.prototype.eachUniqueKey = function (o) {
									return ((this._ctx.unique = 'unique'), this.eachKey(o))
								}),
								(a.prototype.eachPrimaryKey = function (o) {
									var u = this._ctx
									return (
										(u.keysOnly = !u.isMatch),
										this.each(function (h, p) {
											o(p.primaryKey, p)
										})
									)
								}),
								(a.prototype.keys = function (o) {
									var u = this._ctx
									u.keysOnly = !u.isMatch
									var h = []
									return this.each(function (p, w) {
										h.push(w.key)
									})
										.then(function () {
											return h
										})
										.then(o)
								}),
								(a.prototype.primaryKeys = function (o) {
									var u = this._ctx
									if ($n(u, !0) && u.limit > 0)
										return this._read(function (p) {
											var w = Fi(u, u.table.core.schema)
											return u.table.core.query({
												trans: p,
												values: !1,
												limit: u.limit,
												direction: u.dir === 'prev' ? 'prev' : void 0,
												query: {index: w, range: u.range},
											})
										})
											.then(function (p) {
												var w = p.result
												return w
											})
											.then(o)
									u.keysOnly = !u.isMatch
									var h = []
									return this.each(function (p, w) {
										h.push(w.primaryKey)
									})
										.then(function () {
											return h
										})
										.then(o)
								}),
								(a.prototype.uniqueKeys = function (o) {
									return ((this._ctx.unique = 'unique'), this.keys(o))
								}),
								(a.prototype.firstKey = function (o) {
									return this.limit(1)
										.keys(function (u) {
											return u[0]
										})
										.then(o)
								}),
								(a.prototype.lastKey = function (o) {
									return this.reverse().firstKey(o)
								}),
								(a.prototype.distinct = function () {
									var o = this._ctx,
										u = o.index && o.table.schema.idxByName[o.index]
									if (!u || !u.multi) return this
									var h = {}
									return (
										Ni(this._ctx, function (p) {
											var w = p.primaryKey.toString(),
												k = v(h, w)
											return ((h[w] = !0), !k)
										}),
										this
									)
								}),
								(a.prototype.modify = function (o) {
									var u = this,
										h = this._ctx
									return this._write(function (p) {
										var w
										typeof o == 'function'
											? (w = o)
											: (w = function (te) {
													return yn(te, o)
												})
										var k = h.table.core,
											O = k.schema.primaryKey,
											D = O.outbound,
											B = O.extractKey,
											W = 200,
											H = u.db._options.modifyChunkSize
										H &&
											(typeof H == 'object'
												? (W = H[k.name] || H['*'] || 200)
												: (W = H))
										var J = [],
											le = 0,
											K = [],
											V = function (te, pe) {
												var ce = pe.failures,
													ae = pe.numFailures
												le += te - ae
												for (var fe = 0, Be = f(ce); fe < Be.length; fe++) {
													var Re = Be[fe]
													J.push(ce[Re])
												}
											},
											ne = o === Ea
										return u
											.clone()
											.primaryKeys()
											.then(function (te) {
												var pe = $n(h) &&
														h.limit === 1 / 0 &&
														(typeof o != 'function' || ne) && {
															index: h.index,
															range: h.range,
														},
													ce = function (ae) {
														var fe = Math.min(W, te.length - ae),
															Be = te.slice(ae, ae + fe)
														return (
															ne
																? Promise.resolve([])
																: k.getMany({
																		trans: p,
																		keys: Be,
																		cache: 'immutable',
																	})
														).then(function (Re) {
															var Ce = [],
																Ke = [],
																mt = D ? [] : null,
																Ye = ne ? Be : []
															if (!ne)
																for (var We = 0; We < fe; ++We) {
																	var nt = Re[We],
																		at = {value: $(nt), primKey: te[ae + We]}
																	w.call(at, at.value, at) !== !1 &&
																		(at.value == null
																			? Ye.push(te[ae + We])
																			: !D && He(B(nt), B(at.value)) !== 0
																				? (Ye.push(te[ae + We]),
																					Ce.push(at.value))
																				: (Ke.push(at.value),
																					D && mt.push(te[ae + We])))
																}
															return Promise.resolve(
																Ce.length > 0 &&
																	k
																		.mutate({trans: p, type: 'add', values: Ce})
																		.then(function (Bt) {
																			for (var Xe in Bt.failures)
																				Ye.splice(parseInt(Xe), 1)
																			V(Ce.length, Bt)
																		}),
															)
																.then(function () {
																	return (
																		(Ke.length > 0 ||
																			(pe && typeof o == 'object')) &&
																		k
																			.mutate({
																				trans: p,
																				type: 'put',
																				keys: mt,
																				values: Ke,
																				criteria: pe,
																				changeSpec: typeof o != 'function' && o,
																				isAdditionalChunk: ae > 0,
																			})
																			.then(function (Bt) {
																				return V(Ke.length, Bt)
																			})
																	)
																})
																.then(function () {
																	return (
																		(Ye.length > 0 || (pe && ne)) &&
																		k
																			.mutate({
																				trans: p,
																				type: 'delete',
																				keys: Ye,
																				criteria: pe,
																				isAdditionalChunk: ae > 0,
																			})
																			.then(function (Bt) {
																				return Lr(h.table, Ye, Bt)
																			})
																			.then(function (Bt) {
																				return V(Ye.length, Bt)
																			})
																	)
																})
																.then(function () {
																	return te.length > ae + fe && ce(ae + W)
																})
														})
													}
												return ce(0).then(function () {
													if (J.length > 0)
														throw new Ct(
															'Error modifying one or more objects',
															J,
															le,
															K,
														)
													return te.length
												})
											})
									})
								}),
								(a.prototype.delete = function () {
									var o = this._ctx,
										u = o.range
									return $n(o) &&
										!o.table.schema.yProps &&
										(o.isPrimKey || u.type === 3)
										? this._write(function (h) {
												var p = o.table.core.schema.primaryKey,
													w = u
												return o.table.core
													.count({trans: h, query: {index: p, range: w}})
													.then(function (k) {
														return o.table.core
															.mutate({trans: h, type: 'deleteRange', range: w})
															.then(function (O) {
																var D = O.failures,
																	B = O.numFailures
																if (B)
																	throw new Ct(
																		'Could not delete some values',
																		Object.keys(D).map(function (W) {
																			return D[W]
																		}),
																		k - B,
																	)
																return k - B
															})
													})
											})
										: this.modify(Ea)
								}),
								a
							)
						})(),
						Ea = function (a, o) {
							return (o.value = null)
						}
					function uo(a) {
						return ci(lo.prototype, function (u, h) {
							this.db = a
							var p = tn,
								w = null
							if (h)
								try {
									p = h()
								} catch (B) {
									w = B
								}
							var k = u._ctx,
								O = k.table,
								D = O.hook.reading.fire
							this._ctx = {
								table: O,
								index: k.index,
								isPrimKey:
									!k.index ||
									(O.schema.primKey.keyPath &&
										k.index === O.schema.primKey.name),
								range: p,
								keysOnly: !1,
								dir: 'next',
								unique: '',
								algorithm: null,
								filter: null,
								replayFilter: null,
								justLimit: !0,
								isMatch: null,
								offset: 0,
								limit: 1 / 0,
								error: w,
								or: k.or,
								valueMapper: D !== Ft ? D : null,
							}
						})
					}
					function fo(a, o) {
						return a < o ? -1 : a === o ? 0 : 1
					}
					function co(a, o) {
						return a > o ? -1 : a === o ? 0 : 1
					}
					function Cr(a, o, u) {
						var h = a instanceof ho ? new a.Collection(a) : a
						return ((h._ctx.error = u ? new u(o) : new TypeError(o)), h)
					}
					function Vn(a) {
						return new a.Collection(a, function () {
							return ka('')
						}).limit(0)
					}
					function tu(a) {
						return a === 'next'
							? function (o) {
									return o.toUpperCase()
								}
							: function (o) {
									return o.toLowerCase()
								}
					}
					function ru(a) {
						return a === 'next'
							? function (o) {
									return o.toLowerCase()
								}
							: function (o) {
									return o.toUpperCase()
								}
					}
					function ws(a, o, u, h, p, w) {
						for (
							var k = Math.min(a.length, h.length), O = -1, D = 0;
							D < k;
							++D
						) {
							var B = o[D]
							if (B !== h[D])
								return p(a[D], u[D]) < 0
									? a.substr(0, D) + u[D] + u.substr(D + 1)
									: p(a[D], h[D]) < 0
										? a.substr(0, D) + h[D] + u.substr(D + 1)
										: O >= 0
											? a.substr(0, O) + o[O] + u.substr(O + 1)
											: null
							p(a[D], B) < 0 && (O = D)
						}
						return k < h.length && w === 'next'
							? a + u.substr(a.length)
							: k < a.length && w === 'prev'
								? a.substr(0, u.length)
								: O < 0
									? null
									: a.substr(0, O) + h[O] + u.substr(O + 1)
					}
					function di(a, o, u, h) {
						var p,
							w,
							k,
							O,
							D,
							B,
							W,
							H = u.length
						if (
							!u.every(function (V) {
								return typeof V == 'string'
							})
						)
							return Cr(a, Rr)
						function J(V) {
							;((p = tu(V)), (w = ru(V)), (k = V === 'next' ? fo : co))
							var ne = u
								.map(function (te) {
									return {lower: w(te), upper: p(te)}
								})
								.sort(function (te, pe) {
									return k(te.lower, pe.lower)
								})
							;((O = ne.map(function (te) {
								return te.upper
							})),
								(D = ne.map(function (te) {
									return te.lower
								})),
								(B = V),
								(W = V === 'next' ? '' : h))
						}
						J('next')
						var le = new a.Collection(a, function () {
							return bn(O[0], D[H - 1] + h)
						})
						le._ondirectionchange = function (V) {
							J(V)
						}
						var K = 0
						return (
							le._addAlgorithm(function (V, ne, te) {
								var pe = V.key
								if (typeof pe != 'string') return !1
								var ce = w(pe)
								if (o(ce, D, K)) return !0
								for (var ae = null, fe = K; fe < H; ++fe) {
									var Be = ws(pe, ce, O[fe], D[fe], k, B)
									Be === null && ae === null
										? (K = fe + 1)
										: (ae === null || k(ae, Be) > 0) && (ae = Be)
								}
								return (
									ne(
										ae !== null
											? function () {
													V.continue(ae + W)
												}
											: te,
									),
									!1
								)
							}),
							le
						)
					}
					function bn(a, o, u, h) {
						return {type: 2, lower: a, upper: o, lowerOpen: u, upperOpen: h}
					}
					function ka(a) {
						return {type: 1, lower: a, upper: a}
					}
					var ho = (function () {
						function a() {}
						return (
							Object.defineProperty(a.prototype, 'Collection', {
								get: function () {
									return this._ctx.table.db.Collection
								},
								enumerable: !1,
								configurable: !0,
							}),
							(a.prototype.between = function (o, u, h, p) {
								;((h = h !== !1), (p = p === !0))
								try {
									return this._cmp(o, u) > 0 ||
										(this._cmp(o, u) === 0 && (h || p) && !(h && p))
										? Vn(this)
										: new this.Collection(this, function () {
												return bn(o, u, !h, !p)
											})
								} catch {
									return Cr(this, Ot)
								}
							}),
							(a.prototype.equals = function (o) {
								return o == null
									? Cr(this, Ot)
									: new this.Collection(this, function () {
											return ka(o)
										})
							}),
							(a.prototype.above = function (o) {
								return o == null
									? Cr(this, Ot)
									: new this.Collection(this, function () {
											return bn(o, void 0, !0)
										})
							}),
							(a.prototype.aboveOrEqual = function (o) {
								return o == null
									? Cr(this, Ot)
									: new this.Collection(this, function () {
											return bn(o, void 0, !1)
										})
							}),
							(a.prototype.below = function (o) {
								return o == null
									? Cr(this, Ot)
									: new this.Collection(this, function () {
											return bn(void 0, o, !1, !0)
										})
							}),
							(a.prototype.belowOrEqual = function (o) {
								return o == null
									? Cr(this, Ot)
									: new this.Collection(this, function () {
											return bn(void 0, o)
										})
							}),
							(a.prototype.startsWith = function (o) {
								return typeof o != 'string'
									? Cr(this, Rr)
									: this.between(o, o + Ut, !0, !0)
							}),
							(a.prototype.startsWithIgnoreCase = function (o) {
								return o === ''
									? this.startsWith(o)
									: di(
											this,
											function (u, h) {
												return u.indexOf(h[0]) === 0
											},
											[o],
											Ut,
										)
							}),
							(a.prototype.equalsIgnoreCase = function (o) {
								return di(
									this,
									function (u, h) {
										return u === h[0]
									},
									[o],
									'',
								)
							}),
							(a.prototype.anyOfIgnoreCase = function () {
								var o = P.apply(Je, arguments)
								return o.length === 0
									? Vn(this)
									: di(
											this,
											function (u, h) {
												return h.indexOf(u) !== -1
											},
											o,
											'',
										)
							}),
							(a.prototype.startsWithAnyOfIgnoreCase = function () {
								var o = P.apply(Je, arguments)
								return o.length === 0
									? Vn(this)
									: di(
											this,
											function (u, h) {
												return h.some(function (p) {
													return u.indexOf(p) === 0
												})
											},
											o,
											Ut,
										)
							}),
							(a.prototype.anyOf = function () {
								var o = this,
									u = P.apply(Je, arguments),
									h = this._cmp
								try {
									u.sort(h)
								} catch {
									return Cr(this, Ot)
								}
								if (u.length === 0) return Vn(this)
								var p = new this.Collection(this, function () {
									return bn(u[0], u[u.length - 1])
								})
								p._ondirectionchange = function (k) {
									;((h = k === 'next' ? o._ascending : o._descending),
										u.sort(h))
								}
								var w = 0
								return (
									p._addAlgorithm(function (k, O, D) {
										for (var B = k.key; h(B, u[w]) > 0;)
											if ((++w, w === u.length)) return (O(D), !1)
										return h(B, u[w]) === 0
											? !0
											: (O(function () {
													k.continue(u[w])
												}),
												!1)
									}),
									p
								)
							}),
							(a.prototype.notEqual = function (o) {
								return this.inAnyRange(
									[
										[Nt, o],
										[o, this.db._maxKey],
									],
									{includeLowers: !1, includeUppers: !1},
								)
							}),
							(a.prototype.noneOf = function () {
								var o = P.apply(Je, arguments)
								if (o.length === 0) return new this.Collection(this)
								try {
									o.sort(this._ascending)
								} catch {
									return Cr(this, Ot)
								}
								var u = o.reduce(function (h, p) {
									return h ? h.concat([[h[h.length - 1][1], p]]) : [[Nt, p]]
								}, null)
								return (
									u.push([o[o.length - 1], this.db._maxKey]),
									this.inAnyRange(u, {includeLowers: !1, includeUppers: !1})
								)
							}),
							(a.prototype.inAnyRange = function (o, u) {
								var h = this,
									p = this._cmp,
									w = this._ascending,
									k = this._descending,
									O = this._min,
									D = this._max
								if (o.length === 0) return Vn(this)
								if (
									!o.every(function (fe) {
										return (
											fe[0] !== void 0 &&
											fe[1] !== void 0 &&
											w(fe[0], fe[1]) <= 0
										)
									})
								)
									return Cr(
										this,
										'First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower',
										Oe.InvalidArgument,
									)
								var B = !u || u.includeLowers !== !1,
									W = u && u.includeUppers === !0
								function H(fe, Be) {
									for (var Re = 0, Ce = fe.length; Re < Ce; ++Re) {
										var Ke = fe[Re]
										if (p(Be[0], Ke[1]) < 0 && p(Be[1], Ke[0]) > 0) {
											;((Ke[0] = O(Ke[0], Be[0])), (Ke[1] = D(Ke[1], Be[1])))
											break
										}
									}
									return (Re === Ce && fe.push(Be), fe)
								}
								var J = w
								function le(fe, Be) {
									return J(fe[0], Be[0])
								}
								var K
								try {
									;((K = o.reduce(H, [])), K.sort(le))
								} catch {
									return Cr(this, Ot)
								}
								var V = 0,
									ne = W
										? function (fe) {
												return w(fe, K[V][1]) > 0
											}
										: function (fe) {
												return w(fe, K[V][1]) >= 0
											},
									te = B
										? function (fe) {
												return k(fe, K[V][0]) > 0
											}
										: function (fe) {
												return k(fe, K[V][0]) >= 0
											}
								function pe(fe) {
									return !ne(fe) && !te(fe)
								}
								var ce = ne,
									ae = new this.Collection(this, function () {
										return bn(K[0][0], K[K.length - 1][1], !B, !W)
									})
								return (
									(ae._ondirectionchange = function (fe) {
										;(fe === 'next'
											? ((ce = ne), (J = w))
											: ((ce = te), (J = k)),
											K.sort(le))
									}),
									ae._addAlgorithm(function (fe, Be, Re) {
										for (var Ce = fe.key; ce(Ce);)
											if ((++V, V === K.length)) return (Be(Re), !1)
										return pe(Ce)
											? !0
											: (h._cmp(Ce, K[V][1]) === 0 ||
													h._cmp(Ce, K[V][0]) === 0 ||
													Be(function () {
														J === w
															? fe.continue(K[V][0])
															: fe.continue(K[V][1])
													}),
												!1)
									}),
									ae
								)
							}),
							(a.prototype.startsWithAnyOf = function () {
								var o = P.apply(Je, arguments)
								return o.every(function (u) {
									return typeof u == 'string'
								})
									? o.length === 0
										? Vn(this)
										: this.inAnyRange(
												o.map(function (u) {
													return [u, u + Ut]
												}),
											)
									: Cr(this, 'startsWithAnyOf() only works with strings')
							}),
							a
						)
					})()
					function nu(a) {
						return ci(ho.prototype, function (u, h, p) {
							if (
								((this.db = a),
								(this._ctx = {table: u, index: h === ':id' ? null : h, or: p}),
								(this._cmp = this._ascending = He),
								(this._descending = function (w, k) {
									return He(k, w)
								}),
								(this._max = function (w, k) {
									return He(w, k) > 0 ? w : k
								}),
								(this._min = function (w, k) {
									return He(w, k) < 0 ? w : k
								}),
								(this._IDBKeyRange = a._deps.IDBKeyRange),
								!this._IDBKeyRange)
							)
								throw new Oe.MissingAPI()
						})
					}
					function Jr(a) {
						return Dt(function (o) {
							return (ji(o), a(o.target.error), !1)
						})
					}
					function ji(a) {
						;(a.stopPropagation && a.stopPropagation(),
							a.preventDefault && a.preventDefault())
					}
					var Ui = 'storagemutated',
						vo = 'x-storagemutated-1',
						rn = Mi(null, Ui),
						Ss = (function () {
							function a() {}
							return (
								(a.prototype._lock = function () {
									return (
										ee(!ke.global),
										++this._reculock,
										this._reculock === 1 &&
											!ke.global &&
											(ke.lockOwnerFor = this),
										this
									)
								}),
								(a.prototype._unlock = function () {
									if ((ee(!ke.global), --this._reculock === 0))
										for (
											ke.global || (ke.lockOwnerFor = null);
											this._blockedFuncs.length > 0 && !this._locked();
										) {
											var o = this._blockedFuncs.shift()
											try {
												Fe(o[1], o[0])
											} catch {}
										}
									return this
								}),
								(a.prototype._locked = function () {
									return this._reculock && ke.lockOwnerFor !== this
								}),
								(a.prototype.create = function (o) {
									var u = this
									if (!this.mode) return this
									var h = this.db.idbdb,
										p = this.db._state.dbOpenError
									if ((ee(!this.idbtrans), !o && !h))
										switch (p && p.name) {
											case 'DatabaseClosedError':
												throw new Oe.DatabaseClosed(p)
											case 'MissingAPIError':
												throw new Oe.MissingAPI(p.message, p)
											default:
												throw new Oe.OpenFailed(p)
										}
									if (!this.active) throw new Oe.TransactionInactive()
									return (
										ee(this._completion._state === null),
										(o = this.idbtrans =
											o ||
											(this.db.core
												? this.db.core.transaction(this.storeNames, this.mode, {
														durability: this.chromeTransactionDurability,
													})
												: h.transaction(this.storeNames, this.mode, {
														durability: this.chromeTransactionDurability,
													}))),
										(o.onerror = Dt(function (w) {
											;(ji(w), u._reject(o.error))
										})),
										(o.onabort = Dt(function (w) {
											;(ji(w),
												u.active && u._reject(new Oe.Abort(o.error)),
												(u.active = !1),
												u.on('abort').fire(w))
										})),
										(o.oncomplete = Dt(function () {
											;((u.active = !1),
												u._resolve(),
												'mutatedParts' in o &&
													rn.storagemutated.fire(o.mutatedParts))
										})),
										this
									)
								}),
								(a.prototype._promise = function (o, u, h) {
									var p = this
									if (o === 'readwrite' && this.mode !== 'readwrite')
										return yt(new Oe.ReadOnly('Transaction is readonly'))
									if (!this.active) return yt(new Oe.TransactionInactive())
									if (this._locked())
										return new Se(function (k, O) {
											p._blockedFuncs.push([
												function () {
													p._promise(o, u, h).then(k, O)
												},
												ke,
											])
										})
									if (h)
										return Mn(function () {
											var k = new Se(function (O, D) {
												p._lock()
												var B = u(O, D, p)
												B && B.then && B.then(O, D)
											})
											return (
												k.finally(function () {
													return p._unlock()
												}),
												(k._lib = !0),
												k
											)
										})
									var w = new Se(function (k, O) {
										var D = u(k, O, p)
										D && D.then && D.then(k, O)
									})
									return ((w._lib = !0), w)
								}),
								(a.prototype._root = function () {
									return this.parent ? this.parent._root() : this
								}),
								(a.prototype.waitFor = function (o) {
									var u = this._root(),
										h = Se.resolve(o)
									if (u._waitingFor)
										u._waitingFor = u._waitingFor.then(function () {
											return h
										})
									else {
										;((u._waitingFor = h), (u._waitingQueue = []))
										var p = u.idbtrans.objectStore(u.storeNames[0])
										;(function k() {
											for (++u._spinCount; u._waitingQueue.length;)
												u._waitingQueue.shift()()
											u._waitingFor && (p.get(-1 / 0).onsuccess = k)
										})()
									}
									var w = u._waitingFor
									return new Se(function (k, O) {
										h.then(
											function (D) {
												return u._waitingQueue.push(Dt(k.bind(null, D)))
											},
											function (D) {
												return u._waitingQueue.push(Dt(O.bind(null, D)))
											},
										).finally(function () {
											u._waitingFor === w && (u._waitingFor = null)
										})
									})
								}),
								(a.prototype.abort = function () {
									this.active &&
										((this.active = !1),
										this.idbtrans && this.idbtrans.abort(),
										this._reject(new Oe.Abort()))
								}),
								(a.prototype.table = function (o) {
									var u = this._memoizedTables || (this._memoizedTables = {})
									if (v(u, o)) return u[o]
									var h = this.schema[o]
									if (!h)
										throw new Oe.NotFound(
											'Table ' + o + ' not part of transaction',
										)
									var p = new this.db.Table(o, h, this)
									return ((p.core = this.db.core.table(o)), (u[o] = p), p)
								}),
								a
							)
						})()
					function po(a) {
						return ci(Ss.prototype, function (u, h, p, w, k) {
							var O = this
							;(u !== 'readonly' &&
								h.forEach(function (D) {
									var B,
										W = (B = p[D]) === null || B === void 0 ? void 0 : B.yProps
									W &&
										(h = h.concat(
											W.map(function (H) {
												return H.updatesTable
											}),
										))
								}),
								(this.db = a),
								(this.mode = u),
								(this.storeNames = h),
								(this.schema = p),
								(this.chromeTransactionDurability = w),
								(this.idbtrans = null),
								(this.on = Mi(this, 'complete', 'error', 'abort')),
								(this.parent = k || null),
								(this.active = !0),
								(this._reculock = 0),
								(this._blockedFuncs = []),
								(this._resolve = null),
								(this._reject = null),
								(this._waitingFor = null),
								(this._waitingQueue = null),
								(this._spinCount = 0),
								(this._completion = new Se(function (D, B) {
									;((O._resolve = D), (O._reject = B))
								})),
								this._completion.then(
									function () {
										;((O.active = !1), O.on.complete.fire())
									},
									function (D) {
										var B = O.active
										return (
											(O.active = !1),
											O.on.error.fire(D),
											O.parent
												? O.parent._reject(D)
												: B && O.idbtrans && O.idbtrans.abort(),
											yt(D)
										)
									},
								))
						})
					}
					function zi(a, o, u, h, p, w, k, O) {
						return {
							name: a,
							keyPath: o,
							unique: u,
							multi: h,
							auto: p,
							compound: w,
							src:
								(u && !k ? '&' : '') + (h ? '*' : '') + (p ? '++' : '') + go(o),
							type: O,
						}
					}
					function go(a) {
						return typeof a == 'string'
							? a
							: a
								? '[' + [].join.call(a, '+') + ']'
								: ''
					}
					function _o(a, o, u) {
						return {
							name: a,
							primKey: o,
							indexes: u,
							mappedClass: null,
							idxByName: ve(u, function (h) {
								return [h.name, h]
							}),
						}
					}
					function iu(a) {
						return a.length === 1 ? a[0] : a
					}
					var qi = function (a) {
						try {
							return (
								a.only([[]]),
								(qi = function () {
									return [[]]
								}),
								[[]]
							)
						} catch {
							return (
								(qi = function () {
									return Ut
								}),
								Ut
							)
						}
					}
					function xa(a) {
						return a == null
							? function () {}
							: typeof a == 'string'
								? Es(a)
								: function (o) {
										return ge(o, a)
									}
					}
					function Es(a) {
						var o = a.split('.')
						return o.length === 1
							? function (u) {
									return u[a]
								}
							: function (u) {
									return ge(u, a)
								}
					}
					function ks(a) {
						return [].slice.call(a)
					}
					var rt = 0
					function zt(a) {
						return a == null
							? ':id'
							: typeof a == 'string'
								? a
								: '['.concat(a.join('+'), ']')
					}
					function _r(a, o, u) {
						function h(J, le) {
							var K = ks(J.objectStoreNames),
								V = K.length > 0 ? le.objectStore(K[0]) : {}
							return {
								schema: {
									name: J.name,
									tables: K.map(function (ne) {
										return le.objectStore(ne)
									}).map(function (ne) {
										var te = ne.keyPath,
											pe = ne.autoIncrement,
											ce = c(te),
											ae = te == null,
											fe = {},
											Be = {
												name: ne.name,
												primaryKey: {
													name: null,
													isPrimaryKey: !0,
													outbound: ae,
													compound: ce,
													keyPath: te,
													autoIncrement: pe,
													unique: !0,
													extractKey: xa(te),
												},
												indexes: ks(ne.indexNames)
													.map(function (Re) {
														return ne.index(Re)
													})
													.map(function (Re) {
														var Ce = Re.name,
															Ke = Re.unique,
															mt = Re.multiEntry,
															Ye = Re.keyPath,
															We = c(Ye),
															nt = {
																name: Ce,
																compound: We,
																keyPath: Ye,
																unique: Ke,
																multiEntry: mt,
																extractKey: xa(Ye),
															}
														return ((fe[zt(Ye)] = nt), nt)
													}),
												getIndexByKeyPath: function (Re) {
													return fe[zt(Re)]
												},
											}
										return (
											(fe[':id'] = Be.primaryKey),
											te != null && (fe[zt(te)] = Be.primaryKey),
											Be
										)
									}),
								},
								hasGetAll:
									K.length > 0 &&
									'getAll' in V &&
									!(
										typeof navigator < 'u' &&
										/Safari/.test(navigator.userAgent) &&
										!/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
										[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] <
											604
									),
								hasIdb3Features: 'getAllRecords' in V,
							}
						}
						function p(J) {
							if (J.type === 3) return null
							if (J.type === 4)
								throw new Error('Cannot convert never type to IDBKeyRange')
							var le = J.lower,
								K = J.upper,
								V = J.lowerOpen,
								ne = J.upperOpen,
								te =
									le === void 0
										? K === void 0
											? null
											: o.upperBound(K, !!ne)
										: K === void 0
											? o.lowerBound(le, !!V)
											: o.bound(le, K, !!V, !!ne)
							return te
						}
						function w(J) {
							var le = J.name
							function K(te) {
								var pe = te.trans,
									ce = te.type,
									ae = te.keys,
									fe = te.values,
									Be = te.range
								return new Promise(function (Re, Ce) {
									Re = Dt(Re)
									var Ke = pe.objectStore(le),
										mt = Ke.keyPath == null,
										Ye = ce === 'put' || ce === 'add'
									if (!Ye && ce !== 'delete' && ce !== 'deleteRange')
										throw new Error('Invalid operation type: ' + ce)
									var We = (ae || fe || {length: 1}).length
									if (ae && fe && ae.length !== fe.length)
										throw new Error(
											'Given keys array must have same length as given values array.',
										)
									if (We === 0)
										return Re({
											numFailures: 0,
											failures: {},
											results: [],
											lastResult: void 0,
										})
									var nt,
										at = [],
										Bt = [],
										Xe = 0,
										ir = function (mr) {
											;(++Xe, ji(mr))
										}
									if (ce === 'deleteRange') {
										if (Be.type === 4)
											return Re({
												numFailures: Xe,
												failures: Bt,
												results: [],
												lastResult: void 0,
											})
										Be.type === 3
											? at.push((nt = Ke.clear()))
											: at.push((nt = Ke.delete(p(Be))))
									} else {
										var nn = Ye ? (mt ? [fe, ae] : [fe, null]) : [ae, null],
											Mr = nn[0],
											Gi = nn[1]
										if (Ye)
											for (var Dr = 0; Dr < We; ++Dr)
												(at.push(
													(nt =
														Gi && Gi[Dr] !== void 0
															? Ke[ce](Mr[Dr], Gi[Dr])
															: Ke[ce](Mr[Dr])),
												),
													(nt.onerror = ir))
										else
											for (var Dr = 0; Dr < We; ++Dr)
												(at.push((nt = Ke[ce](Mr[Dr]))), (nt.onerror = ir))
									}
									var an = function (mr) {
										var Hi = mr.target.result
										;(at.forEach(function (Sn, Ns) {
											return Sn.error != null && (Bt[Ns] = Sn.error)
										}),
											Re({
												numFailures: Xe,
												failures: Bt,
												results:
													ce === 'delete'
														? ae
														: at.map(function (Sn) {
																return Sn.result
															}),
												lastResult: Hi,
											}))
									}
									;((nt.onerror = function (mr) {
										;(ir(mr), an(mr))
									}),
										(nt.onsuccess = an))
								})
							}
							function V(te) {
								var pe = te.trans,
									ce = te.values,
									ae = te.query,
									fe = te.reverse,
									Be = te.unique
								return new Promise(function (Re, Ce) {
									Re = Dt(Re)
									var Ke = ae.index,
										mt = ae.range,
										Ye = pe.objectStore(le),
										We = Ke.isPrimaryKey ? Ye : Ye.index(Ke.name),
										nt = fe
											? Be
												? 'prevunique'
												: 'prev'
											: Be
												? 'nextunique'
												: 'next',
										at =
											ce || !('openKeyCursor' in We)
												? We.openCursor(p(mt), nt)
												: We.openKeyCursor(p(mt), nt)
									;((at.onerror = Jr(Ce)),
										(at.onsuccess = Dt(function (Bt) {
											var Xe = at.result
											if (!Xe) {
												Re(null)
												return
											}
											;((Xe.___id = ++rt), (Xe.done = !1))
											var ir = Xe.continue.bind(Xe),
												nn = Xe.continuePrimaryKey
											nn && (nn = nn.bind(Xe))
											var Mr = Xe.advance.bind(Xe),
												Gi = function () {
													throw new Error('Cursor not started')
												},
												Dr = function () {
													throw new Error('Cursor not stopped')
												}
											;((Xe.trans = pe),
												(Xe.stop =
													Xe.continue =
													Xe.continuePrimaryKey =
													Xe.advance =
														Gi),
												(Xe.fail = Dt(Ce)),
												(Xe.next = function () {
													var an = this,
														mr = 1
													return this.start(function () {
														return mr-- ? an.continue() : an.stop()
													}).then(function () {
														return an
													})
												}),
												(Xe.start = function (an) {
													var mr = new Promise(function (Sn, Ns) {
															;((Sn = Dt(Sn)),
																(at.onerror = Jr(Ns)),
																(Xe.fail = Ns),
																(Xe.stop = function (um) {
																	;((Xe.stop =
																		Xe.continue =
																		Xe.continuePrimaryKey =
																		Xe.advance =
																			Dr),
																		Sn(um))
																}))
														}),
														Hi = function () {
															if (at.result)
																try {
																	an()
																} catch (Sn) {
																	Xe.fail(Sn)
																}
															else
																((Xe.done = !0),
																	(Xe.start = function () {
																		throw new Error('Cursor behind last entry')
																	}),
																	Xe.stop())
														}
													return (
														(at.onsuccess = Dt(function (Sn) {
															;((at.onsuccess = Hi), Hi())
														})),
														(Xe.continue = ir),
														(Xe.continuePrimaryKey = nn),
														(Xe.advance = Mr),
														Hi(),
														mr
													)
												}),
												Re(Xe))
										}, Ce)))
								})
							}
							function ne(te, pe) {
								return function (ce) {
									return new Promise(function (ae, fe) {
										var Be
										ae = Dt(ae)
										var Re = ce.trans,
											Ce = ce.values,
											Ke = ce.limit,
											mt = ce.query,
											Ye =
												(Be = ce.direction) !== null && Be !== void 0
													? Be
													: 'next',
											We = Ke === 1 / 0 ? void 0 : Ke,
											nt = mt.index,
											at = mt.range,
											Bt = Re.objectStore(le),
											Xe = nt.isPrimaryKey ? Bt : Bt.index(nt.name),
											ir = p(at)
										if (Ke === 0) return ae({result: []})
										if (pe) {
											var nn = {query: ir, count: We, direction: Ye},
												Mr = Ce ? Xe.getAll(nn) : Xe.getAllKeys(nn)
											;((Mr.onsuccess = function (mr) {
												return ae({result: mr.target.result})
											}),
												(Mr.onerror = Jr(fe)))
										} else if (te && Ye === 'next') {
											var Mr = Ce ? Xe.getAll(ir, We) : Xe.getAllKeys(ir, We)
											;((Mr.onsuccess = function (Hi) {
												return ae({result: Hi.target.result})
											}),
												(Mr.onerror = Jr(fe)))
										} else {
											var Gi = 0,
												Dr =
													Ce || !('openKeyCursor' in Xe)
														? Xe.openCursor(ir, Ye)
														: Xe.openKeyCursor(ir, Ye),
												an = []
											;((Dr.onsuccess = function () {
												var mr = Dr.result
												if (!mr) return ae({result: an})
												if (
													(an.push(Ce ? mr.value : mr.primaryKey), ++Gi === Ke)
												)
													return ae({result: an})
												mr.continue()
											}),
												(Dr.onerror = Jr(fe)))
										}
									})
								}
							}
							return {
								name: le,
								schema: J,
								mutate: K,
								getMany: function (te) {
									var pe = te.trans,
										ce = te.keys
									return new Promise(function (ae, fe) {
										ae = Dt(ae)
										for (
											var Be = pe.objectStore(le),
												Re = ce.length,
												Ce = new Array(Re),
												Ke = 0,
												mt = 0,
												Ye,
												We = function (Xe) {
													var ir = Xe.target
													;((Ce[ir._pos] = ir.result) != null,
														++mt === Ke && ae(Ce))
												},
												nt = Jr(fe),
												at = 0;
											at < Re;
											++at
										) {
											var Bt = ce[at]
											Bt != null &&
												((Ye = Be.get(ce[at])),
												(Ye._pos = at),
												(Ye.onsuccess = We),
												(Ye.onerror = nt),
												++Ke)
										}
										Ke === 0 && ae(Ce)
									})
								},
								get: function (te) {
									var pe = te.trans,
										ce = te.key
									return new Promise(function (ae, fe) {
										ae = Dt(ae)
										var Be = pe.objectStore(le),
											Re = Be.get(ce)
										;((Re.onsuccess = function (Ce) {
											return ae(Ce.target.result)
										}),
											(Re.onerror = Jr(fe)))
									})
								},
								query: ne(D, B),
								openCursor: V,
								count: function (te) {
									var pe = te.query,
										ce = te.trans,
										ae = pe.index,
										fe = pe.range
									return new Promise(function (Be, Re) {
										var Ce = ce.objectStore(le),
											Ke = ae.isPrimaryKey ? Ce : Ce.index(ae.name),
											mt = p(fe),
											Ye = mt ? Ke.count(mt) : Ke.count()
										;((Ye.onsuccess = Dt(function (We) {
											return Be(We.target.result)
										})),
											(Ye.onerror = Jr(Re)))
									})
								},
							}
						}
						var k = h(a, u),
							O = k.schema,
							D = k.hasGetAll,
							B = k.hasIdb3Features,
							W = O.tables.map(function (J) {
								return w(J)
							}),
							H = {}
						return (
							W.forEach(function (J) {
								return (H[J.name] = J)
							}),
							{
								stack: 'dbcore',
								transaction: a.transaction.bind(a),
								table: function (J) {
									var le = H[J]
									if (!le) throw new Error("Table '".concat(J, "' not found"))
									return H[J]
								},
								MIN_KEY: -1 / 0,
								MAX_KEY: qi(o),
								schema: O,
							}
						)
					}
					function Zn(a, o) {
						return o.reduce(function (u, h) {
							var p = h.create
							return i(i({}, u), p(u))
						}, a)
					}
					function wn(a, o, u, h) {
						var p = u.IDBKeyRange
						u.indexedDB
						var w = Zn(_r(o, p, h), a.dbcore)
						return {dbcore: w}
					}
					function xs(a, o) {
						var u = o.db,
							h = wn(a._middlewares, u, a._deps, o)
						;((a.core = h.dbcore),
							a.tables.forEach(function (p) {
								var w = p.name
								a.core.schema.tables.some(function (k) {
									return k.name === w
								}) &&
									((p.core = a.core.table(w)),
									a[w] instanceof a.Table && (a[w].core = p.core))
							}))
					}
					function As(a, o, u, h) {
						u.forEach(function (p) {
							var w = h[p]
							o.forEach(function (k) {
								var O = A(k, p)
								;(!O || ('value' in O && O.value === void 0)) &&
									(k === a.Transaction.prototype || k instanceof a.Transaction
										? x(k, p, {
												get: function () {
													return this.table(p)
												},
												set: function (D) {
													S(this, p, {
														value: D,
														writable: !0,
														configurable: !0,
														enumerable: !0,
													})
												},
											})
										: (k[p] = new a.Table(p, w)))
							})
						})
					}
					function au(a, o) {
						o.forEach(function (u) {
							for (var h in u) u[h] instanceof a.Table && delete u[h]
						})
					}
					function k_(a, o) {
						return a._cfg.version - o._cfg.version
					}
					function x_(a, o, u, h) {
						var p = a._dbSchema
						u.objectStoreNames.contains('$meta') &&
							!p.$meta &&
							((p.$meta = _o('$meta', Wc('')[0], [])),
							a._storeNames.push('$meta'))
						var w = a._createTransaction('readwrite', a._storeNames, p)
						;(w.create(u), w._completion.catch(h))
						var k = w._reject.bind(w),
							O = ke.transless || ke
						Mn(function () {
							if (((ke.trans = w), (ke.transless = O), o === 0))
								(f(p).forEach(function (D) {
									su(u, D, p[D].primKey, p[D].indexes)
								}),
									xs(a, u),
									Se.follow(function () {
										return a.on.populate.fire(w)
									}).catch(k))
							else
								return (
									xs(a, u),
									T_(a, w, o)
										.then(function (D) {
											return I_(a, D, w, u)
										})
										.catch(k)
								)
						})
					}
					function A_(a, o) {
						;(Kc(a._dbSchema, o),
							o.db.version % 10 === 0 &&
								!o.objectStoreNames.contains('$meta') &&
								o.db
									.createObjectStore('$meta')
									.add(Math.ceil(o.db.version / 10 - 1), 'version'))
						var u = Is(a, a.idbdb, o)
						Rs(a, a._dbSchema, o)
						for (
							var h = ou(u, a._dbSchema),
								p = function (B) {
									if (B.change.length || B.recreate)
										return (
											console.warn(
												'Unable to patch indexes of table '.concat(
													B.name,
													' because it has changes on the type of index or primary key.',
												),
											),
											{value: void 0}
										)
									var W = o.objectStore(B.name)
									B.add.forEach(function (H) {
										;(se &&
											console.debug(
												'Dexie upgrade patch: Creating missing index '
													.concat(B.name, '.')
													.concat(H.src),
											),
											Ts(W, H))
									})
								},
								w = 0,
								k = h.change;
							w < k.length;
							w++
						) {
							var O = k[w],
								D = p(O)
							if (typeof D == 'object') return D.value
						}
					}
					function T_(a, o, u) {
						return o.storeNames.includes('$meta')
							? o
									.table('$meta')
									.get('version')
									.then(function (h) {
										return h ?? u
									})
							: Se.resolve(u)
					}
					function I_(a, o, u, h) {
						var p = [],
							w = a._versions,
							k = (a._dbSchema = Is(a, a.idbdb, h)),
							O = w.filter(function (B) {
								return B._cfg.version >= o
							})
						if (O.length === 0) return Se.resolve()
						O.forEach(function (B) {
							;(p.push(function () {
								var W = k,
									H = B._cfg.dbschema
								;(Rs(a, W, h), Rs(a, H, h), (k = a._dbSchema = H))
								var J = ou(W, H)
								;(J.add.forEach(function (pe) {
									su(h, pe[0], pe[1].primKey, pe[1].indexes)
								}),
									J.change.forEach(function (pe) {
										if (pe.recreate)
											throw new Oe.Upgrade(
												'Not yet support for changing primary key',
											)
										var ce = h.objectStore(pe.name)
										;(pe.add.forEach(function (ae) {
											return Ts(ce, ae)
										}),
											pe.change.forEach(function (ae) {
												;(ce.deleteIndex(ae.name), Ts(ce, ae))
											}),
											pe.del.forEach(function (ae) {
												return ce.deleteIndex(ae)
											}))
									}))
								var le = B._cfg.contentUpgrade
								if (le && B._cfg.version > o) {
									;(xs(a, h), (u._memoizedTables = {}))
									var K = je(H)
									;(J.del.forEach(function (pe) {
										K[pe] = W[pe]
									}),
										au(a, [a.Transaction.prototype]),
										As(a, [a.Transaction.prototype], f(K), K),
										(u.schema = K))
									var V = M(le)
									V && fi()
									var ne,
										te = Se.follow(function () {
											if (((ne = le(u)), ne && V)) {
												var pe = _n.bind(null, null)
												ne.then(pe, pe)
											}
										})
									return ne && typeof ne.then == 'function'
										? Se.resolve(ne)
										: te.then(function () {
												return ne
											})
								}
							}),
								p.push(function (W) {
									var H = B._cfg.dbschema
									;(R_(H, W),
										au(a, [a.Transaction.prototype]),
										As(
											a,
											[a.Transaction.prototype],
											a._storeNames,
											a._dbSchema,
										),
										(u.schema = a._dbSchema))
								}),
								p.push(function (W) {
									a.idbdb.objectStoreNames.contains('$meta') &&
										(Math.ceil(a.idbdb.version / 10) === B._cfg.version
											? (a.idbdb.deleteObjectStore('$meta'),
												delete a._dbSchema.$meta,
												(a._storeNames = a._storeNames.filter(function (H) {
													return H !== '$meta'
												})))
											: W.objectStore('$meta').put(B._cfg.version, 'version'))
								}))
						})
						function D() {
							return p.length
								? Se.resolve(p.shift()(u.idbtrans)).then(D)
								: Se.resolve()
						}
						return D().then(function () {
							Kc(k, h)
						})
					}
					function ou(a, o) {
						var u = {del: [], add: [], change: []},
							h
						for (h in a) o[h] || u.del.push(h)
						for (h in o) {
							var p = a[h],
								w = o[h]
							if (!p) u.add.push([h, w])
							else {
								var k = {
									name: h,
									def: w,
									recreate: !1,
									del: [],
									add: [],
									change: [],
								}
								if (
									'' + (p.primKey.keyPath || '') !=
										'' + (w.primKey.keyPath || '') ||
									p.primKey.auto !== w.primKey.auto
								)
									((k.recreate = !0), u.change.push(k))
								else {
									var O = p.idxByName,
										D = w.idxByName,
										B = void 0
									for (B in O) D[B] || k.del.push(B)
									for (B in D) {
										var W = O[B],
											H = D[B]
										W ? W.src !== H.src && k.change.push(H) : k.add.push(H)
									}
									;(k.del.length > 0 ||
										k.add.length > 0 ||
										k.change.length > 0) &&
										u.change.push(k)
								}
							}
						}
						return u
					}
					function su(a, o, u, h) {
						var p = a.db.createObjectStore(
							o,
							u.keyPath
								? {keyPath: u.keyPath, autoIncrement: u.auto}
								: {autoIncrement: u.auto},
						)
						return (
							h.forEach(function (w) {
								return Ts(p, w)
							}),
							p
						)
					}
					function Kc(a, o) {
						f(a).forEach(function (u) {
							o.db.objectStoreNames.contains(u) ||
								(se && console.debug('Dexie: Creating missing table', u),
								su(o, u, a[u].primKey, a[u].indexes))
						})
					}
					function R_(a, o) {
						;[].slice.call(o.db.objectStoreNames).forEach(function (u) {
							return a[u] == null && o.db.deleteObjectStore(u)
						})
					}
					function Ts(a, o) {
						a.createIndex(o.name, o.keyPath, {
							unique: o.unique,
							multiEntry: o.multi,
						})
					}
					function Is(a, o, u) {
						var h = {},
							p = N(o.objectStoreNames, 0)
						return (
							p.forEach(function (w) {
								for (
									var k = u.objectStore(w),
										O = k.keyPath,
										D = zi(
											go(O),
											O || '',
											!0,
											!1,
											!!k.autoIncrement,
											O && typeof O != 'string',
											!0,
										),
										B = [],
										W = 0;
									W < k.indexNames.length;
									++W
								) {
									var H = k.index(k.indexNames[W])
									O = H.keyPath
									var J = zi(
										H.name,
										O,
										!!H.unique,
										!!H.multiEntry,
										!1,
										O && typeof O != 'string',
										!1,
									)
									B.push(J)
								}
								h[w] = _o(w, D, B)
							}),
							h
						)
					}
					function C_(a, o, u) {
						a.verno = o.version / 10
						var h = (a._dbSchema = Is(a, o, u))
						;((a._storeNames = N(o.objectStoreNames, 0)),
							As(a, [a._allTables], f(h), h))
					}
					function O_(a, o) {
						var u = Is(a, a.idbdb, o),
							h = ou(u, a._dbSchema)
						return !(
							h.add.length ||
							h.change.some(function (p) {
								return p.add.length || p.change.length
							})
						)
					}
					function Rs(a, o, u) {
						for (var h = u.db.objectStoreNames, p = 0; p < h.length; ++p) {
							var w = h[p],
								k = u.objectStore(w)
							a._hasGetAll = 'getAll' in k
							for (var O = 0; O < k.indexNames.length; ++O) {
								var D = k.indexNames[O],
									B = k.index(D).keyPath,
									W = typeof B == 'string' ? B : '[' + N(B).join('+') + ']'
								if (o[w]) {
									var H = o[w].idxByName[W]
									H &&
										((H.name = D),
										delete o[w].idxByName[W],
										(o[w].idxByName[D] = H))
								}
							}
						}
						typeof navigator < 'u' &&
							/Safari/.test(navigator.userAgent) &&
							!/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
							l.WorkerGlobalScope &&
							l instanceof l.WorkerGlobalScope &&
							[].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 &&
							(a._hasGetAll = !1)
					}
					function Wc(a) {
						return a.split(',').map(function (o, u) {
							var h,
								p = o.split(':'),
								w = (h = p[1]) === null || h === void 0 ? void 0 : h.trim()
							o = p[0].trim()
							var k = o.replace(/([&*]|\+\+)/g, ''),
								O = /^\[/.test(k) ? k.match(/^\[(.*)\]$/)[1].split('+') : k
							return zi(
								k,
								O || null,
								/\&/.test(o),
								/\*/.test(o),
								/\+\+/.test(o),
								c(O),
								u === 0,
								w,
							)
						})
					}
					var D_ = (function () {
						function a() {}
						return (
							(a.prototype._createTableSchema = function (o, u, h) {
								return _o(o, u, h)
							}),
							(a.prototype._parseIndexSyntax = function (o) {
								return Wc(o)
							}),
							(a.prototype._parseStoresSpec = function (o, u) {
								var h = this
								f(o).forEach(function (p) {
									if (o[p] !== null) {
										var w = h._parseIndexSyntax(o[p]),
											k = w.shift()
										if (!k)
											throw new Oe.Schema(
												'Invalid schema for table ' + p + ': ' + o[p],
											)
										if (((k.unique = !0), k.multi))
											throw new Oe.Schema('Primary key cannot be multiEntry*')
										w.forEach(function (D) {
											if (D.auto)
												throw new Oe.Schema(
													'Only primary key can be marked as autoIncrement (++)',
												)
											if (!D.keyPath)
												throw new Oe.Schema(
													'Index must have a name and cannot be an empty string',
												)
										})
										var O = h._createTableSchema(p, k, w)
										u[p] = O
									}
								})
							}),
							(a.prototype.stores = function (o) {
								var u = this.db
								this._cfg.storesSource = this._cfg.storesSource
									? m(this._cfg.storesSource, o)
									: o
								var h = u._versions,
									p = {},
									w = {}
								return (
									h.forEach(function (k) {
										;(m(p, k._cfg.storesSource),
											(w = k._cfg.dbschema = {}),
											k._parseStoresSpec(p, w))
									}),
									(u._dbSchema = w),
									au(u, [u._allTables, u, u.Transaction.prototype]),
									As(
										u,
										[
											u._allTables,
											u,
											u.Transaction.prototype,
											this._cfg.tables,
										],
										f(w),
										w,
									),
									(u._storeNames = f(w)),
									this
								)
							}),
							(a.prototype.upgrade = function (o) {
								return (
									(this._cfg.contentUpgrade = C(
										this._cfg.contentUpgrade || st,
										o,
									)),
									this
								)
							}),
							a
						)
					})()
					function P_(a) {
						return ci(D_.prototype, function (u) {
							;((this.db = a),
								(this._cfg = {
									version: u,
									storesSource: null,
									dbschema: {},
									tables: {},
									contentUpgrade: null,
								}))
						})
					}
					var mo = L_()
					function L_() {
						if (typeof FinalizationRegistry < 'u' && typeof WeakRef < 'u') {
							var a = new Set(),
								o = new FinalizationRegistry(function (k) {
									a.delete(k)
								}),
								u = function () {
									return Array.from(a)
										.map(function (k) {
											return k.deref()
										})
										.filter(function (k) {
											return k !== void 0
										})
								},
								h = function (k) {
									var O = new WeakRef(k._novip)
									if (
										(a.add(O),
										o.register(k._novip, O, O),
										a.size > k._options.maxConnections)
									) {
										var D = a.values().next().value
										;(a.delete(D), o.unregister(D))
									}
								},
								p = function (k) {
									if (k)
										for (var O = a.values(), D = O.next(); !D.done;) {
											var B = D.value
											if (B.deref() === k._novip) {
												;(a.delete(B), o.unregister(B))
												return
											}
											D = O.next()
										}
								}
							return {toArray: u, add: h, remove: p}
						} else {
							var w = [],
								u = function () {
									return w
								},
								h = function (B) {
									w.push(B._novip)
								},
								p = function (B) {
									if (B) {
										var W = w.indexOf(B._novip)
										W !== -1 && w.splice(W, 1)
									}
								}
							return {toArray: u, add: h, remove: p}
						}
					}
					function lu(a, o) {
						var u = a._dbNamesDB
						return (
							u ||
								((u = a._dbNamesDB =
									new Yn(Tt, {addons: [], indexedDB: a, IDBKeyRange: o})),
								u.version(1).stores({dbnames: 'name'})),
							u.table('dbnames')
						)
					}
					function uu(a) {
						return a && typeof a.databases == 'function'
					}
					function M_(a) {
						var o = a.indexedDB,
							u = a.IDBKeyRange
						return uu(o)
							? Promise.resolve(o.databases()).then(function (h) {
									return h
										.map(function (p) {
											return p.name
										})
										.filter(function (p) {
											return p !== Tt
										})
								})
							: lu(o, u).toCollection().primaryKeys()
					}
					function N_(a, o) {
						var u = a.indexedDB,
							h = a.IDBKeyRange
						!uu(u) && o !== Tt && lu(u, h).put({name: o}).catch(st)
					}
					function B_(a, o) {
						var u = a.indexedDB,
							h = a.IDBKeyRange
						!uu(u) && o !== Tt && lu(u, h).delete(o).catch(st)
					}
					function fu(a) {
						return Mn(function () {
							return ((ke.letThrough = !0), a())
						})
					}
					function F_() {
						var a =
							!navigator.userAgentData &&
							/Safari\//.test(navigator.userAgent) &&
							!/Chrom(e|ium)\//.test(navigator.userAgent)
						if (!a || !indexedDB.databases) return Promise.resolve()
						var o
						return new Promise(function (u) {
							var h = function () {
								return indexedDB.databases().finally(u)
							}
							;((o = setInterval(h, 100)), h())
						}).finally(function () {
							return clearInterval(o)
						})
					}
					var cu
					function du(a) {
						return !('from' in a)
					}
					var Or = function (a, o) {
						if (this)
							m(
								this,
								arguments.length
									? {d: 1, from: a, to: arguments.length > 1 ? o : a}
									: {d: 0},
							)
						else {
							var u = new Or()
							return (a && 'd' in a && m(u, a), u)
						}
					}
					_(
						Or.prototype,
						((cu = {
							add: function (a) {
								return (bo(this, a), this)
							},
							addKey: function (a) {
								return (yo(this, a, a), this)
							},
							addKeys: function (a) {
								var o = this
								return (
									a.forEach(function (u) {
										return yo(o, u, u)
									}),
									this
								)
							},
							hasKey: function (a) {
								var o = Cs(this).next(a).value
								return o && He(o.from, a) <= 0 && He(o.to, a) >= 0
							},
						}),
						(cu[ze] = function () {
							return Cs(this)
						}),
						cu),
					)
					function yo(a, o, u) {
						var h = He(o, u)
						if (!isNaN(h)) {
							if (h > 0) throw RangeError()
							if (du(a)) return m(a, {from: o, to: u, d: 1})
							var p = a.l,
								w = a.r
							if (He(u, a.from) < 0)
								return (
									p
										? yo(p, o, u)
										: (a.l = {from: o, to: u, d: 1, l: null, r: null}),
									Hc(a)
								)
							if (He(o, a.to) > 0)
								return (
									w
										? yo(w, o, u)
										: (a.r = {from: o, to: u, d: 1, l: null, r: null}),
									Hc(a)
								)
							;(He(o, a.from) < 0 &&
								((a.from = o), (a.l = null), (a.d = w ? w.d + 1 : 1)),
								He(u, a.to) > 0 &&
									((a.to = u), (a.r = null), (a.d = a.l ? a.l.d + 1 : 1)))
							var k = !a.r
							;(p && !a.l && bo(a, p), w && k && bo(a, w))
						}
					}
					function bo(a, o) {
						function u(h, p) {
							var w = p.from,
								k = p.to,
								O = p.l,
								D = p.r
							;(yo(h, w, k), O && u(h, O), D && u(h, D))
						}
						du(o) || u(a, o)
					}
					function Gc(a, o) {
						var u = Cs(o),
							h = u.next()
						if (h.done) return !1
						for (
							var p = h.value, w = Cs(a), k = w.next(p.from), O = k.value;
							!h.done && !k.done;
						) {
							if (He(O.from, p.to) <= 0 && He(O.to, p.from) >= 0) return !0
							He(p.from, O.from) < 0
								? (p = (h = u.next(O.from)).value)
								: (O = (k = w.next(p.from)).value)
						}
						return !1
					}
					function Cs(a) {
						var o = du(a) ? null : {s: 0, n: a}
						return {
							next: function (u) {
								for (var h = arguments.length > 0; o;)
									switch (o.s) {
										case 0:
											if (((o.s = 1), h))
												for (; o.n.l && He(u, o.n.from) < 0;)
													o = {up: o, n: o.n.l, s: 1}
											else for (; o.n.l;) o = {up: o, n: o.n.l, s: 1}
										case 1:
											if (((o.s = 2), !h || He(u, o.n.to) <= 0))
												return {value: o.n, done: !1}
										case 2:
											if (o.n.r) {
												;((o.s = 3), (o = {up: o, n: o.n.r, s: 0}))
												continue
											}
										case 3:
											o = o.up
									}
								return {done: !0}
							},
						}
					}
					function Hc(a) {
						var o,
							u,
							h =
								(((o = a.r) === null || o === void 0 ? void 0 : o.d) || 0) -
								(((u = a.l) === null || u === void 0 ? void 0 : u.d) || 0),
							p = h > 1 ? 'r' : h < -1 ? 'l' : ''
						if (p) {
							var w = p === 'r' ? 'l' : 'r',
								k = i({}, a),
								O = a[p]
							;((a.from = O.from),
								(a.to = O.to),
								(a[p] = O[p]),
								(k[p] = O[w]),
								(a[w] = k),
								(k.d = $c(k)))
						}
						a.d = $c(a)
					}
					function $c(a) {
						var o = a.r,
							u = a.l
						return (o ? (u ? Math.max(o.d, u.d) : o.d) : u ? u.d : 0) + 1
					}
					function Os(a, o) {
						return (
							f(o).forEach(function (u) {
								a[u] ? bo(a[u], o[u]) : (a[u] = j(o[u]))
							}),
							a
						)
					}
					function hu(a, o) {
						return (
							a.all ||
							o.all ||
							Object.keys(a).some(function (u) {
								return o[u] && Gc(o[u], a[u])
							})
						)
					}
					var Ki = {},
						vu = {},
						pu = !1
					function Ds(a, o) {
						;(Os(vu, a),
							pu ||
								((pu = !0),
								setTimeout(function () {
									pu = !1
									var u = vu
									;((vu = {}), gu(u, !1))
								}, 0)))
					}
					function gu(a, o) {
						o === void 0 && (o = !1)
						var u = new Set()
						if (a.all)
							for (var h = 0, p = Object.values(Ki); h < p.length; h++) {
								var w = p[h]
								Vc(w, a, u, o)
							}
						else
							for (var k in a) {
								var O = /^idb\:\/\/(.*)\/(.*)\//.exec(k)
								if (O) {
									var D = O[1],
										B = O[2],
										w = Ki['idb://'.concat(D, '/').concat(B)]
									w && Vc(w, a, u, o)
								}
							}
						u.forEach(function (W) {
							return W()
						})
					}
					function Vc(a, o, u, h) {
						for (
							var p = [], w = 0, k = Object.entries(a.queries.query);
							w < k.length;
							w++
						) {
							for (
								var O = k[w], D = O[0], B = O[1], W = [], H = 0, J = B;
								H < J.length;
								H++
							) {
								var le = J[H]
								hu(o, le.obsSet)
									? le.subscribers.forEach(function (te) {
											return u.add(te)
										})
									: h && W.push(le)
							}
							h && p.push([D, W])
						}
						if (h)
							for (var K = 0, V = p; K < V.length; K++) {
								var ne = V[K],
									D = ne[0],
									W = ne[1]
								a.queries.query[D] = W
							}
					}
					function j_(a) {
						var o = a._state,
							u = a._deps.indexedDB
						if (o.isBeingOpened || a.idbdb)
							return o.dbReadyPromise.then(function () {
								return o.dbOpenError ? yt(o.dbOpenError) : a
							})
						;((o.isBeingOpened = !0),
							(o.dbOpenError = null),
							(o.openComplete = !1))
						var h = o.openCanceller,
							p = Math.round(a.verno * 10),
							w = !1
						function k() {
							if (o.openCanceller !== h)
								throw new Oe.DatabaseClosed('db.open() was cancelled')
						}
						var O = o.dbReadyResolve,
							D = null,
							B = !1,
							W = function () {
								return new Se(function (H, J) {
									if ((k(), !u)) throw new Oe.MissingAPI()
									var le = a.name,
										K = o.autoSchema || !p ? u.open(le) : u.open(le, p)
									if (!K) throw new Oe.MissingAPI()
									;((K.onerror = Jr(J)),
										(K.onblocked = Dt(a._fireOnBlocked)),
										(K.onupgradeneeded = Dt(function (V) {
											if (
												((D = K.transaction),
												o.autoSchema && !a._options.allowEmptyDB)
											) {
												;((K.onerror = ji), D.abort(), K.result.close())
												var ne = u.deleteDatabase(le)
												ne.onsuccess = ne.onerror = Dt(function () {
													J(
														new Oe.NoSuchDatabase(
															'Database '.concat(le, ' doesnt exist'),
														),
													)
												})
											} else {
												D.onerror = Jr(J)
												var te =
													V.oldVersion > Math.pow(2, 62) ? 0 : V.oldVersion
												;((B = te < 1),
													(a.idbdb = K.result),
													w && A_(a, D),
													x_(a, te / 10, D, J))
											}
										}, J)),
										(K.onsuccess = Dt(function () {
											D = null
											var V = (a.idbdb = K.result),
												ne = N(V.objectStoreNames)
											if (ne.length > 0)
												try {
													var te = V.transaction(iu(ne), 'readonly')
													if (o.autoSchema) C_(a, V, te)
													else if ((Rs(a, a._dbSchema, te), !O_(a, te) && !w))
														return (
															console.warn(
																'Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.',
															),
															V.close(),
															(p = V.version + 1),
															(w = !0),
															H(W())
														)
													xs(a, te)
												} catch {}
											;(mo.add(a),
												(V.onversionchange = Dt(function (pe) {
													;((o.vcFired = !0), a.on('versionchange').fire(pe))
												})),
												(V.onclose = Dt(function () {
													a.close({disableAutoOpen: !1})
												})),
												B && N_(a._deps, le),
												H())
										}, J)))
								}).catch(function (H) {
									switch (H?.name) {
										case 'UnknownError':
											if (o.PR1398_maxLoop > 0)
												return (
													o.PR1398_maxLoop--,
													console.warn(
														'Dexie: Workaround for Chrome UnknownError on open()',
													),
													W()
												)
											break
										case 'VersionError':
											if (p > 0) return ((p = 0), W())
											break
									}
									return Se.reject(H)
								})
							}
						return Se.race([
							h,
							(typeof navigator > 'u' ? Se.resolve() : F_()).then(W),
						])
							.then(function () {
								return (
									k(),
									(o.onReadyBeingFired = []),
									Se.resolve(
										fu(function () {
											return a.on.ready.fire(a.vip)
										}),
									).then(function H() {
										if (o.onReadyBeingFired.length > 0) {
											var J = o.onReadyBeingFired.reduce(C, st)
											return (
												(o.onReadyBeingFired = []),
												Se.resolve(
													fu(function () {
														return J(a.vip)
													}),
												).then(H)
											)
										}
									})
								)
							})
							.finally(function () {
								o.openCanceller === h &&
									((o.onReadyBeingFired = null), (o.isBeingOpened = !1))
							})
							.catch(function (H) {
								o.dbOpenError = H
								try {
									D && D.abort()
								} catch {}
								return (h === o.openCanceller && a._close(), yt(H))
							})
							.finally(function () {
								;((o.openComplete = !0), O())
							})
							.then(function () {
								if (B) {
									var H = {}
									;(a.tables.forEach(function (J) {
										;(J.schema.indexes.forEach(function (le) {
											le.name &&
												(H[
													'idb://'
														.concat(a.name, '/')
														.concat(J.name, '/')
														.concat(le.name)
												] = new Or(-1 / 0, [[[]]]))
										}),
											(H['idb://'.concat(a.name, '/').concat(J.name, '/')] = H[
												'idb://'.concat(a.name, '/').concat(J.name, '/:dels')
											] =
												new Or(-1 / 0, [[[]]])))
									}),
										rn(Ui).fire(H),
										gu(H, !0))
								}
								return a
							})
					}
					function _u(a) {
						var o = function (k) {
								return a.next(k)
							},
							u = function (k) {
								return a.throw(k)
							},
							h = w(o),
							p = w(u)
						function w(k) {
							return function (O) {
								var D = k(O),
									B = D.value
								return D.done
									? B
									: !B || typeof B.then != 'function'
										? c(B)
											? Promise.all(B).then(h, p)
											: h(B)
										: B.then(h, p)
							}
						}
						return w(o)()
					}
					function U_(a, o, u) {
						var h = arguments.length
						if (h < 2) throw new Oe.InvalidArgument('Too few arguments')
						for (var p = new Array(h - 1); --h;) p[h - 1] = arguments[h]
						u = p.pop()
						var w = Me(p)
						return [a, w, u]
					}
					function Zc(a, o, u, h, p) {
						return Se.resolve().then(function () {
							var w = ke.transless || ke,
								k = a._createTransaction(o, u, a._dbSchema, h)
							k.explicit = !0
							var O = {trans: k, transless: w}
							if (h) k.idbtrans = h.idbtrans
							else
								try {
									;(k.create(),
										(k.idbtrans._explicit = !0),
										(a._state.PR1398_maxLoop = 3))
								} catch (H) {
									return H.name === _t.InvalidState &&
										a.isOpen() &&
										--a._state.PR1398_maxLoop > 0
										? (console.warn('Dexie: Need to reopen db'),
											a.close({disableAutoOpen: !1}),
											a.open().then(function () {
												return Zc(a, o, u, null, p)
											}))
										: yt(H)
								}
							var D = M(p)
							D && fi()
							var B,
								W = Se.follow(function () {
									if (((B = p.call(k, k)), B))
										if (D) {
											var H = _n.bind(null, null)
											B.then(H, H)
										} else
											typeof B.next == 'function' &&
												typeof B.throw == 'function' &&
												(B = _u(B))
								}, O)
							return (
								B && typeof B.then == 'function'
									? Se.resolve(B).then(function (H) {
											return k.active
												? H
												: yt(
														new Oe.PrematureCommit(
															'Transaction committed too early. See http://bit.ly/2kdckMn',
														),
													)
										})
									: W.then(function () {
											return B
										})
							)
								.then(function (H) {
									return (
										h && k._resolve(),
										k._completion.then(function () {
											return H
										})
									)
								})
								.catch(function (H) {
									return (k._reject(H), yt(H))
								})
						})
					}
					function Ps(a, o, u) {
						for (var h = c(a) ? a.slice() : [a], p = 0; p < u; ++p) h.push(o)
						return h
					}
					function z_(a) {
						return i(i({}, a), {
							table: function (o) {
								var u = a.table(o),
									h = u.schema,
									p = {},
									w = []
								function k(V, ne, te) {
									var pe = zt(V),
										ce = (p[pe] = p[pe] || []),
										ae = V == null ? 0 : typeof V == 'string' ? 1 : V.length,
										fe = ne > 0,
										Be = i(i({}, te), {
											name: fe
												? ''.concat(pe, '(virtual-from:').concat(te.name, ')')
												: te.name,
											lowLevelIndex: te,
											isVirtual: fe,
											keyTail: ne,
											keyLength: ae,
											extractKey: xa(V),
											unique: !fe && te.unique,
										})
									if ((ce.push(Be), Be.isPrimaryKey || w.push(Be), ae > 1)) {
										var Re = ae === 2 ? V[0] : V.slice(0, ae - 1)
										k(Re, ne + 1, te)
									}
									return (
										ce.sort(function (Ce, Ke) {
											return Ce.keyTail - Ke.keyTail
										}),
										Be
									)
								}
								var O = k(h.primaryKey.keyPath, 0, h.primaryKey)
								p[':id'] = [O]
								for (var D = 0, B = h.indexes; D < B.length; D++) {
									var W = B[D]
									k(W.keyPath, 0, W)
								}
								function H(V) {
									var ne = p[zt(V)]
									return ne && ne[0]
								}
								function J(V, ne) {
									return {
										type: V.type === 1 ? 2 : V.type,
										lower: Ps(V.lower, V.lowerOpen ? a.MAX_KEY : a.MIN_KEY, ne),
										lowerOpen: !0,
										upper: Ps(V.upper, V.upperOpen ? a.MIN_KEY : a.MAX_KEY, ne),
										upperOpen: !0,
									}
								}
								function le(V) {
									var ne = V.query.index
									return ne.isVirtual
										? i(i({}, V), {
												query: {
													index: ne.lowLevelIndex,
													range: J(V.query.range, ne.keyTail),
												},
											})
										: V
								}
								var K = i(i({}, u), {
									schema: i(i({}, h), {
										primaryKey: O,
										indexes: w,
										getIndexByKeyPath: H,
									}),
									count: function (V) {
										return u.count(le(V))
									},
									query: function (V) {
										return u.query(le(V))
									},
									openCursor: function (V) {
										var ne = V.query.index,
											te = ne.keyTail,
											pe = ne.isVirtual,
											ce = ne.keyLength
										if (!pe) return u.openCursor(V)
										function ae(fe) {
											function Be(Ce) {
												Ce != null
													? fe.continue(
															Ps(Ce, V.reverse ? a.MAX_KEY : a.MIN_KEY, te),
														)
													: V.unique
														? fe.continue(
																fe.key
																	.slice(0, ce)
																	.concat(
																		V.reverse ? a.MIN_KEY : a.MAX_KEY,
																		te,
																	),
															)
														: fe.continue()
											}
											var Re = Object.create(fe, {
												continue: {value: Be},
												continuePrimaryKey: {
													value: function (Ce, Ke) {
														fe.continuePrimaryKey(Ps(Ce, a.MAX_KEY, te), Ke)
													},
												},
												primaryKey: {
													get: function () {
														return fe.primaryKey
													},
												},
												key: {
													get: function () {
														var Ce = fe.key
														return ce === 1 ? Ce[0] : Ce.slice(0, ce)
													},
												},
												value: {
													get: function () {
														return fe.value
													},
												},
											})
											return Re
										}
										return u.openCursor(le(V)).then(function (fe) {
											return fe && ae(fe)
										})
									},
								})
								return K
							},
						})
					}
					var q_ = {
						stack: 'dbcore',
						name: 'VirtualIndexMiddleware',
						level: 1,
						create: z_,
					}
					function mu(a, o, u, h) {
						return (
							(u = u || {}),
							(h = h || ''),
							f(a).forEach(function (p) {
								if (!v(o, p)) u[h + p] = void 0
								else {
									var w = a[p],
										k = o[p]
									if (typeof w == 'object' && typeof k == 'object' && w && k) {
										var O = xe(w),
											D = xe(k)
										O !== D
											? (u[h + p] = o[p])
											: O === 'Object'
												? mu(w, k, u, h + p + '.')
												: w !== k && (u[h + p] = o[p])
									} else w !== k && (u[h + p] = o[p])
								}
							}),
							f(o).forEach(function (p) {
								v(a, p) || (u[h + p] = o[p])
							}),
							u
						)
					}
					function yu(a, o) {
						return o.type === 'delete'
							? o.keys
							: o.keys || o.values.map(a.extractKey)
					}
					var K_ = {
						stack: 'dbcore',
						name: 'HooksMiddleware',
						level: 2,
						create: function (a) {
							return i(i({}, a), {
								table: function (o) {
									var u = a.table(o),
										h = u.schema.primaryKey,
										p = i(i({}, u), {
											mutate: function (w) {
												var k = ke.trans,
													O = k.table(o).hook,
													D = O.deleting,
													B = O.creating,
													W = O.updating
												switch (w.type) {
													case 'add':
														if (B.fire === st) break
														return k._promise(
															'readwrite',
															function () {
																return H(w)
															},
															!0,
														)
													case 'put':
														if (B.fire === st && W.fire === st) break
														return k._promise(
															'readwrite',
															function () {
																return H(w)
															},
															!0,
														)
													case 'delete':
														if (D.fire === st) break
														return k._promise(
															'readwrite',
															function () {
																return H(w)
															},
															!0,
														)
													case 'deleteRange':
														if (D.fire === st) break
														return k._promise(
															'readwrite',
															function () {
																return J(w)
															},
															!0,
														)
												}
												return u.mutate(w)
												function H(K) {
													var V = ke.trans,
														ne = K.keys || yu(h, K)
													if (!ne) throw new Error('Keys missing')
													return (
														(K =
															K.type === 'add' || K.type === 'put'
																? i(i({}, K), {keys: ne})
																: i({}, K)),
														K.type !== 'delete' && (K.values = s([], K.values)),
														K.keys && (K.keys = s([], K.keys)),
														W_(u, K, ne).then(function (te) {
															var pe = ne.map(function (ce, ae) {
																var fe = te[ae],
																	Be = {onerror: null, onsuccess: null}
																if (K.type === 'delete')
																	D.fire.call(Be, ce, fe, V)
																else if (K.type === 'add' || fe === void 0) {
																	var Re = B.fire.call(Be, ce, K.values[ae], V)
																	ce == null &&
																		Re != null &&
																		((ce = Re),
																		(K.keys[ae] = ce),
																		h.outbound ||
																			ye(K.values[ae], h.keyPath, ce))
																} else {
																	var Ce = mu(fe, K.values[ae]),
																		Ke = W.fire.call(Be, Ce, ce, fe, V)
																	if (Ke) {
																		var mt = K.values[ae]
																		Object.keys(Ke).forEach(function (Ye) {
																			v(mt, Ye)
																				? (mt[Ye] = Ke[Ye])
																				: ye(mt, Ye, Ke[Ye])
																		})
																	}
																}
																return Be
															})
															return u
																.mutate(K)
																.then(function (ce) {
																	for (
																		var ae = ce.failures,
																			fe = ce.results,
																			Be = ce.numFailures,
																			Re = ce.lastResult,
																			Ce = 0;
																		Ce < ne.length;
																		++Ce
																	) {
																		var Ke = fe ? fe[Ce] : ne[Ce],
																			mt = pe[Ce]
																		Ke == null
																			? mt.onerror && mt.onerror(ae[Ce])
																			: mt.onsuccess &&
																				mt.onsuccess(
																					K.type === 'put' && te[Ce]
																						? K.values[Ce]
																						: Ke,
																				)
																	}
																	return {
																		failures: ae,
																		results: fe,
																		numFailures: Be,
																		lastResult: Re,
																	}
																})
																.catch(function (ce) {
																	return (
																		pe.forEach(function (ae) {
																			return ae.onerror && ae.onerror(ce)
																		}),
																		Promise.reject(ce)
																	)
																})
														})
													)
												}
												function J(K) {
													return le(K.trans, K.range, 1e4)
												}
												function le(K, V, ne) {
													return u
														.query({
															trans: K,
															values: !1,
															query: {index: h, range: V},
															limit: ne,
														})
														.then(function (te) {
															var pe = te.result
															return H({
																type: 'delete',
																keys: pe,
																trans: K,
															}).then(function (ce) {
																return ce.numFailures > 0
																	? Promise.reject(ce.failures[0])
																	: pe.length < ne
																		? {
																				failures: [],
																				numFailures: 0,
																				lastResult: void 0,
																			}
																		: le(
																				K,
																				i(i({}, V), {
																					lower: pe[pe.length - 1],
																					lowerOpen: !0,
																				}),
																				ne,
																			)
															})
														})
												}
											},
										})
									return p
								},
							})
						},
					}
					function W_(a, o, u) {
						return o.type === 'add'
							? Promise.resolve([])
							: a.getMany({trans: o.trans, keys: u, cache: 'immutable'})
					}
					function Yc(a, o, u) {
						try {
							if (!o || o.keys.length < a.length) return null
							for (
								var h = [], p = 0, w = 0;
								p < o.keys.length && w < a.length;
								++p
							)
								He(o.keys[p], a[w]) === 0 &&
									(h.push(u ? $(o.values[p]) : o.values[p]), ++w)
							return h.length === a.length ? h : null
						} catch {
							return null
						}
					}
					var G_ = {
						stack: 'dbcore',
						level: -1,
						create: function (a) {
							return {
								table: function (o) {
									var u = a.table(o)
									return i(i({}, u), {
										getMany: function (h) {
											if (!h.cache) return u.getMany(h)
											var p = Yc(h.keys, h.trans._cache, h.cache === 'clone')
											return p
												? Se.resolve(p)
												: u.getMany(h).then(function (w) {
														return (
															(h.trans._cache = {
																keys: h.keys,
																values: h.cache === 'clone' ? $(w) : w,
															}),
															w
														)
													})
										},
										mutate: function (h) {
											return (
												h.type !== 'add' && (h.trans._cache = null),
												u.mutate(h)
											)
										},
									})
								},
							}
						},
					}
					function Xc(a, o) {
						return (
							a.trans.mode === 'readonly' &&
							!!a.subscr &&
							!a.trans.explicit &&
							a.trans.db._options.cache !== 'disabled' &&
							!o.schema.primaryKey.outbound
						)
					}
					function Qc(a, o) {
						switch (a) {
							case 'query':
								return o.values && !o.unique
							case 'get':
								return !1
							case 'getMany':
								return !1
							case 'count':
								return !1
							case 'openCursor':
								return !1
						}
					}
					var H_ = {
						stack: 'dbcore',
						level: 0,
						name: 'Observability',
						create: function (a) {
							var o = a.schema.name,
								u = new Or(a.MIN_KEY, a.MAX_KEY)
							return i(i({}, a), {
								transaction: function (h, p, w) {
									if (ke.subscr && p !== 'readonly')
										throw new Oe.ReadOnly(
											'Readwrite transaction in liveQuery context. Querier source: '.concat(
												ke.querier,
											),
										)
									return a.transaction(h, p, w)
								},
								table: function (h) {
									var p = a.table(h),
										w = p.schema,
										k = w.primaryKey,
										O = w.indexes,
										D = k.extractKey,
										B = k.outbound,
										W =
											k.autoIncrement &&
											O.filter(function (K) {
												return K.compound && K.keyPath.includes(k.keyPath)
											}),
										H = i(i({}, p), {
											mutate: function (K) {
												var V,
													ne,
													te = K.trans,
													pe = K.mutatedParts || (K.mutatedParts = {}),
													ce = function (nt) {
														var at = 'idb://'
															.concat(o, '/')
															.concat(h, '/')
															.concat(nt)
														return pe[at] || (pe[at] = new Or())
													},
													ae = ce(''),
													fe = ce(':dels'),
													Be = K.type,
													Re =
														K.type === 'deleteRange'
															? [K.range]
															: K.type === 'delete'
																? [K.keys]
																: K.values.length < 50
																	? [
																			yu(k, K).filter(function (nt) {
																				return nt
																			}),
																			K.values,
																		]
																	: [],
													Ce = Re[0],
													Ke = Re[1],
													mt = K.trans._cache
												if (c(Ce)) {
													ae.addKeys(Ce)
													var Ye =
														Be === 'delete' || Ce.length === Ke.length
															? Yc(Ce, mt)
															: null
													;(Ye || fe.addKeys(Ce),
														(Ye || Ke) && $_(ce, w, Ye, Ke))
												} else if (Ce) {
													var We = {
														from:
															(V = Ce.lower) !== null && V !== void 0
																? V
																: a.MIN_KEY,
														to:
															(ne = Ce.upper) !== null && ne !== void 0
																? ne
																: a.MAX_KEY,
													}
													;(fe.add(We), ae.add(We))
												} else
													(ae.add(u),
														fe.add(u),
														w.indexes.forEach(function (nt) {
															return ce(nt.name).add(u)
														}))
												return p.mutate(K).then(function (nt) {
													return (
														Ce &&
															(K.type === 'add' || K.type === 'put') &&
															(ae.addKeys(nt.results),
															W &&
																W.forEach(function (at) {
																	for (
																		var Bt = K.values.map(function (Mr) {
																				return at.extractKey(Mr)
																			}),
																			Xe = at.keyPath.findIndex(function (Mr) {
																				return Mr === k.keyPath
																			}),
																			ir = 0,
																			nn = nt.results.length;
																		ir < nn;
																		++ir
																	)
																		Bt[ir][Xe] = nt.results[ir]
																	ce(at.name).addKeys(Bt)
																})),
														(te.mutatedParts = Os(te.mutatedParts || {}, pe)),
														nt
													)
												})
											},
										}),
										J = function (K) {
											var V,
												ne,
												te = K.query,
												pe = te.index,
												ce = te.range
											return [
												pe,
												new Or(
													(V = ce.lower) !== null && V !== void 0
														? V
														: a.MIN_KEY,
													(ne = ce.upper) !== null && ne !== void 0
														? ne
														: a.MAX_KEY,
												),
											]
										},
										le = {
											get: function (K) {
												return [k, new Or(K.key)]
											},
											getMany: function (K) {
												return [k, new Or().addKeys(K.keys)]
											},
											count: J,
											query: J,
											openCursor: J,
										}
									return (
										f(le).forEach(function (K) {
											H[K] = function (V) {
												var ne = ke.subscr,
													te = !!ne,
													pe = Xc(ke, p) && Qc(K, V),
													ce = pe ? (V.obsSet = {}) : ne
												if (te) {
													var ae = function (Ye) {
															var We = 'idb://'
																.concat(o, '/')
																.concat(h, '/')
																.concat(Ye)
															return ce[We] || (ce[We] = new Or())
														},
														fe = ae(''),
														Be = ae(':dels'),
														Re = le[K](V),
														Ce = Re[0],
														Ke = Re[1]
													if (
														(K === 'query' && Ce.isPrimaryKey && !V.values
															? Be.add(Ke)
															: ae(Ce.name || '').add(Ke),
														!Ce.isPrimaryKey)
													)
														if (K === 'count') Be.add(u)
														else {
															var mt =
																K === 'query' &&
																B &&
																V.values &&
																p.query(i(i({}, V), {values: !1}))
															return p[K].apply(this, arguments).then(
																function (Ye) {
																	if (K === 'query') {
																		if (B && V.values)
																			return mt.then(function (Bt) {
																				var Xe = Bt.result
																				return (fe.addKeys(Xe), Ye)
																			})
																		var We = V.values
																			? Ye.result.map(D)
																			: Ye.result
																		V.values ? fe.addKeys(We) : Be.addKeys(We)
																	} else if (K === 'openCursor') {
																		var nt = Ye,
																			at = V.values
																		return (
																			nt &&
																			Object.create(nt, {
																				key: {
																					get: function () {
																						return (
																							Be.addKey(nt.primaryKey),
																							nt.key
																						)
																					},
																				},
																				primaryKey: {
																					get: function () {
																						var Bt = nt.primaryKey
																						return (Be.addKey(Bt), Bt)
																					},
																				},
																				value: {
																					get: function () {
																						return (
																							at && fe.addKey(nt.primaryKey),
																							nt.value
																						)
																					},
																				},
																			})
																		)
																	}
																	return Ye
																},
															)
														}
												}
												return p[K].apply(this, arguments)
											}
										}),
										H
									)
								},
							})
						},
					}
					function $_(a, o, u, h) {
						function p(w) {
							var k = a(w.name || '')
							function O(B) {
								return B != null ? w.extractKey(B) : null
							}
							var D = function (B) {
								return w.multiEntry && c(B)
									? B.forEach(function (W) {
											return k.addKey(W)
										})
									: k.addKey(B)
							}
							;(u || h).forEach(function (B, W) {
								var H = u && O(u[W]),
									J = h && O(h[W])
								He(H, J) !== 0 && (H != null && D(H), J != null && D(J))
							})
						}
						o.indexes.forEach(p)
					}
					function Jc(a, o, u) {
						if (u.numFailures === 0) return o
						if (o.type === 'deleteRange') return null
						var h = o.keys
							? o.keys.length
							: 'values' in o && o.values
								? o.values.length
								: 1
						if (u.numFailures === h) return null
						var p = i({}, o)
						return (
							c(p.keys) &&
								(p.keys = p.keys.filter(function (w, k) {
									return !(k in u.failures)
								})),
							'values' in p &&
								c(p.values) &&
								(p.values = p.values.filter(function (w, k) {
									return !(k in u.failures)
								})),
							p
						)
					}
					function V_(a, o) {
						return o.lower === void 0
							? !0
							: o.lowerOpen
								? He(a, o.lower) > 0
								: He(a, o.lower) >= 0
					}
					function Z_(a, o) {
						return o.upper === void 0
							? !0
							: o.upperOpen
								? He(a, o.upper) < 0
								: He(a, o.upper) <= 0
					}
					function bu(a, o) {
						return V_(a, o) && Z_(a, o)
					}
					function ed(a, o, u, h, p, w) {
						if (!u || u.length === 0) return a
						var k = o.query.index,
							O = k.multiEntry,
							D = o.query.range,
							B = h.schema.primaryKey,
							W = B.extractKey,
							H = k.extractKey,
							J = (k.lowLevelIndex || k).extractKey,
							le = u.reduce(function (V, ne) {
								var te = V,
									pe = []
								if (ne.type === 'add' || ne.type === 'put')
									for (
										var ce = new Or(), ae = ne.values.length - 1;
										ae >= 0;
										--ae
									) {
										var fe = ne.values[ae],
											Be = W(fe)
										if (!ce.hasKey(Be)) {
											var Re = H(fe)
											;(O && c(Re)
												? Re.some(function (We) {
														return bu(We, D)
													})
												: bu(Re, D)) && (ce.addKey(Be), pe.push(fe))
										}
									}
								switch (ne.type) {
									case 'add': {
										var Ce = new Or().addKeys(
											o.values
												? V.map(function (We) {
														return W(We)
													})
												: V,
										)
										te = V.concat(
											o.values
												? pe.filter(function (We) {
														var nt = W(We)
														return Ce.hasKey(nt) ? !1 : (Ce.addKey(nt), !0)
													})
												: pe
														.map(function (We) {
															return W(We)
														})
														.filter(function (We) {
															return Ce.hasKey(We) ? !1 : (Ce.addKey(We), !0)
														}),
										)
										break
									}
									case 'put': {
										var Ke = new Or().addKeys(
											ne.values.map(function (We) {
												return W(We)
											}),
										)
										te = V.filter(function (We) {
											return !Ke.hasKey(o.values ? W(We) : We)
										}).concat(
											o.values
												? pe
												: pe.map(function (We) {
														return W(We)
													}),
										)
										break
									}
									case 'delete':
										var mt = new Or().addKeys(ne.keys)
										te = V.filter(function (We) {
											return !mt.hasKey(o.values ? W(We) : We)
										})
										break
									case 'deleteRange':
										var Ye = ne.range
										te = V.filter(function (We) {
											return !bu(W(We), Ye)
										})
										break
								}
								return te
							}, a)
						if (le === a) return a
						var K = function (V, ne) {
							return He(J(V), J(ne)) || He(W(V), W(ne))
						}
						return (
							le.sort(
								o.direction === 'prev' || o.direction === 'prevunique'
									? function (V, ne) {
											return K(ne, V)
										}
									: K,
							),
							o.limit &&
								o.limit < 1 / 0 &&
								(le.length > o.limit
									? (le.length = o.limit)
									: a.length === o.limit &&
										le.length < o.limit &&
										(p.dirty = !0)),
							w ? Object.freeze(le) : le
						)
					}
					function td(a, o) {
						return (
							He(a.lower, o.lower) === 0 &&
							He(a.upper, o.upper) === 0 &&
							!!a.lowerOpen == !!o.lowerOpen &&
							!!a.upperOpen == !!o.upperOpen
						)
					}
					function Y_(a, o, u, h) {
						if (a === void 0) return o !== void 0 ? -1 : 0
						if (o === void 0) return 1
						var p = He(a, o)
						if (p === 0) {
							if (u && h) return 0
							if (u) return 1
							if (h) return -1
						}
						return p
					}
					function X_(a, o, u, h) {
						if (a === void 0) return o !== void 0 ? 1 : 0
						if (o === void 0) return -1
						var p = He(a, o)
						if (p === 0) {
							if (u && h) return 0
							if (u) return -1
							if (h) return 1
						}
						return p
					}
					function Q_(a, o) {
						return (
							Y_(a.lower, o.lower, a.lowerOpen, o.lowerOpen) <= 0 &&
							X_(a.upper, o.upper, a.upperOpen, o.upperOpen) >= 0
						)
					}
					function J_(a, o, u, h) {
						var p,
							w = Ki['idb://'.concat(a, '/').concat(o)]
						if (!w) return []
						var k = w.queries[u]
						if (!k) return [null, !1, w, null]
						var O = h.query ? h.query.index.name : null,
							D = k[O || '']
						if (!D) return [null, !1, w, null]
						switch (u) {
							case 'query':
								var B = (p = h.direction) !== null && p !== void 0 ? p : 'next',
									W = D.find(function (le) {
										var K
										return (
											le.req.limit === h.limit &&
											le.req.values === h.values &&
											((K = le.req.direction) !== null && K !== void 0
												? K
												: 'next') === B &&
											td(le.req.query.range, h.query.range)
										)
									})
								if (W) return [W, !0, w, D]
								var H = D.find(function (le) {
									var K,
										V = 'limit' in le.req ? le.req.limit : 1 / 0
									return (
										V >= h.limit &&
										((K = le.req.direction) !== null && K !== void 0
											? K
											: 'next') === B &&
										(h.values ? le.req.values : !0) &&
										Q_(le.req.query.range, h.query.range)
									)
								})
								return [H, !1, w, D]
							case 'count':
								var J = D.find(function (le) {
									return td(le.req.query.range, h.query.range)
								})
								return [J, !!J, w, D]
						}
					}
					function em(a, o, u, h) {
						;(a.subscribers.add(u),
							h.addEventListener('abort', function () {
								;(a.subscribers.delete(u), a.subscribers.size === 0 && tm(a, o))
							}))
					}
					function tm(a, o) {
						setTimeout(function () {
							a.subscribers.size === 0 && it(o, a)
						}, 3e3)
					}
					var rm = {
						stack: 'dbcore',
						level: 0,
						name: 'Cache',
						create: function (a) {
							var o = a.schema.name,
								u = i(i({}, a), {
									transaction: function (h, p, w) {
										var k = a.transaction(h, p, w)
										if (p === 'readwrite') {
											var O = new AbortController(),
												D = O.signal,
												B = function (W) {
													return function () {
														if ((O.abort(), p === 'readwrite')) {
															for (
																var H = new Set(), J = 0, le = h;
																J < le.length;
																J++
															) {
																var K = le[J],
																	V = Ki['idb://'.concat(o, '/').concat(K)]
																if (V) {
																	var ne = a.table(K),
																		te = V.optimisticOps.filter(function (at) {
																			return at.trans === k
																		})
																	if (k._explicit && W && k.mutatedParts)
																		for (
																			var pe = 0,
																				ce = Object.values(V.queries.query);
																			pe < ce.length;
																			pe++
																		)
																			for (
																				var ae = ce[pe],
																					fe = 0,
																					Be = ae.slice();
																				fe < Be.length;
																				fe++
																			) {
																				var Re = Be[fe]
																				hu(Re.obsSet, k.mutatedParts) &&
																					(it(ae, Re),
																					Re.subscribers.forEach(function (at) {
																						return H.add(at)
																					}))
																			}
																	else if (te.length > 0) {
																		V.optimisticOps = V.optimisticOps.filter(
																			function (at) {
																				return at.trans !== k
																			},
																		)
																		for (
																			var Ce = 0,
																				Ke = Object.values(V.queries.query);
																			Ce < Ke.length;
																			Ce++
																		)
																			for (
																				var ae = Ke[Ce],
																					mt = 0,
																					Ye = ae.slice();
																				mt < Ye.length;
																				mt++
																			) {
																				var Re = Ye[mt]
																				if (Re.res != null && k.mutatedParts)
																					if (W && !Re.dirty) {
																						var We = Object.isFrozen(Re.res),
																							nt = ed(
																								Re.res,
																								Re.req,
																								te,
																								ne,
																								Re,
																								We,
																							)
																						Re.dirty
																							? (it(ae, Re),
																								Re.subscribers.forEach(
																									function (Xe) {
																										return H.add(Xe)
																									},
																								))
																							: nt !== Re.res &&
																								((Re.res = nt),
																								(Re.promise = Se.resolve({
																									result: nt,
																								})))
																					} else
																						(Re.dirty && it(ae, Re),
																							Re.subscribers.forEach(
																								function (Xe) {
																									return H.add(Xe)
																								},
																							))
																			}
																	}
																}
															}
															H.forEach(function (at) {
																return at()
															})
														}
													}
												}
											;(k.addEventListener('abort', B(!1), {signal: D}),
												k.addEventListener('error', B(!1), {signal: D}),
												k.addEventListener('complete', B(!0), {signal: D}))
										}
										return k
									},
									table: function (h) {
										var p = a.table(h),
											w = p.schema.primaryKey,
											k = i(i({}, p), {
												mutate: function (O) {
													var D = ke.trans
													if (
														w.outbound ||
														D.db._options.cache === 'disabled' ||
														D.explicit ||
														D.idbtrans.mode !== 'readwrite'
													)
														return p.mutate(O)
													var B = Ki['idb://'.concat(o, '/').concat(h)]
													if (!B) return p.mutate(O)
													var W = p.mutate(O)
													return (
														(O.type === 'add' || O.type === 'put') &&
														(O.values.length >= 50 ||
															yu(w, O).some(function (H) {
																return H == null
															}))
															? W.then(function (H) {
																	var J = i(i({}, O), {
																			values: O.values.map(function (K, V) {
																				var ne
																				if (H.failures[V]) return K
																				var te =
																					!(
																						(ne = w.keyPath) === null ||
																						ne === void 0
																					) && ne.includes('.')
																						? $(K)
																						: i({}, K)
																				return (
																					ye(te, w.keyPath, H.results[V]),
																					te
																				)
																			}),
																		}),
																		le = Jc(B, J, H)
																	;(B.optimisticOps.push(le),
																		queueMicrotask(function () {
																			return (
																				O.mutatedParts && Ds(O.mutatedParts)
																			)
																		}))
																})
															: (B.optimisticOps.push(O),
																O.mutatedParts && Ds(O.mutatedParts),
																W.then(function (H) {
																	if (H.numFailures > 0) {
																		it(B.optimisticOps, O)
																		var J = Jc(B, O, H)
																		;(J && B.optimisticOps.push(J),
																			O.mutatedParts && Ds(O.mutatedParts))
																	}
																}),
																W.catch(function () {
																	;(it(B.optimisticOps, O),
																		O.mutatedParts && Ds(O.mutatedParts))
																})),
														W
													)
												},
												query: function (O) {
													var D
													if (!Xc(ke, p) || !Qc('query', O)) return p.query(O)
													var B =
															((D = ke.trans) === null || D === void 0
																? void 0
																: D.db._options.cache) === 'immutable',
														W = ke,
														H = W.requery,
														J = W.signal,
														le = J_(o, h, 'query', O),
														K = le[0],
														V = le[1],
														ne = le[2],
														te = le[3]
													if (K && V) K.obsSet = O.obsSet
													else {
														var pe = p
															.query(O)
															.then(function (ce) {
																var ae = ce.result
																if ((K && (K.res = ae), B)) {
																	for (
																		var fe = 0, Be = ae.length;
																		fe < Be;
																		++fe
																	)
																		Object.freeze(ae[fe])
																	Object.freeze(ae)
																}
																return ce
															})
															.catch(function (ce) {
																return (
																	te && K && it(te, K),
																	Promise.reject(ce)
																)
															})
														;((K = {
															obsSet: O.obsSet,
															promise: pe,
															subscribers: new Set(),
															type: 'query',
															req: O,
															dirty: !1,
														}),
															te
																? te.push(K)
																: ((te = [K]),
																	ne ||
																		(ne = Ki[
																			'idb://'.concat(o, '/').concat(h)
																		] =
																			{
																				queries: {query: {}, count: {}},
																				objs: new Map(),
																				optimisticOps: [],
																				unsignaledParts: {},
																			}),
																	(ne.queries.query[O.query.index.name || ''] =
																		te)))
													}
													return (
														em(K, te, H, J),
														K.promise.then(function (ce) {
															var ae = ed(
																ce.result,
																O,
																ne?.optimisticOps,
																p,
																K,
																B,
															)
															return {result: B ? ae : $(ae)}
														})
													)
												},
											})
										return k
									},
								})
							return u
						},
					}
					function Ls(a, o) {
						return new Proxy(a, {
							get: function (u, h, p) {
								return h === 'db' ? o : Reflect.get(u, h, p)
							},
						})
					}
					var Yn = (function () {
							function a(o, u) {
								var h = this
								;((this._middlewares = {}), (this.verno = 0))
								var p = a.dependencies
								;((this._options = u =
									i(
										{
											addons: a.addons,
											autoOpen: !0,
											indexedDB: p.indexedDB,
											IDBKeyRange: p.IDBKeyRange,
											cache: 'cloned',
											maxConnections: Xt,
										},
										u,
									)),
									(this._deps = {
										indexedDB: u.indexedDB,
										IDBKeyRange: u.IDBKeyRange,
									}))
								var w = u.addons
								;((this._dbSchema = {}),
									(this._versions = []),
									(this._storeNames = []),
									(this._allTables = {}),
									(this.idbdb = null),
									(this._novip = this))
								var k = {
									dbOpenError: null,
									isBeingOpened: !1,
									onReadyBeingFired: null,
									openComplete: !1,
									dbReadyResolve: st,
									dbReadyPromise: null,
									cancelOpen: st,
									openCanceller: null,
									autoSchema: !0,
									PR1398_maxLoop: 3,
									autoOpen: u.autoOpen,
								}
								;((k.dbReadyPromise = new Se(function (D) {
									k.dbReadyResolve = D
								})),
									(k.openCanceller = new Se(function (D, B) {
										k.cancelOpen = B
									})),
									(this._state = k),
									(this.name = o),
									(this.on = Mi(
										this,
										'populate',
										'blocked',
										'versionchange',
										'close',
										{ready: [C, st]},
									)),
									(this.once = function (D, B) {
										var W = function () {
											for (var H = [], J = 0; J < arguments.length; J++)
												H[J] = arguments[J]
											;(h.on(D).unsubscribe(W), B.apply(h, H))
										}
										return h.on(D, W)
									}),
									(this.on.ready.subscribe = U(
										this.on.ready.subscribe,
										function (D) {
											return function (B, W) {
												a.vip(function () {
													var H = h._state
													if (H.openComplete)
														(H.dbOpenError || Se.resolve().then(B), W && D(B))
													else if (H.onReadyBeingFired)
														(H.onReadyBeingFired.push(B), W && D(B))
													else {
														D(B)
														var J = h
														W ||
															D(function le() {
																;(J.on.ready.unsubscribe(B),
																	J.on.ready.unsubscribe(le))
															})
													}
												})
											}
										},
									)),
									(this.Collection = uo(this)),
									(this.Table = eu(this)),
									(this.Transaction = po(this)),
									(this.Version = P_(this)),
									(this.WhereClause = nu(this)),
									this.on('versionchange', function (D) {
										;(D.newVersion > 0
											? console.warn(
													"Another connection wants to upgrade database '".concat(
														h.name,
														"'. Closing db now to resume the upgrade.",
													),
												)
											: console.warn(
													"Another connection wants to delete database '".concat(
														h.name,
														"'. Closing db now to resume the delete request.",
													),
												),
											h.close({disableAutoOpen: !1}))
									}),
									this.on('blocked', function (D) {
										!D.newVersion || D.newVersion < D.oldVersion
											? console.warn(
													"Dexie.delete('".concat(h.name, "') was blocked"),
												)
											: console.warn(
													"Upgrade '"
														.concat(
															h.name,
															"' blocked by other connection holding version ",
														)
														.concat(D.oldVersion / 10),
												)
									}),
									(this._maxKey = qi(u.IDBKeyRange)),
									(this._createTransaction = function (D, B, W, H) {
										return new h.Transaction(
											D,
											B,
											W,
											h._options.chromeTransactionDurability,
											H,
										)
									}),
									(this._fireOnBlocked = function (D) {
										;(h.on('blocked').fire(D),
											mo
												.toArray()
												.filter(function (B) {
													return (
														B.name === h.name && B !== h && !B._state.vcFired
													)
												})
												.map(function (B) {
													return B.on('versionchange').fire(D)
												}))
									}),
									this.use(G_),
									this.use(rm),
									this.use(H_),
									this.use(q_),
									this.use(K_))
								var O = new Proxy(this, {
									get: function (D, B, W) {
										if (B === '_vip') return !0
										if (B === 'table')
											return function (J) {
												return Ls(h.table(J), O)
											}
										var H = Reflect.get(D, B, W)
										return H instanceof Li
											? Ls(H, O)
											: B === 'tables'
												? H.map(function (J) {
														return Ls(J, O)
													})
												: B === '_createTransaction'
													? function () {
															var J = H.apply(this, arguments)
															return Ls(J, O)
														}
													: H
									},
								})
								;((this.vip = O),
									w.forEach(function (D) {
										return D(h)
									}))
							}
							return (
								(a.prototype.version = function (o) {
									if (isNaN(o) || o < 0.1)
										throw new Oe.Type('Given version is not a positive number')
									if (
										((o = Math.round(o * 10) / 10),
										this.idbdb || this._state.isBeingOpened)
									)
										throw new Oe.Schema(
											'Cannot add version when database is open',
										)
									this.verno = Math.max(this.verno, o)
									var u = this._versions,
										h = u.filter(function (p) {
											return p._cfg.version === o
										})[0]
									return (
										h ||
										((h = new this.Version(o)),
										u.push(h),
										u.sort(k_),
										h.stores({}),
										(this._state.autoSchema = !1),
										h)
									)
								}),
								(a.prototype._whenReady = function (o) {
									var u = this
									return this.idbdb &&
										(this._state.openComplete || ke.letThrough || this._vip)
										? o()
										: new Se(function (h, p) {
												if (u._state.openComplete)
													return p(new Oe.DatabaseClosed(u._state.dbOpenError))
												if (!u._state.isBeingOpened) {
													if (!u._state.autoOpen) {
														p(new Oe.DatabaseClosed())
														return
													}
													u.open().catch(st)
												}
												u._state.dbReadyPromise.then(h, p)
											}).then(o)
								}),
								(a.prototype.use = function (o) {
									var u = o.stack,
										h = o.create,
										p = o.level,
										w = o.name
									w && this.unuse({stack: u, name: w})
									var k = this._middlewares[u] || (this._middlewares[u] = [])
									return (
										k.push({stack: u, create: h, level: p ?? 10, name: w}),
										k.sort(function (O, D) {
											return O.level - D.level
										}),
										this
									)
								}),
								(a.prototype.unuse = function (o) {
									var u = o.stack,
										h = o.name,
										p = o.create
									return (
										u &&
											this._middlewares[u] &&
											(this._middlewares[u] = this._middlewares[u].filter(
												function (w) {
													return p ? w.create !== p : h ? w.name !== h : !1
												},
											)),
										this
									)
								}),
								(a.prototype.open = function () {
									var o = this
									return Fe(Yt, function () {
										return j_(o)
									})
								}),
								(a.prototype._close = function () {
									this.on.close.fire(new CustomEvent('close'))
									var o = this._state
									if ((mo.remove(this), this.idbdb)) {
										try {
											this.idbdb.close()
										} catch {}
										this.idbdb = null
									}
									o.isBeingOpened ||
										((o.dbReadyPromise = new Se(function (u) {
											o.dbReadyResolve = u
										})),
										(o.openCanceller = new Se(function (u, h) {
											o.cancelOpen = h
										})))
								}),
								(a.prototype.close = function (o) {
									var u = o === void 0 ? {disableAutoOpen: !0} : o,
										h = u.disableAutoOpen,
										p = this._state
									h
										? (p.isBeingOpened && p.cancelOpen(new Oe.DatabaseClosed()),
											this._close(),
											(p.autoOpen = !1),
											(p.dbOpenError = new Oe.DatabaseClosed()))
										: (this._close(),
											(p.autoOpen = this._options.autoOpen || p.isBeingOpened),
											(p.openComplete = !1),
											(p.dbOpenError = null))
								}),
								(a.prototype.delete = function (o) {
									var u = this
									o === void 0 && (o = {disableAutoOpen: !0})
									var h =
											arguments.length > 0 && typeof arguments[0] != 'object',
										p = this._state
									return new Se(function (w, k) {
										var O = function () {
											u.close(o)
											var D = u._deps.indexedDB.deleteDatabase(u.name)
											;((D.onsuccess = Dt(function () {
												;(B_(u._deps, u.name), w())
											})),
												(D.onerror = Jr(k)),
												(D.onblocked = u._fireOnBlocked))
										}
										if (h)
											throw new Oe.InvalidArgument(
												'Invalid closeOptions argument to db.delete()',
											)
										p.isBeingOpened ? p.dbReadyPromise.then(O) : O()
									})
								}),
								(a.prototype.backendDB = function () {
									return this.idbdb
								}),
								(a.prototype.isOpen = function () {
									return this.idbdb !== null
								}),
								(a.prototype.hasBeenClosed = function () {
									var o = this._state.dbOpenError
									return o && o.name === 'DatabaseClosed'
								}),
								(a.prototype.hasFailed = function () {
									return this._state.dbOpenError !== null
								}),
								(a.prototype.dynamicallyOpened = function () {
									return this._state.autoSchema
								}),
								Object.defineProperty(a.prototype, 'tables', {
									get: function () {
										var o = this
										return f(this._allTables).map(function (u) {
											return o._allTables[u]
										})
									},
									enumerable: !1,
									configurable: !0,
								}),
								(a.prototype.transaction = function () {
									var o = U_.apply(this, arguments)
									return this._transaction.apply(this, o)
								}),
								(a.prototype._transaction = function (o, u, h) {
									var p = this,
										w = ke.trans
									;(!w || w.db !== this || o.indexOf('!') !== -1) && (w = null)
									var k = o.indexOf('?') !== -1
									o = o.replace('!', '').replace('?', '')
									var O, D
									try {
										if (
											((D = u.map(function (W) {
												var H = W instanceof p.Table ? W.name : W
												if (typeof H != 'string')
													throw new TypeError(
														'Invalid table argument to Dexie.transaction(). Only Table or String are allowed',
													)
												return H
											})),
											o == 'r' || o === Qt)
										)
											O = Qt
										else if (o == 'rw' || o == nr) O = nr
										else
											throw new Oe.InvalidArgument(
												'Invalid transaction mode: ' + o,
											)
										if (w) {
											if (w.mode === Qt && O === nr)
												if (k) w = null
												else
													throw new Oe.SubTransaction(
														'Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY',
													)
											;(w &&
												D.forEach(function (W) {
													if (w && w.storeNames.indexOf(W) === -1)
														if (k) w = null
														else
															throw new Oe.SubTransaction(
																'Table ' +
																	W +
																	' not included in parent transaction.',
															)
												}),
												k && w && !w.active && (w = null))
										}
									} catch (W) {
										return w
											? w._promise(null, function (H, J) {
													J(W)
												})
											: yt(W)
									}
									var B = Zc.bind(null, this, O, D, w, h)
									return w
										? w._promise(O, B, 'lock')
										: ke.trans
											? Fe(ke.transless, function () {
													return p._whenReady(B)
												})
											: this._whenReady(B)
								}),
								(a.prototype.table = function (o) {
									if (!v(this._allTables, o))
										throw new Oe.InvalidTable(
											'Table '.concat(o, ' does not exist'),
										)
									return this._allTables[o]
								}),
								a
							)
						})(),
						nm =
							typeof Symbol < 'u' && 'observable' in Symbol
								? Symbol.observable
								: '@@observable',
						im = (function () {
							function a(o) {
								this._subscribe = o
							}
							return (
								(a.prototype.subscribe = function (o, u, h) {
									return this._subscribe(
										!o || typeof o == 'function'
											? {next: o, error: u, complete: h}
											: o,
									)
								}),
								(a.prototype[nm] = function () {
									return this
								}),
								a
							)
						})(),
						Ms
					try {
						Ms = {
							indexedDB:
								l.indexedDB ||
								l.mozIndexedDB ||
								l.webkitIndexedDB ||
								l.msIndexedDB,
							IDBKeyRange: l.IDBKeyRange || l.webkitIDBKeyRange,
						}
					} catch {
						Ms = {indexedDB: null, IDBKeyRange: null}
					}
					function rd(a) {
						var o = !1,
							u,
							h = new im(function (p) {
								var w = M(a)
								function k(te) {
									var pe = li()
									try {
										w && fi()
										var ce = Mn(a, te)
										return (w && (ce = ce.finally(_n)), ce)
									} finally {
										pe && ui()
									}
								}
								var O = !1,
									D,
									B = {},
									W = {},
									H = {
										get closed() {
											return O
										},
										unsubscribe: function () {
											O ||
												((O = !0),
												D && D.abort(),
												J && rn.storagemutated.unsubscribe(V))
										},
									}
								p.start && p.start(H)
								var J = !1,
									le = function () {
										return wt(ne)
									}
								function K() {
									return hu(W, B)
								}
								var V = function (te) {
										;(Os(B, te), K() && le())
									},
									ne = function () {
										if (!(O || !Ms.indexedDB)) {
											B = {}
											var te = {}
											;(D && D.abort(), (D = new AbortController()))
											var pe = {
													subscr: te,
													signal: D.signal,
													requery: le,
													querier: a,
													trans: null,
												},
												ce = k(pe)
											;(J || (rn.storagemutated.subscribe(V), (J = !0)),
												Promise.resolve(ce).then(
													function (ae) {
														;((o = !0),
															(u = ae),
															!(O || pe.signal.aborted) &&
																(K()
																	? le()
																	: ((W = te),
																		K()
																			? le()
																			: ((B = {}),
																				wt(function () {
																					return !O && p.next && p.next(ae)
																				})))))
													},
													function (ae) {
														;((o = !1),
															['DatabaseClosedError', 'AbortError'].includes(
																ae?.name,
															) ||
																O ||
																wt(function () {
																	O || (p.error && p.error(ae))
																}))
													},
												))
										}
									}
								return (setTimeout(le, 0), H)
							})
						return (
							(h.hasValue = function () {
								return o
							}),
							(h.getValue = function () {
								return u
							}),
							h
						)
					}
					var Wi = Yn
					;(_(
						Wi,
						i(i({}, Pt), {
							delete: function (a) {
								var o = new Wi(a, {addons: []})
								return o.delete()
							},
							exists: function (a) {
								return new Wi(a, {addons: []})
									.open()
									.then(function (o) {
										return (o.close(), !0)
									})
									.catch('NoSuchDatabaseError', function () {
										return !1
									})
							},
							getDatabaseNames: function (a) {
								try {
									return M_(Wi.dependencies).then(a)
								} catch {
									return yt(new Oe.MissingAPI())
								}
							},
							defineClass: function () {
								function a(o) {
									m(this, o)
								}
								return a
							},
							ignoreTransaction: function (a) {
								return ke.trans ? Fe(ke.transless || Yt, a) : a()
							},
							vip: fu,
							async: function (a) {
								return function () {
									try {
										var o = _u(a.apply(this, arguments))
										return !o || typeof o.then != 'function' ? Se.resolve(o) : o
									} catch (u) {
										return yt(u)
									}
								}
							},
							spawn: function (a, o, u) {
								try {
									var h = _u(a.apply(u, o || []))
									return !h || typeof h.then != 'function' ? Se.resolve(h) : h
								} catch (p) {
									return yt(p)
								}
							},
							currentTransaction: {
								get: function () {
									return ke.trans || null
								},
							},
							waitFor: function (a, o) {
								var u = Se.resolve(
									typeof a == 'function' ? Wi.ignoreTransaction(a) : a,
								).timeout(o || 6e4)
								return ke.trans ? ke.trans.waitFor(u) : u
							},
							Promise: Se,
							debug: {
								get: function () {
									return se
								},
								set: function (a) {
									we(a)
								},
							},
							derive: R,
							extend: m,
							props: _,
							override: U,
							Events: Mi,
							on: rn,
							liveQuery: rd,
							extendObservabilitySet: Os,
							getByKeyPath: ge,
							setByKeyPath: ye,
							delByKeyPath: Ne,
							shallowClone: je,
							deepClone: $,
							getObjectDiff: mu,
							cmp: He,
							asap: X,
							minKey: Nt,
							addons: [],
							connections: {get: mo.toArray},
							errnames: _t,
							dependencies: Ms,
							cache: Ki,
							semVer: Ir,
							version: Ir.split('.')
								.map(function (a) {
									return parseInt(a)
								})
								.reduce(function (a, o, u) {
									return a + o / Math.pow(10, u * 2)
								}),
						}),
					),
						(Wi.maxKey = qi(Wi.dependencies.IDBKeyRange)),
						typeof dispatchEvent < 'u' &&
							typeof addEventListener < 'u' &&
							(rn(Ui, function (a) {
								if (!hi) {
									var o
									;((o = new CustomEvent(vo, {detail: a})),
										(hi = !0),
										dispatchEvent(o),
										(hi = !1))
								}
							}),
							addEventListener(vo, function (a) {
								var o = a.detail
								hi || wu(o)
							})))
					function wu(a) {
						var o = hi
						try {
							;((hi = !0), rn.storagemutated.fire(a), gu(a, !0))
						} finally {
							hi = o
						}
					}
					var hi = !1,
						vi,
						Su = function () {}
					;(typeof BroadcastChannel < 'u' &&
						((Su = function () {
							;((vi = new BroadcastChannel(vo)),
								(vi.onmessage = function (a) {
									return a.data && wu(a.data)
								}))
						}),
						Su(),
						typeof vi.unref == 'function' && vi.unref(),
						rn(Ui, function (a) {
							hi || vi.postMessage(a)
						})),
						typeof addEventListener < 'u' &&
							(addEventListener('pagehide', function (a) {
								if (!Yn.disableBfCache && a.persisted) {
									;(se && console.debug('Dexie: handling persisted pagehide'),
										vi?.close())
									for (var o = 0, u = mo.toArray(); o < u.length; o++) {
										var h = u[o]
										h.close({disableAutoOpen: !1})
									}
								}
							}),
							addEventListener('pageshow', function (a) {
								!Yn.disableBfCache &&
									a.persisted &&
									(se && console.debug('Dexie: handling persisted pageshow'),
									Su(),
									wu({all: new Or(-1 / 0, [[]])}))
							})))
					function am(a) {
						return new Qr({add: a})
					}
					function om(a) {
						return new Qr({remove: a})
					}
					function sm(a, o) {
						return new Qr({replacePrefix: [a, o]})
					}
					;((Se.rejectionMapper = fr), we(se))
					var lm = Object.freeze({
						__proto__: null,
						DEFAULT_MAX_CONNECTIONS: Xt,
						Dexie: Yn,
						Entity: mn,
						PropModification: Qr,
						RangeSet: Or,
						add: am,
						cmp: He,
						default: Yn,
						liveQuery: rd,
						mergeRanges: bo,
						rangesOverlap: Gc,
						remove: om,
						replacePrefix: sm,
					})
					return (i(Yn, lm, {default: Yn}), Yn)
				})
			})(rl)),
		rl.exports
	)
}
var Ay = xy()
const ac = Wp(Ay),
	kd = Symbol.for('Dexie'),
	cl = globalThis[kd] || (globalThis[kd] = ac)
if (ac.semVer !== cl.semVer)
	throw new Error(
		`Two different versions of Dexie loaded in the same app: ${ac.semVer} and ${cl.semVer}`,
	)
const {
	liveQuery: cS,
	mergeRanges: dS,
	rangesOverlap: hS,
	RangeSet: vS,
	cmp: pS,
	Entity: gS,
	PropModification: _S,
	replacePrefix: mS,
	add: yS,
	remove: bS,
	DexieYProvider: wS,
} = cl
class Ty extends cl {
	episodes
	bookmarks
	constructor() {
		;(super('ai-radio-db'),
			this.version(1).stores({
				episodes: '++id, title, topic, createdAt, isFavorite',
				bookmarks: '++id, episodeId, segmentIndex, timestamp',
			}))
	}
}
const ri = new Ty()
async function Gp(e) {
	return await ri.episodes.add(e)
}
async function Tc() {
	return await ri.episodes.orderBy('createdAt').reverse().toArray()
}
async function Iy(e) {
	await ri.episodes.delete(e)
}
async function Ry(e, t) {
	await ri.episodes.update(e, {isFavorite: t})
}
async function xd(e) {
	return e
		? await ri.bookmarks.where('episodeId').equals(e).toArray()
		: await ri.bookmarks.toArray()
}
async function Cy(e) {
	const t = await ri.bookmarks
		.where({episodeId: e.episodeId, segmentIndex: e.segmentIndex})
		.first()
	t?.id ? await ri.bookmarks.delete(t.id) : await ri.bookmarks.add(e)
}
function Oy() {
	let e = localStorage.getItem('ai-radio-device-id')
	return (
		e ||
			((e = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`),
			localStorage.setItem('ai-radio-device-id', e)),
		e
	)
}
async function Dy() {
	const t = (await Tc()).map(r => ({...r, audioUrl: void 0, audioBlob: void 0}))
	return {
		version: 1,
		exportedAt: new Date().toISOString(),
		deviceId: Oy(),
		settings: bi(),
		episodes: t,
	}
}
function Py(e) {
	const t = JSON.stringify(e, null, 2),
		r = new Blob([t], {type: 'application/json'}),
		n = URL.createObjectURL(r),
		i = document.createElement('a')
	;((i.href = n),
		(i.download = `ai-radio-backup-${new Date().toISOString().slice(0, 10)}.json`),
		document.body.appendChild(i),
		i.click(),
		document.body.removeChild(i),
		URL.revokeObjectURL(n))
}
async function Ly(e) {
	const t = await e.text(),
		r = JSON.parse(t)
	if (!r.version || !r.episodes || !r.settings)
		throw new Error('Invalid sync file format')
	let n = !1,
		i = 0
	if (
		(r.settings && (to(r.settings), (n = !0)),
		r.episodes && Array.isArray(r.episodes))
	)
		for (const s of r.episodes)
			(await Tc()).find(
				c =>
					c.title === s.title &&
					c.topic === s.topic &&
					c.createdAt.getTime() === new Date(s.createdAt).getTime(),
			) ||
				(await Gp({
					title: s.title,
					topic: s.topic,
					link: s.link,
					script: s.script,
					audioBlob: void 0,
					audioUrl: void 0,
					duration: s.duration,
					createdAt: new Date(s.createdAt),
					isFavorite: s.isFavorite,
				}),
				i++)
	return {settingsImported: n, episodesImported: i}
}
async function My(e, t) {
	const r = (
			await El(
				async () => {
					const {default: f} = await Promise.resolve().then(() => uS)
					return {default: f}
				},
				void 0,
			)
		).default,
		n = new r(),
		i = await Ad(e.audioUrl)
	n.file('ai_radio.mp3', i)
	const s = t || e.coverDataUrl
	if (s) {
		const f = await Ad(s)
		n.file('cover.png', f)
	}
	const l = Ny(e)
	return (
		n.file('show_notes.json', JSON.stringify(l, null, 2)),
		n.generateAsync({
			type: 'blob',
			compression: 'DEFLATE',
			compressionOptions: {level: 6},
		})
	)
}
async function Ad(e) {
	if (e.startsWith('data:')) return (await fetch(e)).blob()
	if (e.startsWith('blob:')) return (await fetch(e)).blob()
	const t = await fetch(e)
	if (!t.ok) throw new Error(`Failed to fetch ${e}: ${t.statusText}`)
	return t.blob()
}
function Ny(e) {
	const t = e.speakerSegments || []
	let r = 0
	const n = t.map(f => {
			const c = r,
				m = jy(f.text),
				y = c + m
			return (
				(r = y),
				{
					speaker: By(f.speaker),
					start_time: Lu(c),
					end_time: Lu(y),
					text: f.text,
				}
			)
		}),
		i = r,
		s = e.title,
		l = e.script.slice(0, 200).trim() + (e.script.length > 200 ? '...' : '')
	return {
		show_title: s,
		show_duration: Lu(i),
		two_sentence_summary: l,
		date_of_generation: new Date(e.createdAt).toISOString().split('T')[0],
		timecoded_transcript: n,
	}
}
function By(e) {
	return {HOST: 'MODERATOR', GUEST: 'GAST', CALLER: 'ANRUFER'}[e] || e
}
function Lu(e) {
	if (!e || !isFinite(e)) return '00:00'
	const t = Math.floor(e / 60),
		r = Math.floor(e % 60)
	return `${t.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`
}
function Fy(e, t) {
	const r = URL.createObjectURL(e),
		n = document.createElement('a')
	;((n.href = r),
		(n.download = t),
		document.body.appendChild(n),
		n.click(),
		document.body.removeChild(n),
		URL.revokeObjectURL(r))
}
function jy(e) {
	return (e.trim().split(/\s+/).length / 150) * 60
}
const Qo = {
		technology: [
			'Künstliche Intelligenz erklärt: Was steckt hinter ChatGPT?',
			'Quantencomputer: Die Zukunft der Rechenleistung',
			'Cyber-Sicherheit: So schützt du dich online',
			'Robotik im Alltag: Vom Roboterarm zum Androiden',
			'Space Tech: Mars-Missionen und Weltraumtourismus',
			'5G und 6G: Mehr als nur schnelleres Internet',
			'Blockchain jenseits von Krypto: Smart Contracts & DAOs',
			'Edge Computing: Rechenleistung am Rand des Netzes',
			'Digital Twins: Virtuelle Abbilder der Realität',
			'Neuromorphe Chips: Hardware, die wie das Gehirn denkt',
		],
		science: [
			'Klimawandel: Kipppunkte und Lösungsansätze',
			'CRISPR & Gentechnik: Die Schere im Erbgut',
			'Dunkle Materie: Was hält das Universum zusammen?',
			'mRNA-Impfstoffe: Revolution der Medizin',
			'Neurowissenschaften: Wie das Gehirn Bewusstsein erschafft',
			'Kernfusion: Die Energie der Sterne auf der Erde',
			'Mikrobiom: Die Bakterien, die wir sind',
			'Quantenverschränkung: Spukhafte Fernwirkung',
			'Astrobiologie: Suche nach außerirdischem Leben',
			'Materialwissenschaft: Graphen & Metamaterialien',
		],
		culture: [
			'Digital Art & NFTs: Kunst im Blockchain-Zeitalter',
			'Gaming-Kultur: Vom Nischenhobby zum Mainstream',
			'Streaming-Wars: Wie sich unser Medienkonsum ändert',
			'Social Media Algorithmen: Was sie über dich wissen',
			'Meme Culture: Die Sprache des Internets',
			'Virtual Influencer: Wenn Avatare berühmter sind als Menschen',
			'Creator Economy: Vom Hobby zum Beruf',
			'Retro Gaming: Warum Pixel nie aus der Mode kommen',
			'Internet-Ästhetiken: Vaporwave, Cottagecore & Co.',
			'Digital Fashion: Kleidung, die nicht existiert',
		],
		society: [
			'Future of Work: Remote, KI & 4-Tage-Woche',
			'Bildung 2030: Lernen mit KI-Tutoren',
			'Datenschutz vs. Überwachung: Der gläserne Mensch',
			'KI-Ethik: Wer haftet für algorithmische Entscheidungen?',
			'Urban Planning: Schwammstädte & 15-Minuten-Städte',
			'Grundeinkommen: Utopie oder Notwendigkeit?',
			'Demografie: Alternende Gesellschaften & Migration',
			'Gig Economy: Freiheit oder Prekarität?',
			'Desinformation: Wie Fake News die Demokratie bedrohen',
			'Mental Health im digitalen Zeitalter',
		],
		fun: [
			'Weird Science: Ig-Nobel-Preise & kurioseste Studien',
			'Internet Mysteries: Cicada 3301 & ungeklärte Phänomene',
			'Retro Tech: Disketten, Modems & der Sound der 90er',
			'Verschwörungstheorien: Warum wir an sie glauben',
			'Die seltsamsten Gesetze aus aller Welt',
			'Lost Media: Verschwundene Filme, Spiele & Websites',
			'Number Stations: Geheime Radiosignale im Äther',
			'Glitches in the Matrix: Simulationstheorie',
			'Kryptide: Bigfoot, Nessie & die Suche nach Beweisen',
			'Die absurdesten Patente der Geschichte',
		],
	},
	Uy = {
		technology: '💻 Technologie',
		science: '🔬 Wissenschaft',
		culture: '🎨 Kultur',
		society: '👥 Gesellschaft',
		fun: '🎲 Fun & Kurioses',
	},
	Td = Object.values(Qo).flat()
function Oo(e) {
	if (e && Qo[e]) {
		const t = Qo[e]
		return t[Math.floor(Math.random() * t.length)]
	}
	return Td[Math.floor(Math.random() * Td.length)]
}
function Id(e) {
	return Qo[e] || []
}
function zy() {
	return Object.keys(Qo)
}
function qy() {
	return Object.entries(Uy).map(([e, t]) => ({id: e, name: t}))
}
const Ky = Oo
async function Wy(e) {
	try {
		return await eo('fetch_link_content', {url: e})
	} catch {
		const t = e.startsWith('http') ? e : `https://${e}`,
			r = await fetch(t, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; AI-Radio/1.0)',
					Accept: 'text/html,application/xhtml+xml',
				},
			})
		if (!r.ok)
			throw new Error(`URL konnte nicht geladen werden (HTTP ${r.status})`)
		const n = await r.text()
		return Gy(n)
	}
}
function Gy(e) {
	const t = e.match(/<title[^>]*>([^<]+)<\/title>/i),
		r = t ? t[1].trim() : ''
	let n = e
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&#\d+;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
	return (
		(n = n.slice(0, 8e3)),
		r
			? `Titel: ${r}

${n}`
			: n
	)
}
var Rd
;(function (e) {
	;((e.WINDOW_RESIZED = 'tauri://resize'),
		(e.WINDOW_MOVED = 'tauri://move'),
		(e.WINDOW_CLOSE_REQUESTED = 'tauri://close-requested'),
		(e.WINDOW_DESTROYED = 'tauri://destroyed'),
		(e.WINDOW_FOCUS = 'tauri://focus'),
		(e.WINDOW_BLUR = 'tauri://blur'),
		(e.WINDOW_SCALE_FACTOR_CHANGED = 'tauri://scale-change'),
		(e.WINDOW_THEME_CHANGED = 'tauri://theme-changed'),
		(e.WINDOW_CREATED = 'tauri://window-created'),
		(e.WINDOW_SUSPENDED = 'tauri://suspended'),
		(e.WINDOW_RESUMED = 'tauri://resumed'),
		(e.WEBVIEW_CREATED = 'tauri://webview-created'),
		(e.DRAG_ENTER = 'tauri://drag-enter'),
		(e.DRAG_OVER = 'tauri://drag-over'),
		(e.DRAG_DROP = 'tauri://drag-drop'),
		(e.DRAG_LEAVE = 'tauri://drag-leave'))
})(Rd || (Rd = {}))
async function Hy(e, t) {
	;(window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(e, t),
		await eo('plugin:event|unlisten', {event: e, eventId: t}))
}
async function Hp(e, t, r) {
	var n
	const i = (n = void 0) !== null && n !== void 0 ? n : {kind: 'Any'}
	return eo('plugin:event|listen', {event: e, target: i, handler: jp(t)}).then(
		s => async () => Hy(e, s),
	)
}
function $y(e) {
	return Hp('local-llm-ready', () => e())
}
function Vy(e) {
	return Hp('local-llm-error', t => {
		e(t.payload)
	})
}
const Zy = {
	tech: {
		name: 'tech',
		bgColor: '#0a0a0a',
		accentColor: '#00ff41',
		secondaryColor: '#003311',
		patternFn: nb,
	},
	casual: {
		name: 'casual',
		bgColor: '#1a1a0a',
		accentColor: '#ffaa00',
		secondaryColor: '#332200',
		patternFn: ib,
	},
	academic: {
		name: 'academic',
		bgColor: '#0a0a1a',
		accentColor: '#00aaff',
		secondaryColor: '#002244',
		patternFn: ab,
	},
	entertaining: {
		name: 'entertaining',
		bgColor: '#1a0a1a',
		accentColor: '#ff00aa',
		secondaryColor: '#330022',
		patternFn: ob,
	},
	news: {
		name: 'news',
		bgColor: '#1a1a1a',
		accentColor: '#ff3333',
		secondaryColor: '#441111',
		patternFn: sb,
	},
	podcast: {
		name: 'podcast',
		bgColor: '#0a1a1a',
		accentColor: '#00ffaa',
		secondaryColor: '#003322',
		patternFn: lb,
	},
	chill: {
		name: 'chill',
		bgColor: '#0a1a0a',
		accentColor: '#88ff88',
		secondaryColor: '#113311',
		patternFn: ub,
	},
}
let Us = 1
function Yy(e) {
	return (
		(Us = e || 1),
		() => ((Us = (Us * 1664525 + 1013904223) % 4294967296), Us / 4294967296)
	)
}
function Xy(e) {
	let t = 0
	for (let r = 0; r < e.length; r++) {
		const n = e.charCodeAt(r)
		;((t = (t << 5) - t + n), (t = t & t))
	}
	return Math.abs(t)
}
function Qy(e, t, r, n, i, s, l) {
	const f = t.split(' '),
		c = []
	let m = ''
	for (const y of f) {
		const g = m ? `${m} ${y}` : y
		e.measureText(g).width > i && m ? (c.push(m), (m = y)) : (m = g)
	}
	return (m && c.push(m), c)
}
function Jy(e, t, r, n, i, s) {
	;(e.save(),
		(e.font = `bold ${Math.max(16, r / 24)}px "Courier New", monospace`),
		(e.fillStyle = i),
		(e.textAlign = 'center'),
		(e.shadowColor = i),
		(e.shadowBlur = 10))
	const l = Qy(e, t, 0, 0, r * 0.85),
		f = n * 0.15
	;(l.forEach((c, m) => {
		const y = f + m * (n * 0.06)
		e.fillText(c, r / 2, y)
	}),
		e.restore())
}
function eb(e, t, r, n, i) {
	;(e.save(),
		(e.font = `${Math.max(10, r / 36)}px "Courier New", monospace`),
		(e.fillStyle = i),
		(e.textAlign = 'center'))
	const s = Math.floor((r / (r / 36)) * 0.7),
		l = t.length > s ? t.slice(0, s) + '...' : t
	;(e.fillText(l, r / 2, n * 0.88), e.restore())
}
function tb(e, t, r, n, i) {
	e.save()
	const s = t / 2,
		l = r / 2,
		f = Math.min(t, r) * 0.2
	;((e.strokeStyle = n),
		(e.lineWidth = 3),
		(e.shadowColor = n),
		(e.shadowBlur = 15),
		e.beginPath(),
		e.arc(s, l, f, 0, Math.PI * 2),
		e.stroke(),
		e.beginPath(),
		e.arc(s, l, f * 0.6, 0, Math.PI * 2),
		e.stroke(),
		e.beginPath(),
		e.moveTo(s, l - f * 0.6),
		e.lineTo(s, l - f),
		e.stroke(),
		e.beginPath(),
		e.arc(s, l, f * 0.2, 0, Math.PI * 2),
		(e.fillStyle = n),
		e.fill(),
		e.restore())
}
function rb(e, t, r, n) {
	;(e.save(), (e.strokeStyle = n), (e.lineWidth = 1), (e.globalAlpha = 0.1))
	for (let i = 0; i < r; i += 4)
		(e.beginPath(), e.moveTo(0, i), e.lineTo(t, i), e.stroke())
	e.restore()
}
function nb(e, t, r, n) {
	;(e.save(), (e.strokeStyle = '#003311'), (e.lineWidth = 1))
	const i = 40
	for (let s = 0; s < t; s += i)
		for (let l = 0; l < r; l += i)
			if (
				(n() > 0.7 &&
					(e.beginPath(),
					e.moveTo(s, l),
					n() > 0.5 ? e.lineTo(s + i, l) : e.lineTo(s, l + i),
					e.stroke()),
				n() > 0.85)
			) {
				const f = s + n() * i,
					c = l + n() * i
				;(e.beginPath(), e.arc(f, c, 3, 0, Math.PI * 2), e.stroke())
			}
	e.restore()
}
function ib(e, t, r, n) {
	;(e.save(), (e.strokeStyle = '#332200'), (e.lineWidth = 2))
	for (let i = 0; i < 5; i++) {
		e.beginPath()
		const s = 20 + n() * 40,
			l = 0.01 + n() * 0.02,
			f = r * 0.3 + i * (r * 0.15),
			c = n() * Math.PI * 2
		e.moveTo(0, f)
		for (let m = 0; m < t; m += 2) {
			const y = f + Math.sin(m * l + c) * s
			e.lineTo(m, y)
		}
		e.stroke()
	}
	e.restore()
}
function ab(e, t, r, n) {
	;(e.save(), (e.strokeStyle = '#002244'), (e.lineWidth = 0.5))
	const i = 30
	for (let s = 0; s <= t; s += i)
		(e.beginPath(), e.moveTo(s, 0), e.lineTo(s, r), e.stroke())
	for (let s = 0; s <= r; s += i)
		(e.beginPath(), e.moveTo(0, s), e.lineTo(t, s), e.stroke())
	e.fillStyle = '#004488'
	for (let s = i; s < t; s += i * 2)
		for (let l = i; l < r; l += i * 2)
			n() > 0.6 && e.fillRect(s - 2, l - 2, 4, 4)
	e.restore()
}
function ob(e, t, r, n) {
	;(e.save(), (e.fillStyle = '#330022'))
	for (let i = 0; i < 80; i++) {
		const s = n() * t,
			l = n() * r,
			f = 1 + n() * 3,
			c = 5,
			m = f,
			y = f * 0.4
		e.beginPath()
		const g = Math.PI / c
		for (let v = 0; v < c * 2; v++) {
			const _ = v % 2 === 0 ? m : y,
				S = v * g - Math.PI / 2,
				x = s + Math.cos(S) * _,
				R = l + Math.sin(S) * _
			v === 0 ? e.moveTo(x, R) : e.lineTo(x, R)
		}
		;(e.closePath(), e.fill())
	}
	e.restore()
}
function sb(e, t, r, n) {
	;(e.save(), (e.strokeStyle = '#441111'), (e.lineWidth = 2))
	for (let i = 0; i < 12; i++) {
		const s = (r / 13) * (i + 1) + (n() - 0.5) * 10
		;(e.beginPath(), e.moveTo(0, s))
		for (let l = 0; l < t; l += 10) {
			const f = (n() - 0.5) * 4
			e.lineTo(l, s + f)
		}
		e.stroke()
	}
	e.restore()
}
function lb(e, t, r, n) {
	;(e.save(), (e.strokeStyle = '#003322'), (e.lineWidth = 1.5))
	for (let i = 0; i < 40; i++) {
		const s = t / 40,
			l = i * s,
			f = n() * r * 0.4,
			c = (r - f) / 2
		;(e.beginPath(),
			e.moveTo(l + s / 2, c + f),
			e.lineTo(l + s / 2, c),
			e.stroke())
	}
	e.restore()
}
function ub(e, t, r, n) {
	;(e.save(), (e.fillStyle = '#113311'))
	for (let i = 0; i < 15; i++) {
		const s = n() * t,
			l = n() * r,
			f = 20 + n() * 40
		e.beginPath()
		for (let c = 0; c < 8; c++) {
			const m = (c / 8) * Math.PI * 2,
				y = f * (0.5 + n() * 0.5),
				g = s + Math.cos(m) * y,
				v = l + Math.sin(m) * y * 0.6
			c === 0 ? e.moveTo(g, v) : e.lineTo(g, v)
		}
		;(e.closePath(), e.fill())
	}
	e.restore()
}
function $p(e) {
	const t = e.width || 512,
		r = e.height || 512,
		n = e.seed ?? Xy(`${e.title}-${e.topic}-${e.style}`),
		i = Yy(n),
		s = document.createElement('canvas')
	;((s.width = t), (s.height = r))
	const l = s.getContext('2d')
	if (!l) throw new Error('Failed to get canvas context')
	const f = Zy[e.style]
	return (
		(l.fillStyle = f.bgColor),
		l.fillRect(0, 0, t, r),
		f.patternFn(l, t, r, i),
		rb(l, t, r, f.accentColor),
		tb(l, t, r, f.accentColor),
		Jy(l, e.title, t, r, f.accentColor),
		eb(l, e.topic, t, r, f.secondaryColor),
		s
	)
}
function Vp(e, t = 'image/png') {
	return e.toDataURL(t)
}
function fb(e, t) {
	const r = e.toDataURL('image/png'),
		n = document.createElement('a')
	;((n.href = r),
		(n.download = t),
		document.body.appendChild(n),
		n.click(),
		document.body.removeChild(n))
}
var Ga = typeof self < 'u' ? self : {}
function Zp(e, t) {
	e: {
		for (var r = ['CLOSURE_FLAGS'], n = Ga, i = 0; i < r.length; i++)
			if ((n = n[r[i]]) == null) {
				r = null
				break e
			}
		r = n
	}
	return (e = r && r[e]) != null ? e : t
}
var cb,
	db = typeof TextEncoder < 'u'
function Yp(e) {
	if (db) e = (cb ||= new TextEncoder()).encode(e)
	else {
		let r = 0,
			n = new Uint8Array(3 * e.length)
		for (let i = 0; i < e.length; i++) {
			var t = e.charCodeAt(i)
			if (t < 128) n[r++] = t
			else {
				if (t < 2048) n[r++] = (t >> 6) | 192
				else {
					if (t >= 55296 && t <= 57343) {
						if (t <= 56319 && i < e.length) {
							let s = e.charCodeAt(++i)
							if (s >= 56320 && s <= 57343) {
								;((t = 1024 * (t - 55296) + s - 56320 + 65536),
									(n[r++] = (t >> 18) | 240),
									(n[r++] = ((t >> 12) & 63) | 128),
									(n[r++] = ((t >> 6) & 63) | 128),
									(n[r++] = (63 & t) | 128))
								continue
							}
							i--
						}
						t = 65533
					}
					;((n[r++] = (t >> 12) | 224), (n[r++] = ((t >> 6) & 63) | 128))
				}
				n[r++] = (63 & t) | 128
			}
		}
		e = r === n.length ? n : n.subarray(0, r)
	}
	return e
}
var hb = Zp(610401301, !1),
	Cd = Zp(748402147, !0)
function Od() {
	var e = Ga.navigator
	return e && (e = e.userAgent) ? e : ''
}
var oc,
	Dd = Ga.navigator
oc = (Dd && Dd.userAgentData) || null
var Xp = {},
	Do = null
function vb(e) {
	var t = e.length,
		r = (3 * t) / 4
	r % 3
		? (r = Math.floor(r))
		: '=.'.indexOf(e[t - 1]) != -1 &&
			(r = '=.'.indexOf(e[t - 2]) != -1 ? r - 2 : r - 1)
	var n = new Uint8Array(r),
		i = 0
	return (
		(function (s, l) {
			function f(m) {
				for (; c < s.length;) {
					let y = s.charAt(c++),
						g = Do[y]
					if (g != null) return g
					if (!/^[\s\xa0]*$/.test(y))
						throw Error('Unknown base64 encoding at char: ' + y)
				}
				return m
			}
			Qp()
			for (var c = 0; ;) {
				let m = f(-1),
					y = f(0),
					g = f(64),
					v = f(64)
				if (v === 64 && m === -1) break
				;(l((m << 2) | (y >> 4)),
					g != 64 &&
						(l(((y << 4) & 240) | (g >> 2)),
						v != 64 && l(((g << 6) & 192) | v)))
			}
		})(e, function (s) {
			n[i++] = s
		}),
		i !== r ? n.subarray(0, i) : n
	)
}
function Qp() {
	if (!Do) {
		Do = {}
		var e =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
					'',
				),
			t = ['+/=', '+/', '-_=', '-_.', '-_']
		for (let r = 0; r < 5; r++) {
			let n = e.concat(t[r].split(''))
			Xp[r] = n
			for (let i = 0; i < n.length; i++) {
				let s = n[i]
				Do[s] === void 0 && (Do[s] = i)
			}
		}
	}
}
var pb = typeof Uint8Array < 'u',
	Jp =
		!(
			!(hb && oc && oc.brands.length > 0) &&
			(Od().indexOf('Trident') != -1 || Od().indexOf('MSIE') != -1)
		) && typeof btoa == 'function',
	Pd = /[-_.]/g,
	gb = {'-': '+', _: '/', '.': '='}
function _b(e) {
	return gb[e] || ''
}
function Ld(e) {
	if (!Jp) return vb(e)
	;((e = Pd.test(e) ? e.replace(Pd, _b) : e), (e = atob(e)))
	var t = new Uint8Array(e.length)
	for (let r = 0; r < e.length; r++) t[r] = e.charCodeAt(r)
	return t
}
function sc(e) {
	return pb && e != null && e instanceof Uint8Array
}
var Jo = {}
function Mu() {
	return (mb ||= new ei(null, Jo))
}
var mb,
	ei = class {
		constructor(e, t) {
			if ((eg(t), (this.i = e), e != null && e.length === 0))
				throw Error('ByteString should be constructed with non-empty values')
		}
	}
function eg(e) {
	if (e !== Jo) throw Error('illegal external caller')
}
function tg(e, t) {
	;(e.__closure__error__context__984382 ||
		(e.__closure__error__context__984382 = {}),
		(e.__closure__error__context__984382.severity = t))
}
var yb = void 0
function es(e) {
	return (tg((e = Error(e)), 'warning'), e)
}
function dl(e, t) {
	if (e != null) {
		var r = (yb ??= {}),
			n = r[e] || 0
		n >= t ||
			((r[e] = n + 1),
			tg((e = Error()), 'incident'),
			(function (i) {
				Ga.setTimeout(() => {
					throw i
				}, 0)
			})(e))
	}
}
function Ic() {
	return typeof BigInt == 'function'
}
var Ol = typeof Symbol == 'function' && typeof Symbol() == 'symbol'
function cs(e, t, r = !1) {
	return typeof Symbol == 'function' && typeof Symbol() == 'symbol'
		? r && Symbol.for && e
			? Symbol.for(e)
			: e != null
				? Symbol(e)
				: Symbol()
		: t
}
var Ha,
	bb = cs('jas', void 0, !0),
	Eo = cs(void 0, '1oa'),
	lc = cs(void 0, '0ubsb'),
	wb = cs(void 0, '0actk'),
	Dl = cs('m_m', 'qa', !0),
	rg = {ha: {value: 0, configurable: !0, writable: !0, enumerable: !1}},
	ng = Object.defineProperties,
	Et = Ol ? bb : 'ha',
	Md = []
function ig(e, t) {
	;(Ol || Et in e || ng(e, rg), (e[Et] |= t))
}
function Ur(e, t) {
	;(Ol || Et in e || ng(e, rg), (e[Et] = t))
}
;(Ur(Md, 7), (Ha = Object.freeze(Md)))
var Pl = {}
function Cn(e, t) {
	return t === void 0 ? e.i !== $a && !!(2 & e.m[Et]) : !!(2 & t) && e.i !== $a
}
var $a = {},
	Sb = Object.freeze({})
function Ll(e) {
	return ((e.pa = !0), e)
}
var Eb = Ll(e => typeof e == 'number'),
	ag = Ll(e => typeof e == 'string'),
	kb = Ll(e => typeof e == 'boolean'),
	Ml = typeof Ga.BigInt == 'function' && typeof Ga.BigInt(0) == 'bigint',
	xb = Ll(e =>
		Ml ? e >= Tb && e <= Rb : e[0] === '-' ? Nd(e, Ab) : Nd(e, Ib),
	),
	Ab = Number.MIN_SAFE_INTEGER.toString(),
	Tb = Ml ? BigInt(Number.MIN_SAFE_INTEGER) : void 0,
	Ib = Number.MAX_SAFE_INTEGER.toString(),
	Rb = Ml ? BigInt(Number.MAX_SAFE_INTEGER) : void 0
function Nd(e, t) {
	if (e.length > t.length) return !1
	if (e.length < t.length || e === t) return !0
	for (let r = 0; r < e.length; r++) {
		let n = e[r],
			i = t[r]
		if (n > i) return !1
		if (n < i) return !0
	}
}
var Cb,
	rr = 0,
	sr = 0
function Bd(e) {
	var t = e >>> 0
	;((rr = t), (sr = ((e - t) / 4294967296) >>> 0))
}
function ts(e) {
	if (e < 0) {
		Bd(-e)
		let [t, r] = Rc(rr, sr)
		;((rr = t >>> 0), (sr = r >>> 0))
	} else Bd(e)
}
function og(e, t) {
	var r = 4294967296 * t + (e >>> 0)
	return Number.isSafeInteger(r) ? r : hl(e, t)
}
function hl(e, t) {
	if (((e >>>= 0), (t >>>= 0) <= 2097151)) var r = '' + (4294967296 * t + e)
	else
		Ic()
			? (r = '' + ((BigInt(t) << BigInt(32)) | BigInt(e)))
			: ((e =
					(16777215 & e) +
					6777216 * (r = 16777215 & ((e >>> 24) | (t << 8))) +
					6710656 * (t = (t >> 16) & 65535)),
				(r += 8147497 * t),
				(t *= 2),
				e >= 1e7 && ((r += (e / 1e7) >>> 0), (e %= 1e7)),
				r >= 1e7 && ((t += (r / 1e7) >>> 0), (r %= 1e7)),
				(r = t + Fd(r) + Fd(e)))
	return r
}
function Fd(e) {
	return ((e = String(e)), '0000000'.slice(e.length) + e)
}
function Nl(e) {
	if (e.length < 16) ts(Number(e))
	else if (Ic())
		((e = BigInt(e)),
			(rr = Number(e & BigInt(4294967295)) >>> 0),
			(sr = Number((e >> BigInt(32)) & BigInt(4294967295))))
	else {
		let t = +(e[0] === '-')
		sr = rr = 0
		let r = e.length
		for (let n = t, i = ((r - t) % 6) + t; i <= r; n = i, i += 6) {
			let s = Number(e.slice(n, i))
			;((sr *= 1e6),
				(rr = 1e6 * rr + s) >= 4294967296 &&
					((sr += Math.trunc(rr / 4294967296)), (sr >>>= 0), (rr >>>= 0)))
		}
		if (t) {
			let [n, i] = Rc(rr, sr)
			;((rr = n), (sr = i))
		}
	}
}
function Rc(e, t) {
	return ((t = ~t), e ? (e = 1 + ~e) : (t += 1), [e, t])
}
function Uo(e) {
	return Array.prototype.slice.call(e)
}
var Ob = typeof BigInt == 'function' ? BigInt.asIntN : void 0,
	Db = typeof BigInt == 'function' ? BigInt.asUintN : void 0,
	vl = Number.isSafeInteger,
	ro = Number.isFinite,
	pl = Math.trunc
function Nu(e) {
	if (e != null && typeof e != 'number')
		throw Error(
			`Value of float/double field must be a number, found ${typeof e}: ${e}`,
		)
	return e
}
function sg(e) {
	return e == null || typeof e == 'number'
		? e
		: e === 'NaN' || e === 'Infinity' || e === '-Infinity'
			? Number(e)
			: void 0
}
function lg(e) {
	if (typeof e != 'boolean') {
		var t = typeof e
		throw Error(
			`Expected boolean but got ${t != 'object' ? t : e ? (Array.isArray(e) ? 'array' : t) : 'null'}: ${e}`,
		)
	}
	return e
}
function Un(e) {
	return e == null || typeof e == 'boolean'
		? e
		: typeof e == 'number'
			? !!e
			: void 0
}
var Pb,
	Lb,
	Mb = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/
function ug(e) {
	switch (typeof e) {
		case 'bigint':
			return !0
		case 'number':
			return ro(e)
		case 'string':
			return Mb.test(e)
		default:
			return !1
	}
}
function fg(e) {
	if (typeof e != 'number' || !ro(e)) throw es('int32')
	return 0 | e
}
function uc(e) {
	return e == null ? e : fg(e)
}
function no(e) {
	if (e == null) return e
	if (typeof e == 'string' && e) e = +e
	else if (typeof e != 'number') return
	return ro(e) ? 0 | e : void 0
}
function gl(e) {
	if (e == null) return e
	if (typeof e == 'string' && e) e = +e
	else if (typeof e != 'number') return
	return ro(e) ? e >>> 0 : void 0
}
function Cc(e) {
	return e == null || typeof e == 'string' ? e : void 0
}
function cg(e, t, r) {
	if (e != null && e[Dl] === Pl) return e
	if (Array.isArray(e)) {
		var n = 0 | e[Et]
		return ((r = n | (32 & r) | (2 & r)) !== n && Ur(e, r), new t(e))
	}
}
function Nb(e) {
	return e
}
function Bl(e, t, r, n) {
	var i = n !== void 0
	n = !!n
	var s = [],
		l = e.length,
		f = 4294967295,
		c = !1,
		m = !!(64 & t),
		y = m ? (128 & t ? 0 : -1) : void 0
	if (!(1 & t)) {
		var g = l && e[l - 1]
		;(g != null && typeof g == 'object' && g.constructor === Object
			? (f = --l)
			: (g = void 0),
			!m || 128 & t || i || ((c = !0), (f = Nb(f - y, y, e, g, void 0) + y)))
	}
	for (t = void 0, i = 0; i < l; i++) {
		let v = e[i]
		if (v != null && (v = r(v, n)) != null)
			if (m && i >= f) {
				let _ = i - y
				;(t ??= {})[_] = v
			} else s[i] = v
	}
	if (g)
		for (let v in g) {
			if ((e = g[v]) == null || (e = r(e, n)) == null) continue
			let _
			;((l = +v),
				m && !Number.isNaN(l) && (_ = l + y) < f
					? (s[_] = e)
					: ((t ??= {})[v] = e))
		}
	return (t && (c ? s.push(t) : (s[f] = t)), s)
}
function Oc(e) {
	switch (typeof e) {
		case 'number':
			return Number.isFinite(e) ? e : '' + e
		case 'bigint':
			return xb(e) ? Number(e) : '' + e
		case 'boolean':
			return e ? 1 : 0
		case 'object':
			if (Array.isArray(e)) {
				var t = 0 | e[Et]
				return e.length === 0 && 1 & t ? void 0 : Bl(e, t, Oc)
			}
			if (e != null && e[Dl] === Pl) return dg(e)
			if (e instanceof ei) {
				if ((t = e.i) == null) e = ''
				else if (typeof t == 'string') e = t
				else {
					if (Jp) {
						for (var r = '', n = 0, i = t.length - 10240; n < i;)
							r += String.fromCharCode.apply(null, t.subarray(n, (n += 10240)))
						;((r += String.fromCharCode.apply(null, n ? t.subarray(n) : t)),
							(t = btoa(r)))
					} else {
						;(r === void 0 && (r = 0),
							Qp(),
							(r = Xp[r]),
							(n = Array(Math.floor(t.length / 3))),
							(i = r[64] || ''))
						let m = 0,
							y = 0
						for (; m < t.length - 2; m += 3) {
							var s = t[m],
								l = t[m + 1],
								f = t[m + 2],
								c = r[s >> 2]
							;((s = r[((3 & s) << 4) | (l >> 4)]),
								(l = r[((15 & l) << 2) | (f >> 6)]),
								(f = r[63 & f]),
								(n[y++] = c + s + l + f))
						}
						switch (((c = 0), (f = i), t.length - m)) {
							case 2:
								f = r[(15 & (c = t[m + 1])) << 2] || i
							case 1:
								;((t = t[m]),
									(n[y] = r[t >> 2] + r[((3 & t) << 4) | (c >> 4)] + f + i))
						}
						t = n.join('')
					}
					e = e.i = t
				}
				return e
			}
			return
	}
	return e
}
function dg(e) {
	return Bl((e = e.m), 0 | e[Et], Oc)
}
function hg(e, t, r, n = 0) {
	if (e == null) {
		var i = 32
		;(r ? ((e = [r]), (i |= 128)) : (e = []),
			t && (i = (-16760833 & i) | ((1023 & t) << 14)))
	} else {
		if (!Array.isArray(e)) throw Error('narr')
		if (((i = 0 | e[Et]), Cd && 1 & i)) throw Error('rfarr')
		if (
			(2048 & i &&
				!(2 & i) &&
				(function () {
					if (Cd) throw Error('carr')
					dl(wb, 5)
				})(),
			256 & i)
		)
			throw Error('farr')
		if (64 & i) return ((i | n) !== i && Ur(e, i | n), e)
		if (r && ((i |= 128), r !== e[0])) throw Error('mid')
		e: {
			i |= 64
			var s = (r = e).length
			if (s) {
				var l = s - 1
				let c = r[l]
				if (c != null && typeof c == 'object' && c.constructor === Object) {
					if ((l -= t = 128 & i ? 0 : -1) >= 1024) throw Error('pvtlmt')
					for (var f in c) (s = +f) < l && ((r[s + t] = c[f]), delete c[f])
					i = (-16760833 & i) | ((1023 & l) << 14)
					break e
				}
			}
			if (t) {
				if ((f = Math.max(t, s - (128 & i ? 0 : -1))) > 1024)
					throw Error('spvt')
				i = (-16760833 & i) | ((1023 & f) << 14)
			}
		}
	}
	return (Ur(e, 64 | i | n), e)
}
function Bb(e, t) {
	if (typeof e != 'object') return e
	if (Array.isArray(e)) {
		var r = 0 | e[Et]
		return (
			e.length === 0 && 1 & r
				? (e = void 0)
				: 2 & r ||
					(!t || 4096 & r || 16 & r
						? (e = _l(e, r, !1, t && !(16 & r)))
						: (ig(e, 34), 4 & r && Object.freeze(e))),
			e
		)
	}
	return e != null && e[Dl] === Pl
		? Cn(e, (r = 0 | (t = e.m)[Et]))
			? e
			: pg(e, t, r)
				? vg(e, t)
				: _l(t, r)
		: e instanceof ei
			? e
			: void 0
}
function vg(e, t, r) {
	return ((e = new e.constructor(t)), r && (e.i = $a), (e.o = $a), e)
}
function _l(e, t, r, n) {
	return (
		(n ??= !!(34 & t)),
		(e = Bl(e, t, Bb, n)),
		(n = 32),
		r && (n |= 2),
		Ur(e, (t = (16769217 & t) | n)),
		e
	)
}
function Fl(e) {
	if (e.i !== $a) return !1
	var t = e.m
	return (
		ig((t = _l(t, 0 | t[Et])), 2048),
		(e.m = t),
		(e.i = void 0),
		(e.o = void 0),
		!0
	)
}
function io(e) {
	if (!Fl(e) && Cn(e, 0 | e.m[Et])) throw Error()
}
function Va(e, t) {
	;(t === void 0 && (t = 0 | e[Et]), 32 & t && !(4096 & t) && Ur(e, 4096 | t))
}
function pg(e, t, r) {
	return (
		!!(2 & r) || (!(!(32 & r) || 4096 & r) && (Ur(t, 2 | r), (e.i = $a), !0))
	)
}
function Zr(e, t, r) {
	if ((e = jl(e.m, t, void 0, r)) !== null) return e
}
function jl(e, t, r, n) {
	if (t === -1) return null
	var i = t + (r ? 0 : -1),
		s = e.length - 1
	if (!(s < 1 + (r ? 0 : -1))) {
		if (i >= s) {
			var l = e[s]
			if (l != null && typeof l == 'object' && l.constructor === Object) {
				r = l[t]
				var f = !0
			} else {
				if (i !== s) return
				r = l
			}
		} else r = e[i]
		if (n && r != null) {
			if ((n = n(r)) == null) return n
			if (!Object.is(n, r)) return (f ? (l[t] = n) : (e[i] = n), n)
		}
		return r
	}
}
function Za(e, t, r) {
	;(io(e), Wn((e = e.m), 0 | e[Et], t, r))
}
function Wn(e, t, r, n, i) {
	var s = r + -1,
		l = e.length - 1
	if (l >= 0 && s >= l) {
		let f = e[l]
		if (f != null && typeof f == 'object' && f.constructor === Object)
			return ((f[r] = n), t)
	}
	return s <= l
		? ((e[s] = n), t)
		: (n !== void 0 &&
				(r >= (l = ((t ??= 0 | e[Et]) >> 14) & 1023 || 536870912)
					? n != null && (e[l + -1] = {[r]: n})
					: (e[s] = n)),
			t)
}
function gg(e, t, r, n, i) {
	var s = e.m,
		l = 0 | s[Et]
	;((n = Cn(e, l) ? 1 : n),
		(i = !!i || n === 3),
		n === 2 && Fl(e) && (l = 0 | (s = e.m)[Et]))
	var f = (e = mg(s, t)) === Ha ? 7 : 0 | e[Et],
		c = yg(f, l),
		m = !(4 & c)
	if (m) {
		4 & c && ((e = Uo(e)), (f = 0), (c = zo(c, l)), (l = Wn(s, l, t, e)))
		let y = 0,
			g = 0
		for (; y < e.length; y++) {
			let v = r(e[y])
			v != null && (e[g++] = v)
		}
		;(g < y && (e.length = g),
			(r = (-513 & c) | 4),
			(c = r &= -1025),
			(c &= -4097))
	}
	return (
		c !== f && (Ur(e, c), 2 & c && Object.freeze(e)),
		_g(e, c, s, l, t, n, m, i)
	)
}
function _g(e, t, r, n, i, s, l, f) {
	var c = t
	return (
		s === 1 || (s === 4 && (2 & t || (!(16 & t) && 32 & n)))
			? nl(t) ||
				((t |=
					!e.length || (l && !(4096 & t)) || (32 & n && !(4096 & t || 16 & t))
						? 2
						: 256) !== c && Ur(e, t),
				Object.freeze(e))
			: (s === 2 &&
					nl(t) &&
					((e = Uo(e)), (c = 0), (t = zo(t, n)), (n = Wn(r, n, i, e))),
				nl(t) || (f || (t |= 16), t !== c && Ur(e, t))),
		2 & t || !(4096 & t || 16 & t) || Va(r, n),
		e
	)
}
function mg(e, t, r) {
	return ((e = jl(e, t, r)), Array.isArray(e) ? e : Ha)
}
function yg(e, t) {
	return (2 & t && (e |= 2), 1 | e)
}
function nl(e) {
	return (!!(2 & e) && !!(4 & e)) || !!(256 & e)
}
function bg(e, t, r) {
	io(e)
	var n = 0 | (e = e.m)[Et]
	if (r == null) Wn(e, n, t)
	else {
		var i = r === Ha ? 7 : 0 | r[Et],
			s = i,
			l = nl(i),
			f = l || Object.isFrozen(r)
		for (
			l || (i = 0),
				f || ((r = Uo(r)), (s = 0), (i = zo(i, n)), (f = !1)),
				i |= 5,
				i |= (4 & i ? (512 & i ? 512 : 1024 & i ? 1024 : 0) : void 0) ?? 1024,
				l = 0;
			l < r.length;
			l++
		) {
			let c = r[l],
				m = fg(c)
			Object.is(c, m) ||
				(f && ((r = Uo(r)), (s = 0), (i = zo(i, n)), (f = !1)), (r[l] = m))
		}
		;(i !== s && (f && ((r = Uo(r)), (i = zo(i, n))), Ur(r, i)), Wn(e, n, t, r))
	}
}
function Ei(e, t, r, n) {
	;(io(e),
		Wn(
			(e = e.m),
			0 | e[Et],
			t,
			(n === '0' ? Number(r) === 0 : r === n) ? void 0 : r,
		))
}
function jd(e) {
	if (Ol) return e[Eo] ?? (e[Eo] = new Map())
	if (Eo in e) return e[Eo]
	var t = new Map()
	return (Object.defineProperty(e, Eo, {value: t}), t)
}
function Ud(e, t, r) {
	var n = Sl,
		i = e.get(n)
	if (i != null) return i
	i = 0
	for (let s = 0; s < n.length; s++) {
		let l = n[s]
		jl(t, l) != null && (i !== 0 && (r = Wn(t, r, i)), (i = l))
	}
	return (e.set(n, i), i)
}
function rs(e, t, r) {
	var n = e.m,
		i = 0 | n[Et]
	if (
		((t = (function (f, c, m, y) {
			var g = !1
			if (
				(y = jl(f, y, void 0, v => {
					var _ = cg(v, m, c)
					return ((g = _ !== v && _ != null), _)
				})) != null
			)
				return (g && !Cn(y) && Va(f, c), y)
		})(n, i, t, r)),
		t == null)
	)
		return t
	if (!Cn(e, (i = 0 | n[Et]))) {
		var s,
			l = t
		let f = l.m,
			c = 0 | f[Et]
		;(s = Cn(l, c)
			? pg(l, f, c)
				? vg(l, f, !0)
				: new l.constructor(_l(f, c, !1))
			: l) !== t &&
			(Fl(e) && (i = 0 | (n = e.m)[Et]), Va(n, (i = Wn(n, i, r, (t = s)))))
	}
	return t
}
function wg(e) {
	return (e == null && (e = void 0), e)
}
function ki(e, t, r) {
	return (Za(e, t, (r = wg(r))), r && !Cn(r) && Va(e.m), e)
}
function zo(e, t) {
	return -273 & (2 & t ? 2 | e : -3 & e)
}
function Po(e, t, r, n) {
	var i = n
	io(e)
	var s = (n = e.m),
		l = 0 | n[Et],
		f = Cn(e, l) ? 1 : 2
	f === 2 && Fl(e) && (l = 0 | (s = e.m)[Et])
	var c = (e = mg(s, t)) === Ha ? 7 : 0 | e[Et],
		m = yg(c, l),
		y = !(4 & m)
	if (y) {
		var g = e,
			v = l
		let _ = !!(2 & m)
		_ && (v |= 2)
		let S = !_,
			x = !0,
			R = 0,
			b = 0
		for (; R < g.length; R++) {
			let A = cg(g[R], r, v)
			if (A instanceof r) {
				if (!_) {
					let L = Cn(A)
					;((S &&= !L), (x &&= L))
				}
				g[b++] = A
			}
		}
		;(b < R && (g.length = b),
			(m |= 4),
			(m = x ? -4097 & m : 4096 | m),
			(m = S ? 8 | m : -9 & m))
	}
	;(m !== c && (Ur(e, m), 2 & m && Object.freeze(e)),
		(t = e = _g(e, m, s, l, t, f, y, !0)),
		(i = i ?? new r()),
		t.push(i),
		(s = r = t === Ha ? 7 : 0 | t[Et]),
		(i = Cn(i)) ? ((r &= -9), t.length === 1 && (r &= -4097)) : (r |= 4096),
		r !== s && Ur(t, r),
		i || Va(n))
}
function Fr(e, t) {
	return gl(Zr(e, t)) ?? 0
}
function il(e, t, r) {
	Za(e, t, r == null ? r : lg(r))
}
function Ta(e, t, r) {
	Ei(e, t, r == null ? r : lg(r), !1)
}
function Nn(e, t, r) {
	Ei(e, t, uc(r), 0)
}
function ko(e, t, r) {
	if (r != null) {
		if (typeof r != 'number' || !ro(r)) throw es('uint32')
		r >>>= 0
	}
	Za(e, t, r)
}
function Wr(e, t, r) {
	if (r != null && typeof r != 'string') throw Error()
	Ei(e, t, r, '')
}
function lt(e, t, r) {
	if ((io(e), (t = (e = gg(e, t, Cc, 2, !0)).push), typeof r != 'string'))
		throw Error()
	t.call(e, r)
}
var Ia = class {
	constructor(e, t, r) {
		if (((this.buffer = e), r && !t)) throw Error()
	}
}
function zd(e) {
	if (typeof e == 'string') return new Ia(Ld(e), !0)
	if (Array.isArray(e)) return new Ia(new Uint8Array(e), !0)
	if (e.constructor === Uint8Array) return new Ia(e, !1)
	if (e.constructor === ArrayBuffer)
		return ((e = new Uint8Array(e)), new Ia(e, !1))
	if (e.constructor === ei) {
		eg(Jo)
		var t = e.i
		return (
			(t =
				((t = t == null || sc(t) ? t : typeof t == 'string' ? Ld(t) : null) ==
				null
					? t
					: (e.i = t)) || new Uint8Array(0)),
			new Ia(t, !0, e)
		)
	}
	if (e instanceof Uint8Array)
		return (
			(e =
				e.constructor === Uint8Array
					? e
					: new Uint8Array(e.buffer, e.byteOffset, e.byteLength)),
			new Ia(e, !1)
		)
	throw Error()
}
function Fb(e) {
	return new ml(4294967295 & e, Math.floor(e / 4294967296))
}
function qd(e) {
	return e
		? /^\d+$/.test(e)
			? (Nl(e), new ml(rr, sr))
			: null
		: (jb ||= new ml(0, 0))
}
var jb,
	ml = class {
		constructor(e, t) {
			;((this.j = e >>> 0), (this.i = t >>> 0))
		}
	}
function Ub(e) {
	return new yl(4294967295 & e, Math.floor(e / 4294967296))
}
function Kd(e) {
	return e
		? /^-?\d+$/.test(e)
			? (Nl(e), new yl(rr, sr))
			: null
		: (zb ||= new yl(0, 0))
}
var zb,
	Wd,
	Gd,
	Hd,
	Bu,
	$d,
	xo,
	zs,
	yl = class {
		constructor(e, t) {
			;((this.j = e >>> 0), (this.i = t >>> 0))
		}
	}
function Sg(e, t, r) {
	return typeof BigInt64Array < 'u'
		? (xo ||
				((xo = new BigInt64Array(1)),
				(zs = new Uint32Array(xo.buffer)),
				(xo[0] = BigInt(1)),
				($d = zs[0] === 1)),
			(xo[0] = e),
			new t(zs[(e = $d ? 0 : 1)], zs[1 - e]))
		: (Bu ||
				((Wd = BigInt(Number.MIN_SAFE_INTEGER)),
				(Gd = BigInt(Number.MAX_SAFE_INTEGER)),
				(Hd = BigInt(4294967295)),
				(Bu = BigInt(32))),
			e >= Wd && e <= Gd
				? r(Number(e))
				: ((e = BigInt.asUintN(64, e)), new t(Number(e & Hd), Number(e >> Bu))))
}
function Ba(e, t, r) {
	for (; r > 0 || t > 127;)
		(e.i.push((127 & t) | 128), (t = ((t >>> 7) | (r << 25)) >>> 0), (r >>>= 7))
	e.i.push(t)
}
function Ul(e, t) {
	for (; t > 127;) (e.i.push((127 & t) | 128), (t >>>= 7))
	e.i.push(t)
}
function zl(e, t) {
	if (t >= 0) Ul(e, t)
	else {
		for (let r = 0; r < 9; r++) (e.i.push((127 & t) | 128), (t >>= 7))
		e.i.push(1)
	}
}
var qb = class {
	constructor() {
		this.i = []
	}
	length() {
		return this.i.length
	}
	end() {
		var e = this.i
		return ((this.i = []), e)
	}
}
function bl(e, t) {
	t.length !== 0 && (e.l.push(t), (e.j += t.length))
}
function si(e, t, r) {
	Ul(e.i, 8 * t + r)
}
function ql(e, t) {
	return (si(e, t, 2), (t = e.i.end()), bl(e, t), t.push(e.j), t)
}
function Kl(e, t) {
	var r = t.pop()
	for (r = e.j + e.i.length() - r; r > 127;)
		(t.push((127 & r) | 128), (r >>>= 7), e.j++)
	;(t.push(r), e.j++)
}
function wl(e, t, r) {
	;(si(e, t, 2), Ul(e.i, r.length), bl(e, e.i.end()), bl(e, r))
}
var Kb = class {
	constructor() {
		;((this.l = []), (this.j = 0), (this.i = new qb()))
	}
}
function Gn() {
	var e = class {
		constructor() {
			throw Error()
		}
	}
	return (Object.setPrototypeOf(e, e.prototype), e)
}
var ds = Gn(),
	Eg = Gn(),
	Wl = Gn(),
	Gl = Gn(),
	kg = Gn(),
	Wb = Gn(),
	Gb = Gn(),
	xg = Gn(),
	Hb = Gn(),
	Dc = Gn(),
	gr = class {
		constructor(e, t) {
			this.m = hg(e, t, void 0, 2048)
		}
		toJSON() {
			return dg(this)
		}
	}
;((gr.prototype[Dl] = Pl),
	(gr.prototype.toString = function () {
		return this.m.toString()
	}))
var Hn = class {
	constructor(e, t) {
		;((this.i = e), (e = ds), (this.j = (!!e && t === e) || !1))
	}
}
function Ag(e, t, r, n, i) {
	;(t = Ig(t, n)) != null && ((r = ql(e, r)), i(t, e), Kl(e, r))
}
var Tg,
	$b = new Hn(Ag, ds),
	Vb = new Hn(Ag, ds),
	Vd = Symbol(),
	Zd = Symbol()
function Hl(e) {
	var t = Zb,
		r = Yb,
		n = e[Vd]
	if (n) return n
	;(((n = {}).oa = e),
		(n.W = (function (y) {
			switch (typeof y) {
				case 'boolean':
					return (Pb ||= [0, void 0, !0])
				case 'number':
					return y > 0 ? void 0 : y === 0 ? (Lb ||= [0, void 0]) : [-y, void 0]
				case 'string':
					return [0, y]
				case 'object':
					return y
			}
		})(e[0])))
	var i = e[1],
		s = 1
	i &&
		i.constructor === Object &&
		((n.ca = i),
		typeof (i = e[++s]) == 'function' &&
			((n.ia = !0), (Tg ??= e[s + 1]), (i = e[(s += 2)])))
	for (
		var l = {};
		i && Array.isArray(i) && i.length && typeof i[0] == 'number' && i[0] > 0;
	) {
		for (var f = 0; f < i.length; f++) l[i[f]] = i
		i = e[++s]
	}
	for (f = 1; i !== void 0;) {
		let y
		typeof i == 'number' && ((f += i), (i = e[++s]))
		var c = void 0
		if ((i instanceof Hn ? (y = i) : ((y = $b), s--), y?.j)) {
			;((i = e[++s]), (c = e))
			var m = s
			;(typeof i == 'function' && ((i = i()), (c[m] = i)), (c = i))
		}
		for (
			m = f + 1,
				typeof (i = e[++s]) == 'number' && i < 0 && ((m -= i), (i = e[++s]));
			f < m;
			f++
		)
			(l[f], c ? r(n, f, y, c) : t(n, f, y))
	}
	return (e[Vd] = n)
}
function Ig(e, t) {
	return e instanceof gr ? e.m : Array.isArray(e) ? hg(e, t[0], t[1]) : void 0
}
function Zb(e, t, r) {
	e[t] = r.i
}
function Yb(e, t, r, n) {
	var i,
		s,
		l = r.i
	e[t] = (f, c, m) => l(f, c, m, (s ||= Hl(n).W), (i ||= Rg(n)))
}
function Rg(e) {
	var t = e[Zd]
	if (!t) {
		let r = Hl(e)
		;((t = (n, i) => Cg(n, i, r)), (e[Zd] = t))
	}
	return t
}
function Cg(e, t, r) {
	;(function (n, i, s) {
		var l,
			f = 128 & i ? 0 : -1,
			c = n.length
		;(l = !!c) &&
			(l =
				(l = n[c - 1]) != null &&
				typeof l == 'object' &&
				l.constructor === Object)
		var m = c + (l ? -1 : 0)
		for (i = 128 & i ? 1 : 0; i < m; i++) s(i - f, n[i])
		if (l) {
			n = n[c - 1]
			for (let y in n) !isNaN(y) && s(+y, n[y])
		}
	})(e, 0 | e[Et], (n, i) => {
		if (i != null) {
			var s = (function (l, f) {
				var c = l[f]
				if (c) return c
				if ((c = l.ca) && (c = c[f])) {
					var m = (c = Array.isArray(c)
						? c[0] instanceof Hn
							? c
							: [Vb, c]
						: [c, void 0])[0].i
					if ((c = c[1])) {
						let y = Rg(c),
							g = Hl(c).W
						c = l.ia ? Tg(g, y) : (v, _, S) => m(v, _, S, g, y)
					} else c = m
					return (l[f] = c)
				}
			})(r, n)
			s ? s(t, i, n) : n < 500 || dl(lc, 3)
		}
	})
}
var Fu,
	Xi = 0,
	Ra = Xi
if (ag(Ra)) {
	if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(Ra)) throw Error(String(Ra))
} else if (((Fu = Eb(Ra)) && (Fu = !Number.isSafeInteger(Ra)), Fu))
	throw Error(String(Ra))
function Pc(e, t) {
	if (Array.isArray(t)) {
		var r = 0 | t[Et]
		if (4 & r) return t
		for (var n = 0, i = 0; n < t.length; n++) {
			let s = e(t[n])
			s != null && (t[i++] = s)
		}
		return (
			i < n && (t.length = i),
			(e = (-1537 & r) | 5) !== r && Ur(t, e),
			2 & e && Object.freeze(t),
			t
		)
	}
}
function kr(e, t) {
	return new Hn(e, t)
}
function Og(e, t, r) {
	;(t = sg(t)) != null &&
		(si(e, r, 5),
		(e = e.i),
		(r = Cb ||= new DataView(new ArrayBuffer(8))).setFloat32(0, +t, !0),
		(sr = 0),
		(t = rr = r.getUint32(0, !0)),
		e.i.push((t >>> 0) & 255),
		e.i.push((t >>> 8) & 255),
		e.i.push((t >>> 16) & 255),
		e.i.push((t >>> 24) & 255))
}
function Lc(e, t, r) {
	;(t = no(t)) != null && t != null && (si(e, r, 0), zl(e.i, t))
}
function Dg(e, t, r) {
	;(t = Un(t)) != null && (si(e, r, 0), e.i.i.push(t ? 1 : 0))
}
function Mc(e, t, r) {
	;(t = Cc(t)) != null && wl(e, r, Yp(t))
}
function Pg(e, t, r, n, i) {
	;(t = Ig(t, n)) != null && ((r = ql(e, r)), i(t, e), Kl(e, r))
}
function Lg(e, t, r) {
	;(t = gl(t)) != null && t != null && (si(e, r, 0), Ul(e.i, t))
}
function Mg(e, t, r) {
	;(t = no(t)) != null && ((t = parseInt(t, 10)), si(e, r, 0), zl(e.i, t))
}
Ml || (Xi = kb(Xi) ? (Xi ? '1' : '0') : ag(Xi) ? Xi.trim() || '0' : String(Xi))
var ca,
	Ao = kr(Og, xg),
	al = kr(Og, xg),
	ju = kr(function (e, t, r) {
		if (
			((t = (function (n) {
				if (n == null) return n
				var i = typeof n
				if (i === 'bigint') return String(Ob(64, n))
				if (ug(n)) {
					if (i === 'string') {
						if (((i = pl(Number(n))), vl(i))) n = String(i)
						else if (
							((i = n.indexOf('.')) !== -1 && (n = n.substring(0, i)),
							(i = n.length),
							!(n[0] === '-'
								? i < 20 || (i === 20 && n <= '-9223372036854775808')
								: i < 19 || (i === 19 && n <= '9223372036854775807')))
						)
							if ((Nl(n), (n = rr), 2147483648 & (i = sr)))
								if (Ic())
									n = '' + ((BigInt(0 | i) << BigInt(32)) | BigInt(n >>> 0))
								else {
									let [l, f] = Rc(n, i)
									n = '-' + hl(l, f)
								}
							else n = hl(n, i)
						return n
					}
					if (i === 'number') {
						if (((n = pl(n)), !vl(n))) {
							;(ts(n), (i = rr))
							var s = sr
							;((n = 2147483648 & s) &&
								((s = ~s >>> 0),
								(i = (1 + ~i) >>> 0) == 0 && (s = (s + 1) >>> 0)),
								(n =
									typeof (i = og(i, s)) == 'number'
										? n
											? -i
											: i
										: n
											? '-' + i
											: i))
						}
						return n
					}
				}
			})(t)),
			t != null && (typeof t == 'string' && Kd(t), t != null))
		)
			switch ((si(e, r, 0), typeof t)) {
				case 'number':
					;((e = e.i), ts(t), Ba(e, rr, sr))
					break
				case 'bigint':
					;((r = Sg(t, yl, Ub)), Ba(e.i, r.j, r.i))
					break
				default:
					;((r = Kd(t)), Ba(e.i, r.j, r.i))
			}
	}, Wb),
	Xb = kr(function (e, t, r) {
		if (
			((t = (function (n) {
				if (n == null) return n
				var i = typeof n
				if (i === 'bigint') return String(Db(64, n))
				if (ug(n)) {
					if (i === 'string')
						return (
							(i = pl(Number(n))),
							vl(i) && i >= 0
								? (n = String(i))
								: ((i = n.indexOf('.')) !== -1 && (n = n.substring(0, i)),
									(i =
										n[0] !== '-' &&
										((i = n.length) < 20 ||
											(i === 20 && n <= '18446744073709551615'))) ||
										(Nl(n), (n = hl(rr, sr)))),
							n
						)
					if (i === 'number')
						return (((n = pl(n)) >= 0 && vl(n)) || (ts(n), (n = og(rr, sr))), n)
				}
			})(t)),
			t != null && (typeof t == 'string' && qd(t), t != null))
		)
			switch ((si(e, r, 0), typeof t)) {
				case 'number':
					;((e = e.i), ts(t), Ba(e, rr, sr))
					break
				case 'bigint':
					;((r = Sg(t, ml, Fb)), Ba(e.i, r.j, r.i))
					break
				default:
					;((r = qd(t)), Ba(e.i, r.j, r.i))
			}
	}, Gb),
	wr = kr(Lc, Gl)
ca = new Hn(function (e, t, r) {
	if ((t = Pc(no, t)) != null && t.length) {
		r = ql(e, r)
		for (let n = 0; n < t.length; n++) zl(e.i, t[n])
		Kl(e, r)
	}
}, Gl)
var $r,
	St = kr(Lc, Gl),
	Qb = kr(Lc, Gl),
	qt = kr(Dg, Eg),
	Vt = kr(Dg, Eg),
	vr = kr(Mc, Wl)
$r = new Hn(function (e, t, r) {
	if ((t = Pc(Cc, t)) != null)
		for (let l = 0; l < t.length; l++) {
			var n = e,
				i = r,
				s = t[l]
			s != null && wl(n, i, Yp(s))
		}
}, Wl)
var Nc,
	Vr = kr(Mc, Wl),
	Ng = kr(Mc, Wl),
	un = (function (e, t, r = ds) {
		return new Hn(t, r)
	})(0, function (e, t, r, n, i) {
		if (Array.isArray(t)) {
			for (let s = 0; s < t.length; s++) Pg(e, t[s], r, n, i)
			1 & (e = 0 | t[Et]) || Ur(t, 1 | e)
		}
	}),
	Nr = new Hn(Pg, ds),
	Jb = kr(Lg, kg),
	kn = kr(Mg, Dc)
Nc = new Hn(function (e, t, r) {
	if ((t = Pc(no, t)) != null && t.length) {
		r = ql(e, r)
		for (let n = 0; n < t.length; n++) zl(e.i, t[n])
		Kl(e, r)
	}
}, Dc)
var ti = kr(Mg, Dc)
function hs(e) {
	return function () {
		var t = new Kb()
		;(Cg(this.m, t, Hl(e)), bl(t, t.i.end()))
		var r = new Uint8Array(t.j),
			n = t.l,
			i = n.length,
			s = 0
		for (let l = 0; l < i; l++) {
			let f = n[l]
			;(r.set(f, s), (s += f.length))
		}
		return ((t.l = [r]), r)
	}
}
function Uu(e, t) {
	if (t != null)
		if (Array.isArray(t)) Za(e, 2, Bl(t, 0, Oc))
		else {
			if (!(typeof t == 'string' || t instanceof ei || sc(t)))
				throw Error(
					'invalid value in Any.value field: ' +
						t +
						' expected a ByteString, a base64 encoded string, a Uint8Array or a jspb array',
				)
			if (t != null) {
				if (typeof t == 'string') t = t ? new ei(t, Jo) : Mu()
				else if (t.constructor !== ei) {
					if (!sc(t)) throw Error()
					t = t.length ? new ei(new Uint8Array(t), Jo) : Mu()
				}
			}
			Ei(e, 2, t, Mu())
		}
}
var zu,
	Ca = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	Yd = [
		0,
		Vr,
		kr(function (e, t, r) {
			if (t != null) {
				if (t instanceof gr) {
					let n = t.ra
					return void (n
						? ((t = n(t)), t != null && wl(e, r, zd(t).buffer))
						: dl(lc, 3))
				}
				if (Array.isArray(t)) return void dl(lc, 3)
			}
			;(t =
				t == null || typeof t == 'string' || t instanceof ei ? t : void 0) !=
				null && wl(e, r, zd(t).buffer)
		}, Hb),
	],
	Xd = globalThis.trustedTypes,
	ew = class {
		constructor(e) {
			this.i = e
		}
		toString() {
			return this.i + ''
		}
	}
function Qd(e) {
	var t
	return (
		zu === void 0 &&
			(zu = (function () {
				var r = null
				if (!Xd) return r
				try {
					let n = i => i
					r = Xd.createPolicy('goog#html', {
						createHTML: n,
						createScript: n,
						createScriptURL: n,
					})
				} catch {}
				return r
			})()),
		(e = (t = zu) ? t.createScriptURL(e) : e),
		new ew(e)
	)
}
function qs(e, ...t) {
	if (t.length === 0) return Qd(e[0])
	var r = e[0]
	for (let n = 0; n < t.length; n++) r += encodeURIComponent(t[n]) + e[n + 1]
	return Qd(r)
}
var Jd = [0, kn, -1, qt],
	Bg = {}
Bg[336783863] = [
	0,
	vr,
	qt,
	-1,
	wr,
	[
		0,
		[1, 2, 3, 4, 5, 6, 7, 8, 9],
		Nr,
		[0],
		Nr,
		[0, qt, vr, qt, kn, -1, Nc, vr, -1, [0, qt, -1], kn, qt, -1, Jd],
		Nr,
		[0, vr, -2],
		Nr,
		[0, wr, qt, 1, qt, -4],
		Nr,
		[0, wr, kn, qt, -1, ca, kn, -1, qt, -1],
		Nr,
		[0, vr, -2],
		Nr,
		[0, vr, kn],
		Nr,
		[
			0,
			3,
			qt,
			-1,
			2,
			[0, [2], wr, Nr, [0, kr(Lg, kg)]],
			[0, kn, qt, kn, qt, kn, qt, vr, -1],
			[0, [3, 4], vr, -1, Nr, [0, wr], Nr, [0, kn]],
			[0],
		],
		Nr,
		Jd,
	],
	[0, vr],
	qt,
	[0, [1, 3], [2, 4], Nr, [0, ca], -1, Nr, [0, $r], -1, un, [0, vr, -1]],
	vr,
]
var eh = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	th = [0, ju, -1, Vt, -3, ju, ca, Vr, St, ju, -1, Vt, St, Vt, -2, Vr],
	Xn = class extends gr {
		constructor(e) {
			super(e, 500)
		}
		N(e) {
			return ki(this, 7, e)
		}
	},
	qo = [-1, {}],
	rh = [0, vr, 1, qo],
	nh = [0, vr, $r, qo]
function gi(e, t) {
	Po(e, 1, Xn, t)
}
var Fg = class extends gr {
	constructor(e) {
		super(e, 500)
	}
	N(e) {
		return ki(this, 1001, e)
	}
}
Fg.prototype.j = hs([
	-500,
	un,
	[
		-500,
		Vr,
		-1,
		$r,
		-3,
		[-2, Bg, qt],
		un,
		Yd,
		St,
		-1,
		rh,
		nh,
		un,
		[0, Vr, Vt],
		Vr,
		th,
		St,
		$r,
		987,
		$r,
	],
	4,
	un,
	[-500, vr, -1, [-1, {}], 998, vr],
	un,
	[-500, vr, $r, -1, [-2, {}, qt], 997, $r, -1],
	St,
	un,
	[-500, vr, $r, qo, 998, $r],
	$r,
	St,
	rh,
	nh,
	un,
	[0, Vr, -1, qo],
	$r,
	-2,
	th,
	Vr,
	-1,
	Vt,
	[0, Vt, Jb],
	978,
	qo,
	un,
	Yd,
])
var Ks,
	ih = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	tw = new Uint8Array([
		0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1,
		8, 0, 65, 0, 253, 15, 253, 98, 11,
	])
async function jg(e) {
	if (e) return !0
	if (Ks === void 0)
		try {
			;(await WebAssembly.instantiate(tw), (Ks = !0))
		} catch {
			Ks = !1
		}
	return Ks
}
async function Ws(e, t, r) {
	return {
		wasmLoaderPath: `${t}/${e}_${(r = `wasm${r ? '_module' : ''}${(await jg(r)) ? '' : '_nosimd'}_internal`)}.js`,
		wasmBinaryPath: `${t}/${e}_${r}.wasm`,
	}
}
var Qi = class {}
;((Qi.forVisionTasks = function (e, t = !1) {
	return Ws('vision', e ?? qs``, t)
}),
	(Qi.forTextTasks = function (e, t = !1) {
		return Ws('text', e ?? qs``, t)
	}),
	(Qi.forGenAiTasks = function (e, t = !1) {
		return Ws('genai', e ?? qs``, t)
	}),
	(Qi.forAudioTasks = function (e, t = !1) {
		return Ws('audio', e ?? qs``, t)
	}),
	(Qi.isSimdSupported = function (e = !1) {
		return jg(e)
	}))
var rw = class {
	close() {}
}
function ah(e) {
	function t(l, f) {
		return new ReadableStream({
			start() {},
			async pull(c) {
				;((i = i.then(async () => {
					if (l.cache.length > 0) c.enqueue(l.cache.shift())
					else {
						var {value: m, done: y} = await e.read()
						;(m && (f.active && f.cache.push(m), l.active && c.enqueue(m)),
							y && c.close())
					}
				})),
					await i)
			},
			cancel() {
				;((l.active = !1), (l.cache.length = 0), f.active || e.cancel())
			},
		})
	}
	var r = {cache: [], active: !0},
		n = {cache: [], active: !0},
		i = Promise.resolve(),
		s = t(r, n)
	return ((r = t(n, r)), [s.getReader(), r.getReader()])
}
async function qu(e, t) {
	for (var r = new Uint8Array(t), n = 0; n < t;) {
		let {value: i, done: s} = await e.read()
		if (i) {
			let l = i.subarray(0, t - n)
			;(r.set(l, n), (n += l.length))
		}
		if (s)
			throw Error(
				`Expected ${t} bytes, but stream ended after reading ${n} bytes.`,
			)
	}
	return (await e.cancel(), r)
}
var nw = [
	[
		0,
		async e => {
			var t = new TextEncoder().encode('TFL3').length
			return (
				(e = await qu(e, t + 4)),
				new TextDecoder('utf-8').decode(e.subarray(4, t + 4)) === 'TFL3'
			)
		},
	],
	[1, async e => (e = await qu(e, 6))[4] === 80 && e[5] === 75],
	[
		2,
		async e => (
			(e = await qu(e, 8)),
			new TextDecoder('utf-8').decode(e) === 'LITERTLM'
		),
	],
]
async function Ku(e, t) {
	var r = new Uint8Array(t),
		n = 0
	if (e.i) {
		var i = Math.min(t, e.i.length)
		;(r.set(e.i.subarray(0, i), 0),
			(n += i) < e.i.length ? (e.i = e.i.subarray(n)) : (e.i = void 0))
	}
	for (; n < t;) {
		let {value: s, done: l} = await e.stream.read()
		if (
			(s &&
				((i = s.subarray(0, t - n)),
				r.set(i, n),
				s.length > i.length && (e.i = s.subarray(t - n)),
				(n += i.length)),
			l)
		)
			throw Error(
				`Expected ${t} bytes, but stream ended after reading ${n} bytes.`,
			)
	}
	return r
}
class iw {
	constructor(t) {
		;((this.stream = t), (this.i = void 0), (this.closed = this.stream.closed))
	}
	async read() {
		if (this.i) {
			let t = this.i.slice()
			return ((this.i = void 0), {value: t, done: !1})
		}
		return this.stream.read()
	}
	cancel(t) {
		return this.stream.cancel(t)
	}
	releaseLock() {
		return this.stream.releaseLock()
	}
}
function aw() {
	var e = navigator
	return (
		typeof OffscreenCanvas < 'u' &&
		(!(function (t = navigator) {
			return (t = t.userAgent).includes('Safari') && !t.includes('Chrome')
		})(e) ||
			!!(
				(e = e.userAgent.match(/Version\/([\d]+).*Safari/)) &&
				e.length >= 1 &&
				Number(e[1]) >= 17
			))
	)
}
async function oh(e) {
	if (typeof importScripts != 'function') {
		let t = document.createElement('script')
		return (
			(t.src = e.toString()),
			(t.crossOrigin = 'anonymous'),
			new Promise((r, n) => {
				;(t.addEventListener(
					'load',
					() => {
						r()
					},
					!1,
				),
					t.addEventListener(
						'error',
						i => {
							n(i)
						},
						!1,
					),
					document.body.appendChild(t))
			})
		)
	}
	try {
		importScripts(e.toString())
	} catch (t) {
		if (!(t instanceof TypeError)) throw t
		{
			let r = self.import
			r ? await r(e.toString()) : await import(e.toString())
		}
	}
}
function $e(e, t, r) {
	;(e.o ||
		console.error(
			'No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target',
		),
		r((t = e.h.stringToNewUTF8(t))),
		e.h._free(t))
}
function sh(e, t, r) {
	e.o ||
		console.error(
			'No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target',
		)
	var n = new Uint32Array(t.length)
	for (let i = 0; i < t.length; i++) n[i] = e.h.stringToNewUTF8(t[i])
	;((t = e.h._malloc(4 * n.length)), e.h.HEAPU32.set(n, t >> 2), r(t))
	for (let i of n) e.h._free(i)
	e.h._free(t)
}
function _i(e, t, r) {
	;((e.h.simpleListeners = e.h.simpleListeners || {}),
		(e.h.simpleListeners[t] = r))
}
function Vi(e, t, r) {
	var n = []
	;((e.h.simpleListeners = e.h.simpleListeners || {}),
		(e.h.simpleListeners[t] = (i, s, l) => {
			s ? (r(n, l), (n = [])) : n.push(i)
		}))
}
var lh,
	ow =
		((lh = class {
			constructor(e, t) {
				;((this.l = !0),
					(this.h = e),
					(this.i = null),
					(this.j = 0),
					(this.o = typeof this.h._addIntToInputStream == 'function'),
					t !== void 0
						? (this.h.canvas = t)
						: aw()
							? (this.h.canvas = new OffscreenCanvas(1, 1))
							: (console.warn(
									'OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas.',
								),
								(this.h.canvas = document.createElement('canvas'))))
			}
			async initializeGraph(e) {
				var t = await (await fetch(e)).arrayBuffer()
				;((e = !(e.endsWith('.pbtxt') || e.endsWith('.textproto'))),
					this.setGraph(new Uint8Array(t), e))
			}
			setGraphFromString(e) {
				this.setGraph(new TextEncoder().encode(e), !1)
			}
			setGraph(e, t) {
				var r = e.length,
					n = this.h._malloc(r)
				;(this.h.HEAPU8.set(e, n),
					t ? this.h._changeBinaryGraph(r, n) : this.h._changeTextGraph(r, n),
					this.h._free(n))
			}
			configureAudio(e, t, r, n, i) {
				;(this.h._configureAudio ||
					console.warn(
						'Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?',
					),
					$e(this, n || 'input_audio', s => {
						$e(this, (i = i || 'audio_header'), l => {
							this.h._configureAudio(s, l, e, t ?? 0, r)
						})
					}))
			}
			setAutoResizeCanvas(e) {
				this.l = e
			}
			setAutoRenderToScreen(e) {
				this.h._setAutoRenderToScreen(e)
			}
			setGpuBufferVerticalFlip(e) {
				this.h.gpuOriginForWebTexturesIsBottomLeft = e
			}
			attachErrorListener(e) {
				this.h.errorListener = e
			}
			attachEmptyPacketListener(e, t) {
				;((this.h.emptyPacketListeners = this.h.emptyPacketListeners || {}),
					(this.h.emptyPacketListeners[e] = t))
			}
			addAudioToStream(e, t, r) {
				this.addAudioToStreamWithShape(e, 0, 0, t, r)
			}
			addAudioToStreamWithShape(e, t, r, n, i) {
				var s = 4 * e.length
				;(this.j !== s &&
					(this.i && this.h._free(this.i),
					(this.i = this.h._malloc(s)),
					(this.j = s)),
					this.h.HEAPF32.set(e, this.i / 4),
					$e(this, n, l => {
						this.h._addAudioToInputStream(this.i, t, r, l, i)
					}))
			}
			addGpuBufferToStream(e, t, r) {
				$e(this, t, n => {
					if (!this.h.canvas) throw Error('No OpenGL canvas configured.')
					n ? this.h._bindTextureToStream(n) : this.h._bindTextureToCanvas()
					var i =
						this.h.canvas.getContext('webgl2') ||
						this.h.canvas.getContext('webgl')
					if (!i)
						throw Error(
							'Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.',
						)
					;(this.h.gpuOriginForWebTexturesIsBottomLeft &&
						i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !0),
						i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, e),
						this.h.gpuOriginForWebTexturesIsBottomLeft &&
							i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1))
					var [s, l] =
						e.videoWidth !== void 0
							? [e.videoWidth, e.videoHeight]
							: e.naturalWidth !== void 0
								? [e.naturalWidth, e.naturalHeight]
								: e.displayWidth !== void 0
									? [e.displayWidth, e.displayHeight]
									: [e.width, e.height]
					!this.l ||
						(s === this.h.canvas.width && l === this.h.canvas.height) ||
						((this.h.canvas.width = s), (this.h.canvas.height = l))
					var [f, c] = [s, l]
					this.h._addBoundTextureToStream(n, f, c, r)
				})
			}
			addBoolToStream(e, t, r) {
				$e(this, t, n => {
					this.h._addBoolToInputStream(e, n, r)
				})
			}
			addDoubleToStream(e, t, r) {
				$e(this, t, n => {
					this.h._addDoubleToInputStream(e, n, r)
				})
			}
			addFloatToStream(e, t, r) {
				$e(this, t, n => {
					this.h._addFloatToInputStream(e, n, r)
				})
			}
			addIntToStream(e, t, r) {
				$e(this, t, n => {
					this.h._addIntToInputStream(e, n, r)
				})
			}
			addUintToStream(e, t, r) {
				$e(this, t, n => {
					this.h._addUintToInputStream(e, n, r)
				})
			}
			addStringToStream(e, t, r) {
				$e(this, t, n => {
					$e(this, e, i => {
						this.h._addStringToInputStream(i, n, r)
					})
				})
			}
			addStringRecordToStream(e, t, r) {
				$e(this, t, n => {
					sh(this, Object.keys(e), i => {
						sh(this, Object.values(e), s => {
							this.h._addFlatHashMapToInputStream(
								i,
								s,
								Object.keys(e).length,
								n,
								r,
							)
						})
					})
				})
			}
			addProtoToStream(e, t, r, n) {
				$e(this, r, i => {
					$e(this, t, s => {
						var l = this.h._malloc(e.length)
						;(this.h.HEAPU8.set(e, l),
							this.h._addProtoToInputStream(l, e.length, s, i, n),
							this.h._free(l))
					})
				})
			}
			addEmptyPacketToStream(e, t) {
				$e(this, e, r => {
					this.h._addEmptyPacketToInputStream(r, t)
				})
			}
			addBoolVectorToStream(e, t, r) {
				$e(this, t, n => {
					var i = this.h._allocateBoolVector(e.length)
					if (!i) throw Error('Unable to allocate new bool vector on heap.')
					for (let s of e) this.h._addBoolVectorEntry(i, s)
					this.h._addBoolVectorToInputStream(i, n, r)
				})
			}
			addDoubleVectorToStream(e, t, r) {
				$e(this, t, n => {
					var i = this.h._allocateDoubleVector(e.length)
					if (!i) throw Error('Unable to allocate new double vector on heap.')
					for (let s of e) this.h._addDoubleVectorEntry(i, s)
					this.h._addDoubleVectorToInputStream(i, n, r)
				})
			}
			addFloatVectorToStream(e, t, r) {
				$e(this, t, n => {
					var i = this.h._allocateFloatVector(e.length)
					if (!i) throw Error('Unable to allocate new float vector on heap.')
					for (let s of e) this.h._addFloatVectorEntry(i, s)
					this.h._addFloatVectorToInputStream(i, n, r)
				})
			}
			addIntVectorToStream(e, t, r) {
				$e(this, t, n => {
					var i = this.h._allocateIntVector(e.length)
					if (!i) throw Error('Unable to allocate new int vector on heap.')
					for (let s of e) this.h._addIntVectorEntry(i, s)
					this.h._addIntVectorToInputStream(i, n, r)
				})
			}
			addUintVectorToStream(e, t, r) {
				$e(this, t, n => {
					var i = this.h._allocateUintVector(e.length)
					if (!i)
						throw Error('Unable to allocate new unsigned int vector on heap.')
					for (let s of e) this.h._addUintVectorEntry(i, s)
					this.h._addUintVectorToInputStream(i, n, r)
				})
			}
			addStringVectorToStream(e, t, r) {
				$e(this, t, n => {
					var i = this.h._allocateStringVector(e.length)
					if (!i) throw Error('Unable to allocate new string vector on heap.')
					for (let s of e)
						$e(this, s, l => {
							this.h._addStringVectorEntry(i, l)
						})
					this.h._addStringVectorToInputStream(i, n, r)
				})
			}
			addBoolToInputSidePacket(e, t) {
				$e(this, t, r => {
					this.h._addBoolToInputSidePacket(e, r)
				})
			}
			addDoubleToInputSidePacket(e, t) {
				$e(this, t, r => {
					this.h._addDoubleToInputSidePacket(e, r)
				})
			}
			addFloatToInputSidePacket(e, t) {
				$e(this, t, r => {
					this.h._addFloatToInputSidePacket(e, r)
				})
			}
			addIntToInputSidePacket(e, t) {
				$e(this, t, r => {
					this.h._addIntToInputSidePacket(e, r)
				})
			}
			addUintToInputSidePacket(e, t) {
				$e(this, t, r => {
					this.h._addUintToInputSidePacket(e, r)
				})
			}
			addStringToInputSidePacket(e, t) {
				$e(this, t, r => {
					$e(this, e, n => {
						this.h._addStringToInputSidePacket(n, r)
					})
				})
			}
			addProtoToInputSidePacket(e, t, r) {
				$e(this, r, n => {
					$e(this, t, i => {
						var s = this.h._malloc(e.length)
						;(this.h.HEAPU8.set(e, s),
							this.h._addProtoToInputSidePacket(s, e.length, i, n),
							this.h._free(s))
					})
				})
			}
			addBoolVectorToInputSidePacket(e, t) {
				$e(this, t, r => {
					var n = this.h._allocateBoolVector(e.length)
					if (!n) throw Error('Unable to allocate new bool vector on heap.')
					for (let i of e) this.h._addBoolVectorEntry(n, i)
					this.h._addBoolVectorToInputSidePacket(n, r)
				})
			}
			addDoubleVectorToInputSidePacket(e, t) {
				$e(this, t, r => {
					var n = this.h._allocateDoubleVector(e.length)
					if (!n) throw Error('Unable to allocate new double vector on heap.')
					for (let i of e) this.h._addDoubleVectorEntry(n, i)
					this.h._addDoubleVectorToInputSidePacket(n, r)
				})
			}
			addFloatVectorToInputSidePacket(e, t) {
				$e(this, t, r => {
					var n = this.h._allocateFloatVector(e.length)
					if (!n) throw Error('Unable to allocate new float vector on heap.')
					for (let i of e) this.h._addFloatVectorEntry(n, i)
					this.h._addFloatVectorToInputSidePacket(n, r)
				})
			}
			addIntVectorToInputSidePacket(e, t) {
				$e(this, t, r => {
					var n = this.h._allocateIntVector(e.length)
					if (!n) throw Error('Unable to allocate new int vector on heap.')
					for (let i of e) this.h._addIntVectorEntry(n, i)
					this.h._addIntVectorToInputSidePacket(n, r)
				})
			}
			addUintVectorToInputSidePacket(e, t) {
				$e(this, t, r => {
					var n = this.h._allocateUintVector(e.length)
					if (!n)
						throw Error('Unable to allocate new unsigned int vector on heap.')
					for (let i of e) this.h._addUintVectorEntry(n, i)
					this.h._addUintVectorToInputSidePacket(n, r)
				})
			}
			addStringVectorToInputSidePacket(e, t) {
				$e(this, t, r => {
					var n = this.h._allocateStringVector(e.length)
					if (!n) throw Error('Unable to allocate new string vector on heap.')
					for (let i of e)
						$e(this, i, s => {
							this.h._addStringVectorEntry(n, s)
						})
					this.h._addStringVectorToInputSidePacket(n, r)
				})
			}
			attachBoolListener(e, t) {
				;(_i(this, e, t),
					$e(this, e, r => {
						this.h._attachBoolListener(r)
					}))
			}
			attachBoolVectorListener(e, t) {
				;(Vi(this, e, t),
					$e(this, e, r => {
						this.h._attachBoolVectorListener(r)
					}))
			}
			attachIntListener(e, t) {
				;(_i(this, e, t),
					$e(this, e, r => {
						this.h._attachIntListener(r)
					}))
			}
			attachIntVectorListener(e, t) {
				;(Vi(this, e, t),
					$e(this, e, r => {
						this.h._attachIntVectorListener(r)
					}))
			}
			attachUintListener(e, t) {
				;(_i(this, e, t),
					$e(this, e, r => {
						this.h._attachUintListener(r)
					}))
			}
			attachUintVectorListener(e, t) {
				;(Vi(this, e, t),
					$e(this, e, r => {
						this.h._attachUintVectorListener(r)
					}))
			}
			attachDoubleListener(e, t) {
				;(_i(this, e, t),
					$e(this, e, r => {
						this.h._attachDoubleListener(r)
					}))
			}
			attachDoubleVectorListener(e, t) {
				;(Vi(this, e, t),
					$e(this, e, r => {
						this.h._attachDoubleVectorListener(r)
					}))
			}
			attachFloatListener(e, t) {
				;(_i(this, e, t),
					$e(this, e, r => {
						this.h._attachFloatListener(r)
					}))
			}
			attachFloatVectorListener(e, t) {
				;(Vi(this, e, t),
					$e(this, e, r => {
						this.h._attachFloatVectorListener(r)
					}))
			}
			attachStringListener(e, t) {
				;(_i(this, e, t),
					$e(this, e, r => {
						this.h._attachStringListener(r)
					}))
			}
			attachStringVectorListener(e, t) {
				;(Vi(this, e, t),
					$e(this, e, r => {
						this.h._attachStringVectorListener(r)
					}))
			}
			attachProtoListener(e, t, r) {
				;(_i(this, e, t),
					$e(this, e, n => {
						this.h._attachProtoListener(n, r || !1)
					}))
			}
			attachProtoVectorListener(e, t, r) {
				;(Vi(this, e, t),
					$e(this, e, n => {
						this.h._attachProtoVectorListener(n, r || !1)
					}))
			}
			attachAudioListener(e, t, r) {
				;(this.h._attachAudioListener ||
					console.warn(
						'Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?',
					),
					_i(this, e, (n, i) => {
						;((n = new Float32Array(n.buffer, n.byteOffset, n.length / 4)),
							t(n, i))
					}),
					$e(this, e, n => {
						this.h._attachAudioListener(n, r || !1)
					}))
			}
			finishProcessing() {
				this.h._waitUntilIdle()
			}
			closeGraph() {
				;(this.h._closeGraph(),
					(this.h.simpleListeners = void 0),
					(this.h.emptyPacketListeners = void 0))
			}
		}),
		class extends lh {
			la() {
				this.h._registerModelResourcesGraphService()
			}
		})
async function sw(e, t) {
	var r = await (async (n, i, s) => {
		var l = ar
		if (
			(n && (await oh(n)),
			!self.ModuleFactory || (i && (await oh(i), !self.ModuleFactory)))
		)
			throw Error('ModuleFactory not set.')
		return (
			self.Module &&
				s &&
				(((n = self.Module).locateFile = s.locateFile),
				s.mainScriptUrlOrBlob &&
					(n.mainScriptUrlOrBlob = s.mainScriptUrlOrBlob)),
			(s = await self.ModuleFactory(self.Module || s)),
			(self.ModuleFactory = self.Module = void 0),
			new l(s, null)
		)
	})(e.wasmLoaderPath, e.assetLoaderPath, {
		locateFile: n =>
			n.endsWith('.wasm')
				? e.wasmBinaryPath.toString()
				: e.assetBinaryPath && n.endsWith('.data')
					? e.assetBinaryPath.toString()
					: n,
	})
	return ((r.ka = new rw()), await r.N(t), r)
}
async function Wu(e, t) {
	return sw(e, t)
}
function uh(e) {
	try {
		let t = e.J.length
		if (t === 1) throw Error(e.J[0].message)
		if (t > 1)
			throw Error(
				'Encountered multiple errors: ' + e.J.map(r => r.message).join(', '),
			)
	} finally {
		e.J = []
	}
}
function Pa(e, t) {
	e.I = Math.max(e.I, t)
}
var fc = class {
	constructor(e) {
		;((this.j = e),
			(this.J = []),
			(this.I = 0),
			this.j.setAutoRenderToScreen(!1))
	}
	setGraph(e, t) {
		;(this.j.attachErrorListener((r, n) => {
			this.J.push(Error(n))
		}),
			this.j.la(),
			this.j.setGraph(e, t),
			uh(this))
	}
	finishProcessing() {
		;(this.j.finishProcessing(), uh(this))
	}
	close() {
		;(this.ka?.close(), this.j.closeGraph())
	}
}
fc.prototype.close = fc.prototype.close
var Ya = class extends gr {
	constructor(e) {
		super(e)
	}
	j() {
		return no(Zr(this, 2)) ?? 0
	}
}
function fh(e, t) {
	ki(e, 1, t)
}
var lw = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	Ug = [0, ti, St, al, -1, wr]
function uw(e, t, r, n) {
	if (e.data !== void 0) {
		var i = new Uint8Array(e.data.buffer, t, r)
		return (
			n === 1 &&
				(function (s, l, f) {
					;(s.i.push([l, f]), s.i.sort((c, m) => c[0] - m[0]), (l = 0))
					for (let [c, m] of s.i) {
						let y = m
						;(f = c) <= l && (l = Math.max(l, f + y))
					}
					l === s.length && (s.data = void 0)
				})(e, t, r),
			i
		)
	}
}
Ya.prototype.l = hs(Ug)
class fw {
	constructor(t) {
		;((this.i = []), (this.data = t), (this.length = t.length))
	}
}
function zg(e, t) {
	return new cw(async () => {
		var {value: r, done: n} = await e.read()
		return n ? void 0 : r
	}, t)
}
async function ch(e, t, r, n, i) {
	if (i === 2)
		return (
			(e.i = []),
			(e.j = () => Promise.resolve(void 0)),
			setTimeout(() => {
				e.l()
			}, 0),
			Promise.resolve(0)
		)
	for (; e.size < r + n;) {
		var s = await e.j()
		if (s === void 0) break
		e.i.push(new fw(s))
	}
	if (e.size < r + n)
		throw Error(
			`Data size is too small: ${e.size}, expected at least ${r + n}.`,
		)
	s = t._malloc(n) >>> 0
	var l = 0
	for (let f = 0; f < e.i.length; f++) {
		let c = e.i[f]
		if (r >= c.length) {
			r -= c.length
			continue
		}
		let m = Math.min(n, c.length - r)
		if ((r = uw(c, r, m, i)) === void 0)
			throw Error('Data has already been released.')
		if ((t.HEAPU8.set(r, s + l), (r = 0), (l += m), (n -= m) === 0)) break
	}
	if (n !== 0) throw Error('Data not found.')
	return Promise.resolve(s)
}
var cw = class {
	constructor(e, t) {
		;((this.i = []), (this.j = e), (this.l = t))
	}
	get size() {
		var e = 0
		for (let t = 0; t < this.i.length; t++) e += this.i[t].length
		return e
	}
}
function Ko(e) {
	return typeof e == 'object' && e != null && 'imageSource' in e
}
function Wo(e) {
	return typeof e == 'object' && e != null && 'audioSource' in e
}
async function dh(e, t, r) {
	e = new Kg(e, r)
	var n = 0
	for (t = t.getReader(); ;) {
		let {value: i, done: s} = await t.read()
		if (s) break
		;(e.set(i, n), (n += i.byteLength))
	}
	if (r !== n)
		throw (
			qg(e),
			Error(
				`File could not be fully loaded to memory, so was not retained. Loaded ${n}/${r} bytes before failure`,
			)
		)
	return e
}
function qg(e) {
	if (e.i)
		try {
			e.h._free(e.j)
		} catch {
		} finally {
			e.i = !1
		}
}
var Kg = class {
		constructor(e, t) {
			;((this.h = e),
				(this.l = t),
				(this.j = this.h._malloc(t) >>> 0),
				(this.o = this.h.HEAPU8),
				(this.i = !!this.j))
		}
		get offset() {
			if (!this.i) throw Error('WasmFileReference has been freed.')
			return this.j
		}
		get size() {
			if (!this.i) throw Error('WasmFileReference has been freed.')
			return this.l
		}
		set(e, t) {
			this.o.set(e, this.j + (t ?? 0))
		}
	},
	Wg = class extends gr {
		constructor(e) {
			super(e)
		}
	}
Wg.prototype.j = hs([0, Vr, 2, $r, St, Vt])
var dw = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	hw = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	vw = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	Gg = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	Gu = [
		0,
		St,
		-6,
		1,
		St,
		1,
		[0, Vt, ti, -2],
		[0, Vt, al],
		ti,
		-2,
		[0, Vt, -1, ti, al, kn, wr, qt, -2],
		1,
		Vt,
		St,
		wr,
		-1,
		[0, ti, St],
		Vt,
		-1,
		Ao,
		St,
		-5,
		Ao,
		-1,
		[0, wr, Ao],
		wr,
		qt,
		[0, wr, -2],
		Ao,
		[0, St],
		[0, St, -4],
		qt,
		wr,
		-2,
		qt,
		-1,
		al,
		Ao,
		qt,
		St,
		-1,
		[0, wr, -2],
		Vt,
		St,
		wr,
		qt,
		[0, wr, -1],
		wr,
		qt,
		-1,
	],
	hh = [0, Vr, -2],
	vh = [
		0,
		[4, 6],
		Gu,
		St,
		1,
		Qb,
		$r,
		Ng,
		Nc,
		hh,
		wr,
		[
			0,
			[
				0,
				St,
				-1,
				un,
				[0, St, [0, St, -1], -1, [0, ti, -1], Vt],
				Vt,
				-2,
				St,
				-1,
			],
			[0, St, -1, Vt],
			Gu,
			Vt,
			St,
			[0, St],
			-1,
		],
		vr,
		-3,
		[0, St, Vt],
		Gu,
		[0, hh, -2],
		ca,
		un,
		[0, Vr, -2],
		ca,
	]
Gg.prototype.j = hs([
	0,
	Vr,
	8,
	[0, Vt, -6],
	1,
	St,
	1,
	St,
	[0, un, [0, Vr, Xb, -1, ti], vh, St],
	[0, St, Vt, -3],
	1,
	ti,
	1,
	vh,
	1,
	St,
	5,
	ti,
	ca,
	1,
	Ug,
	Vt,
	St,
	Vt,
	-1,
])
var pw = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	Hg = class extends gr {
		constructor(e) {
			super(e)
		}
	},
	Sl = [2, 4]
Hg.prototype.j = hs([0, Sl, St, Ng, St, Nr, [0, 1, Vr]])
var gw = (function (e) {
	return class extends e {
		constructor() {
			;(super(...arguments), (this.P = !1), (this.F = this.H = 0))
		}
		M() {
			if (this.P)
				throw Error(
					'Cannot process because LLM inference engine is currently loading or processing.',
				)
			this.P = !0
		}
		L() {
			this.P = !1
		}
		async createLlmInferenceEngine(t, r) {
			this.M()
			try {
				let n = zg(t, () => {})
				await this.h.createLlmInferenceEngine(
					Fr(r, 2) ?? 512,
					rs(r, Ya, 3)?.j() ?? 40,
					Un(Zr(r, 6)) ?? !1 ?? !1,
					Fr(r, 7) ?? 0,
					Un(Zr(r, 8)) ?? !1 ?? !1,
					(i, s, l) => ch(n, this.h, i, s, l),
				)
			} finally {
				this.L()
			}
		}
		async ba(t, r) {
			this.M()
			try {
				;(await this.na(t),
					await this.h.ccall(
						'CreateLlmInferenceEngineConverted',
						'void',
						['number', 'number', 'boolean'],
						[
							Fr(r, 2) ?? 512,
							rs(r, Ya, 3)?.j() ?? 40,
							Un(Zr(r, 6)) ?? !1 ?? !1,
						],
						{async: !0},
					))
			} finally {
				this.L()
			}
		}
		V() {
			this.M()
			try {
				let t = this.h
				;(t.ccall('DeleteLlmInferenceEngine', 'void', [], [], {async: !1}),
					this.H &&
						(t._FreeSession(this.H),
						this.F === this.H && (this.F = 0),
						(this.H = 0)),
					this.F && (t._FreeSession(this.F), (this.F = 0)))
			} finally {
				this.L()
			}
		}
		async R(t, r, n) {
			this.M()
			try {
				let i = [],
					s = this.h
				s._userProgressListener = (v, _) => {
					;(v && i.push(v), n && n(v, _))
				}
				let l = r.l(),
					f = l.length,
					c = this.h._malloc(f)
				this.h.HEAPU8.set(l, c)
				let m = t.some(Wo),
					y = t.some(Ko)
				s.ccallNum = s.ccall
				let g = await s.ccallNum(
					'MakeSessionForPredict',
					'number',
					['number', 'number', 'boolean', 'boolean'],
					[c, f, y, m],
					{async: !0},
				)
				r = []
				for (let v of t)
					if (typeof v == 'string')
						$e(this, v, _ => {
							s._AddTextQueryChunk(g, _)
						})
					else if (Ko(v)) {
						let {image: _, width: S, height: x} = await this.fa(v.imageSource),
							R =
								typeof OffscreenCanvas < 'u'
									? new OffscreenCanvas(S, x)
									: document.createElement('canvas')
						;((R.width = S), (R.height = x))
						let b = R.getContext('2d')
						b.drawImage(_, 0, 0)
						let A = b.getImageData(0, 0, S, x),
							L = this.h._malloc(A.width * A.height * 4)
						;(this.h.HEAPU8.set(A.data, L),
							s._AddImageQueryChunk(g, L, A.width, A.height),
							r.push(L))
					} else {
						if (!Wo(v)) throw Error('Unsupported PromptPart type in query.')
						{
							let _ = await this.ea(v.audioSource),
								S = this.h._malloc(_.audioSamples.byteLength)
							;(this.h.HEAPF32.set(_.audioSamples, S / 4),
								s._AddAudioQueryChunk(
									g,
									_.audioSampleRateHz,
									S,
									_.audioSamples.length,
								),
								r.push(S))
						}
					}
				;(await s.ccall('PredictSession', 'void', ['number'], [g], {async: !0}),
					(t = !0),
					y && this.F === 0 && ((this.F = g), (t = !1)),
					m && this.H === 0 && ((this.H = g), (t = !1)),
					t && s._FreeSession(g))
				for (let v of r) this.h._free(v)
				return (
					(r.length = 0),
					n && n('', !0),
					this.h._free(c),
					(s._userProgressListener = void 0),
					i.join('')
				)
			} finally {
				this.L()
			}
		}
		S(t) {
			this.M()
			var r = 0,
				n = ''
			for (let i of t)
				typeof i == 'string'
					? (n += i)
					: Ko(i)
						? (r += 260)
						: Wo(i) &&
							console.warn(
								'sizeInTokens is not yet implemented for audio; audio tokens will not be counted',
							)
			try {
				let i
				return (
					$e(this, n, s => {
						i = this.h._GetSizeInTokens(s)
					}),
					r + i
				)
			} finally {
				this.L()
			}
		}
		async na(t) {
			t = await (async function (r) {
				for (var n = [], i = 0; ;) {
					let {done: s, value: l} = await r.read()
					if (s) break
					;(n.push(l), (i += l.length))
				}
				if (n.length === 0) return new Uint8Array(0)
				if (n.length === 1) return n[0]
				;((r = new Uint8Array(i)), (i = 0))
				for (let s of n) (r.set(s, i), (i += s.length))
				return r
			})(t)
			try {
				this.h.FS_unlink('llm.task')
			} catch {}
			this.h.FS_createDataFile('/', 'llm.task', t, !0, !1, !1)
		}
		async fa(t) {
			if (typeof t == 'string') {
				let r = new Image()
				;((r.src = t), (r.crossOrigin = 'Anonymous'))
				try {
					await r.decode()
				} catch {
					throw Error(`Image from URL ${t} failed to load`)
				}
				return {image: r, width: r.naturalWidth, height: r.naturalHeight}
			}
			if (t instanceof HTMLImageElement) {
				try {
					await t.decode()
				} catch {
					throw Error('Image from HTMLImageElement failed to load')
				}
				return {image: t, width: t.naturalWidth, height: t.naturalHeight}
			}
			return t instanceof HTMLVideoElement
				? {image: t, width: t.videoWidth, height: t.videoHeight}
				: t instanceof VideoFrame
					? {image: t, width: t.displayWidth, height: t.displayHeight}
					: {image: t, width: t.width, height: t.height}
		}
		async ea(t) {
			if (typeof t == 'string') {
				let r = await fetch(t)
				if (!r.ok) throw Error(`Audio fetch for ${t} had error: ${r.status}`)
				return (
					(t = await r.arrayBuffer()),
					{
						audioSamples: (t = await new AudioContext({
							sampleRate: 16e3,
						}).decodeAudioData(t)).getChannelData(0),
						audioSampleRateHz: t.sampleRate,
					}
				)
			}
			return typeof t == 'object' &&
				t != null &&
				'audioSamples' in t &&
				'audioSampleRateHz' in t
				? t
				: {audioSamples: t.getChannelData(0), audioSampleRateHz: t.sampleRate}
		}
	}
})(
	(function (e) {
		var t = class extends e {
			static async ma(r, n) {
				n ||= await t.X()
				var i = []
				for (let l of r?.requiredFeatures ?? [])
					n.features.has(l)
						? i.push(l)
						: console.warn(`WebGPU feature ${l} is not supported.`)
				r = {...r, requiredFeatures: i}
				try {
					var s = await n.requestDevice(r)
				} catch (l) {
					throw (
						console.error(
							'Unable to initialize WebGPU with the requested features.',
						),
						l
					)
				}
				return ((r = s).adapterInfo || (r.adapterInfo = n.info), s)
			}
			static async X(r) {
				if (!(r = await navigator.gpu.requestAdapter(r)))
					throw Error(
						'Unable to request adapter from navigator.gpu; Ensure WebGPU is enabled.',
					)
				return r
			}
			ga(r) {
				if (n)
					typeof HTMLCanvasElement < 'u' &&
						n instanceof HTMLCanvasElement &&
						(n.id = 'canvas_webgpu')
				else var n = new OffscreenCanvas(1, 1)
				;(n
					.getContext('webgpu')
					.configure({
						device: r,
						format: navigator.gpu.getPreferredCanvasFormat(),
					}),
					(this.h.preinitializedWebGPUDevice = r))
			}
			aa() {
				return this.h.ccall('closeGraph', 'void', [], [], {async: !0})
			}
		}
		return t
	})(
		(function (e) {
			return class extends e {
				addStreamingReaderToInputSidePacket(t, r) {
					this.h.addStreamingReaderToInputSidePacket(
						(n, i, s) => ch(t, this.h, n, i, s),
						r,
					)
				}
			}
		})(
			(function (e) {
				return class extends e {
					Y(t, r) {
						$e(this, 'lora_model_ref_in', n => {
							this.h._addRawDataSpanToInputStream(t.offset, t.size, n, r)
						})
					}
				}
			})(class extends ow {}),
		),
	),
)
class cc extends gw {}
var dc = class {
		constructor(e) {
			;((this.j = e), (this.i = ph), ph++)
		}
	},
	ph = 1
class _w {
	constructor() {
		var t, r
		;((this.promise = new Promise((n, i) => {
			;((t = n), (r = i))
		})),
			(this.resolve = t),
			(this.reject = r))
	}
}
function gh(e) {
	return e === 1 ? 1 : e + (e % 2)
}
async function Gs() {
	var e = await cc.X({powerPreference: 'high-performance'}),
		t = e.limits.maxBufferSize,
		r = e.limits.maxStorageBufferBindingSize
	return (
		t < 524550144 &&
			console.warn(
				`This WebGPU device is unable to execute most LLM tasks, because the required maxBufferSize is usually at least 524550144, but your device only supports maxBufferSize of ${t}`,
			),
		r < 524550144 &&
			console.warn(
				`The WebGPU device is unable to execute LLM tasks, because the required maxStorageBufferBindingSize is usually at least 524550144, but your device only supports maxStorageBufferBindingSize of ${r}`,
			),
		(t = {
			requiredFeatures: ['shader-f16'],
			requiredLimits: {
				maxStorageBufferBindingSize: r,
				maxBufferSize: t,
				maxStorageBuffersPerShaderStage:
					e.limits.maxStorageBuffersPerShaderStage,
			},
		}),
		e.features.has('subgroups') &&
			(console.warn(
				'Experimental Chromium WGSL subgroup support detected. Enabling this feature in the inference engine.',
			),
			(t.requiredFeatures = ['shader-f16', 'subgroups'])),
		cc.ma(t, e)
	)
}
function Fa(e) {
	if (e.D.length > 0) {
		let t = [...e.D]
		if (((e.D.length = 0), !e.o)) throw t
		;(e.o.reject(t), (e.o = void 0))
	}
}
function mw(e) {
	var t = (function (n) {
		var i = new Fg()
		;(lt(i, 10, 'text_in'),
			lt(i, 10, 'token_cost_in'),
			lt(i, 10, 'lora_model_id_to_apply_in'),
			lt(i, 10, 'lora_model_ref_in'),
			lt(i, 10, 'lora_model_id_to_load_in'),
			lt(i, 16, 'streaming_reader'),
			lt(i, 15, 'text_out'),
			lt(i, 15, 'text_end'),
			lt(i, 15, 'token_cost_out'))
		var s = new Xn()
		;(Wr(s, 2, 'TokenizerInputBuildCalculator'),
			lt(s, 3, 'PROMPT:text_in'),
			lt(s, 3, 'LORA_ID:lora_model_id_to_apply_in'),
			lt(s, 4, 'prompt'),
			gi(i, s),
			(s = new Xn()),
			Wr(s, 2, 'ModelDataCalculator'),
			lt(s, 6, 'MODEL_DATA:__side_packet_1'),
			lt(s, 6, 'MODEL_TYPE:model_type'),
			lt(s, 5, 'READ_DATA_FN:streaming_reader'),
			lt(s, 3, 'LORA_MODEL_SPAN:lora_model_ref_in'),
			lt(s, 3, 'LORA_MODEL_ID:lora_model_id_to_load_in'),
			lt(s, 4, 'LORA_DATA:lora_model_data'),
			gi(i, s),
			(s = new Xn()),
			Wr(s, 2, 'Gpt2UnicodeMappingCalculator'),
			lt(s, 5, 'MODEL_TYPE:model_type'),
			lt(s, 6, 'BYTES_TO_UNICODE_MAPPING:tokenizer_mapping'),
			gi(i, s),
			(s = new Ca()),
			Wr(
				s,
				1,
				'type.googleapis.com/odml.infra.proto.TokenizerCalculatorOptions',
			))
		var l = new Hg(),
			f = Fr(n.i, 2)
		;(Nn(l, 1, f), Wr((f = new pw()), 2, 'spm_vocab_model'), (f = wg(f)))
		e: {
			io(l)
			var c = l.m,
				m = 0 | c[Et]
			if (f == null) {
				var y = jd(c)
				if (Ud(y, c, m) !== 4) break e
				y.set(Sl, 0)
			} else {
				let g = jd((y = c)),
					v = Ud(g, y, m)
				v !== 4 && (v && (m = Wn(y, m, v)), g.set(Sl, 4))
			}
			Wn(c, m, 4, f)
		}
		return (
			f && !Cn(f) && Va(l.m),
			Nn(l, 3, 2),
			Uu(s, l.j()),
			Wr((l = new Xn()), 2, 'TokenizerCalculator'),
			Po(l, 8, Ca, s),
			lt(l, 5, 'MODEL_DATA:__side_packet_1'),
			lt(l, 3, 'PROMPT_AND_INPUT_OPTIONS:prompt'),
			lt(l, 5, 'BYTES_TO_UNICODE_MAPPING:tokenizer_mapping'),
			lt(l, 6, 'PROCESSOR_GETTER:__input_side_1'),
			lt(l, 4, 'IDS_AND_INPUT_OPTIONS:__stream_0'),
			gi(i, l),
			(s = new Ca()),
			Wr(s, 1, 'type.googleapis.com/odml.infra.proto.LlmGpuCalculatorOptions'),
			Nn((l = new Gg()), 12, 3),
			Wr(l, 1, 'llm.tflite'),
			Nn(l, 14, 0),
			(f = gh(Fr(n.i, 5))),
			Nn(l, 22, f),
			(f = rs(n.i, Ya, 3)),
			ki(l, 31, f),
			Ta((f = new dw()), 1, !0),
			Un(Zr(n.i, 6)) != null && (Un(Zr(n.i, 6)) ?? !1) && Ta(f, 1, !1),
			Ta(f, 2, !0),
			Ta(f, 5, !0),
			ki(l, 10, f),
			(f = gg(n.i, 4, no, Sb === void 0 ? 2 : 4)),
			bg(l, 29, f),
			(f = new vw()),
			Nn((c = new hw()), 1, 1),
			(y = Fr(n.i, 2)),
			Nn(c, 2, y),
			Un(Zr(n.i, 9)) != null &&
				(Un(Zr(n.i, 9)) ?? !1) &&
				(Ta(l, 35, !0), il(c, 60, !0)),
			ki(f, 1, c),
			ki(l, 20, f),
			Uu(s, l.j()),
			Wr((l = new Xn()), 2, 'LlmGpuCalculator'),
			Po(l, 8, Ca, s),
			lt(l, 3, 'IDS_AND_INPUT_OPTIONS:__stream_0'),
			lt(l, 3, 'FINISH:finish'),
			lt(l, 3, 'LORA_DATA:lora_model_data'),
			lt(l, 5, 'MODEL_DATA:__side_packet_1'),
			lt(l, 4, 'DECODED_IDS:__stream_3'),
			lt(l, 4, 'OUTPUT_END:__stream_4'),
			(s = new eh()),
			Wr(s, 1, 'FINISH'),
			Ta(s, 2, !0),
			Po(l, 13, eh, s),
			gi(i, l),
			(s = new Xn()),
			Wr(s, 2, 'IsPacketPresentCalculator'),
			lt(s, 3, '__stream_4'),
			lt(s, 4, 'text_end'),
			gi(i, s),
			(s = new Ca()),
			Wr(
				s,
				1,
				'type.googleapis.com/odml.infra.proto.DetokenizerCalculatorOptions',
			),
			(l = new Wg()),
			(n = gh(Fr(n.i, 5))),
			Nn(l, 5, n),
			lt(l, 4, '<eos>'),
			lt(l, 4, '<|endoftext|>'),
			Uu(s, l.j()),
			(n = new Xn()),
			Wr(n, 2, 'DetokenizerCalculator'),
			Po(n, 8, Ca, s),
			lt(n, 3, 'IDS_AND_INPUT_OPTIONS:__stream_3'),
			lt(n, 5, 'PROCESSOR_GETTER:__input_side_1'),
			lt(n, 5, 'BYTES_TO_UNICODE_MAPPING:tokenizer_mapping'),
			lt(n, 5, 'MODEL_DATA:__side_packet_1'),
			lt(n, 4, 'FINISH_AND_INPUT_OPTIONS:finish'),
			lt(n, 4, 'WORDS:text_out'),
			gi(i, n),
			(n = new Xn()),
			Wr(n, 2, 'TokenCostCalculator'),
			lt(n, 3, 'PROMPT:token_cost_in'),
			lt(n, 5, 'PROCESSOR_GETTER:__input_side_1'),
			lt(n, 5, 'BYTES_TO_UNICODE_MAPPING:tokenizer_mapping'),
			lt(n, 4, 'NUM_TOKENS:token_cost_out'),
			gi(i, n),
			i
		)
	})(e)
	;(e.j.attachStringVectorListener('text_out', (n, i) => {
		;((n = (function (s, l) {
			return s == null || s.length === 0
				? []
				: s.map(
						f => (
							(f = (f = f.replaceAll('▁', ' ')).replaceAll(
								'<0x0A>',
								`
`,
							)),
							l && (f = f.trimStart()),
							f.split('\\[eod\\]', 1)[0]
						),
					)
		})(n, e.G.length === 0)),
			n.forEach((s, l) => {
				l < Fr(e.i, 5) && e.G[l].push(s)
			}),
			e.A &&
				e.D.length === 0 &&
				(e.B ? (n.length > Fr(e.i, 5) && n.pop(), e.A(n, !1)) : e.A(n[0], !1)),
			Pa(e, i))
	}),
		e.j.attachEmptyPacketListener('text_out', n => {
			Pa(e, n)
		}),
		e.j.attachBoolListener('text_end', (n, i) => {
			Pa(e, i)
			try {
				Fa(e)
			} catch (s) {
				throw ((e.l = !1), s)
			}
			if ((e.o && (e.o.resolve(e.G.map(s => s.join(''))), (e.o = void 0)), e.A))
				if (e.B) {
					for (n = [], i = 0; i < Fr(e.i, 5); i++) n.push('')
					e.A(n, !0)
				} else e.A('', !0)
			;((e.l = !1), (e.B = void 0))
		}),
		e.j.attachEmptyPacketListener('text_end', n => {
			;((e.l = !1),
				(e.B = void 0),
				Pa(e, n),
				Fa(e),
				e.o && (e.o.resolve(e.G.map(i => i.join(''))), (e.o = void 0)))
		}),
		e.j.attachIntListener('token_cost_out', (n, i) => {
			;((e.T = n), Pa(e, i))
		}),
		e.U && e.j.addStreamingReaderToInputSidePacket(e.U, 'streaming_reader'))
	var r = t.j()
	return (
		e.C?.removeEventListener('uncapturederror', e.K),
		e.j.aa().then(() => {
			;(e.C?.addEventListener('uncapturederror', e.K),
				(e.D.length = 0),
				e.setGraph(new Uint8Array(r), !0),
				e.finishProcessing())
		})
	)
}
function _h(e, t, r, n) {
	if (
		((e.A = typeof r == 'function' ? r : n),
		(n = (t = Array.isArray(t) ? t : [t]).filter(i => Ko(i)).length) > 0 &&
			(gl(Zr(e.i, 7)) == null || Fr(e.i, 7) < n))
	)
		throw Error(
			`maxNumImages is set to ${gl(Zr(e.i, 7)) != null ? Fr(e.i, 7) : 0}, but the query included ${n} images.`,
		)
	if (
		(n = t.filter(i => Wo(i)).length) > 0 &&
		(Un(Zr(e.i, 8)) == null || !Un(Zr(e.i, 8)))
	)
		throw Error(
			`supportAudio was not enabled, but the query included ${n} audio chunks.`,
		)
	if (e.v) {
		if (e.B && Fr(e.i, 5) > 1)
			throw Error(
				'Multi-response generation is not supported for converted LLM models (.task format) yet, nor is it supported for multimodality. Please use the .bin format without multimodality or request only one response.',
			)
		if (r instanceof dc)
			throw Error(
				'LoRA is not supported for converted LLM models (.task format) yet, nor is it supported for multimodality. Please use the .bin format without multimodality to use LoRA.',
			)
		return (
			(e.j.h.LLM_CANCEL_FLAG = void 0),
			e.j
				.R(t, e.u, (i, s) => {
					e.D.length === 0 && e.A && (e.B ? e.A([i], s) : e.A(i, s))
				})
				.then(i => (Fa(e), [i]))
		)
	}
	if (e.l) throw Error('Previous invocation or loading is still ongoing.')
	for (
		e.l = !0, e.j.h.LLM_CANCEL_FLAG = void 0, e.G.length = 0, n = 0;
		n < Fr(e.i, 5);
		n++
	)
		e.G[n] = []
	if (
		((n = e.I + 1),
		e.j.addStringToStream(t.join(''), 'text_in', n),
		r instanceof dc)
	) {
		if (r.j !== e)
			throw (
				(e.l = !1),
				(e.B = void 0),
				Error('The LoRA model was not loaded by this LLM Inference task.')
			)
		e.j.addUintToStream(r.i, 'lora_model_id_to_apply_in', n)
	} else e.j.addEmptyPacketToStream('lora_model_id_to_apply_in', n)
	return (e.finishProcessing(), (e.o = new _w()), e.o.promise)
}
var ar = class extends fc {
	constructor(e, t) {
		if (
			(super(new cc(e, t)),
			(this.G = []),
			(this.O = this.v = this.l = !1),
			(this.D = []),
			(this.K = r => {
				if ((r = r.error).message.match(/exceeds the max buffer size limit/))
					throw Error(`Failed to run this LLM model because it requires a buffer size that exceeds the maximum size your device supports, but you could try a smaller LLM model or different device.
WebGPU throws: "${r.message}"`)
				if (
					r.message.match(
						/is larger than the maximum storage buffer binding size/,
					)
				)
					throw Error(`Failed to run this LLM model because it requires a storage buffer binding size that exceeds the maximum size your device supports, but you could try a smaller LLM model or different device.
WebGPU throws: "${r.message}"`)
				this.D.push(r)
			}),
			(this.i = new lw()),
			fh(this.i, new ih()),
			(this.u = new Ya()),
			ki(this.i, 3, this.u),
			ko(this.i, 2, 512),
			(e = this.u),
			!ro(2))
		)
			throw es('enum')
		;(Ei(e, 1, 2, 0),
			Nn(this.u, 2, 40),
			Ei(this.u, 3, Nu(1), 0),
			Za(this.u, 5, uc(0)),
			Ei(this.u, 4, Nu(0.8), 0),
			ko(this.i, 5, 1))
	}
	async N(e) {
		if (this.l) throw Error('Cannot set options while loading or processing.')
		if (e.baseOptions?.modelAssetPath && e.baseOptions?.modelAssetBuffer)
			throw Error(
				'Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer',
			)
		var t,
			r = new Promise(l => {
				t = l
			})
		if (e.baseOptions?.modelAssetPath) {
			var n = await fetch(e.baseOptions.modelAssetPath.toString())
			if (!n.ok)
				throw Error(
					`Failed to fetch model: ${e.baseOptions.modelAssetPath} (${n.status})`,
				)
			if (!n.body)
				throw Error(
					`Failed to fetch model: ${e.baseOptions.modelAssetPath} (no body)`,
				)
			n = n.body.getReader()
		} else
			e.baseOptions?.modelAssetBuffer instanceof Uint8Array
				? (n = (function (l) {
						return new ReadableStream({
							start() {},
							async pull(f) {
								;(f.enqueue(l), f.close())
							},
						})
					})(e.baseOptions.modelAssetBuffer).getReader())
				: e.baseOptions?.modelAssetBuffer instanceof ReadableStreamDefaultReader
					? ((n = e.baseOptions.modelAssetBuffer),
						(e.baseOptions.modelAssetBuffer = void 0))
					: t()
		if (!n) throw Error('No model asset provided.')
		{
			let [l, f] = ah(n)
			var i = await (async function (m) {
				var y,
					g = []
				for (let [_, S] of nw) {
					let x = _
					var v = S
					;(([m, y] = ah(m)),
						(v = await v(y)),
						await y.cancel(),
						v && g.push(x))
				}
				if ((await m.cancel(), g.length === 0))
					throw Error('No model format matched.')
				if (g.length === 1) return g[0]
				throw Error(`Multiple model formats matched: ${g}`)
			})(f)
			this.O = i === 1
			var s = null
			if (i === 2) {
				let m = this.j.h
				s = await (async function (y, g) {
					y = new iw(y)
					var v = await Ku(y, 32)
					if (
						((v = new DataView(v.buffer)),
						(v = Number(v.getBigUint64(24, !0))),
						(g = g(await Ku(y, v - 32))) < 0)
					)
						throw Error(
							'.litertlm file could not be read or did not contain a web-formatted LLM',
						)
					return (await Ku(y, g - v), y)
				})(l, y => {
					var g = m._malloc(y.length)
					return (
						m.HEAPU8.set(y, g),
						(y = m._GetLiteRtModelOffset(g)),
						m._free(g),
						y
					)
				})
			}
			;((i = 'maxNumImages' in e && e.maxNumImages ? e.maxNumImages : 0),
				ko(this.i, 7, i))
			let c = 'supportAudio' in e && !!e.supportAudio
			;(il(this.i, 8, c),
				this.O || i > 0 || c
					? ((this.v = !0), (n = s || l))
					: ((this.v = !1), (this.U = zg(s || l, t))))
		}
		if (
			(e.baseOptions?.gpuOptions?.device &&
				(this.C && this.C.removeEventListener('uncapturederror', this.K),
				(this.C = e.baseOptions.gpuOptions.device),
				this.j.ga(this.C),
				this.C.addEventListener('uncapturederror', this.K)),
			'maxTokens' in e && ko(this.i, 2, e.maxTokens ?? 512),
			'topK' in e && Nn(this.u, 2, e.topK ?? 40),
			'temperature' in e && Ei(this.u, 4, Nu(e.temperature ?? 0.8), 0),
			'randomSeed' in e && Za(this.u, 5, uc(e.randomSeed ?? 0)),
			'loraRanks' in e &&
				(function (l, f) {
					bg(l, 4, f)
				})(this.i, e.loraRanks ?? []),
			'numResponses' in e)
		) {
			if ((s = e.numResponses ?? 1) < 1)
				throw Error("'numResponses' must be at least 1.")
			if (this.v && s > 1)
				throw Error(
					"'numResponses > 1' is not supported for converted LLM models yet, and is also not supported with multimodality.",
				)
			;(ko(this.i, 5, s),
				(i = rs(this.i, Ya, 3)),
				s > 1 &&
					i &&
					(i.j() <= 1 || (Zr(i, 4, sg) ?? 0) <= 0) &&
					console.warn(
						'To generate multiple responses, it is expected topK > 1 and temperature > 0; otherwise, all the generated responses may be the same.',
					))
		}
		if (
			('forceF32' in e && e.forceF32 !== void 0 && il(this.i, 6, e.forceF32),
			'disableRewinding' in e && e.disableRewinding !== void 0)
		) {
			if (this.v && e.disableRewinding)
				throw Error(
					"'disableRewinding' is not supported for converted LLM models yet, and is also not supported with multimodality.",
				)
			il(this.i, 9, e.disableRewinding)
		}
		return this.v
			? (this.j.V(),
				this.O
					? this.j.ba(n, this.i).then(() => {
							Fa(this)
						})
					: this.j.createLlmInferenceEngine(n, this.i).then(() => {
							Fa(this)
						}))
			: ((this.l = !0),
				(e = mw(this).then(() => {})),
				Promise.all([r, e]).then(() => {
					;((this.l = !1), Fa(this))
				}))
	}
	get baseOptions() {
		return rs(this.i, ih, 1)
	}
	set baseOptions(e) {
		fh(this.i, e)
	}
	get isIdle() {
		return !this.l && !this.o
	}
	R(e, t, r) {
		return (
			Fr(this.i, 5) > 1 &&
				console.warn(
					"'numResponses' is set larger than 1 and this function only returns the first response, so we recommend either using 'generateResponses()' to obtain multiple responses, or else setting 'numResponses' to 1 for better performance.",
				),
			(this.B = !1),
			_h(this, e, t, r).then(n => n[0])
		)
	}
	da(e, t, r) {
		return ((this.B = !0), _h(this, e, t, r))
	}
	S(e) {
		if (((e = Array.isArray(e) ? e : [e]), this.v)) return this.j.S(e)
		if (this.l) throw Error('Previous invocation or loading is still ongoing.')
		if (e.some(Ko))
			throw Error('sizeInTokens requires maxNumImages > 0 for images.')
		if (e.some(Wo)) throw Error('sizeInTokens requires supportAudio for audio.')
		return (
			(e = e.join('')),
			(this.l = !0),
			(this.T = void 0),
			this.j.addStringToStream(e, 'token_cost_in', this.I + 1),
			this.finishProcessing(),
			(this.l = !1),
			this.T
		)
	}
	Z() {
		var e = this.j.h
		;(this.v || this.l) && (e.LLM_CANCEL_FLAG = 1)
	}
	async ja(e) {
		if (this.v)
			throw Error(
				'LoRA is not supported for converted LLM models (.task format) yet, nor is it supported for multimodality. Please use the old format (.bin) without multimodality to use LoRA.',
			)
		if (this.l)
			throw Error('Cannot load LoRA model while loading or processing.')
		if (((this.l = !0), e instanceof Uint8Array)) {
			var t = new Kg(this.j.h, e.length)
			;(t.set(e), (e = t))
		} else
			e =
				e instanceof Blob
					? await (async function (n, i) {
							return dh(n, i.stream(), i.size)
						})(this.j.h, e)
					: await (async function (n, i) {
							i = await fetch(i.toString())
							var s = Number(i.headers.get('content-length'))
							if (!i.body) throw Error('Response body is not available.')
							if (!s) throw Error('File size is 0.')
							return dh(n, i.body, s)
						})(this.j.h, e)
		t = new dc(this)
		var r = this.I + 1
		return (
			this.j.Y(e, r),
			this.j.addUintToStream(t.i, 'lora_model_id_to_load_in', r),
			this.finishProcessing(),
			qg(e),
			Pa(this, r),
			(this.l = !1),
			t
		)
	}
	close() {
		;(this.v && this.j.V(),
			this.C?.removeEventListener('uncapturederror', this.K),
			super.close())
	}
}
;((ar.prototype.loadLoraModel = ar.prototype.ja),
	(ar.prototype.cancelProcessing = ar.prototype.Z),
	(ar.prototype.sizeInTokens = ar.prototype.S),
	(ar.prototype.generateResponses = ar.prototype.da),
	(ar.prototype.generateResponse = ar.prototype.R),
	(ar.prototype.setOptions = ar.prototype.N),
	(ar.createWebGpuDevice = Gs),
	(ar.createFromModelPath = async function (e, t) {
		return Wu(
			e,
			(t = {
				baseOptions: {gpuOptions: {device: await Gs()}, modelAssetPath: t},
			}),
		)
	}),
	(ar.createFromModelBuffer = async function (e, t) {
		return Wu(
			e,
			(t = {
				baseOptions: {gpuOptions: {device: await Gs()}, modelAssetBuffer: t},
			}),
		)
	}),
	(ar.createFromOptions = async function (e, t) {
		if (!t.baseOptions?.gpuOptions?.device) {
			let r = await Gs()
			;((t.baseOptions = t.baseOptions ?? {}),
				(t.baseOptions.gpuOptions = t?.baseOptions?.gpuOptions ?? {}),
				(t.baseOptions.gpuOptions.device = r))
		}
		return Wu(e, t)
	}))
const $g = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm',
	Bc = {
		'gemma3-1b-int4': {
			name: 'Gemma 3 1B (Empfohlen)',
			url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4-web.task',
			sizeBytes: 7e8,
			description: 'Schnell, gut für Deutsch',
		},
		'gemma3-1b-int8': {
			name: 'Gemma 3 1B (Hohe Qualität)',
			url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int8-web.task',
			sizeBytes: 1e9,
			description: 'Bessere Qualität, größerer Download',
		},
	}
let ni = null,
	ns = ''
async function Vg() {
	if (!navigator.gpu) return {supported: !1, reason: 'WebGPU nicht verfügbar'}
	try {
		return (await navigator.gpu.requestAdapter())
			? {supported: !0}
			: {supported: !1, reason: 'Kein GPU-Adapter'}
	} catch (e) {
		return {
			supported: !1,
			reason: `WebGPU-Check fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`,
		}
	}
}
function yw(e, t) {
	const r = bw(e)
	return `${ww(t)} Du verwandelst den bereitgestellten Text in einen kurzen, extrem leicht verständlichen Radio-Beitrag (${r}).
- Nutze kurze Sätze. Keine Schachtelsätze.
- Verwende rhetorische Fragen und lockere Überleitungen ("Übrigens...", "Schon gewusst?").
- Antworte ausschließlich mit dem reinen Sprechtext. Keine Markdown-Formatierung.`
}
function bw(e) {
	switch (e) {
		case 'short':
			return 'maximal 30 Sekunden Sprechzeit'
		case 'long':
			return 'maximal 3 Minuten Sprechzeit'
		case 'chill':
			return 'entspannt und ausführlich, bis zu 4 Minuten Sprechzeit'
		default:
			return 'maximal 90 Sekunden Sprechzeit'
	}
}
function ww(e) {
	switch (e) {
		case 'casual':
			return 'Du sprichst wie mit einem guten Freund. Locker, umgangssprachlich, mit Humor und Alltagsbeispielen.'
		case 'academic':
			return 'Du bist ein erfahrener Dozent und Erklärer. Strukturiert, faktenbasiert, mit klaren Zusammenhängen.'
		case 'entertaining':
			return 'Du bist ein unterhaltsamer Erzähler und Entertainer. Nutze Humor, überraschende Fakten, Storytelling.'
		case 'news':
			return 'Du bist ein erfahrener Nachrichtensprecher. Sachlich, prägnant, informativ.'
		case 'podcast':
			return 'Du bist ein erfahrener Podcast-Host. Persönlich, nahbar, mit eigenen Anekdoten.'
		default:
			return 'Du bist ein erfahrener Radio-Moderator für ein Tech- und Infotainment-Radio.'
	}
}
function Sw(e) {
	switch (e) {
		case 'short':
			return 200
		case 'long':
			return 800
		case 'chill':
			return 1e3
		default:
			return 500
	}
}
function Ew(e, t) {
	return `<start_of_turn>user
${e}

${t}<end_of_turn>
<start_of_turn>model
`
}
async function Zg(e, t) {
	if (ni && ns === e) return
	await $l()
	const r = Bc[e]
	t?.(0)
	const n = await Qi.forGenAiTasks($g)
	;(t?.(10),
		(ni = await ar.createFromOptions(n, {
			baseOptions: {modelAssetPath: r.url},
			maxTokens: 1e3,
			topK: 40,
			temperature: 0.8,
			randomSeed: 42,
		})),
		(ns = e),
		t?.(100))
}
async function Yg(e, t) {
	if (e.name.endsWith('.litertlm'))
		throw new Error(
			'.litertlm Dateien sind nur für Android Native kompatibel. Bitte verwende eine .task Datei (z.B. gemma3-1b-it-int4-web.task).',
		)
	;(await $l(), t?.(0))
	const r = await Qi.forGenAiTasks($g)
	t?.(10)
	const n = e.stream().getReader()
	;((ni = await ar.createFromOptions(r, {
		baseOptions: {modelAssetBuffer: n},
		maxTokens: 1e3,
		topK: 40,
		temperature: 0.8,
		randomSeed: 42,
	})),
		(ns = `file:${e.name}`),
		t?.(100))
}
async function kw(e) {
	if (!ni)
		throw new Error('Kein Modell geladen. Bitte zuerst ein Modell laden.')
	const t = yw(e.quality, e.style)
	let r
	;(e.mode === 'deeper'
		? (r = `Gehe vertieft auf das Thema ein. Erzähle mehr Hintergründe, Details, Zusammenhänge und interessante Fakten.

Verwandle das in ein Radioskript:

${e.topic}`)
		: (r = `Verwandle das in ein Radioskript:

${e.topic}`),
		e.linkContent &&
			(r += `

Quelltext (URL-Inhalt):
${e.linkContent}`))
	const n = Ew(t, r),
		i = Sw(e.quality),
		s = await ni.generateResponse(n)
	if (!s || s.length === 0) throw new Error('Leere Antwort vom lokalen Modell')
	let l = s.trim()
	return (l.length > i * 4 && (l = l.slice(0, i * 4)), l)
}
async function $l() {
	ni && (ni.close(), (ni = null), (ns = ''))
}
function Xg() {
	return ni !== null
}
function hc() {
	return ns
}
const xw = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			AVAILABLE_MODELS: Bc,
			checkWebGPUAvailability: Vg,
			generateScript: kw,
			getCurrentModelKey: hc,
			isModelReady: Xg,
			loadModelFromFile: Yg,
			loadModelFromUrl: Zg,
			unloadModel: $l,
		},
		Symbol.toStringTag,
		{value: 'Module'},
	),
)
var mh = ot('<span class="error-text svelte-1h0cjjc"> </span>'),
	Aw = ot(
		'<div class="progress-container svelte-1h0cjjc"><div class="progress-bar svelte-1h0cjjc"><div class="progress-fill svelte-1h0cjjc"></div></div> <span class="progress-text svelte-1h0cjjc"> </span></div>',
	),
	Tw = ot('<button class="btn-ctrl svelte-1h0cjjc">[ ▶ START ]</button>'),
	Iw = ot(
		'<button class="btn-ctrl btn-stop svelte-1h0cjjc">[ ⏹ STOP ]</button>',
	),
	Rw = ot('<button class="btn-sm svelte-1h0cjjc">[ DOWNLOAD ]</button>'),
	Cw = ot(
		'<div class="model-row svelte-1h0cjjc"><label class="model-radio svelte-1h0cjjc"><input type="radio" name="active-model" class="svelte-1h0cjjc"/> <div class="model-info svelte-1h0cjjc"><span class="model-name svelte-1h0cjjc"> </span> <span class="model-meta svelte-1h0cjjc"> </span></div></label> <!></div>',
	),
	Ow = ot(
		'<div class="section loaded-model svelte-1h0cjjc"><h4 class="svelte-1h0cjjc">> GELADENES MODELL</h4> <span class="model-name svelte-1h0cjjc"> </span></div>',
	),
	Dw = ot(
		'<div class="controls-row svelte-1h0cjjc"><!></div> <div class="section svelte-1h0cjjc"><h4 class="svelte-1h0cjjc">> MODELL AUSWÄHLEN</h4> <!></div> <div class="section svelte-1h0cjjc"><h4 class="svelte-1h0cjjc">> EIGENES MODELL</h4> <input type="file" accept=".task" style="display: none;" class="svelte-1h0cjjc"/> <button class="btn-ctrl btn-pick svelte-1h0cjjc">[ 📁 .TASK DATEI AUSWÄHLEN ]</button></div> <!>',
		1,
	),
	Pw = ot(
		'<div class="section svelte-1h0cjjc"><p class="hint warning svelte-1h0cjjc">Local LLM benötigt WebGPU. Bitte verwende Chrome 113+ oder einen kompatiblen Browser.</p></div>',
	),
	Lw = ot(
		'<div class="model-manager svelte-1h0cjjc"><h3 class="svelte-1h0cjjc">═══ LOCAL LLM ═══</h3> <div class="status-bar svelte-1h0cjjc"><span class="status-label svelte-1h0cjjc">WebGPU:</span> <span> </span> <!></div> <div class="status-bar svelte-1h0cjjc"><span class="status-label svelte-1h0cjjc">STATUS:</span> <span> </span> <!></div> <!> <!></div>',
	)
function Mw(e, t) {
	da(t, !0)
	let r = qe(!1),
		n = qe(''),
		i = qe('CHECKING...'),
		s = qe(''),
		l = qe('gemma3-1b-int4'),
		f = qe(0),
		c = qe(null)
	const m = Object.entries(Bc)
	function y($) {
		return $ >= 1e9
			? `${($ / 1e9).toFixed(1)} GB`
			: $ >= 1e6
				? `${($ / 1e6).toFixed(0)} MB`
				: `${($ / 1e3).toFixed(0)} KB`
	}
	async function g() {
		q(i, 'CHECKING...')
		const $ = await Vg()
		;(q(r, $.supported, !0),
			q(n, $.reason || '', !0),
			$.supported
				? q(i, 'NOT RUNNING')
				: (q(i, 'ERROR'), q(s, $.reason || 'WebGPU nicht verfügbar', !0)))
	}
	async function v($) {
		;(q(i, 'LOADING...'), q(f, 0), q(s, ''))
		try {
			;(await Zg($, Ie => {
				q(f, Ie, !0)
			}),
				q(i, 'READY'))
			const _e = bi()
			;((_e.localModelKey = $), to(_e))
		} catch (_e) {
			;(q(i, 'ERROR'), q(s, _e instanceof Error ? _e.message : String(_e), !0))
		}
	}
	async function _() {
		I(c) && I(c).click()
	}
	async function S($) {
		const Ie = $.target.files?.[0]
		if (Ie) {
			;(q(i, 'LOADING...'), q(f, 0), q(s, ''))
			try {
				;(await Yg(Ie, xe => {
					q(f, xe, !0)
				}),
					q(i, 'READY'))
			} catch (xe) {
				;(q(i, 'ERROR'),
					q(s, xe instanceof Error ? xe.message : String(xe), !0))
			} finally {
				I(c) && (I(c).value = '')
			}
		}
	}
	async function x() {
		try {
			;(await $l(), q(i, 'NOT RUNNING'), q(s, ''))
		} catch ($) {
			console.error('Unload failed:', $)
		}
	}
	function R($) {
		q(l, $, !0)
	}
	;(Ti(() => {
		g()
	}),
		Ti(() => {
			Xg() && q(i, 'READY')
		}))
	var b = Lw(),
		A = oe(ie(b), 2),
		L = oe(ie(A), 2)
	let N
	var U = ie(L),
		ee = oe(L, 2)
	{
		var X = $ => {
			var _e = mh(),
				Ie = ie(_e)
			;(At(() => dt(Ie, I(n))), et($, _e))
		}
		It(ee, $ => {
			!I(r) && I(n) && $(X)
		})
	}
	var ve = oe(A, 2),
		ge = oe(ie(ve), 2)
	let ye
	var Ne = ie(ge),
		je = oe(ge, 2)
	{
		var Ee = $ => {
			var _e = mh(),
				Ie = ie(_e)
			;(At(() => dt(Ie, I(s))), et($, _e))
		}
		It(je, $ => {
			I(s) && $(Ee)
		})
	}
	var Me = oe(ve, 2)
	{
		var Qe = $ => {
			var _e = Aw(),
				Ie = ie(_e),
				xe = ie(Ie),
				ze = oe(Ie, 2),
				ft = ie(ze)
			;(At(() => {
				;(Si(xe, `width: ${I(f) ?? ''}%`), dt(ft, `${I(f) ?? ''}%`))
			}),
				et($, _e))
		}
		It(Me, $ => {
			I(i) === 'LOADING...' && $(Qe)
		})
	}
	var pt = oe(Me, 2)
	{
		var j = $ => {
				var _e = Dw(),
					Ie = Ma(_e),
					xe = ie(Ie)
				{
					var ze = Te => {
							var Rt = Tw()
							;(ct('click', Rt, () => v(I(l))), et(Te, Rt))
						},
						ft = Te => {
							var Rt = Iw()
							;(ct('click', Rt, x), et(Te, Rt))
						}
					It(xe, Te => {
						I(i) === 'NOT RUNNING' || I(i) === 'CHECKING...' || I(i) === 'ERROR'
							? Te(ze)
							: I(i) === 'READY' && Te(ft, 1)
					})
				}
				var it = oe(Ie, 2),
					Je = oe(ie(it), 2)
				Fn(
					Je,
					17,
					() => m,
					Bn,
					(Te, Rt) => {
						var Ct = dn(() => Dm(I(Rt), 2))
						let kt = () => I(Ct)[0],
							_t = () => I(Ct)[1]
						var tt = Cw(),
							Oe = ie(tt),
							er = ie(Oe),
							fr = oe(er, 2),
							Pt = ie(fr),
							st = ie(Pt),
							Ft = oe(Pt, 2),
							jt = ie(Ft),
							cr = oe(Oe, 2)
						{
							var zr = Lt => {
								var dr = Rw()
								;(At(() => (dr.disabled = I(i) === 'LOADING...')),
									ct('click', dr, () => v(kt())),
									et(Lt, dr))
							}
							It(cr, Lt => {
								I(i) !== 'LOADING...' && I(i) !== 'READY' && Lt(zr)
							})
						}
						;(At(
							Lt => {
								;(sy(er, I(l) === kt()),
									(er.disabled = I(i) === 'LOADING...' || I(i) === 'READY'),
									dt(st, _t().name),
									dt(jt, `${Lt ?? ''} — ${_t().description ?? ''}`))
							},
							[() => y(_t().sizeBytes)],
						),
							ct('change', er, () => R(kt())),
							et(Te, tt))
					},
				)
				var P = oe(it, 2),
					M = oe(ie(P), 2)
				Na(
					M,
					Te => q(c, Te),
					() => I(c),
				)
				var ue = oe(M, 2),
					me = oe(P, 2)
				{
					var Ge = Te => {
							var Rt = Ow(),
								Ct = oe(ie(Rt), 2),
								kt = ie(Ct)
							;(At(_t => dt(kt, _t), [() => hc()]), et(Te, Rt))
						},
						be = dn(() => hc())
					It(me, Te => {
						I(be) && Te(Ge)
					})
				}
				;(ct('change', M, S), ct('click', ue, _), et($, _e))
			},
			G = $ => {
				var _e = Pw()
				et($, _e)
			}
		It(pt, $ => {
			I(r) ? $(j) : $(G, -1)
		})
	}
	;(At(() => {
		;((N = An(L, 1, 'status-value svelte-1h0cjjc', null, N, {
			supported: I(r),
			unsupported: !I(r),
		})),
			dt(U, I(r) ? 'VERFÜGBAR' : 'NICHT VERFÜGBAR'),
			(ye = An(ge, 1, 'status-value svelte-1h0cjjc', null, ye, {
				ready: I(i) === 'READY',
				error: I(i) === 'ERROR',
				loading: I(i) === 'LOADING...' || I(i) === 'CHECKING...',
			})),
			dt(Ne, I(i)))
	}),
		et(e, b),
		ha())
}
Cl(['click', 'change'])
var Nw = ot('<span class="checkmark svelte-gxwg5f">✓</span>'),
	Bw = ot('<span class="spinner svelte-gxwg5f">⟳</span>'),
	Fw = ot('<span class="stage-number svelte-gxwg5f"> </span>'),
	jw = ot(
		'<div><div class="stage-indicator svelte-gxwg5f"><!></div> <div class="stage-info svelte-gxwg5f"><div class="stage-name svelte-gxwg5f"> </div> <div class="stage-progress-bar svelte-gxwg5f"><div class="stage-progress-fill svelte-gxwg5f"></div></div></div></div>',
	),
	Uw = ot(
		'<div class="log-entry svelte-gxwg5f"><span class="log-time svelte-gxwg5f"> </span> <span class="log-stage svelte-gxwg5f"> </span> <span class="log-message svelte-gxwg5f"> </span></div>',
	),
	zw = ot(
		'<div class="logs-section svelte-gxwg5f"><h3 class="svelte-gxwg5f">═══ LOGS ═══</h3> <div class="logs-container svelte-gxwg5f"></div></div>',
	),
	qw = ot(
		'<div class="generation-progress svelte-gxwg5f"><div class="progress-header svelte-gxwg5f"><h2 class="svelte-gxwg5f">═══ GENERATION PIPELINE ═══</h2> <div class="overall-progress svelte-gxwg5f"><span class="progress-label svelte-gxwg5f">OVERALL:</span> <div class="progress-bar svelte-gxwg5f"><div class="progress-fill svelte-gxwg5f"></div></div> <span class="progress-value svelte-gxwg5f"> </span></div></div> <div class="stages-list svelte-gxwg5f"></div> <!></div>',
	)
function Kw(e, t) {
	da(t, !0)
	function r(x) {
		const R = Jn.indexOf(t.currentStage),
			b = Jn.indexOf(x)
		return b < R ? 'completed' : b === R ? 'active' : 'pending'
	}
	function n(x) {
		const R = Jn.indexOf(x)
		return R === -1 ? '' : (R + 1).toString().padStart(2, '0')
	}
	function i(x) {
		return new Date(x).toLocaleTimeString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		})
	}
	var s = qw(),
		l = ie(s),
		f = oe(ie(l), 2),
		c = oe(ie(f), 2),
		m = ie(c),
		y = oe(c, 2),
		g = ie(y),
		v = oe(l, 2)
	Fn(
		v,
		21,
		() => Jn,
		Bn,
		(x, R) => {
			var b = jw()
			An(
				b,
				1,
				'stage-item svelte-gxwg5f',
				null,
				{},
				{'getStageStatus(stage)': r(R)},
			)
			var A = ie(b),
				L = ie(A)
			{
				var N = Me => {
						var Qe = Nw()
						et(Me, Qe)
					},
					U = dn(() => r(I(R)) === 'completed'),
					ee = Me => {
						var Qe = Bw()
						et(Me, Qe)
					},
					X = dn(() => r(I(R)) === 'active'),
					ve = Me => {
						var Qe = Fw(),
							pt = ie(Qe)
						;(At(j => dt(pt, j), [() => n(I(R))]), et(Me, Qe))
					}
				It(L, Me => {
					I(U) ? Me(N) : I(X) ? Me(ee, 1) : Me(ve, -1)
				})
			}
			var ge = oe(A, 2),
				ye = ie(ge),
				Ne = ie(ye),
				je = oe(ye, 2),
				Ee = ie(je)
			;(At(
				Me => {
					;(dt(Ne, bd[I(R)]), Si(Ee, `width: ${Me ?? ''}%`))
				},
				[
					() =>
						r(I(R)) === 'completed'
							? 100
							: r(I(R)) === 'active' && I(R) === t.currentStage
								? t.progress
								: 0,
				],
			),
				et(x, b))
		},
	)
	var _ = oe(v, 2)
	{
		var S = x => {
			var R = zw(),
				b = oe(ie(R), 2)
			;(Fn(
				b,
				21,
				() => t.logs,
				Bn,
				(A, L) => {
					var N = Uw(),
						U = ie(N),
						ee = ie(U),
						X = oe(U, 2),
						ve = ie(X),
						ge = oe(X, 2),
						ye = ie(ge)
					;(At(
						Ne => {
							;(dt(ee, `[${Ne ?? ''}]`),
								dt(ve, `[${bd[I(L).stage] ?? ''}]`),
								dt(ye, I(L).message))
						},
						[() => i(I(L).timestamp)],
					),
						et(A, N))
				},
			),
				et(x, R))
		}
		It(_, x => {
			t.logs.length > 0 && x(S)
		})
	}
	;(At(() => {
		;(Si(m, `width: ${t.progress ?? ''}%`), dt(g, `${t.progress ?? ''}%`))
	}),
		et(e, s),
		ha())
}
const Ww = {
	fftSize: 256,
	smoothingTimeConstant: 0.8,
	minDecibels: -90,
	maxDecibels: -10,
}
class Gw {
	audioContext = null
	analyser = null
	source = null
	animationFrameId = null
	callbacks = new Set()
	config
	constructor(t = {}) {
		this.config = {...Ww, ...t}
	}
	async connect(t) {
		;(this.audioContext && this.disconnect(),
			(this.audioContext = new (
				window.AudioContext || window.webkitAudioContext
			)()),
			this.audioContext.state === 'suspended' &&
				(await this.audioContext.resume()),
			(this.analyser = this.audioContext.createAnalyser()),
			(this.analyser.fftSize = this.config.fftSize),
			(this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant),
			(this.analyser.minDecibels = this.config.minDecibels),
			(this.analyser.maxDecibels = this.config.maxDecibels),
			(this.source = this.audioContext.createMediaElementSource(t)),
			this.source.connect(this.analyser),
			this.analyser.connect(this.audioContext.destination),
			this.startLoop())
	}
	subscribe(t) {
		return (this.callbacks.add(t), () => this.callbacks.delete(t))
	}
	getFrequencyData() {
		if (!this.analyser) return null
		const t = new Uint8Array(this.analyser.frequencyBinCount)
		return (this.analyser.getByteFrequencyData(t), t)
	}
	getTimeData() {
		if (!this.analyser) return null
		const t = new Uint8Array(this.analyser.fftSize)
		return (this.analyser.getByteTimeDomainData(t), t)
	}
	disconnect() {
		;(this.animationFrameId !== null &&
			(cancelAnimationFrame(this.animationFrameId),
			(this.animationFrameId = null)),
			this.source && (this.source.disconnect(), (this.source = null)),
			this.analyser && (this.analyser.disconnect(), (this.analyser = null)),
			this.audioContext &&
				(this.audioContext.close(), (this.audioContext = null)),
			this.callbacks.clear())
	}
	startLoop() {
		const t = () => {
			const r = this.getFrequencyData(),
				n = this.getTimeData()
			if (r && n) for (const i of this.callbacks) i(r, n)
			this.animationFrameId = requestAnimationFrame(t)
		}
		this.animationFrameId = requestAnimationFrame(t)
	}
}
function Hw(e, t) {
	const r = Math.floor(e.length / t),
		n = []
	for (let i = 0; i < t; i++) {
		const s = i * r,
			l = Math.min(s + r, e.length)
		let f = 0
		for (let y = s; y < l; y++) f += e[y]
		const m = (f / (l - s) / 255) * 100
		n.push(Math.min(100, Math.max(0, m)))
	}
	return n
}
var $w = ot('<div class="bar svelte-1w8izp2" aria-hidden="true"></div>'),
	Vw = ot(
		'<div class="bars-visualizer svelte-1w8izp2" role="img" aria-label="Audio frequency visualizer"></div>',
	),
	Zw = ot(
		'<canvas class="canvas-visualizer svelte-1w8izp2" aria-label="Audio waveform visualizer"></canvas>',
	),
	Yw = ot(
		'<canvas class="canvas-visualizer svelte-1w8izp2" aria-label="Circular audio visualizer"></canvas>',
	),
	Xw = ot('<div class="visualizer-container svelte-1w8izp2"><!></div>')
function Qw(e, t) {
	da(t, !0)
	let r = jo(t, 'barCount', 3, 32),
		n = jo(t, 'style', 3, 'bars'),
		i = jo(t, 'config', 19, () => ({})),
		s = qe(null),
		l = qe(Br([])),
		f = qe(null),
		c = qe(null),
		m = qe(null)
	const y = async () => {
			if (t.audioElement) {
				q(s, new Gw(i()), !0)
				try {
					;(await I(s).connect(t.audioElement),
						I(s).subscribe((N, U) => {
							;(q(f, N, !0), q(c, U, !0), q(l, Hw(N, r()), !0))
						}))
				} catch (N) {
					console.error('Failed to connect visualizer:', N)
				}
			}
		},
		g = () => {
			I(s) && (I(s).disconnect(), q(s, null))
		}
	;(fs(() => {
		y()
	}),
		X0(() => {
			g()
		}),
		Ti(() => {
			;(!t.audioElement || !t.isPlaying) && q(l, new Array(r()).fill(0), !0)
		}))
	function v(N, U, ee) {
		if (!I(c)) return
		;(N.clearRect(0, 0, U, ee),
			N.beginPath(),
			(N.strokeStyle = '#00ff41'),
			(N.lineWidth = 2),
			(N.shadowColor = '#00ff41'),
			(N.shadowBlur = 10))
		const X = U / I(c).length
		let ve = 0
		for (let ge = 0; ge < I(c).length; ge++) {
			const Ne = ((I(c)[ge] / 128) * ee) / 2
			;(ge === 0 ? N.moveTo(ve, Ne) : N.lineTo(ve, Ne), (ve += X))
		}
		;(N.lineTo(U, ee / 2), N.stroke(), (N.shadowBlur = 0))
	}
	function _(N, U, ee) {
		if (!I(f)) return
		N.clearRect(0, 0, U, ee)
		const X = U / 2,
			ve = ee / 2,
			ge = Math.min(U, ee) / 2 - 20,
			ye = I(f).length,
			Ne = (Math.PI * 2) / ye
		;((N.lineWidth = 3), (N.lineCap = 'round'))
		for (let je = 0; je < ye; je++) {
			const Ee = I(f)[je] / 255,
				Me = Ee * ge * 0.8,
				Qe = je * Ne - Math.PI / 2,
				pt = X + Math.cos(Qe) * (ge * 0.2),
				j = ve + Math.sin(Qe) * (ge * 0.2),
				G = X + Math.cos(Qe) * (ge * 0.2 + Me),
				$ = ve + Math.sin(Qe) * (ge * 0.2 + Me),
				_e = 120 + Ee * 60
			;((N.strokeStyle = `hsl(${_e}, 100%, 50%)`),
				(N.shadowColor = `hsl(${_e}, 100%, 50%)`),
				(N.shadowBlur = 10),
				N.beginPath(),
				N.moveTo(pt, j),
				N.lineTo(G, $),
				N.stroke())
		}
		N.shadowBlur = 0
	}
	function S() {
		if (!I(m)) return
		const N = I(m).getContext('2d')
		if (!N) return
		const U = window.devicePixelRatio || 1,
			ee = I(m).getBoundingClientRect()
		;((I(m).width = ee.width * U),
			(I(m).height = ee.height * U),
			N.scale(U, U),
			n() === 'waveform'
				? v(N, ee.width, ee.height)
				: n() === 'circular' && _(N, ee.width, ee.height))
	}
	;(Ti(() => {
		n() !== 'bars' && I(m) && S()
	}),
		Ti(() => {
			if (!t.isPlaying && I(m)) {
				const N = I(m).getContext('2d')
				N && N.clearRect(0, 0, I(m).width, I(m).height)
			}
		}))
	var x = Xw(),
		R = ie(x)
	{
		var b = N => {
				var U = Vw()
				;(Fn(
					U,
					21,
					() => I(l),
					Bn,
					(ee, X, ve) => {
						var ge = $w()
						;(At(() =>
							Si(ge, `height: ${I(X) ?? ''}%; animation-delay: ${ve * 30}ms;`),
						),
							et(ee, ge))
					},
				),
					et(N, U))
			},
			A = N => {
				var U = Zw()
				;(yi(U, 'width', 300),
					yi(U, 'height', 100),
					Na(
						U,
						ee => q(m, ee),
						() => I(m),
					),
					et(N, U))
			},
			L = N => {
				var U = Yw()
				;(yi(U, 'width', 200),
					yi(U, 'height', 200),
					Na(
						U,
						ee => q(m, ee),
						() => I(m),
					),
					et(N, U))
			}
		It(R, N => {
			n() === 'bars'
				? N(b)
				: n() === 'waveform'
					? N(A, 1)
					: n() === 'circular' && N(L, 2)
		})
	}
	;(At(() => yi(x, 'data-style', n())), et(e, x), ha())
}
function yh(e) {
	let t = 0
	return e.map((r, n) => {
		const i = t,
			s = r1(r.text),
			l = i + s
		return (
			(t = l),
			{
				index: n,
				speaker: r.speaker,
				text: r.text,
				startTime: i,
				endTime: l,
				isBookmarked: !1,
			}
		)
	})
}
function Jw(e) {
	return {HOST: 'MODERATOR', GUEST: 'GAST', CALLER: 'ANRUFER'}[e] || e
}
function e1(e) {
	if (!e || !isFinite(e)) return '00:00'
	const t = Math.floor(e / 60),
		r = Math.floor(e % 60)
	return `${t.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`
}
function t1(e, t) {
	for (let r = 0; r < e.length; r++)
		if (t >= e[r].startTime && t < e[r].endTime) return r
	return e.length > 0 ? e.length - 1 : -1
}
function r1(e) {
	return (e.trim().split(/\s+/).length / 150) * 60
}
var n1 = ot('<p class="empty svelte-1sknjbt"> </p>'),
	i1 = ot(
		'<div><div class="line-meta svelte-1sknjbt"><span class="speaker-badge svelte-1sknjbt"> </span> <span class="timecode svelte-1sknjbt"> </span></div> <div class="line-text svelte-1sknjbt"> </div> <button> </button></div>',
	),
	a1 = ot(
		'<div class="transcript-player svelte-1sknjbt"><div class="transcript-header svelte-1sknjbt"><h3 class="svelte-1sknjbt">═══ TRANSCRIPT ═══</h3> <label class="filter-toggle svelte-1sknjbt"><input type="checkbox" class="svelte-1sknjbt"/> <span>Nur Bookmarks</span></label></div> <div class="transcript-list svelte-1sknjbt"><!></div></div>',
	)
function o1(e, t) {
	da(t, !0)
	let r = jo(t, 'audioElement', 7),
		n = qe(Br([])),
		i = qe(!1),
		s = dn(() => t1(t.transcript, t.currentTime))
	fs(async () => {
		if (t.episodeId) {
			const L = await xd(t.episodeId)
			q(n, L, !0)
			for (const N of L) {
				const U = t.transcript[N.segmentIndex]
				U && (U.isBookmarked = !0)
			}
		}
	})
	function l(L) {
		r() && (r().currentTime = L.startTime)
	}
	async function f(L) {
		const N = L.isBookmarked
		L.isBookmarked = !N
		const U = {
			episodeId: t.episodeId,
			episodeTitle: t.episodeTitle,
			segmentIndex: L.index,
			speaker: L.speaker,
			text: L.text,
			timestamp: L.startTime,
			createdAt: new Date(),
		}
		if ((await Cy(U), N))
			q(
				n,
				I(n).filter(
					ee => !(ee.episodeId === t.episodeId && ee.segmentIndex === L.index),
				),
				!0,
			)
		else {
			const ee = await xd(t.episodeId)
			q(n, ee, !0)
		}
	}
	function c() {
		return I(i) ? t.transcript.filter(L => L.isBookmarked) : t.transcript
	}
	function m(L) {
		return Jw(L)
	}
	var y = a1(),
		g = ie(y),
		v = oe(ie(g), 2),
		_ = ie(v),
		S = oe(g, 2),
		x = ie(S)
	{
		var R = L => {
				var N = n1(),
					U = ie(N)
				;(At(() =>
					dt(U, I(i) ? 'Keine Bookmarks gesetzt' : 'Kein Transkript verfügbar'),
				),
					et(L, N))
			},
			b = dn(() => c().length === 0),
			A = L => {
				var N = Lp(),
					U = Ma(N)
				;(Fn(U, 17, c, Bn, (ee, X) => {
					var ve = i1()
					let ge
					var ye = ie(ve),
						Ne = ie(ye),
						je = ie(Ne),
						Ee = oe(Ne, 2),
						Me = ie(Ee),
						Qe = oe(ye, 2),
						pt = ie(Qe),
						j = oe(Qe, 2)
					let G
					var $ = ie(j)
					;(At(
						(_e, Ie) => {
							;((ge = An(ve, 1, 'transcript-line svelte-1sknjbt', null, ge, {
								active: I(X).index === I(s),
								bookmarked: I(X).isBookmarked,
							})),
								dt(je, _e),
								dt(Me, Ie),
								dt(pt, I(X).text),
								(G = An(j, 1, 'bookmark-btn svelte-1sknjbt', null, G, {
									active: I(X).isBookmarked,
								})),
								yi(
									j,
									'aria-label',
									I(X).isBookmarked ? 'Bookmark entfernen' : 'Bookmark setzen',
								),
								dt($, I(X).isBookmarked ? '★' : '☆'))
						},
						[() => m(I(X).speaker), () => e1(I(X).startTime)],
					),
						ct('click', ve, () => l(I(X))),
						ct('click', j, _e => {
							;(_e.stopPropagation(), f(I(X)))
						}),
						et(ee, ve))
				}),
					et(L, N))
			}
		It(x, L => {
			I(b) ? L(R) : L(A, -1)
		})
	}
	;(Bp(
		_,
		() => I(i),
		L => q(i, L),
	),
		et(e, y),
		ha())
}
Cl(['click'])
var s1 = ot(
		'<div class="cover-placeholder generating svelte-4wuyrs"><span class="generating-text svelte-4wuyrs">GENERATING...</span></div>',
	),
	l1 = ot(
		'<div class="download-overlay svelte-4wuyrs"><span class="svelte-4wuyrs">⬇ DOWNLOAD</span></div>',
	),
	u1 = ot('<img class="cover-image svelte-4wuyrs"/> <!>', 1),
	f1 = ot(
		'<div class="cover-placeholder error svelte-4wuyrs"><span class="svelte-4wuyrs">⚠ ERROR</span></div>',
	),
	c1 = ot(
		'<div class="cover-art svelte-4wuyrs" role="img" aria-label="Cover art - click to download" title="Click to download cover"><!></div>',
	)
function d1(e, t) {
	da(t, !0)
	let r = jo(t, 'size', 3, 300),
		n = qe(null),
		i = qe(!1),
		s = qe(!1)
	async function l() {
		if (!I(i)) {
			q(i, !0)
			try {
				const _ = $p({
					title: t.title,
					topic: t.topic,
					style: t.style,
					width: r(),
					height: r(),
				})
				;(q(n, Vp(_), !0), t.onGenerated?.(I(n)))
			} catch (_) {
				;(console.error('Failed to generate cover:', _), q(n, null))
			} finally {
				q(i, !1)
			}
		}
	}
	function f() {
		if (!I(n)) return
		const _ = document.createElement('canvas')
		;((_.width = r()), (_.height = r()))
		const S = _.getContext('2d')
		if (!S) return
		const x = new Image()
		;((x.onload = () => {
			;(S.drawImage(x, 0, 0, r(), r()),
				fb(_, `ai-radio-cover-${Date.now()}.png`))
		}),
			(x.src = I(n)))
	}
	;(fs(() => {
		l()
	}),
		Ti(() => {
			t.title && t.topic && t.style && l()
		}))
	var c = c1(),
		m = ie(c)
	{
		var y = _ => {
				var S = s1()
				et(_, S)
			},
			g = _ => {
				var S = u1(),
					x = Ma(S),
					R = oe(x, 2)
				{
					var b = A => {
						var L = l1()
						et(A, L)
					}
					It(R, A => {
						I(s) && A(b)
					})
				}
				;(At(() => {
					;(yi(x, 'src', I(n)), yi(x, 'alt', t.title))
				}),
					et(_, S))
			},
			v = _ => {
				var S = f1()
				et(_, S)
			}
		It(m, _ => {
			I(i) ? _(y) : I(n) ? _(g, 1) : _(v, -1)
		})
	}
	;(Bo('mouseenter', c, () => q(s, !0)),
		Bo('mouseleave', c, () => q(s, !1)),
		ct('click', c, f),
		et(e, c),
		ha())
}
Cl(['click'])
const Qg = {dailyGenerations: 50, dailyCharacters: 1e5, dailyAudioMinutes: 120},
	Jg = 'ai-radio-quota-usage'
function Fc() {
	return new Date().toISOString().split('T')[0]
}
function bh() {
	return {
		date: Fc(),
		generations: 0,
		characters: 0,
		audioMinutes: 0,
		lastReset: new Date().toISOString(),
	}
}
function jc() {
	try {
		const e = localStorage.getItem(Jg)
		if (!e) {
			const n = bh()
			return (Go(n), n)
		}
		const t = JSON.parse(e),
			r = Fc()
		if (t.date !== r) {
			const n = {
				date: r,
				generations: 0,
				characters: 0,
				audioMinutes: 0,
				lastReset: new Date().toISOString(),
			}
			return (Go(n), n)
		}
		return t
	} catch {
		const e = bh()
		return (Go(e), e)
	}
}
function Go(e) {
	try {
		localStorage.setItem(Jg, JSON.stringify(e))
	} catch (t) {
		console.error('Failed to save quota usage:', t)
	}
}
function wh(e, t) {
	const r = jc(),
		n = Qg
	let i, s
	switch (e) {
		case 'generation':
			;((i = r.generations), (s = n.dailyGenerations))
			break
		case 'character':
			;((i = r.characters), (s = n.dailyCharacters))
			break
		case 'audio':
			;((i = r.audioMinutes), (s = n.dailyAudioMinutes))
			break
	}
	const l = Math.max(0, s - i)
	return {allowed: i + t <= s, remaining: l, limit: s}
}
function Hu(e, t) {
	const r = jc()
	switch (e) {
		case 'generation':
			r.generations += t
			break
		case 'character':
			r.characters += t
			break
		case 'audio':
			r.audioMinutes += t
			break
	}
	;((r.lastReset = new Date().toISOString()), Go(r))
}
function vc() {
	const e = jc(),
		t = Qg,
		r = e.generations,
		n = t.dailyGenerations,
		i = Math.max(0, n - r),
		s = Math.round((r / n) * 100),
		l = e.characters,
		f = t.dailyCharacters,
		c = Math.max(0, f - l),
		m = Math.round((l / f) * 100),
		y = e.audioMinutes,
		g = t.dailyAudioMinutes,
		v = Math.max(0, g - y),
		_ = Math.round((y / g) * 100)
	return {
		generations: {used: r, limit: n, remaining: i, percent: s},
		characters: {used: l, limit: f, remaining: c, percent: m},
		audio: {used: y, limit: g, remaining: v, percent: _},
	}
}
function h1() {
	const e = {
		date: Fc(),
		generations: 0,
		characters: 0,
		audioMinutes: 0,
		lastReset: new Date().toISOString(),
	}
	Go(e)
}
function $u(e) {
	return e < 50 ? '#00ff41' : e < 80 ? '#ffaa00' : '#ff3333'
}
function Sh() {
	const e = vc()
	return {
		generations: $u(e.generations.percent),
		characters: $u(e.characters.percent),
		audio: $u(e.audio.percent),
	}
}
var v1 = ot('<span> </span>'),
	p1 = ot('<span class="badge svelte-1n46o8q">OFFLINE</span>'),
	g1 = ot('<div class="error-banner svelte-1n46o8q"> </div>'),
	_1 = ot('<button> </button>'),
	m1 = ot(
		'<div class="topic-item svelte-1n46o8q"><button class="topic-btn svelte-1n46o8q"> </button> <button class="btn-similar svelte-1n46o8q" title="Ähnliches Thema finden">🔄</button></div>',
	),
	y1 = ot(
		'<div class="topic-suggestions svelte-1n46o8q"><div class="suggestions-header svelte-1n46o8q"><span class="svelte-1n46o8q">Kategorie:</span> <div class="category-tabs svelte-1n46o8q"><button>Alle</button> <!></div></div> <div class="topic-list svelte-1n46o8q"></div> <div class="suggestions-footer svelte-1n46o8q"><button class="btn-random svelte-1n46o8q">🎲 Würfel</button></div></div>',
	),
	Eh = ot('<button class="btn-secondary svelte-1n46o8q"> </button>'),
	b1 = ot(
		'<div class="player-section svelte-1n46o8q"><div class="player-header svelte-1n46o8q"><!> <div class="player-main svelte-1n46o8q"><!> <div class="progress-container svelte-1n46o8q"><span class="time svelte-1n46o8q"> </span> <div class="progress-bar svelte-1n46o8q"><div class="progress-fill svelte-1n46o8q"></div></div> <span class="time svelte-1n46o8q"> </span></div></div></div></div> <!> <div class="script-preview svelte-1n46o8q"><p class="svelte-1n46o8q"> </p></div> <div class="post-actions svelte-1n46o8q"><button class="btn-action svelte-1n46o8q">[ 🔍 MEHR DAZU ]</button> <button class="btn-action svelte-1n46o8q">[ 🔄 NEU ]</button> <button class="btn-action svelte-1n46o8q">[ 🎲 ÄHNLICH ]</button></div>',
		1,
	),
	w1 = ot('<p class="empty svelte-1n46o8q">No episodes yet...</p>'),
	S1 = ot(
		'<div class="episode-card svelte-1n46o8q"><div class="episode-info svelte-1n46o8q"><span class="episode-title svelte-1n46o8q"> </span> <span class="episode-meta svelte-1n46o8q"> </span></div> <div class="episode-actions svelte-1n46o8q"><button class="svelte-1n46o8q">[ ▶ ]</button> <button class="svelte-1n46o8q"> </button> <button class="svelte-1n46o8q"> </button> <button class="svelte-1n46o8q">[ 🗑 ]</button></div></div>',
	),
	E1 = ot(
		'<div class="history-panel svelte-1n46o8q"><div class="history-header svelte-1n46o8q"><h2 class="svelte-1n46o8q">═══ HISTORY ═══</h2> <button class="svelte-1n46o8q">[ ✕ ]</button></div> <div class="history-list svelte-1n46o8q"><!></div></div>',
	),
	k1 = ot(
		'<p class="hint warning svelte-1n46o8q">⚠️ Ohne API wird ein einfacher Fallback-Text generiert.</p>',
	),
	kh = ot('<option class="svelte-1n46o8q"> </option>'),
	xh = ot('<p> </p>'),
	x1 = ot(
		'<div class="settings-overlay svelte-1n46o8q" role="dialog" aria-modal="true" tabindex="-1"><div class="settings-panel svelte-1n46o8q" role="document"><div class="settings-header svelte-1n46o8q"><h2 class="svelte-1n46o8q">═══ SETTINGS ═══</h2> <button class="svelte-1n46o8q">[ ✕ ]</button></div> <div class="settings-content svelte-1n46o8q"><div class="settings-section svelte-1n46o8q"><h3 class="svelte-1n46o8q">LLM API (Optional)</h3> <p class="hint svelte-1n46o8q">Kostenlose APIs: Kilo, OpenCode, Gemini</p> <div class="api-providers svelte-1n46o8q"><label class="provider-option svelte-1n46o8q"><input type="radio" class="svelte-1n46o8q"/> <span class="svelte-1n46o8q">Keine API (Fallback)</span></label> <label class="provider-option svelte-1n46o8q"><input type="radio" class="svelte-1n46o8q"/> <span class="svelte-1n46o8q">Kilo Gateway (empfohlen)</span></label> <label class="provider-option svelte-1n46o8q"><input type="radio" class="svelte-1n46o8q"/> <span class="svelte-1n46o8q">OpenCode AI</span></label> <label class="provider-option svelte-1n46o8q"><input type="radio" class="svelte-1n46o8q"/> <span class="svelte-1n46o8q">Google Gemini</span></label> <label class="provider-option svelte-1n46o8q"><input type="radio" class="svelte-1n46o8q"/> <span class="svelte-1n46o8q">Local LLM (Offline)</span></label></div> <div class="input-group svelte-1n46o8q"><label for="apiKey" class="svelte-1n46o8q">API Key:</label> <input id="apiKey" type="password" placeholder="Enter API key..." class="svelte-1n46o8q"/></div> <!> <!></div> <div class="settings-section svelte-1n46o8q"><h3 class="svelte-1n46o8q">Stimme</h3> <div class="voice-select svelte-1n46o8q"><select class="svelte-1n46o8q"><optgroup label="Deutsch" class="svelte-1n46o8q"></optgroup><optgroup label="English" class="svelte-1n46o8q"></optgroup></select></div></div> <div class="settings-section svelte-1n46o8q"><h3 class="svelte-1n46o8q">Script-Qualität</h3> <div class="quality-select svelte-1n46o8q"><select class="svelte-1n46o8q"><option class="svelte-1n46o8q">Kurz (30s)</option><option class="svelte-1n46o8q">Normal (90s)</option><option class="svelte-1n46o8q">Lang (3min)</option><option class="svelte-1n46o8q">Chill (4min, ausführlich)</option></select></div></div> <div class="settings-section svelte-1n46o8q"><h3 class="svelte-1n46o8q">Sprechstil</h3> <div class="style-select svelte-1n46o8q"><select class="svelte-1n46o8q"><option class="svelte-1n46o8q">💻 Tech-Fokus</option><option class="svelte-1n46o8q">😎 Locker & Frei</option><option class="svelte-1n46o8q">🎓 Akademisch</option><option class="svelte-1n46o8q">🎭 Unterhaltsam</option><option class="svelte-1n46o8q">📺 Nachrichten</option><option class="svelte-1n46o8q">🎙️ Podcast</option></select></div> <p class="hint svelte-1n46o8q">beeinflusst den Tonfall und Stil des Radio-Beitrags</p></div> <div class="settings-section svelte-1n46o8q"><label class="checkbox-option svelte-1n46o8q"><input type="checkbox" class="svelte-1n46o8q"/> <span class="svelte-1n46o8q">Automatisch abspielen</span></label></div> <div class="settings-section svelte-1n46o8q"><h3 class="svelte-1n46o8q">Sync (Geräteübergreifend)</h3> <p class="hint svelte-1n46o8q">Exportiere deine Daten als JSON-Datei, um sie auf einem anderen Gerät zu importieren.</p> <input type="file" accept=".json" style="display: none;" class="svelte-1n46o8q"/> <div class="sync-buttons svelte-1n46o8q"><button class="btn-secondary svelte-1n46o8q">[ 📤 EXPORT ]</button> <button class="btn-secondary svelte-1n46o8q">[ 📥 IMPORT ]</button></div> <!></div> <div class="settings-section svelte-1n46o8q"><h3 class="svelte-1n46o8q">Einstellungen Backup</h3> <p class="hint svelte-1n46o8q"> </p> <input type="file" accept=".json" style="display: none;" class="svelte-1n46o8q"/> <div class="sync-buttons svelte-1n46o8q"><button class="btn-secondary svelte-1n46o8q">[ 📤 EXPORT SETTINGS ]</button> <button class="btn-secondary svelte-1n46o8q">[ 📥 IMPORT SETTINGS ]</button> <button class="btn-secondary svelte-1n46o8q" style="background: #330000; border-color: #ff3333; color: #ff3333;">[ 🔄 RESET TO DEFAULTS ]</button></div> <!></div></div> <div class="settings-footer svelte-1n46o8q"><button class="btn-secondary svelte-1n46o8q">API Key löschen</button> <button class="btn-secondary svelte-1n46o8q">[ 🔄 RESET QUOTA ]</button> <button class="btn-primary svelte-1n46o8q">[ SPEICHERN ]</button></div></div></div>',
	),
	A1 = ot(
		'<div class="scanlines svelte-1n46o8q"></div> <main><header class="header svelte-1n46o8q"><h1 class="svelte-1n46o8q">📡 AI_RADIO_v1.0.0</h1> <div class="header-actions svelte-1n46o8q"><button class="icon-btn svelte-1n46o8q" title="Settings">⚙</button> <!> <span class="status-indicator svelte-1n46o8q"> <!></span></div> <div class="quota-display svelte-1n46o8q"><span class="svelte-1n46o8q"> </span> <span class="svelte-1n46o8q"> </span> <span class="svelte-1n46o8q"> </span></div></header> <div class="content svelte-1n46o8q"><!> <div class="input-group svelte-1n46o8q"><label for="topic" class="svelte-1n46o8q">> TOPIC:</label> <div class="topic-input-row svelte-1n46o8q"><input id="topic" type="text" placeholder="Enter topic or paste link..." class="svelte-1n46o8q"/> <button class="btn-dice svelte-1n46o8q" title="Topic vorschlagen">🎲</button></div> <!></div> <div class="input-group svelte-1n46o8q"><label for="link" class="svelte-1n46o8q">> LINK:</label> <input id="link" type="url" placeholder="Optional: Paste URL for content..." class="svelte-1n46o8q"/></div> <div class="controls svelte-1n46o8q"><button class="btn-primary svelte-1n46o8q"> </button> <!> <!> <button class="btn-history svelte-1n46o8q">[ 📜 HISTORY ]</button></div> <!> <!></div> <!> <!></main> <audio class="svelte-1n46o8q"></audio>',
		1,
	)
function T1(e, t) {
	da(t, !0)
	const r = []
	let n = qe(''),
		i = qe(''),
		s = qe(!1),
		l = qe(!1),
		f = qe(null),
		c = qe(''),
		m = qe(0),
		y = qe(0),
		g = qe(!1),
		v = qe(!1),
		_ = qe(!1),
		S = qe(Br([])),
		x = qe(Br(bi())),
		R = qe(''),
		b = qe(''),
		A = qe(!1),
		L = qe(!1),
		N = qe('NOT RUNNING'),
		U = qe('idle'),
		ee = qe(0),
		X = qe(Br([])),
		ve = qe(null),
		ge = qe(Br([])),
		ye = qe(Br([])),
		Ne = qe(null),
		je = qe(null),
		Ee = qe(!1),
		Me = qe(Br(vc())),
		Qe = qe(Br(Sh()))
	function pt() {
		;(q(Me, vc(), !0), q(Qe, Sh(), !0))
	}
	let j = qe('all'),
		G = dn(qy),
		$ = dn(zy),
		_e = dn(() => (I(j) === 'all' ? I($).flatMap(de => Id(de)) : Id(I(j)))),
		Ie = qe(''),
		xe = qe('none'),
		ze = qe(''),
		ft = qe('normal'),
		it = qe('tech'),
		Je = qe(null),
		P = qe(null)
	;(fs(
		() => (
			(async () => (
				q(x, bi(), !0),
				q(Ie, I(x).apiKey, !0),
				q(xe, I(x).apiProvider, !0),
				q(ze, I(x).defaultVoice, !0),
				q(ft, I(x).quality, !0),
				q(it, I(x).style, !0),
				await ue()
			))(),
			window.addEventListener('popstate', M),
			() => {
				window.removeEventListener('popstate', M)
			}
		),
	),
		Ti(() => {
			if (I(x).apiProvider !== 'local') return
			const de = $y(() => {
					q(N, 'READY')
				}),
				Fe = Vy(Ze => {
					q(N, 'ERROR')
				})
			return () => {
				;(de.then(Ze => Ze()), Fe.then(Ze => Ze()))
			}
		}))
	function M(de) {
		I(g) ? q(g, !1) : I(v) && q(v, !1)
	}
	async function ue() {
		try {
			q(S, await Tc(), !0)
		} catch (de) {
			console.error('Failed to load history:', de)
		}
	}
	function me(de) {
		return new Promise(Fe => setTimeout(Fe, de))
	}
	function Ge(de, Fe) {
		q(U, de, !0)
		const Ze = Jn.indexOf(de)
		;(q(ee, Math.round(((Ze + 1) / Jn.length) * 100), !0), be(de, Fe))
	}
	function be(de, Fe) {
		q(
			X,
			[...I(X), {timestamp: new Date().toISOString(), stage: de, message: Fe}],
			!0,
		)
	}
	async function Te(de, Fe) {
		if (!I(n).trim()) return
		const Ze = de === 'similar' && Fe ? Fe : I(n),
			wt = wh('generation', 1)
		if (!wt.allowed) {
			q(R, `Tageslimit erreicht: Maximale ${wt.limit} Generationen pro Tag.`)
			return
		}
		const yt = Ze.length * 500,
			Tr = wh('character', yt)
		if (!Tr.allowed) {
			q(
				R,
				`Zeichenlimit erreicht: Noch ${Tr.remaining.toLocaleString()} Zeichen verfügbar.`,
			)
			return
		}
		;(q(s, !0),
			q(L, I(x).apiProvider === 'local'),
			q(R, ''),
			q(c, ''),
			q(U, 'idle'),
			q(ee, 0),
			q(X, [], !0),
			q(ve, null),
			q(ge, [], !0))
		let Ir
		try {
			if (
				(Ge('researching', 'Starting research phase...'),
				await me(500),
				I(i).trim())
			)
				try {
					;(q(b, 'Lade URL-Inhalt...'),
						be('researching', 'Fetching link content...'),
						(Ir = await Wy(I(i).trim())),
						q(b, ''),
						be('researching', 'Link content fetched successfully'))
				} catch (He) {
					;(q(R, `URL-Warnung: ${He.message}. Generiere ohne URL-Inhalt.`),
						be('researching', `Link fetch failed: ${He.message}`),
						(Ir = void 0))
				}
			;(Ge('writing-script', 'Generating radio script...'),
				be('writing-script', `Invoking LLM for topic: ${Ze}`))
			const Ut = await Up(Ze, I(x), Ir, de, Fe)
			;(q(c, Ut, !0),
				be('writing-script', 'Script generated successfully'),
				await me(300),
				Ge('generating-speech', 'Parsing script into segments...'),
				be('generating-speech', 'Analyzing script structure...'))
			const Nt = _y(Ut, I(x).style)
			;(q(ve, Nt, !0),
				q(ge, Nt.segments, !0),
				q(ye, yh(Nt.segments), !0),
				be(
					'generating-speech',
					`Parsed ${Nt.segments.length} speaker segments`,
				),
				await me(200),
				Ge('generating-speech', 'Generating audio for each segment...'))
			const Ot = []
			for (let He = 0; He < I(ge).length; He++) {
				const Gt = I(ge)[He],
					Kr = Math.round(((He + 1) / I(ge).length) * 100)
				;(q(
					ee,
					Math.round((fy / Jn.length) * 100 + (Kr / 100) * (100 / Jn.length)),
					!0,
				),
					be(
						'generating-speech',
						`Generating audio for ${Gt.speaker} (${He + 1}/${I(ge).length})`,
					))
				try {
					const Pr = await vy(Gt.text, {
						voice: Gt.voice,
						rate: '+0%',
						pitch: '+0Hz',
						volume: '+0%',
					})
					Ot.push(Pr)
				} catch (Pr) {
					console.error(`Edge TTS failed for segment ${He}:`, Pr)
					try {
						const Lr = await (await py(Gt.text, Gt.voice)).arrayBuffer()
						;(Ot.push(Lr),
							be(
								'generating-speech',
								`HTTP fallback succeeded for ${Gt.speaker}`,
							))
					} catch ($t) {
						if (
							(console.error(`HTTP TTS fallback failed for segment ${He}:`, $t),
							!window.speechSynthesis)
						)
							throw new Error(
								`TTS unavailable for segment ${He} (Edge: ${Pr instanceof Error ? Pr.message : 'unknown error'}; HTTP: ${$t instanceof Error ? $t.message : 'unknown error'})`,
								{cause: $t},
							)
						;(await hy(Gt.text, {voice: Gt.voice, rate: '+0%', pitch: '+0Hz'}),
							Ot.push(new ArrayBuffer(0)),
							be(
								'generating-speech',
								`Web Speech fallback used for ${Gt.speaker}`,
							))
					}
				}
			}
			;(await me(200),
				Ge('mixing-audio', 'Mixing audio segments...'),
				be('mixing-audio', 'Concatenating audio buffers...'))
			const Rr = Ot.reduce((He, Gt) => He + Gt.byteLength, 0),
				Xt = new Uint8Array(Rr)
			let Tt = 0
			for (const He of Ot)
				(Xt.set(new Uint8Array(He), Tt), (Tt += He.byteLength))
			const Qt = new Blob([Xt], {type: 'audio/mp3'}),
				nr = URL.createObjectURL(Qt)
			;(be('mixing-audio', 'Audio mixed successfully'),
				await me(300),
				Ge('generating-metadata', 'Generating episode metadata...'),
				be('generating-metadata', 'Creating episode entry...'),
				await me(200),
				Ge('generating-cover', 'Generating cover art...'),
				be('generating-cover', 'Generating cover art...'))
			const Ht = $p({
				title: Nt.title || Ze.slice(0, 50),
				topic: Ze,
				style: I(x).style,
				width: 512,
				height: 512,
			})
			;(q(Ne, Vp(Ht), !0),
				await me(200),
				I(f) &&
					((I(f).src = nr), I(x).autoPlay && (await I(f).play(), q(l, !0))))
			const tn = {
					title: Nt.title || Ze.slice(0, 50) + (Ze.length > 50 ? '...' : ''),
					topic: Ze,
					link: I(i) || void 0,
					script: Ut,
					audioUrl: nr,
					duration: I(f)?.duration || 0,
					createdAt: new Date(),
					isFavorite: !1,
					speakerSegments: Nt.segments,
					coverDataUrl: I(Ne) || void 0,
				},
				qr = await Gp(tn)
			;(await ue(),
				q(je, {...tn, id: qr}, !0),
				Hu('generation', 1),
				Hu('character', Ut.length))
			const mn = Math.ceil((I(f)?.duration || 0) / 60)
			;(Hu('audio', mn),
				pt(),
				Ge('complete', 'Generation complete!'),
				q(ee, 100))
		} catch (Ut) {
			;(console.error('Error:', Ut),
				q(R, `Fehler: ${Ut.message || 'Generation failed'}`),
				q(U, 'error'),
				be('error', I(R)))
		} finally {
			;(q(s, !1), q(L, !1), q(b, ''))
		}
	}
	async function Rt() {
		await Te('deeper')
	}
	async function Ct() {
		await Te()
	}
	async function kt() {
		q(Ee, !0)
		try {
			if (I(x).apiProvider === 'none' || !I(x).apiKey) {
				;(q(n, Oo(), !0), await Te('similar', I(n)))
				return
			}
			q(b, 'Suche ähnliches Thema...')
			try {
				const {suggestRelatedTopic: de} = await El(async () => {
						const {suggestRelatedTopic: Ze} = await Promise.resolve().then(
							() => Sy,
						)
						return {suggestRelatedTopic: Ze}
					}, []),
					Fe = await de(I(n), I(x))
				Fe
					? (q(n, Fe, !0), await Te('similar', I(n)))
					: (q(n, Oo(), !0), await Te('similar', I(n)))
			} catch {
				;(q(n, Oo(), !0), await Te('similar', I(n)))
			} finally {
				q(b, '')
			}
		} finally {
			;(await new Promise(de => setTimeout(de, 150)), q(Ee, !1))
		}
	}
	function _t() {
		I(f) && (I(l) ? I(f).pause() : I(f).play(), q(l, !I(l)))
	}
	function tt(de) {
		if (!de || !isFinite(de)) return '00:00'
		const Fe = Math.floor(de / 60),
			Ze = Math.floor(de % 60)
		return `${Fe.toString().padStart(2, '0')}:${Ze.toString().padStart(2, '0')}`
	}
	function Oe() {
		I(f) && q(m, I(f).currentTime, !0)
	}
	function er() {
		I(f) && q(y, I(f).duration, !0)
	}
	async function fr(de) {
		;(q(c, de.script, !0),
			q(ye, yh(de.speakerSegments || []), !0),
			q(Ne, de.coverDataUrl || null, !0),
			q(je, de, !0),
			I(f) &&
				de.audioUrl &&
				((I(f).src = de.audioUrl), await I(f).play(), q(l, !0)),
			q(g, !1),
			window.history.state?.panel && window.history.back())
	}
	async function Pt(de) {
		try {
			;(await Iy(de), await ue())
		} catch (Fe) {
			console.error('Failed to delete:', Fe)
		}
	}
	async function st(de) {
		try {
			;(await Ry(de.id, !de.isFavorite), await ue())
		} catch (Fe) {
			console.error('Failed to toggle favorite:', Fe)
		}
	}
	function Ft() {
		;(q(Ie, I(x).apiKey, !0),
			q(xe, I(x).apiProvider, !0),
			q(ze, I(x).defaultVoice, !0),
			q(it, I(x).style, !0),
			q(v, !0),
			window.history.pushState({panel: 'settings'}, ''))
	}
	function jt() {
		;(q(v, !1), window.history.state?.panel && window.history.back())
	}
	function cr() {
		;(q(
			x,
			{
				...I(x),
				apiKey: I(Ie),
				apiProvider: I(xe),
				defaultVoice: I(ze),
				quality: I(ft),
				style: I(it),
			},
			!0,
		),
			to(I(x)),
			q(v, !1))
	}
	function zr() {
		const de = zp(),
			Fe = new Blob([de], {type: 'application/json'}),
			Ze = URL.createObjectURL(Fe),
			wt = document.createElement('a')
		;((wt.href = Ze),
			(wt.download = `ai-radio-settings-v${fa}-${new Date().toISOString().split('T')[0]}.json`),
			document.body.appendChild(wt),
			wt.click(),
			document.body.removeChild(wt),
			URL.revokeObjectURL(Ze),
			q(b, 'Einstellungen exportiert!'))
	}
	function Lt() {
		I(P) && I(P).click()
	}
	async function dr(de) {
		const Ze = de.target.files?.[0]
		if (Ze)
			try {
				;(q(A, !0), q(b, 'Importiere Einstellungen...'))
				const wt = await Ze.text()
				qp(wt)
					? (q(x, bi(), !0),
						q(Ie, I(x).apiKey, !0),
						q(xe, I(x).apiProvider, !0),
						q(ze, I(x).defaultVoice, !0),
						q(ft, I(x).quality, !0),
						q(it, I(x).style, !0),
						q(b, 'Einstellungen erfolgreich importiert!'))
					: q(b, 'Import fehlgeschlagen: Ungültiges Format')
			} catch (wt) {
				q(b, `Import fehlgeschlagen: ${wt.message}`)
			} finally {
				;(q(A, !1), I(P) && (I(P).value = ''))
			}
	}
	function Dn() {
		confirm(
			'Alle Einstellungen auf Standardwerte zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.',
		) &&
			(Kp(),
			q(x, bi(), !0),
			q(Ie, I(x).apiKey, !0),
			q(xe, I(x).apiProvider, !0),
			q(ze, I(x).defaultVoice, !0),
			q(ft, I(x).quality, !0),
			q(it, I(x).style, !0),
			q(b, 'Einstellungen zurückgesetzt!'))
	}
	function C() {
		;(q(Ie, ''), q(xe, 'none'))
	}
	function se() {
		;(I(j) === 'all' ? q(n, Oo(), !0) : q(n, Ky(I(j)), !0), q(_, !1))
	}
	async function we(de) {
		;(q(n, de, !0), q(_, !1), await kt())
	}
	async function Pe() {
		try {
			;(q(A, !0), q(b, 'Exportiere Daten...'))
			const de = await Dy()
			;(Py(de),
				q(b, `Export erfolgreich! ${de.episodes.length} Episoden exportiert.`))
		} catch (de) {
			q(b, `Export fehlgeschlagen: ${de.message}`)
		} finally {
			q(A, !1)
		}
	}
	async function z(de) {
		try {
			;(q(A, !0), q(b, 'Erstelle ZIP-Archiv...'))
			const Fe = await My(de, de.coverDataUrl),
				wt = `ai-radio_${de.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 50)}_${new Date(de.createdAt).toISOString().split('T')[0]}.zip`
			;(Fy(Fe, wt), q(b, 'ZIP-Export erfolgreich!'))
		} catch (Fe) {
			q(b, `ZIP-Export fehlgeschlagen: ${Fe.message}`)
		} finally {
			q(A, !1)
		}
	}
	function re() {
		I(Je) && I(Je).click()
	}
	async function E(de) {
		const Ze = de.target.files?.[0]
		if (Ze)
			try {
				;(q(A, !0), q(b, 'Importiere Daten...'))
				const wt = await Ly(Ze)
				;(q(
					b,
					`Import erfolgreich! ${wt.episodesImported} Episoden importiert.`,
				),
					wt.settingsImported && q(x, bi(), !0),
					await ue())
			} catch (wt) {
				q(b, `Import fehlgeschlagen: ${wt.message}`)
			} finally {
				;(q(A, !1), I(Je) && (I(Je).value = ''))
			}
	}
	var he = A1(),
		Ve = oe(Ma(he), 2)
	let d
	var Y = ie(Ve),
		Q = oe(ie(Y), 2),
		T = ie(Q),
		F = oe(T, 2)
	{
		var Z = de => {
			var Fe = v1()
			let Ze
			var wt = ie(Fe)
			;(At(() => {
				;((Ze = An(Fe, 1, 'local-badge svelte-1n46o8q', null, Ze, {
					ready: I(N) === 'READY',
					error: I(N) === 'ERROR',
				})),
					dt(wt, `LOCAL AI: ${I(N) ?? ''}`))
			}),
				et(de, Fe))
		}
		It(F, de => {
			I(x).apiProvider === 'local' && de(Z)
		})
	}
	var Ue = oe(F, 2),
		Ae = ie(Ue),
		Le = oe(Ae)
	{
		var vt = de => {
			var Fe = p1()
			et(de, Fe)
		}
		It(Le, de => {
			I(x).apiProvider === 'none' && de(vt)
		})
	}
	var Yt = oe(Q, 2),
		ke = ie(Yt),
		ht = ie(ke),
		xt = oe(ke, 2),
		Kt = ie(xt),
		Se = oe(xt, 2),
		Pn = ie(Se),
		Ln = oe(Y, 2),
		Mt = ie(Ln)
	{
		var hr = de => {
			var Fe = g1(),
				Ze = ie(Fe)
			;(At(() => dt(Ze, I(R))), et(de, Fe))
		}
		It(Mt, de => {
			I(R) && de(hr)
		})
	}
	var Wt = oe(Mt, 2),
		xr = oe(ie(Wt), 2),
		Ar = ie(xr),
		pa = oe(Ar, 2),
		li = oe(xr, 2)
	{
		var ui = de => {
			var Fe = y1(),
				Ze = ie(Fe),
				wt = oe(ie(Ze), 2),
				yt = ie(wt)
			let Tr
			var Ir = oe(yt, 2)
			Fn(
				Ir,
				17,
				() => I(G),
				Bn,
				(Rr, Xt) => {
					var Tt = _1()
					let Qt
					var nr = ie(Tt)
					;(At(
						Ht => {
							;((Qt = An(Tt, 1, 'category-tab svelte-1n46o8q', null, Qt, {
								active: I(j) === I(Xt).id,
							})),
								dt(nr, Ht))
						},
						[() => I(Xt).name.split(' ')[0]],
					),
						ct('click', Tt, () => q(j, I(Xt).id, !0)),
						et(Rr, Tt))
				},
			)
			var Ut = oe(Ze, 2)
			Fn(
				Ut,
				21,
				() => I(_e),
				Bn,
				(Rr, Xt) => {
					var Tt = m1(),
						Qt = ie(Tt),
						nr = ie(Qt),
						Ht = oe(Qt, 2)
					;(At(() => dt(nr, I(Xt))),
						ct('click', Qt, () => {
							;(q(n, I(Xt), !0), q(_, !1))
						}),
						ct('click', Ht, () => we(I(Xt))),
						et(Rr, Tt))
				},
			)
			var Nt = oe(Ut, 2),
				Ot = ie(Nt)
			;(At(
				() =>
					(Tr = An(yt, 1, 'category-tab svelte-1n46o8q', null, Tr, {
						active: I(j) === 'all',
					})),
			),
				ct('click', yt, () => q(j, 'all')),
				ct('click', Ot, se),
				et(de, Fe))
		}
		It(li, de => {
			I(_) && de(ui)
		})
	}
	var ga = oe(Wt, 2),
		ms = oe(ie(ga), 2),
		ys = oe(ga, 2),
		_a = ie(ys),
		ma = ie(_a),
		Dt = oe(_a, 2)
	{
		var tr = de => {
			var Fe = Eh(),
				Ze = ie(Fe)
			;(At(() => dt(Ze, I(l) ? '[ ⏸ PAUSE ]' : '[ ▶ PLAY ]')),
				ct('click', Fe, _t),
				et(de, Fe))
		}
		It(Dt, de => {
			I(f) && I(c) && de(tr)
		})
	}
	var bs = oe(Dt, 2)
	{
		var ya = de => {
			var Fe = Eh(),
				Ze = ie(Fe)
			;(At(() => {
				;((Fe.disabled = I(A)),
					dt(Ze, I(A) ? '[ 📦 EXPORTING... ]' : '[ 📦 ZIP EXPORT ]'))
			}),
				ct('click', Fe, () => z(I(je))),
				et(de, Fe))
		}
		It(bs, de => {
			I(je) && de(ya)
		})
	}
	var ba = oe(bs, 2),
		Pi = oe(ys, 2)
	{
		var Xl = de => {
			Kw(de, {
				get currentStage() {
					return I(U)
				},
				get progress() {
					return I(ee)
				},
				get logs() {
					return I(X)
				},
			})
		}
		It(Pi, de => {
			I(s) && de(Xl)
		})
	}
	var Mn = oe(Pi, 2)
	{
		var fi = de => {
			var Fe = b1(),
				Ze = Ma(Fe),
				wt = ie(Ze),
				yt = ie(wt)
			{
				let $t = dn(() => I(ve)?.title || I(n).slice(0, 50))
				d1(yt, {
					get title() {
						return I($t)
					},
					get topic() {
						return I(n)
					},
					get style() {
						return I(x).style
					},
					size: 200,
				})
			}
			var Tr = oe(yt, 2),
				Ir = ie(Tr)
			Qw(Ir, {
				get audioElement() {
					return I(f)
				},
				get isPlaying() {
					return I(l)
				},
				barCount: 40,
				style: 'bars',
			})
			var Ut = oe(Ir, 2),
				Nt = ie(Ut),
				Ot = ie(Nt),
				Rr = oe(Nt, 2),
				Xt = ie(Rr),
				Tt = oe(Rr, 2),
				Qt = ie(Tt),
				nr = oe(Ze, 2)
			{
				var Ht = $t => {
					{
						let Lr = dn(() => I(S).find(yn => yn.script === I(c))?.id || ''),
							Qr = dn(
								() =>
									I(S).find(yn => yn.script === I(c))?.title ||
									'Current Episode',
							)
						o1($t, {
							get transcript() {
								return I(ye)
							},
							get currentTime() {
								return I(m)
							},
							get duration() {
								return I(y)
							},
							get audioElement() {
								return I(f)
							},
							get episodeId() {
								return I(Lr)
							},
							get episodeTitle() {
								return I(Qr)
							},
						})
					}
				}
				It(nr, $t => {
					I(ye).length > 0 && $t(Ht)
				})
			}
			var tn = oe(nr, 2),
				qr = ie(tn),
				mn = ie(qr),
				He = oe(tn, 2),
				Gt = ie(He),
				Kr = oe(Gt, 2),
				Pr = oe(Kr, 2)
			;(At(
				($t, Lr, Qr) => {
					;(dt(Ot, $t),
						Si(Xt, `width: ${I(y) ? (I(m) / I(y)) * 100 : 0}%`),
						dt(Qt, Lr),
						dt(mn, `${Qr ?? ''}${I(c).length > 300 ? '...' : ''}`),
						(Gt.disabled = I(s)),
						(Kr.disabled = I(s)),
						(Pr.disabled = I(s)))
				},
				[() => tt(I(m)), () => tt(I(y)), () => I(c).slice(0, 300)],
			),
				ct('click', Gt, Rt),
				ct('click', Kr, Ct),
				ct('click', Pr, kt),
				et(de, Fe))
		}
		It(Mn, de => {
			I(f) && I(c) && de(fi)
		})
	}
	var _n = oe(Ln, 2)
	{
		var wa = de => {
			var Fe = E1(),
				Ze = ie(Fe),
				wt = oe(ie(Ze), 2),
				yt = oe(Ze, 2),
				Tr = ie(yt)
			{
				var Ir = Nt => {
						var Ot = w1()
						et(Nt, Ot)
					},
					Ut = Nt => {
						var Ot = Lp(),
							Rr = Ma(Ot)
						;(Fn(
							Rr,
							17,
							() => I(S),
							Bn,
							(Xt, Tt) => {
								var Qt = S1(),
									nr = ie(Qt),
									Ht = ie(nr),
									tn = ie(Ht),
									qr = oe(Ht, 2),
									mn = ie(qr),
									He = oe(nr, 2),
									Gt = ie(He),
									Kr = oe(Gt, 2),
									Pr = ie(Kr),
									$t = oe(Kr, 2),
									Lr = ie($t),
									Qr = oe($t, 2)
								;(At(
									(yn, Li) => {
										;(dt(
											tn,
											`${I(Tt).isFavorite ? '⭐ ' : ''}${I(Tt).title ?? ''}`,
										),
											dt(mn, `${yn ?? ''} | ${Li ?? ''}`),
											(Kr.disabled = I(A)),
											dt(Pr, I(A) ? '[ 📦... ]' : '[ 📦 ]'),
											dt(Lr, `[${I(Tt).isFavorite ? '⭐' : '☆'}]`))
									},
									[
										() => tt(I(Tt).duration),
										() => new Date(I(Tt).createdAt).toLocaleDateString(),
									],
								),
									ct('click', Gt, () => fr(I(Tt))),
									ct('click', Kr, () => z(I(Tt))),
									ct('click', $t, () => st(I(Tt))),
									ct('click', Qr, () => Pt(I(Tt).id)),
									et(Xt, Qt))
							},
						),
							et(Nt, Ot))
					}
				It(Tr, Nt => {
					I(S).length === 0 ? Nt(Ir) : Nt(Ut, -1)
				})
			}
			;(ct('click', wt, () => {
				;(q(g, !1), window.history.state?.panel && window.history.back())
			}),
				et(de, Fe))
		}
		It(_n, de => {
			I(g) && de(wa)
		})
	}
	var Ql = oe(_n, 2)
	{
		var Jl = de => {
			var Fe = x1(),
				Ze = ie(Fe),
				wt = ie(Ze),
				yt = oe(ie(wt), 2),
				Tr = oe(wt, 2),
				Ir = ie(Tr),
				Ut = oe(ie(Ir), 4),
				Nt = ie(Ut),
				Ot = ie(Nt)
			Ot.value = Ot.__value = 'none'
			var Rr = oe(Nt, 2),
				Xt = ie(Rr)
			Xt.value = Xt.__value = 'kilo'
			var Tt = oe(Rr, 2),
				Qt = ie(Tt)
			Qt.value = Qt.__value = 'opencode'
			var nr = oe(Tt, 2),
				Ht = ie(nr)
			Ht.value = Ht.__value = 'gemini'
			var tn = oe(nr, 2),
				qr = ie(tn)
			qr.value = qr.__value = 'local'
			var mn = oe(Ut, 2),
				He = oe(ie(mn), 2),
				Gt = oe(mn, 2)
			{
				var Kr = rt => {
					var zt = k1()
					et(rt, zt)
				}
				It(Gt, rt => {
					I(xe) === 'none' && rt(Kr)
				})
			}
			var Pr = oe(Gt, 2)
			{
				var $t = rt => {
					Mw(rt, {})
				}
				It(Pr, rt => {
					I(xe) === 'local' && rt($t)
				})
			}
			var Lr = oe(Ir, 2),
				Qr = oe(ie(Lr), 2),
				yn = ie(Qr),
				Li = ie(yn)
			Fn(
				Li,
				21,
				() => Sd.german,
				Bn,
				(rt, zt) => {
					var _r = kh(),
						Zn = ie(_r),
						wn = {}
					;(At(() => {
						;(dt(Zn, `${I(zt).name ?? ''} (${I(zt).gender ?? ''})`),
							wn !== (wn = I(zt).id) &&
								(_r.value = (_r.__value = I(zt).id) ?? ''))
					}),
						et(rt, _r))
				},
			)
			var Mi = oe(Li)
			Fn(
				Mi,
				21,
				() => Sd.english,
				Bn,
				(rt, zt) => {
					var _r = kh(),
						Zn = ie(_r),
						wn = {}
					;(At(() => {
						;(dt(Zn, `${I(zt).name ?? ''} (${I(zt).gender ?? ''})`),
							wn !== (wn = I(zt).id) &&
								(_r.value = (_r.__value = I(zt).id) ?? ''))
					}),
						et(rt, _r))
				},
			)
			var ci = oe(Lr, 2),
				eu = oe(ie(ci), 2),
				$n = ie(eu),
				Ni = ie($n)
			Ni.value = Ni.__value = 'short'
			var Bi = oe(Ni)
			Bi.value = Bi.__value = 'normal'
			var ao = oe(Bi)
			ao.value = ao.__value = 'long'
			var Fi = oe(ao)
			Fi.value = Fi.__value = 'chill'
			var oo = oe(ci, 2),
				Sa = oe(ie(oo), 2),
				so = ie(Sa),
				lo = ie(so)
			lo.value = lo.__value = 'tech'
			var Ea = oe(lo)
			Ea.value = Ea.__value = 'casual'
			var uo = oe(Ea)
			uo.value = uo.__value = 'academic'
			var fo = oe(uo)
			fo.value = fo.__value = 'entertaining'
			var co = oe(fo)
			co.value = co.__value = 'news'
			var Cr = oe(co)
			Cr.value = Cr.__value = 'podcast'
			var Vn = oe(oo, 2),
				tu = ie(Vn),
				ru = ie(tu),
				ws = oe(Vn, 2),
				di = oe(ie(ws), 4)
			Na(
				di,
				rt => q(Je, rt),
				() => I(Je),
			)
			var bn = oe(di, 2),
				ka = ie(bn),
				ho = oe(ka, 2),
				nu = oe(bn, 2)
			{
				var Jr = rt => {
					var zt = xh()
					let _r
					var Zn = ie(zt)
					;(At(
						wn => {
							;((_r = An(zt, 1, 'sync-message svelte-1n46o8q', null, _r, wn)),
								dt(Zn, I(b)))
						},
						[() => ({error: I(b).includes('fehl') || I(b).includes('Fehler')})],
					),
						et(rt, zt))
				}
				It(nu, rt => {
					I(b) && rt(Jr)
				})
			}
			var ji = oe(ws, 2),
				Ui = oe(ie(ji), 2),
				vo = ie(Ui),
				rn = oe(Ui, 2)
			Na(
				rn,
				rt => q(P, rt),
				() => I(P),
			)
			var Ss = oe(rn, 2),
				po = ie(Ss),
				zi = oe(po, 2),
				go = oe(zi, 2),
				_o = oe(Ss, 2)
			{
				var iu = rt => {
					var zt = xh()
					let _r
					var Zn = ie(zt)
					;(At(
						wn => {
							;((_r = An(zt, 1, 'sync-message svelte-1n46o8q', null, _r, wn)),
								dt(Zn, I(b)))
						},
						[() => ({error: I(b).includes('fehl') || I(b).includes('Fehler')})],
					),
						et(rt, zt))
				}
				It(_o, rt => {
					I(b) && rt(iu)
				})
			}
			var qi = oe(Tr, 2),
				xa = ie(qi),
				Es = oe(xa, 2),
				ks = oe(Es, 2)
			;(At(() => {
				;((ka.disabled = I(A)),
					(ho.disabled = I(A)),
					dt(
						vo,
						`Exportiere/Importiere nur die App-Einstellungen (ohne Episoden). Version: v${fa}`,
					),
					(po.disabled = I(A)),
					(zi.disabled = I(A)),
					(go.disabled = I(A)))
			}),
				ct('click', Fe, jt),
				ct('keydown', Fe, rt => {
					rt.key === 'Escape' && jt()
				}),
				ct('click', Ze, rt => rt.stopPropagation()),
				ct('click', yt, jt),
				So(
					r,
					[],
					Ot,
					() => I(xe),
					rt => q(xe, rt),
				),
				So(
					r,
					[],
					Xt,
					() => I(xe),
					rt => q(xe, rt),
				),
				So(
					r,
					[],
					Qt,
					() => I(xe),
					rt => q(xe, rt),
				),
				So(
					r,
					[],
					Ht,
					() => I(xe),
					rt => q(xe, rt),
				),
				So(
					r,
					[],
					qr,
					() => I(xe),
					rt => q(xe, rt),
				),
				Ru(
					He,
					() => I(Ie),
					rt => q(Ie, rt),
				),
				Iu(
					yn,
					() => I(ze),
					rt => q(ze, rt),
				),
				Iu(
					$n,
					() => I(ft),
					rt => q(ft, rt),
				),
				Iu(
					so,
					() => I(it),
					rt => q(it, rt),
				),
				Bp(
					ru,
					() => I(x).autoPlay,
					rt => (I(x).autoPlay = rt),
				),
				ct('change', di, E),
				ct('click', ka, Pe),
				ct('click', ho, re),
				ct('change', rn, dr),
				ct('click', po, zr),
				ct('click', zi, Lt),
				ct('click', go, Dn),
				ct('click', xa, C),
				ct('click', Es, () => {
					;(h1(), pt())
				}),
				ct('click', ks, cr),
				et(de, Fe))
		}
		It(Ql, de => {
			I(v) && de(Jl)
		})
	}
	var Xr = oe(Ve, 2)
	;(Na(
		Xr,
		de => q(f, de),
		() => I(f),
	),
		At(
			(de, Fe, Ze) => {
				;((d = An(Ve, 1, 'terminal svelte-1n46o8q', null, d, {
					transitioning: I(Ee),
				})),
					dt(
						Ae,
						`${I(s) ? (I(L) ? 'LOCAL GENERATING...' : 'GENERATING...') : 'READY'} `,
					),
					Si(ke, `color: ${I(Qe).generations ?? ''}`),
					dt(
						ht,
						`▣ Gen: ${I(Me).generations.used ?? ''}/${I(Me).generations.limit ?? ''}`,
					),
					Si(xt, `color: ${I(Qe).characters ?? ''}`),
					dt(Kt, `▣ Char: ${de ?? ''}/${Fe ?? ''}`),
					Si(Se, `color: ${I(Qe).audio ?? ''}`),
					dt(
						Pn,
						`▣ Audio: ${I(Me).audio.used ?? ''}/${I(Me).audio.limit ?? ''}min`,
					),
					(Ar.disabled = I(s)),
					(ms.disabled = I(s)),
					(_a.disabled = Ze),
					dt(ma, I(s) ? '[ GENERATING... ]' : '[ ▶ TUNE IN ]'))
			},
			[
				() => I(Me).characters.used.toLocaleString(),
				() => I(Me).characters.limit.toLocaleString(),
				() => I(s) || !I(n).trim(),
			],
		),
		ct('click', T, Ft),
		Ru(
			Ar,
			() => I(n),
			de => q(n, de),
		),
		ct('click', pa, () => q(_, !I(_))),
		Ru(
			ms,
			() => I(i),
			de => q(i, de),
		),
		ct('click', _a, () => Te()),
		ct('click', ba, () => {
			;(q(g, !I(g)),
				I(g)
					? window.history.pushState({panel: 'history'}, '')
					: window.history.state?.panel && window.history.back())
		}),
		Bo('timeupdate', Xr, Oe),
		Bo('loadedmetadata', Xr, er),
		Bo('ended', Xr, () => q(l, !1)),
		et(e, he),
		ha())
}
Cl(['click', 'keydown', 'change'])
const e_ = document.getElementById('app')
if (!e_) throw new Error('No #app element found')
$0(T1, {target: e_})
var Vu = {},
	Zu = {},
	Gr = {},
	Hs = {exports: {}}
const I1 = {},
	R1 = Object.freeze(
		Object.defineProperty({__proto__: null, default: I1}, Symbol.toStringTag, {
			value: 'Module',
		}),
	),
	ai = Ey(R1)
var $s = {exports: {}},
	Ah
function Vl() {
	if (Ah) return $s.exports
	;((Ah = 1),
		typeof process > 'u' ||
		!process.version ||
		process.version.indexOf('v0.') === 0 ||
		(process.version.indexOf('v1.') === 0 &&
			process.version.indexOf('v1.8.') !== 0)
			? ($s.exports = {nextTick: e})
			: ($s.exports = process))
	function e(t, r, n, i) {
		if (typeof t != 'function')
			throw new TypeError('"callback" argument must be a function')
		var s = arguments.length,
			l,
			f
		switch (s) {
			case 0:
			case 1:
				return process.nextTick(t)
			case 2:
				return process.nextTick(function () {
					t.call(null, r)
				})
			case 3:
				return process.nextTick(function () {
					t.call(null, r, n)
				})
			case 4:
				return process.nextTick(function () {
					t.call(null, r, n, i)
				})
			default:
				for (l = new Array(s - 1), f = 0; f < l.length;) l[f++] = arguments[f]
				return process.nextTick(function () {
					t.apply(null, l)
				})
		}
	}
	return $s.exports
}
var Yu, Th
function C1() {
	if (Th) return Yu
	Th = 1
	var e = {}.toString
	return (
		(Yu =
			Array.isArray ||
			function (t) {
				return e.call(t) == '[object Array]'
			}),
		Yu
	)
}
var Xu, Ih
function t_() {
	return (Ih || ((Ih = 1), (Xu = ai)), Xu)
}
var Vs = {exports: {}},
	Rh
function Zl() {
	return (
		Rh ||
			((Rh = 1),
			(function (e, t) {
				var r = ai,
					n = r.Buffer
				function i(l, f) {
					for (var c in l) f[c] = l[c]
				}
				n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow
					? (e.exports = r)
					: (i(r, t), (t.Buffer = s))
				function s(l, f, c) {
					return n(l, f, c)
				}
				;(i(n, s),
					(s.from = function (l, f, c) {
						if (typeof l == 'number')
							throw new TypeError('Argument must not be a number')
						return n(l, f, c)
					}),
					(s.alloc = function (l, f, c) {
						if (typeof l != 'number')
							throw new TypeError('Argument must be a number')
						var m = n(l)
						return (
							f !== void 0
								? typeof c == 'string'
									? m.fill(f, c)
									: m.fill(f)
								: m.fill(0),
							m
						)
					}),
					(s.allocUnsafe = function (l) {
						if (typeof l != 'number')
							throw new TypeError('Argument must be a number')
						return n(l)
					}),
					(s.allocUnsafeSlow = function (l) {
						if (typeof l != 'number')
							throw new TypeError('Argument must be a number')
						return r.SlowBuffer(l)
					}))
			})(Vs, Vs.exports)),
		Vs.exports
	)
}
var yr = {},
	Ch
function vs() {
	if (Ch) return yr
	Ch = 1
	function e(x) {
		return Array.isArray ? Array.isArray(x) : S(x) === '[object Array]'
	}
	yr.isArray = e
	function t(x) {
		return typeof x == 'boolean'
	}
	yr.isBoolean = t
	function r(x) {
		return x === null
	}
	yr.isNull = r
	function n(x) {
		return x == null
	}
	yr.isNullOrUndefined = n
	function i(x) {
		return typeof x == 'number'
	}
	yr.isNumber = i
	function s(x) {
		return typeof x == 'string'
	}
	yr.isString = s
	function l(x) {
		return typeof x == 'symbol'
	}
	yr.isSymbol = l
	function f(x) {
		return x === void 0
	}
	yr.isUndefined = f
	function c(x) {
		return S(x) === '[object RegExp]'
	}
	yr.isRegExp = c
	function m(x) {
		return typeof x == 'object' && x !== null
	}
	yr.isObject = m
	function y(x) {
		return S(x) === '[object Date]'
	}
	yr.isDate = y
	function g(x) {
		return S(x) === '[object Error]' || x instanceof Error
	}
	yr.isError = g
	function v(x) {
		return typeof x == 'function'
	}
	yr.isFunction = v
	function _(x) {
		return (
			x === null ||
			typeof x == 'boolean' ||
			typeof x == 'number' ||
			typeof x == 'string' ||
			typeof x == 'symbol' ||
			typeof x > 'u'
		)
	}
	;((yr.isPrimitive = _), (yr.isBuffer = ai.Buffer.isBuffer))
	function S(x) {
		return Object.prototype.toString.call(x)
	}
	return yr
}
var Zs = {exports: {}},
	Ys = {exports: {}},
	Oh
function O1() {
	return (
		Oh ||
			((Oh = 1),
			typeof Object.create == 'function'
				? (Ys.exports = function (t, r) {
						r &&
							((t.super_ = r),
							(t.prototype = Object.create(r.prototype, {
								constructor: {
									value: t,
									enumerable: !1,
									writable: !0,
									configurable: !0,
								},
							})))
					})
				: (Ys.exports = function (t, r) {
						if (r) {
							t.super_ = r
							var n = function () {}
							;((n.prototype = r.prototype),
								(t.prototype = new n()),
								(t.prototype.constructor = t))
						}
					})),
		Ys.exports
	)
}
var Dh
function ps() {
	if (Dh) return Zs.exports
	Dh = 1
	try {
		var e = ai
		if (typeof e.inherits != 'function') throw ''
		Zs.exports = e.inherits
	} catch {
		Zs.exports = O1()
	}
	return Zs.exports
}
var Qu = {exports: {}},
	Ph
function D1() {
	return (
		Ph ||
			((Ph = 1),
			(function (e) {
				function t(s, l) {
					if (!(s instanceof l))
						throw new TypeError('Cannot call a class as a function')
				}
				var r = Zl().Buffer,
					n = ai
				function i(s, l, f) {
					s.copy(l, f)
				}
				;((e.exports = (function () {
					function s() {
						;(t(this, s),
							(this.head = null),
							(this.tail = null),
							(this.length = 0))
					}
					return (
						(s.prototype.push = function (f) {
							var c = {data: f, next: null}
							;(this.length > 0 ? (this.tail.next = c) : (this.head = c),
								(this.tail = c),
								++this.length)
						}),
						(s.prototype.unshift = function (f) {
							var c = {data: f, next: this.head}
							;(this.length === 0 && (this.tail = c),
								(this.head = c),
								++this.length)
						}),
						(s.prototype.shift = function () {
							if (this.length !== 0) {
								var f = this.head.data
								return (
									this.length === 1
										? (this.head = this.tail = null)
										: (this.head = this.head.next),
									--this.length,
									f
								)
							}
						}),
						(s.prototype.clear = function () {
							;((this.head = this.tail = null), (this.length = 0))
						}),
						(s.prototype.join = function (f) {
							if (this.length === 0) return ''
							for (var c = this.head, m = '' + c.data; (c = c.next);)
								m += f + c.data
							return m
						}),
						(s.prototype.concat = function (f) {
							if (this.length === 0) return r.alloc(0)
							for (var c = r.allocUnsafe(f >>> 0), m = this.head, y = 0; m;)
								(i(m.data, c, y), (y += m.data.length), (m = m.next))
							return c
						}),
						s
					)
				})()),
					n &&
						n.inspect &&
						n.inspect.custom &&
						(e.exports.prototype[n.inspect.custom] = function () {
							var s = n.inspect({length: this.length})
							return this.constructor.name + ' ' + s
						}))
			})(Qu)),
		Qu.exports
	)
}
var Ju, Lh
function r_() {
	if (Lh) return Ju
	Lh = 1
	var e = Vl()
	function t(i, s) {
		var l = this,
			f = this._readableState && this._readableState.destroyed,
			c = this._writableState && this._writableState.destroyed
		return f || c
			? (s
					? s(i)
					: i &&
						(this._writableState
							? this._writableState.errorEmitted ||
								((this._writableState.errorEmitted = !0),
								e.nextTick(n, this, i))
							: e.nextTick(n, this, i)),
				this)
			: (this._readableState && (this._readableState.destroyed = !0),
				this._writableState && (this._writableState.destroyed = !0),
				this._destroy(i || null, function (m) {
					!s && m
						? l._writableState
							? l._writableState.errorEmitted ||
								((l._writableState.errorEmitted = !0), e.nextTick(n, l, m))
							: e.nextTick(n, l, m)
						: s && s(m)
				}),
				this)
	}
	function r() {
		;(this._readableState &&
			((this._readableState.destroyed = !1),
			(this._readableState.reading = !1),
			(this._readableState.ended = !1),
			(this._readableState.endEmitted = !1)),
			this._writableState &&
				((this._writableState.destroyed = !1),
				(this._writableState.ended = !1),
				(this._writableState.ending = !1),
				(this._writableState.finalCalled = !1),
				(this._writableState.prefinished = !1),
				(this._writableState.finished = !1),
				(this._writableState.errorEmitted = !1)))
	}
	function n(i, s) {
		i.emit('error', s)
	}
	return ((Ju = {destroy: t, undestroy: r}), Ju)
}
var ef, Mh
function P1() {
	return (Mh || ((Mh = 1), (ef = ai.deprecate)), ef)
}
var tf, Nh
function n_() {
	if (Nh) return tf
	Nh = 1
	var e = Vl()
	tf = x
	function t(j) {
		var G = this
		;((this.next = null),
			(this.entry = null),
			(this.finish = function () {
				pt(G, j)
			}))
	}
	var r =
			!process.browser &&
			['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1
				? setImmediate
				: e.nextTick,
		n
	x.WritableState = _
	var i = Object.create(vs())
	i.inherits = ps()
	var s = {deprecate: P1()},
		l = t_(),
		f = Zl().Buffer,
		c =
			(typeof br < 'u'
				? br
				: typeof window < 'u'
					? window
					: typeof self < 'u'
						? self
						: {}
			).Uint8Array || function () {}
	function m(j) {
		return f.from(j)
	}
	function y(j) {
		return f.isBuffer(j) || j instanceof c
	}
	var g = r_()
	i.inherits(x, l)
	function v() {}
	function _(j, G) {
		;((n = n || Xa()), (j = j || {}))
		var $ = G instanceof n
		;((this.objectMode = !!j.objectMode),
			$ && (this.objectMode = this.objectMode || !!j.writableObjectMode))
		var _e = j.highWaterMark,
			Ie = j.writableHighWaterMark,
			xe = this.objectMode ? 16 : 16 * 1024
		;(_e || _e === 0
			? (this.highWaterMark = _e)
			: $ && (Ie || Ie === 0)
				? (this.highWaterMark = Ie)
				: (this.highWaterMark = xe),
			(this.highWaterMark = Math.floor(this.highWaterMark)),
			(this.finalCalled = !1),
			(this.needDrain = !1),
			(this.ending = !1),
			(this.ended = !1),
			(this.finished = !1),
			(this.destroyed = !1))
		var ze = j.decodeStrings === !1
		;((this.decodeStrings = !ze),
			(this.defaultEncoding = j.defaultEncoding || 'utf8'),
			(this.length = 0),
			(this.writing = !1),
			(this.corked = 0),
			(this.sync = !0),
			(this.bufferProcessing = !1),
			(this.onwrite = function (ft) {
				X(G, ft)
			}),
			(this.writecb = null),
			(this.writelen = 0),
			(this.bufferedRequest = null),
			(this.lastBufferedRequest = null),
			(this.pendingcb = 0),
			(this.prefinished = !1),
			(this.errorEmitted = !1),
			(this.bufferedRequestCount = 0),
			(this.corkedRequestsFree = new t(this)))
	}
	;((_.prototype.getBuffer = function () {
		for (var G = this.bufferedRequest, $ = []; G;) ($.push(G), (G = G.next))
		return $
	}),
		(function () {
			try {
				Object.defineProperty(_.prototype, 'buffer', {
					get: s.deprecate(
						function () {
							return this.getBuffer()
						},
						'_writableState.buffer is deprecated. Use _writableState.getBuffer instead.',
						'DEP0003',
					),
				})
			} catch {}
		})())
	var S
	typeof Symbol == 'function' &&
	Symbol.hasInstance &&
	typeof Function.prototype[Symbol.hasInstance] == 'function'
		? ((S = Function.prototype[Symbol.hasInstance]),
			Object.defineProperty(x, Symbol.hasInstance, {
				value: function (j) {
					return S.call(this, j)
						? !0
						: this !== x
							? !1
							: j && j._writableState instanceof _
				},
			}))
		: (S = function (j) {
				return j instanceof this
			})
	function x(j) {
		if (((n = n || Xa()), !S.call(x, this) && !(this instanceof n)))
			return new x(j)
		;((this._writableState = new _(j, this)),
			(this.writable = !0),
			j &&
				(typeof j.write == 'function' && (this._write = j.write),
				typeof j.writev == 'function' && (this._writev = j.writev),
				typeof j.destroy == 'function' && (this._destroy = j.destroy),
				typeof j.final == 'function' && (this._final = j.final)),
			l.call(this))
	}
	x.prototype.pipe = function () {
		this.emit('error', new Error('Cannot pipe, not readable'))
	}
	function R(j, G) {
		var $ = new Error('write after end')
		;(j.emit('error', $), e.nextTick(G, $))
	}
	function b(j, G, $, _e) {
		var Ie = !0,
			xe = !1
		return (
			$ === null
				? (xe = new TypeError('May not write null values to stream'))
				: typeof $ != 'string' &&
					$ !== void 0 &&
					!G.objectMode &&
					(xe = new TypeError('Invalid non-string/buffer chunk')),
			xe && (j.emit('error', xe), e.nextTick(_e, xe), (Ie = !1)),
			Ie
		)
	}
	;((x.prototype.write = function (j, G, $) {
		var _e = this._writableState,
			Ie = !1,
			xe = !_e.objectMode && y(j)
		return (
			xe && !f.isBuffer(j) && (j = m(j)),
			typeof G == 'function' && (($ = G), (G = null)),
			xe ? (G = 'buffer') : G || (G = _e.defaultEncoding),
			typeof $ != 'function' && ($ = v),
			_e.ended
				? R(this, $)
				: (xe || b(this, _e, j, $)) &&
					(_e.pendingcb++, (Ie = L(this, _e, xe, j, G, $))),
			Ie
		)
	}),
		(x.prototype.cork = function () {
			var j = this._writableState
			j.corked++
		}),
		(x.prototype.uncork = function () {
			var j = this._writableState
			j.corked &&
				(j.corked--,
				!j.writing &&
					!j.corked &&
					!j.bufferProcessing &&
					j.bufferedRequest &&
					ye(this, j))
		}),
		(x.prototype.setDefaultEncoding = function (G) {
			if (
				(typeof G == 'string' && (G = G.toLowerCase()),
				!(
					[
						'hex',
						'utf8',
						'utf-8',
						'ascii',
						'binary',
						'base64',
						'ucs2',
						'ucs-2',
						'utf16le',
						'utf-16le',
						'raw',
					].indexOf((G + '').toLowerCase()) > -1
				))
			)
				throw new TypeError('Unknown encoding: ' + G)
			return ((this._writableState.defaultEncoding = G), this)
		}))
	function A(j, G, $) {
		return (
			!j.objectMode &&
				j.decodeStrings !== !1 &&
				typeof G == 'string' &&
				(G = f.from(G, $)),
			G
		)
	}
	Object.defineProperty(x.prototype, 'writableHighWaterMark', {
		enumerable: !1,
		get: function () {
			return this._writableState.highWaterMark
		},
	})
	function L(j, G, $, _e, Ie, xe) {
		if (!$) {
			var ze = A(G, _e, Ie)
			_e !== ze && (($ = !0), (Ie = 'buffer'), (_e = ze))
		}
		var ft = G.objectMode ? 1 : _e.length
		G.length += ft
		var it = G.length < G.highWaterMark
		if ((it || (G.needDrain = !0), G.writing || G.corked)) {
			var Je = G.lastBufferedRequest
			;((G.lastBufferedRequest = {
				chunk: _e,
				encoding: Ie,
				isBuf: $,
				callback: xe,
				next: null,
			}),
				Je
					? (Je.next = G.lastBufferedRequest)
					: (G.bufferedRequest = G.lastBufferedRequest),
				(G.bufferedRequestCount += 1))
		} else N(j, G, !1, ft, _e, Ie, xe)
		return it
	}
	function N(j, G, $, _e, Ie, xe, ze) {
		;((G.writelen = _e),
			(G.writecb = ze),
			(G.writing = !0),
			(G.sync = !0),
			$ ? j._writev(Ie, G.onwrite) : j._write(Ie, xe, G.onwrite),
			(G.sync = !1))
	}
	function U(j, G, $, _e, Ie) {
		;(--G.pendingcb,
			$
				? (e.nextTick(Ie, _e),
					e.nextTick(Me, j, G),
					(j._writableState.errorEmitted = !0),
					j.emit('error', _e))
				: (Ie(_e),
					(j._writableState.errorEmitted = !0),
					j.emit('error', _e),
					Me(j, G)))
	}
	function ee(j) {
		;((j.writing = !1),
			(j.writecb = null),
			(j.length -= j.writelen),
			(j.writelen = 0))
	}
	function X(j, G) {
		var $ = j._writableState,
			_e = $.sync,
			Ie = $.writecb
		if ((ee($), G)) U(j, $, _e, G, Ie)
		else {
			var xe = Ne($)
			;(!xe &&
				!$.corked &&
				!$.bufferProcessing &&
				$.bufferedRequest &&
				ye(j, $),
				_e ? r(ve, j, $, xe, Ie) : ve(j, $, xe, Ie))
		}
	}
	function ve(j, G, $, _e) {
		;($ || ge(j, G), G.pendingcb--, _e(), Me(j, G))
	}
	function ge(j, G) {
		G.length === 0 && G.needDrain && ((G.needDrain = !1), j.emit('drain'))
	}
	function ye(j, G) {
		G.bufferProcessing = !0
		var $ = G.bufferedRequest
		if (j._writev && $ && $.next) {
			var _e = G.bufferedRequestCount,
				Ie = new Array(_e),
				xe = G.corkedRequestsFree
			xe.entry = $
			for (var ze = 0, ft = !0; $;)
				((Ie[ze] = $), $.isBuf || (ft = !1), ($ = $.next), (ze += 1))
			;((Ie.allBuffers = ft),
				N(j, G, !0, G.length, Ie, '', xe.finish),
				G.pendingcb++,
				(G.lastBufferedRequest = null),
				xe.next
					? ((G.corkedRequestsFree = xe.next), (xe.next = null))
					: (G.corkedRequestsFree = new t(G)),
				(G.bufferedRequestCount = 0))
		} else {
			for (; $;) {
				var it = $.chunk,
					Je = $.encoding,
					P = $.callback,
					M = G.objectMode ? 1 : it.length
				if (
					(N(j, G, !1, M, it, Je, P),
					($ = $.next),
					G.bufferedRequestCount--,
					G.writing)
				)
					break
			}
			$ === null && (G.lastBufferedRequest = null)
		}
		;((G.bufferedRequest = $), (G.bufferProcessing = !1))
	}
	;((x.prototype._write = function (j, G, $) {
		$(new Error('_write() is not implemented'))
	}),
		(x.prototype._writev = null),
		(x.prototype.end = function (j, G, $) {
			var _e = this._writableState
			;(typeof j == 'function'
				? (($ = j), (j = null), (G = null))
				: typeof G == 'function' && (($ = G), (G = null)),
				j != null && this.write(j, G),
				_e.corked && ((_e.corked = 1), this.uncork()),
				_e.ending || Qe(this, _e, $))
		}))
	function Ne(j) {
		return (
			j.ending &&
			j.length === 0 &&
			j.bufferedRequest === null &&
			!j.finished &&
			!j.writing
		)
	}
	function je(j, G) {
		j._final(function ($) {
			;(G.pendingcb--,
				$ && j.emit('error', $),
				(G.prefinished = !0),
				j.emit('prefinish'),
				Me(j, G))
		})
	}
	function Ee(j, G) {
		!G.prefinished &&
			!G.finalCalled &&
			(typeof j._final == 'function'
				? (G.pendingcb++, (G.finalCalled = !0), e.nextTick(je, j, G))
				: ((G.prefinished = !0), j.emit('prefinish')))
	}
	function Me(j, G) {
		var $ = Ne(G)
		return (
			$ &&
				(Ee(j, G), G.pendingcb === 0 && ((G.finished = !0), j.emit('finish'))),
			$
		)
	}
	function Qe(j, G, $) {
		;((G.ending = !0),
			Me(j, G),
			$ && (G.finished ? e.nextTick($) : j.once('finish', $)),
			(G.ended = !0),
			(j.writable = !1))
	}
	function pt(j, G, $) {
		var _e = j.entry
		for (j.entry = null; _e;) {
			var Ie = _e.callback
			;(G.pendingcb--, Ie($), (_e = _e.next))
		}
		G.corkedRequestsFree.next = j
	}
	return (
		Object.defineProperty(x.prototype, 'destroyed', {
			get: function () {
				return this._writableState === void 0
					? !1
					: this._writableState.destroyed
			},
			set: function (j) {
				this._writableState && (this._writableState.destroyed = j)
			},
		}),
		(x.prototype.destroy = g.destroy),
		(x.prototype._undestroy = g.undestroy),
		(x.prototype._destroy = function (j, G) {
			;(this.end(), G(j))
		}),
		tf
	)
}
var rf, Bh
function Xa() {
	if (Bh) return rf
	Bh = 1
	var e = Vl(),
		t =
			Object.keys ||
			function (g) {
				var v = []
				for (var _ in g) v.push(_)
				return v
			}
	rf = c
	var r = Object.create(vs())
	r.inherits = ps()
	var n = i_(),
		i = n_()
	r.inherits(c, n)
	for (var s = t(i.prototype), l = 0; l < s.length; l++) {
		var f = s[l]
		c.prototype[f] || (c.prototype[f] = i.prototype[f])
	}
	function c(g) {
		if (!(this instanceof c)) return new c(g)
		;(n.call(this, g),
			i.call(this, g),
			g && g.readable === !1 && (this.readable = !1),
			g && g.writable === !1 && (this.writable = !1),
			(this.allowHalfOpen = !0),
			g && g.allowHalfOpen === !1 && (this.allowHalfOpen = !1),
			this.once('end', m))
	}
	Object.defineProperty(c.prototype, 'writableHighWaterMark', {
		enumerable: !1,
		get: function () {
			return this._writableState.highWaterMark
		},
	})
	function m() {
		this.allowHalfOpen || this._writableState.ended || e.nextTick(y, this)
	}
	function y(g) {
		g.end()
	}
	return (
		Object.defineProperty(c.prototype, 'destroyed', {
			get: function () {
				return this._readableState === void 0 || this._writableState === void 0
					? !1
					: this._readableState.destroyed && this._writableState.destroyed
			},
			set: function (g) {
				this._readableState === void 0 ||
					this._writableState === void 0 ||
					((this._readableState.destroyed = g),
					(this._writableState.destroyed = g))
			},
		}),
		(c.prototype._destroy = function (g, v) {
			;(this.push(null), this.end(), e.nextTick(v, g))
		}),
		rf
	)
}
var nf = {},
	Fh
function jh() {
	if (Fh) return nf
	Fh = 1
	var e = Zl().Buffer,
		t =
			e.isEncoding ||
			function (b) {
				switch (((b = '' + b), b && b.toLowerCase())) {
					case 'hex':
					case 'utf8':
					case 'utf-8':
					case 'ascii':
					case 'binary':
					case 'base64':
					case 'ucs2':
					case 'ucs-2':
					case 'utf16le':
					case 'utf-16le':
					case 'raw':
						return !0
					default:
						return !1
				}
			}
	function r(b) {
		if (!b) return 'utf8'
		for (var A; ;)
			switch (b) {
				case 'utf8':
				case 'utf-8':
					return 'utf8'
				case 'ucs2':
				case 'ucs-2':
				case 'utf16le':
				case 'utf-16le':
					return 'utf16le'
				case 'latin1':
				case 'binary':
					return 'latin1'
				case 'base64':
				case 'ascii':
				case 'hex':
					return b
				default:
					if (A) return
					;((b = ('' + b).toLowerCase()), (A = !0))
			}
	}
	function n(b) {
		var A = r(b)
		if (typeof A != 'string' && (e.isEncoding === t || !t(b)))
			throw new Error('Unknown encoding: ' + b)
		return A || b
	}
	nf.StringDecoder = i
	function i(b) {
		this.encoding = n(b)
		var A
		switch (this.encoding) {
			case 'utf16le':
				;((this.text = g), (this.end = v), (A = 4))
				break
			case 'utf8':
				;((this.fillLast = c), (A = 4))
				break
			case 'base64':
				;((this.text = _), (this.end = S), (A = 3))
				break
			default:
				;((this.write = x), (this.end = R))
				return
		}
		;((this.lastNeed = 0),
			(this.lastTotal = 0),
			(this.lastChar = e.allocUnsafe(A)))
	}
	;((i.prototype.write = function (b) {
		if (b.length === 0) return ''
		var A, L
		if (this.lastNeed) {
			if (((A = this.fillLast(b)), A === void 0)) return ''
			;((L = this.lastNeed), (this.lastNeed = 0))
		} else L = 0
		return L < b.length ? (A ? A + this.text(b, L) : this.text(b, L)) : A || ''
	}),
		(i.prototype.end = y),
		(i.prototype.text = m),
		(i.prototype.fillLast = function (b) {
			if (this.lastNeed <= b.length)
				return (
					b.copy(
						this.lastChar,
						this.lastTotal - this.lastNeed,
						0,
						this.lastNeed,
					),
					this.lastChar.toString(this.encoding, 0, this.lastTotal)
				)
			;(b.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, b.length),
				(this.lastNeed -= b.length))
		}))
	function s(b) {
		return b <= 127
			? 0
			: b >> 5 === 6
				? 2
				: b >> 4 === 14
					? 3
					: b >> 3 === 30
						? 4
						: b >> 6 === 2
							? -1
							: -2
	}
	function l(b, A, L) {
		var N = A.length - 1
		if (N < L) return 0
		var U = s(A[N])
		return U >= 0
			? (U > 0 && (b.lastNeed = U - 1), U)
			: --N < L || U === -2
				? 0
				: ((U = s(A[N])),
					U >= 0
						? (U > 0 && (b.lastNeed = U - 2), U)
						: --N < L || U === -2
							? 0
							: ((U = s(A[N])),
								U >= 0
									? (U > 0 && (U === 2 ? (U = 0) : (b.lastNeed = U - 3)), U)
									: 0))
	}
	function f(b, A, L) {
		if ((A[0] & 192) !== 128) return ((b.lastNeed = 0), '�')
		if (b.lastNeed > 1 && A.length > 1) {
			if ((A[1] & 192) !== 128) return ((b.lastNeed = 1), '�')
			if (b.lastNeed > 2 && A.length > 2 && (A[2] & 192) !== 128)
				return ((b.lastNeed = 2), '�')
		}
	}
	function c(b) {
		var A = this.lastTotal - this.lastNeed,
			L = f(this, b)
		if (L !== void 0) return L
		if (this.lastNeed <= b.length)
			return (
				b.copy(this.lastChar, A, 0, this.lastNeed),
				this.lastChar.toString(this.encoding, 0, this.lastTotal)
			)
		;(b.copy(this.lastChar, A, 0, b.length), (this.lastNeed -= b.length))
	}
	function m(b, A) {
		var L = l(this, b, A)
		if (!this.lastNeed) return b.toString('utf8', A)
		this.lastTotal = L
		var N = b.length - (L - this.lastNeed)
		return (b.copy(this.lastChar, 0, N), b.toString('utf8', A, N))
	}
	function y(b) {
		var A = b && b.length ? this.write(b) : ''
		return this.lastNeed ? A + '�' : A
	}
	function g(b, A) {
		if ((b.length - A) % 2 === 0) {
			var L = b.toString('utf16le', A)
			if (L) {
				var N = L.charCodeAt(L.length - 1)
				if (N >= 55296 && N <= 56319)
					return (
						(this.lastNeed = 2),
						(this.lastTotal = 4),
						(this.lastChar[0] = b[b.length - 2]),
						(this.lastChar[1] = b[b.length - 1]),
						L.slice(0, -1)
					)
			}
			return L
		}
		return (
			(this.lastNeed = 1),
			(this.lastTotal = 2),
			(this.lastChar[0] = b[b.length - 1]),
			b.toString('utf16le', A, b.length - 1)
		)
	}
	function v(b) {
		var A = b && b.length ? this.write(b) : ''
		if (this.lastNeed) {
			var L = this.lastTotal - this.lastNeed
			return A + this.lastChar.toString('utf16le', 0, L)
		}
		return A
	}
	function _(b, A) {
		var L = (b.length - A) % 3
		return L === 0
			? b.toString('base64', A)
			: ((this.lastNeed = 3 - L),
				(this.lastTotal = 3),
				L === 1
					? (this.lastChar[0] = b[b.length - 1])
					: ((this.lastChar[0] = b[b.length - 2]),
						(this.lastChar[1] = b[b.length - 1])),
				b.toString('base64', A, b.length - L))
	}
	function S(b) {
		var A = b && b.length ? this.write(b) : ''
		return this.lastNeed
			? A + this.lastChar.toString('base64', 0, 3 - this.lastNeed)
			: A
	}
	function x(b) {
		return b.toString(this.encoding)
	}
	function R(b) {
		return b && b.length ? this.write(b) : ''
	}
	return nf
}
var af, Uh
function i_() {
	if (Uh) return af
	Uh = 1
	var e = Vl()
	af = A
	var t = C1(),
		r
	;((A.ReadableState = b), ai.EventEmitter)
	var n = function (P, M) {
			return P.listeners(M).length
		},
		i = t_(),
		s = Zl().Buffer,
		l =
			(typeof br < 'u'
				? br
				: typeof window < 'u'
					? window
					: typeof self < 'u'
						? self
						: {}
			).Uint8Array || function () {}
	function f(P) {
		return s.from(P)
	}
	function c(P) {
		return s.isBuffer(P) || P instanceof l
	}
	var m = Object.create(vs())
	m.inherits = ps()
	var y = ai,
		g = void 0
	y && y.debuglog ? (g = y.debuglog('stream')) : (g = function () {})
	var v = D1(),
		_ = r_(),
		S
	m.inherits(A, i)
	var x = ['error', 'close', 'destroy', 'pause', 'resume']
	function R(P, M, ue) {
		if (typeof P.prependListener == 'function') return P.prependListener(M, ue)
		!P._events || !P._events[M]
			? P.on(M, ue)
			: t(P._events[M])
				? P._events[M].unshift(ue)
				: (P._events[M] = [ue, P._events[M]])
	}
	function b(P, M) {
		;((r = r || Xa()), (P = P || {}))
		var ue = M instanceof r
		;((this.objectMode = !!P.objectMode),
			ue && (this.objectMode = this.objectMode || !!P.readableObjectMode))
		var me = P.highWaterMark,
			Ge = P.readableHighWaterMark,
			be = this.objectMode ? 16 : 16 * 1024
		;(me || me === 0
			? (this.highWaterMark = me)
			: ue && (Ge || Ge === 0)
				? (this.highWaterMark = Ge)
				: (this.highWaterMark = be),
			(this.highWaterMark = Math.floor(this.highWaterMark)),
			(this.buffer = new v()),
			(this.length = 0),
			(this.pipes = null),
			(this.pipesCount = 0),
			(this.flowing = null),
			(this.ended = !1),
			(this.endEmitted = !1),
			(this.reading = !1),
			(this.sync = !0),
			(this.needReadable = !1),
			(this.emittedReadable = !1),
			(this.readableListening = !1),
			(this.resumeScheduled = !1),
			(this.destroyed = !1),
			(this.defaultEncoding = P.defaultEncoding || 'utf8'),
			(this.awaitDrain = 0),
			(this.readingMore = !1),
			(this.decoder = null),
			(this.encoding = null),
			P.encoding &&
				(S || (S = jh().StringDecoder),
				(this.decoder = new S(P.encoding)),
				(this.encoding = P.encoding)))
	}
	function A(P) {
		if (((r = r || Xa()), !(this instanceof A))) return new A(P)
		;((this._readableState = new b(P, this)),
			(this.readable = !0),
			P &&
				(typeof P.read == 'function' && (this._read = P.read),
				typeof P.destroy == 'function' && (this._destroy = P.destroy)),
			i.call(this))
	}
	;(Object.defineProperty(A.prototype, 'destroyed', {
		get: function () {
			return this._readableState === void 0 ? !1 : this._readableState.destroyed
		},
		set: function (P) {
			this._readableState && (this._readableState.destroyed = P)
		},
	}),
		(A.prototype.destroy = _.destroy),
		(A.prototype._undestroy = _.undestroy),
		(A.prototype._destroy = function (P, M) {
			;(this.push(null), M(P))
		}),
		(A.prototype.push = function (P, M) {
			var ue = this._readableState,
				me
			return (
				ue.objectMode
					? (me = !0)
					: typeof P == 'string' &&
						((M = M || ue.defaultEncoding),
						M !== ue.encoding && ((P = s.from(P, M)), (M = '')),
						(me = !0)),
				L(this, P, M, !1, me)
			)
		}),
		(A.prototype.unshift = function (P) {
			return L(this, P, null, !0, !1)
		}))
	function L(P, M, ue, me, Ge) {
		var be = P._readableState
		if (M === null) ((be.reading = !1), ye(P, be))
		else {
			var Te
			;(Ge || (Te = U(be, M)),
				Te
					? P.emit('error', Te)
					: be.objectMode || (M && M.length > 0)
						? (typeof M != 'string' &&
								!be.objectMode &&
								Object.getPrototypeOf(M) !== s.prototype &&
								(M = f(M)),
							me
								? be.endEmitted
									? P.emit(
											'error',
											new Error('stream.unshift() after end event'),
										)
									: N(P, be, M, !0)
								: be.ended
									? P.emit('error', new Error('stream.push() after EOF'))
									: ((be.reading = !1),
										be.decoder && !ue
											? ((M = be.decoder.write(M)),
												be.objectMode || M.length !== 0
													? N(P, be, M, !1)
													: Ee(P, be))
											: N(P, be, M, !1)))
						: me || (be.reading = !1))
		}
		return ee(be)
	}
	function N(P, M, ue, me) {
		;(M.flowing && M.length === 0 && !M.sync
			? (P.emit('data', ue), P.read(0))
			: ((M.length += M.objectMode ? 1 : ue.length),
				me ? M.buffer.unshift(ue) : M.buffer.push(ue),
				M.needReadable && Ne(P)),
			Ee(P, M))
	}
	function U(P, M) {
		var ue
		return (
			!c(M) &&
				typeof M != 'string' &&
				M !== void 0 &&
				!P.objectMode &&
				(ue = new TypeError('Invalid non-string/buffer chunk')),
			ue
		)
	}
	function ee(P) {
		return (
			!P.ended &&
			(P.needReadable || P.length < P.highWaterMark || P.length === 0)
		)
	}
	;((A.prototype.isPaused = function () {
		return this._readableState.flowing === !1
	}),
		(A.prototype.setEncoding = function (P) {
			return (
				S || (S = jh().StringDecoder),
				(this._readableState.decoder = new S(P)),
				(this._readableState.encoding = P),
				this
			)
		}))
	var X = 8388608
	function ve(P) {
		return (
			P >= X
				? (P = X)
				: (P--,
					(P |= P >>> 1),
					(P |= P >>> 2),
					(P |= P >>> 4),
					(P |= P >>> 8),
					(P |= P >>> 16),
					P++),
			P
		)
	}
	function ge(P, M) {
		return P <= 0 || (M.length === 0 && M.ended)
			? 0
			: M.objectMode
				? 1
				: P !== P
					? M.flowing && M.length
						? M.buffer.head.data.length
						: M.length
					: (P > M.highWaterMark && (M.highWaterMark = ve(P)),
						P <= M.length ? P : M.ended ? M.length : ((M.needReadable = !0), 0))
	}
	A.prototype.read = function (P) {
		;(g('read', P), (P = parseInt(P, 10)))
		var M = this._readableState,
			ue = P
		if (
			(P !== 0 && (M.emittedReadable = !1),
			P === 0 && M.needReadable && (M.length >= M.highWaterMark || M.ended))
		)
			return (
				g('read: emitReadable', M.length, M.ended),
				M.length === 0 && M.ended ? ft(this) : Ne(this),
				null
			)
		if (((P = ge(P, M)), P === 0 && M.ended))
			return (M.length === 0 && ft(this), null)
		var me = M.needReadable
		;(g('need readable', me),
			(M.length === 0 || M.length - P < M.highWaterMark) &&
				((me = !0), g('length less than watermark', me)),
			M.ended || M.reading
				? ((me = !1), g('reading or ended', me))
				: me &&
					(g('do read'),
					(M.reading = !0),
					(M.sync = !0),
					M.length === 0 && (M.needReadable = !0),
					this._read(M.highWaterMark),
					(M.sync = !1),
					M.reading || (P = ge(ue, M))))
		var Ge
		return (
			P > 0 ? (Ge = _e(P, M)) : (Ge = null),
			Ge === null ? ((M.needReadable = !0), (P = 0)) : (M.length -= P),
			M.length === 0 &&
				(M.ended || (M.needReadable = !0), ue !== P && M.ended && ft(this)),
			Ge !== null && this.emit('data', Ge),
			Ge
		)
	}
	function ye(P, M) {
		if (!M.ended) {
			if (M.decoder) {
				var ue = M.decoder.end()
				ue &&
					ue.length &&
					(M.buffer.push(ue), (M.length += M.objectMode ? 1 : ue.length))
			}
			;((M.ended = !0), Ne(P))
		}
	}
	function Ne(P) {
		var M = P._readableState
		;((M.needReadable = !1),
			M.emittedReadable ||
				(g('emitReadable', M.flowing),
				(M.emittedReadable = !0),
				M.sync ? e.nextTick(je, P) : je(P)))
	}
	function je(P) {
		;(g('emit readable'), P.emit('readable'), $(P))
	}
	function Ee(P, M) {
		M.readingMore || ((M.readingMore = !0), e.nextTick(Me, P, M))
	}
	function Me(P, M) {
		for (
			var ue = M.length;
			!M.reading &&
			!M.flowing &&
			!M.ended &&
			M.length < M.highWaterMark &&
			(g('maybeReadMore read 0'), P.read(0), ue !== M.length);
		)
			ue = M.length
		M.readingMore = !1
	}
	;((A.prototype._read = function (P) {
		this.emit('error', new Error('_read() is not implemented'))
	}),
		(A.prototype.pipe = function (P, M) {
			var ue = this,
				me = this._readableState
			switch (me.pipesCount) {
				case 0:
					me.pipes = P
					break
				case 1:
					me.pipes = [me.pipes, P]
					break
				default:
					me.pipes.push(P)
					break
			}
			;((me.pipesCount += 1), g('pipe count=%d opts=%j', me.pipesCount, M))
			var Ge =
					(!M || M.end !== !1) && P !== process.stdout && P !== process.stderr,
				be = Ge ? Rt : st
			;(me.endEmitted ? e.nextTick(be) : ue.once('end', be), P.on('unpipe', Te))
			function Te(Ft, jt) {
				;(g('onunpipe'),
					Ft === ue &&
						jt &&
						jt.hasUnpiped === !1 &&
						((jt.hasUnpiped = !0), _t()))
			}
			function Rt() {
				;(g('onend'), P.end())
			}
			var Ct = Qe(ue)
			P.on('drain', Ct)
			var kt = !1
			function _t() {
				;(g('cleanup'),
					P.removeListener('close', fr),
					P.removeListener('finish', Pt),
					P.removeListener('drain', Ct),
					P.removeListener('error', er),
					P.removeListener('unpipe', Te),
					ue.removeListener('end', Rt),
					ue.removeListener('end', st),
					ue.removeListener('data', Oe),
					(kt = !0),
					me.awaitDrain &&
						(!P._writableState || P._writableState.needDrain) &&
						Ct())
			}
			var tt = !1
			ue.on('data', Oe)
			function Oe(Ft) {
				;(g('ondata'), (tt = !1))
				var jt = P.write(Ft)
				jt === !1 &&
					!tt &&
					(((me.pipesCount === 1 && me.pipes === P) ||
						(me.pipesCount > 1 && Je(me.pipes, P) !== -1)) &&
						!kt &&
						(g('false write response, pause', me.awaitDrain),
						me.awaitDrain++,
						(tt = !0)),
					ue.pause())
			}
			function er(Ft) {
				;(g('onerror', Ft),
					st(),
					P.removeListener('error', er),
					n(P, 'error') === 0 && P.emit('error', Ft))
			}
			R(P, 'error', er)
			function fr() {
				;(P.removeListener('finish', Pt), st())
			}
			P.once('close', fr)
			function Pt() {
				;(g('onfinish'), P.removeListener('close', fr), st())
			}
			P.once('finish', Pt)
			function st() {
				;(g('unpipe'), ue.unpipe(P))
			}
			return (
				P.emit('pipe', ue),
				me.flowing || (g('pipe resume'), ue.resume()),
				P
			)
		}))
	function Qe(P) {
		return function () {
			var M = P._readableState
			;(g('pipeOnDrain', M.awaitDrain),
				M.awaitDrain && M.awaitDrain--,
				M.awaitDrain === 0 && n(P, 'data') && ((M.flowing = !0), $(P)))
		}
	}
	;((A.prototype.unpipe = function (P) {
		var M = this._readableState,
			ue = {hasUnpiped: !1}
		if (M.pipesCount === 0) return this
		if (M.pipesCount === 1)
			return P && P !== M.pipes
				? this
				: (P || (P = M.pipes),
					(M.pipes = null),
					(M.pipesCount = 0),
					(M.flowing = !1),
					P && P.emit('unpipe', this, ue),
					this)
		if (!P) {
			var me = M.pipes,
				Ge = M.pipesCount
			;((M.pipes = null), (M.pipesCount = 0), (M.flowing = !1))
			for (var be = 0; be < Ge; be++)
				me[be].emit('unpipe', this, {hasUnpiped: !1})
			return this
		}
		var Te = Je(M.pipes, P)
		return Te === -1
			? this
			: (M.pipes.splice(Te, 1),
				(M.pipesCount -= 1),
				M.pipesCount === 1 && (M.pipes = M.pipes[0]),
				P.emit('unpipe', this, ue),
				this)
	}),
		(A.prototype.on = function (P, M) {
			var ue = i.prototype.on.call(this, P, M)
			if (P === 'data') this._readableState.flowing !== !1 && this.resume()
			else if (P === 'readable') {
				var me = this._readableState
				!me.endEmitted &&
					!me.readableListening &&
					((me.readableListening = me.needReadable = !0),
					(me.emittedReadable = !1),
					me.reading ? me.length && Ne(this) : e.nextTick(pt, this))
			}
			return ue
		}),
		(A.prototype.addListener = A.prototype.on))
	function pt(P) {
		;(g('readable nexttick read 0'), P.read(0))
	}
	A.prototype.resume = function () {
		var P = this._readableState
		return (P.flowing || (g('resume'), (P.flowing = !0), j(this, P)), this)
	}
	function j(P, M) {
		M.resumeScheduled || ((M.resumeScheduled = !0), e.nextTick(G, P, M))
	}
	function G(P, M) {
		;(M.reading || (g('resume read 0'), P.read(0)),
			(M.resumeScheduled = !1),
			(M.awaitDrain = 0),
			P.emit('resume'),
			$(P),
			M.flowing && !M.reading && P.read(0))
	}
	A.prototype.pause = function () {
		return (
			g('call pause flowing=%j', this._readableState.flowing),
			this._readableState.flowing !== !1 &&
				(g('pause'), (this._readableState.flowing = !1), this.emit('pause')),
			this
		)
	}
	function $(P) {
		var M = P._readableState
		for (g('flow', M.flowing); M.flowing && P.read() !== null;);
	}
	;((A.prototype.wrap = function (P) {
		var M = this,
			ue = this._readableState,
			me = !1
		;(P.on('end', function () {
			if ((g('wrapped end'), ue.decoder && !ue.ended)) {
				var Te = ue.decoder.end()
				Te && Te.length && M.push(Te)
			}
			M.push(null)
		}),
			P.on('data', function (Te) {
				if (
					(g('wrapped data'),
					ue.decoder && (Te = ue.decoder.write(Te)),
					!(ue.objectMode && Te == null) &&
						!(!ue.objectMode && (!Te || !Te.length)))
				) {
					var Rt = M.push(Te)
					Rt || ((me = !0), P.pause())
				}
			}))
		for (var Ge in P)
			this[Ge] === void 0 &&
				typeof P[Ge] == 'function' &&
				(this[Ge] = (function (Te) {
					return function () {
						return P[Te].apply(P, arguments)
					}
				})(Ge))
		for (var be = 0; be < x.length; be++)
			P.on(x[be], this.emit.bind(this, x[be]))
		return (
			(this._read = function (Te) {
				;(g('wrapped _read', Te), me && ((me = !1), P.resume()))
			}),
			this
		)
	}),
		Object.defineProperty(A.prototype, 'readableHighWaterMark', {
			enumerable: !1,
			get: function () {
				return this._readableState.highWaterMark
			},
		}),
		(A._fromList = _e))
	function _e(P, M) {
		if (M.length === 0) return null
		var ue
		return (
			M.objectMode
				? (ue = M.buffer.shift())
				: !P || P >= M.length
					? (M.decoder
							? (ue = M.buffer.join(''))
							: M.buffer.length === 1
								? (ue = M.buffer.head.data)
								: (ue = M.buffer.concat(M.length)),
						M.buffer.clear())
					: (ue = Ie(P, M.buffer, M.decoder)),
			ue
		)
	}
	function Ie(P, M, ue) {
		var me
		return (
			P < M.head.data.length
				? ((me = M.head.data.slice(0, P)), (M.head.data = M.head.data.slice(P)))
				: P === M.head.data.length
					? (me = M.shift())
					: (me = ue ? xe(P, M) : ze(P, M)),
			me
		)
	}
	function xe(P, M) {
		var ue = M.head,
			me = 1,
			Ge = ue.data
		for (P -= Ge.length; (ue = ue.next);) {
			var be = ue.data,
				Te = P > be.length ? be.length : P
			if (
				(Te === be.length ? (Ge += be) : (Ge += be.slice(0, P)),
				(P -= Te),
				P === 0)
			) {
				Te === be.length
					? (++me, ue.next ? (M.head = ue.next) : (M.head = M.tail = null))
					: ((M.head = ue), (ue.data = be.slice(Te)))
				break
			}
			++me
		}
		return ((M.length -= me), Ge)
	}
	function ze(P, M) {
		var ue = s.allocUnsafe(P),
			me = M.head,
			Ge = 1
		for (me.data.copy(ue), P -= me.data.length; (me = me.next);) {
			var be = me.data,
				Te = P > be.length ? be.length : P
			if ((be.copy(ue, ue.length - P, 0, Te), (P -= Te), P === 0)) {
				Te === be.length
					? (++Ge, me.next ? (M.head = me.next) : (M.head = M.tail = null))
					: ((M.head = me), (me.data = be.slice(Te)))
				break
			}
			++Ge
		}
		return ((M.length -= Ge), ue)
	}
	function ft(P) {
		var M = P._readableState
		if (M.length > 0)
			throw new Error('"endReadable()" called on non-empty stream')
		M.endEmitted || ((M.ended = !0), e.nextTick(it, M, P))
	}
	function it(P, M) {
		!P.endEmitted &&
			P.length === 0 &&
			((P.endEmitted = !0), (M.readable = !1), M.emit('end'))
	}
	function Je(P, M) {
		for (var ue = 0, me = P.length; ue < me; ue++) if (P[ue] === M) return ue
		return -1
	}
	return af
}
var of, zh
function a_() {
	if (zh) return of
	;((zh = 1), (of = n))
	var e = Xa(),
		t = Object.create(vs())
	;((t.inherits = ps()), t.inherits(n, e))
	function r(l, f) {
		var c = this._transformState
		c.transforming = !1
		var m = c.writecb
		if (!m)
			return this.emit(
				'error',
				new Error('write callback called multiple times'),
			)
		;((c.writechunk = null),
			(c.writecb = null),
			f != null && this.push(f),
			m(l))
		var y = this._readableState
		;((y.reading = !1),
			(y.needReadable || y.length < y.highWaterMark) &&
				this._read(y.highWaterMark))
	}
	function n(l) {
		if (!(this instanceof n)) return new n(l)
		;(e.call(this, l),
			(this._transformState = {
				afterTransform: r.bind(this),
				needTransform: !1,
				transforming: !1,
				writecb: null,
				writechunk: null,
				writeencoding: null,
			}),
			(this._readableState.needReadable = !0),
			(this._readableState.sync = !1),
			l &&
				(typeof l.transform == 'function' && (this._transform = l.transform),
				typeof l.flush == 'function' && (this._flush = l.flush)),
			this.on('prefinish', i))
	}
	function i() {
		var l = this
		typeof this._flush == 'function'
			? this._flush(function (f, c) {
					s(l, f, c)
				})
			: s(this, null, null)
	}
	;((n.prototype.push = function (l, f) {
		return (
			(this._transformState.needTransform = !1),
			e.prototype.push.call(this, l, f)
		)
	}),
		(n.prototype._transform = function (l, f, c) {
			throw new Error('_transform() is not implemented')
		}),
		(n.prototype._write = function (l, f, c) {
			var m = this._transformState
			if (
				((m.writecb = c),
				(m.writechunk = l),
				(m.writeencoding = f),
				!m.transforming)
			) {
				var y = this._readableState
				;(m.needTransform || y.needReadable || y.length < y.highWaterMark) &&
					this._read(y.highWaterMark)
			}
		}),
		(n.prototype._read = function (l) {
			var f = this._transformState
			f.writechunk !== null && f.writecb && !f.transforming
				? ((f.transforming = !0),
					this._transform(f.writechunk, f.writeencoding, f.afterTransform))
				: (f.needTransform = !0)
		}),
		(n.prototype._destroy = function (l, f) {
			var c = this
			e.prototype._destroy.call(this, l, function (m) {
				;(f(m), c.emit('close'))
			})
		}))
	function s(l, f, c) {
		if (f) return l.emit('error', f)
		if ((c != null && l.push(c), l._writableState.length))
			throw new Error('Calling transform done when ws.length != 0')
		if (l._transformState.transforming)
			throw new Error('Calling transform done when still transforming')
		return l.push(null)
	}
	return of
}
var sf, qh
function L1() {
	if (qh) return sf
	;((qh = 1), (sf = r))
	var e = a_(),
		t = Object.create(vs())
	;((t.inherits = ps()), t.inherits(r, e))
	function r(n) {
		if (!(this instanceof r)) return new r(n)
		e.call(this, n)
	}
	return (
		(r.prototype._transform = function (n, i, s) {
			s(null, n)
		}),
		sf
	)
}
var Kh
function o_() {
	return (
		Kh ||
			((Kh = 1),
			(function (e, t) {
				var r = {},
					n = ai
				r.READABLE_STREAM === 'disable' && n
					? ((e.exports = n),
						(t = e.exports = n.Readable),
						(t.Readable = n.Readable),
						(t.Writable = n.Writable),
						(t.Duplex = n.Duplex),
						(t.Transform = n.Transform),
						(t.PassThrough = n.PassThrough),
						(t.Stream = n))
					: ((t = e.exports = i_()),
						(t.Stream = n || t),
						(t.Readable = t),
						(t.Writable = n_()),
						(t.Duplex = Xa()),
						(t.Transform = a_()),
						(t.PassThrough = L1()))
			})(Hs, Hs.exports)),
		Hs.exports
	)
}
var Wh
function Oi() {
	if (Wh) return Gr
	if (
		((Wh = 1),
		(Gr.base64 = !0),
		(Gr.array = !0),
		(Gr.string = !0),
		(Gr.arraybuffer = typeof ArrayBuffer < 'u' && typeof Uint8Array < 'u'),
		(Gr.nodebuffer = typeof Buffer < 'u'),
		(Gr.uint8array = typeof Uint8Array < 'u'),
		typeof ArrayBuffer > 'u')
	)
		Gr.blob = !1
	else {
		var e = new ArrayBuffer(0)
		try {
			Gr.blob = new Blob([e], {type: 'application/zip'}).size === 0
		} catch {
			try {
				var t =
						self.BlobBuilder ||
						self.WebKitBlobBuilder ||
						self.MozBlobBuilder ||
						self.MSBlobBuilder,
					r = new t()
				;(r.append(e), (Gr.blob = r.getBlob('application/zip').size === 0))
			} catch {
				Gr.blob = !1
			}
		}
	}
	try {
		Gr.nodestream = !!o_().Readable
	} catch {
		Gr.nodestream = !1
	}
	return Gr
}
var Xs = {},
	Gh
function s_() {
	if (Gh) return Xs
	Gh = 1
	var e = Zt(),
		t = Oi(),
		r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	return (
		(Xs.encode = function (n) {
			for (
				var i = [],
					s,
					l,
					f,
					c,
					m,
					y,
					g,
					v = 0,
					_ = n.length,
					S = _,
					x = e.getTypeOf(n) !== 'string';
				v < n.length;
			)
				((S = _ - v),
					x
						? ((s = n[v++]), (l = v < _ ? n[v++] : 0), (f = v < _ ? n[v++] : 0))
						: ((s = n.charCodeAt(v++)),
							(l = v < _ ? n.charCodeAt(v++) : 0),
							(f = v < _ ? n.charCodeAt(v++) : 0)),
					(c = s >> 2),
					(m = ((s & 3) << 4) | (l >> 4)),
					(y = S > 1 ? ((l & 15) << 2) | (f >> 6) : 64),
					(g = S > 2 ? f & 63 : 64),
					i.push(r.charAt(c) + r.charAt(m) + r.charAt(y) + r.charAt(g)))
			return i.join('')
		}),
		(Xs.decode = function (n) {
			var i,
				s,
				l,
				f,
				c,
				m,
				y,
				g = 0,
				v = 0,
				_ = 'data:'
			if (n.substr(0, _.length) === _)
				throw new Error('Invalid base64 input, it looks like a data url.')
			n = n.replace(/[^A-Za-z0-9+/=]/g, '')
			var S = (n.length * 3) / 4
			if (
				(n.charAt(n.length - 1) === r.charAt(64) && S--,
				n.charAt(n.length - 2) === r.charAt(64) && S--,
				S % 1 !== 0)
			)
				throw new Error('Invalid base64 input, bad content length.')
			var x
			for (
				t.uint8array ? (x = new Uint8Array(S | 0)) : (x = new Array(S | 0));
				g < n.length;
			)
				((f = r.indexOf(n.charAt(g++))),
					(c = r.indexOf(n.charAt(g++))),
					(m = r.indexOf(n.charAt(g++))),
					(y = r.indexOf(n.charAt(g++))),
					(i = (f << 2) | (c >> 4)),
					(s = ((c & 15) << 4) | (m >> 2)),
					(l = ((m & 3) << 6) | y),
					(x[v++] = i),
					m !== 64 && (x[v++] = s),
					y !== 64 && (x[v++] = l))
			return x
		}),
		Xs
	)
}
var lf, Hh
function Yl() {
	return (
		Hh ||
			((Hh = 1),
			(lf = {
				isNode: typeof Buffer < 'u',
				newBufferFrom: function (e, t) {
					if (Buffer.from && Buffer.from !== Uint8Array.from)
						return Buffer.from(e, t)
					if (typeof e == 'number')
						throw new Error('The "data" argument must not be a number')
					return new Buffer(e, t)
				},
				allocBuffer: function (e) {
					if (Buffer.alloc) return Buffer.alloc(e)
					var t = new Buffer(e)
					return (t.fill(0), t)
				},
				isBuffer: function (e) {
					return Buffer.isBuffer(e)
				},
				isStream: function (e) {
					return (
						e &&
						typeof e.on == 'function' &&
						typeof e.pause == 'function' &&
						typeof e.resume == 'function'
					)
				},
			})),
		lf
	)
}
var uf, $h
function M1() {
	if ($h) return uf
	$h = 1
	var e = br.MutationObserver || br.WebKitMutationObserver,
		t
	if (process.browser)
		if (e) {
			var r = 0,
				n = new e(c),
				i = br.document.createTextNode('')
			;(n.observe(i, {characterData: !0}),
				(t = function () {
					i.data = r = ++r % 2
				}))
		} else if (!br.setImmediate && typeof br.MessageChannel < 'u') {
			var s = new br.MessageChannel()
			;((s.port1.onmessage = c),
				(t = function () {
					s.port2.postMessage(0)
				}))
		} else
			'document' in br &&
			'onreadystatechange' in br.document.createElement('script')
				? (t = function () {
						var y = br.document.createElement('script')
						;((y.onreadystatechange = function () {
							;(c(),
								(y.onreadystatechange = null),
								y.parentNode.removeChild(y),
								(y = null))
						}),
							br.document.documentElement.appendChild(y))
					})
				: (t = function () {
						setTimeout(c, 0)
					})
	else
		t = function () {
			process.nextTick(c)
		}
	var l,
		f = []
	function c() {
		l = !0
		for (var y, g, v = f.length; v;) {
			for (g = f, f = [], y = -1; ++y < v;) g[y]()
			v = f.length
		}
		l = !1
	}
	uf = m
	function m(y) {
		f.push(y) === 1 && !l && t()
	}
	return uf
}
var ff, Vh
function N1() {
	if (Vh) return ff
	Vh = 1
	var e = M1()
	function t() {}
	var r = {},
		n = ['REJECTED'],
		i = ['FULFILLED'],
		s = ['PENDING']
	if (!process.browser) var l = ['UNHANDLED']
	ff = f
	function f(b) {
		if (typeof b != 'function')
			throw new TypeError('resolver must be a function')
		;((this.state = s),
			(this.queue = []),
			(this.outcome = void 0),
			process.browser || (this.handled = l),
			b !== t && g(this, b))
	}
	;((f.prototype.finally = function (b) {
		if (typeof b != 'function') return this
		var A = this.constructor
		return this.then(L, N)
		function L(U) {
			function ee() {
				return U
			}
			return A.resolve(b()).then(ee)
		}
		function N(U) {
			function ee() {
				throw U
			}
			return A.resolve(b()).then(ee)
		}
	}),
		(f.prototype.catch = function (b) {
			return this.then(null, b)
		}),
		(f.prototype.then = function (b, A) {
			if (
				(typeof b != 'function' && this.state === i) ||
				(typeof A != 'function' && this.state === n)
			)
				return this
			var L = new this.constructor(t)
			if (
				(process.browser || (this.handled === l && (this.handled = null)),
				this.state !== s)
			) {
				var N = this.state === i ? b : A
				m(L, N, this.outcome)
			} else this.queue.push(new c(L, b, A))
			return L
		}))
	function c(b, A, L) {
		;((this.promise = b),
			typeof A == 'function' &&
				((this.onFulfilled = A),
				(this.callFulfilled = this.otherCallFulfilled)),
			typeof L == 'function' &&
				((this.onRejected = L), (this.callRejected = this.otherCallRejected)))
	}
	;((c.prototype.callFulfilled = function (b) {
		r.resolve(this.promise, b)
	}),
		(c.prototype.otherCallFulfilled = function (b) {
			m(this.promise, this.onFulfilled, b)
		}),
		(c.prototype.callRejected = function (b) {
			r.reject(this.promise, b)
		}),
		(c.prototype.otherCallRejected = function (b) {
			m(this.promise, this.onRejected, b)
		}))
	function m(b, A, L) {
		e(function () {
			var N
			try {
				N = A(L)
			} catch (U) {
				return r.reject(b, U)
			}
			N === b
				? r.reject(b, new TypeError('Cannot resolve promise with itself'))
				: r.resolve(b, N)
		})
	}
	;((r.resolve = function (b, A) {
		var L = v(y, A)
		if (L.status === 'error') return r.reject(b, L.value)
		var N = L.value
		if (N) g(b, N)
		else {
			;((b.state = i), (b.outcome = A))
			for (var U = -1, ee = b.queue.length; ++U < ee;)
				b.queue[U].callFulfilled(A)
		}
		return b
	}),
		(r.reject = function (b, A) {
			;((b.state = n),
				(b.outcome = A),
				process.browser ||
					(b.handled === l &&
						e(function () {
							b.handled === l && process.emit('unhandledRejection', A, b)
						})))
			for (var L = -1, N = b.queue.length; ++L < N;) b.queue[L].callRejected(A)
			return b
		}))
	function y(b) {
		var A = b && b.then
		if (
			b &&
			(typeof b == 'object' || typeof b == 'function') &&
			typeof A == 'function'
		)
			return function () {
				A.apply(b, arguments)
			}
	}
	function g(b, A) {
		var L = !1
		function N(ve) {
			L || ((L = !0), r.reject(b, ve))
		}
		function U(ve) {
			L || ((L = !0), r.resolve(b, ve))
		}
		function ee() {
			A(U, N)
		}
		var X = v(ee)
		X.status === 'error' && N(X.value)
	}
	function v(b, A) {
		var L = {}
		try {
			;((L.value = b(A)), (L.status = 'success'))
		} catch (N) {
			;((L.status = 'error'), (L.value = N))
		}
		return L
	}
	f.resolve = _
	function _(b) {
		return b instanceof this ? b : r.resolve(new this(t), b)
	}
	f.reject = S
	function S(b) {
		var A = new this(t)
		return r.reject(A, b)
	}
	f.all = x
	function x(b) {
		var A = this
		if (Object.prototype.toString.call(b) !== '[object Array]')
			return this.reject(new TypeError('must be an array'))
		var L = b.length,
			N = !1
		if (!L) return this.resolve([])
		for (var U = new Array(L), ee = 0, X = -1, ve = new this(t); ++X < L;)
			ge(b[X], X)
		return ve
		function ge(ye, Ne) {
			A.resolve(ye).then(je, function (Ee) {
				N || ((N = !0), r.reject(ve, Ee))
			})
			function je(Ee) {
				;((U[Ne] = Ee), ++ee === L && !N && ((N = !0), r.resolve(ve, U)))
			}
		}
	}
	f.race = R
	function R(b) {
		var A = this
		if (Object.prototype.toString.call(b) !== '[object Array]')
			return this.reject(new TypeError('must be an array'))
		var L = b.length,
			N = !1
		if (!L) return this.resolve([])
		for (var U = -1, ee = new this(t); ++U < L;) X(b[U])
		return ee
		function X(ve) {
			A.resolve(ve).then(
				function (ge) {
					N || ((N = !0), r.resolve(ee, ge))
				},
				function (ge) {
					N || ((N = !0), r.reject(ee, ge))
				},
			)
		}
	}
	return ff
}
var cf, Zh
function gs() {
	if (Zh) return cf
	Zh = 1
	var e = null
	return (
		typeof Promise < 'u' ? (e = Promise) : (e = N1()),
		(cf = {Promise: e}),
		cf
	)
}
var df = {},
	Yh
function B1() {
	return (
		Yh ||
			((Yh = 1),
			(function (e, t) {
				if (e.setImmediate) return
				var r = 1,
					n = {},
					i = !1,
					s = e.document,
					l
				function f(A) {
					typeof A != 'function' && (A = new Function('' + A))
					for (
						var L = new Array(arguments.length - 1), N = 0;
						N < L.length;
						N++
					)
						L[N] = arguments[N + 1]
					var U = {callback: A, args: L}
					return ((n[r] = U), l(r), r++)
				}
				function c(A) {
					delete n[A]
				}
				function m(A) {
					var L = A.callback,
						N = A.args
					switch (N.length) {
						case 0:
							L()
							break
						case 1:
							L(N[0])
							break
						case 2:
							L(N[0], N[1])
							break
						case 3:
							L(N[0], N[1], N[2])
							break
						default:
							L.apply(t, N)
							break
					}
				}
				function y(A) {
					if (i) setTimeout(y, 0, A)
					else {
						var L = n[A]
						if (L) {
							i = !0
							try {
								m(L)
							} finally {
								;(c(A), (i = !1))
							}
						}
					}
				}
				function g() {
					l = function (A) {
						process.nextTick(function () {
							y(A)
						})
					}
				}
				function v() {
					if (e.postMessage && !e.importScripts) {
						var A = !0,
							L = e.onmessage
						return (
							(e.onmessage = function () {
								A = !1
							}),
							e.postMessage('', '*'),
							(e.onmessage = L),
							A
						)
					}
				}
				function _() {
					var A = 'setImmediate$' + Math.random() + '$',
						L = function (N) {
							N.source === e &&
								typeof N.data == 'string' &&
								N.data.indexOf(A) === 0 &&
								y(+N.data.slice(A.length))
						}
					;(e.addEventListener
						? e.addEventListener('message', L, !1)
						: e.attachEvent('onmessage', L),
						(l = function (N) {
							e.postMessage(A + N, '*')
						}))
				}
				function S() {
					var A = new MessageChannel()
					;((A.port1.onmessage = function (L) {
						var N = L.data
						y(N)
					}),
						(l = function (L) {
							A.port2.postMessage(L)
						}))
				}
				function x() {
					var A = s.documentElement
					l = function (L) {
						var N = s.createElement('script')
						;((N.onreadystatechange = function () {
							;(y(L),
								(N.onreadystatechange = null),
								A.removeChild(N),
								(N = null))
						}),
							A.appendChild(N))
					}
				}
				function R() {
					l = function (A) {
						setTimeout(y, 0, A)
					}
				}
				var b = Object.getPrototypeOf && Object.getPrototypeOf(e)
				;((b = b && b.setTimeout ? b : e),
					{}.toString.call(e.process) === '[object process]'
						? g()
						: v()
							? _()
							: e.MessageChannel
								? S()
								: s && 'onreadystatechange' in s.createElement('script')
									? x()
									: R(),
					(b.setImmediate = f),
					(b.clearImmediate = c))
			})(typeof self > 'u' ? (typeof br > 'u' ? df : br) : self)),
		df
	)
}
var Xh
function Zt() {
	return (
		Xh ||
			((Xh = 1),
			(function (e) {
				var t = Oi(),
					r = s_(),
					n = Yl(),
					i = gs()
				B1()
				function s(v) {
					var _ = null
					return (
						t.uint8array
							? (_ = new Uint8Array(v.length))
							: (_ = new Array(v.length)),
						f(v, _)
					)
				}
				e.newBlob = function (v, _) {
					e.checkSupport('blob')
					try {
						return new Blob([v], {type: _})
					} catch {
						try {
							var S =
									self.BlobBuilder ||
									self.WebKitBlobBuilder ||
									self.MozBlobBuilder ||
									self.MSBlobBuilder,
								x = new S()
							return (x.append(v), x.getBlob(_))
						} catch {
							throw new Error("Bug : can't construct the Blob.")
						}
					}
				}
				function l(v) {
					return v
				}
				function f(v, _) {
					for (var S = 0; S < v.length; ++S) _[S] = v.charCodeAt(S) & 255
					return _
				}
				var c = {
					stringifyByChunk: function (v, _, S) {
						var x = [],
							R = 0,
							b = v.length
						if (b <= S) return String.fromCharCode.apply(null, v)
						for (; R < b;)
							(_ === 'array' || _ === 'nodebuffer'
								? x.push(
										String.fromCharCode.apply(
											null,
											v.slice(R, Math.min(R + S, b)),
										),
									)
								: x.push(
										String.fromCharCode.apply(
											null,
											v.subarray(R, Math.min(R + S, b)),
										),
									),
								(R += S))
						return x.join('')
					},
					stringifyByChar: function (v) {
						for (var _ = '', S = 0; S < v.length; S++)
							_ += String.fromCharCode(v[S])
						return _
					},
					applyCanBeUsed: {
						uint8array: (function () {
							try {
								return (
									t.uint8array &&
									String.fromCharCode.apply(null, new Uint8Array(1)).length ===
										1
								)
							} catch {
								return !1
							}
						})(),
						nodebuffer: (function () {
							try {
								return (
									t.nodebuffer &&
									String.fromCharCode.apply(null, n.allocBuffer(1)).length === 1
								)
							} catch {
								return !1
							}
						})(),
					},
				}
				function m(v) {
					var _ = 65536,
						S = e.getTypeOf(v),
						x = !0
					if (
						(S === 'uint8array'
							? (x = c.applyCanBeUsed.uint8array)
							: S === 'nodebuffer' && (x = c.applyCanBeUsed.nodebuffer),
						x)
					)
						for (; _ > 1;)
							try {
								return c.stringifyByChunk(v, S, _)
							} catch {
								_ = Math.floor(_ / 2)
							}
					return c.stringifyByChar(v)
				}
				e.applyFromCharCode = m
				function y(v, _) {
					for (var S = 0; S < v.length; S++) _[S] = v[S]
					return _
				}
				var g = {}
				;((g.string = {
					string: l,
					array: function (v) {
						return f(v, new Array(v.length))
					},
					arraybuffer: function (v) {
						return g.string.uint8array(v).buffer
					},
					uint8array: function (v) {
						return f(v, new Uint8Array(v.length))
					},
					nodebuffer: function (v) {
						return f(v, n.allocBuffer(v.length))
					},
				}),
					(g.array = {
						string: m,
						array: l,
						arraybuffer: function (v) {
							return new Uint8Array(v).buffer
						},
						uint8array: function (v) {
							return new Uint8Array(v)
						},
						nodebuffer: function (v) {
							return n.newBufferFrom(v)
						},
					}),
					(g.arraybuffer = {
						string: function (v) {
							return m(new Uint8Array(v))
						},
						array: function (v) {
							return y(new Uint8Array(v), new Array(v.byteLength))
						},
						arraybuffer: l,
						uint8array: function (v) {
							return new Uint8Array(v)
						},
						nodebuffer: function (v) {
							return n.newBufferFrom(new Uint8Array(v))
						},
					}),
					(g.uint8array = {
						string: m,
						array: function (v) {
							return y(v, new Array(v.length))
						},
						arraybuffer: function (v) {
							return v.buffer
						},
						uint8array: l,
						nodebuffer: function (v) {
							return n.newBufferFrom(v)
						},
					}),
					(g.nodebuffer = {
						string: m,
						array: function (v) {
							return y(v, new Array(v.length))
						},
						arraybuffer: function (v) {
							return g.nodebuffer.uint8array(v).buffer
						},
						uint8array: function (v) {
							return y(v, new Uint8Array(v.length))
						},
						nodebuffer: l,
					}),
					(e.transformTo = function (v, _) {
						if ((_ || (_ = ''), !v)) return _
						e.checkSupport(v)
						var S = e.getTypeOf(_),
							x = g[S][v](_)
						return x
					}),
					(e.resolve = function (v) {
						for (var _ = v.split('/'), S = [], x = 0; x < _.length; x++) {
							var R = _[x]
							R === '.' ||
								(R === '' && x !== 0 && x !== _.length - 1) ||
								(R === '..' ? S.pop() : S.push(R))
						}
						return S.join('/')
					}),
					(e.getTypeOf = function (v) {
						if (typeof v == 'string') return 'string'
						if (Object.prototype.toString.call(v) === '[object Array]')
							return 'array'
						if (t.nodebuffer && n.isBuffer(v)) return 'nodebuffer'
						if (t.uint8array && v instanceof Uint8Array) return 'uint8array'
						if (t.arraybuffer && v instanceof ArrayBuffer) return 'arraybuffer'
					}),
					(e.checkSupport = function (v) {
						var _ = t[v.toLowerCase()]
						if (!_) throw new Error(v + ' is not supported by this platform')
					}),
					(e.MAX_VALUE_16BITS = 65535),
					(e.MAX_VALUE_32BITS = -1),
					(e.pretty = function (v) {
						var _ = '',
							S,
							x
						for (x = 0; x < (v || '').length; x++)
							((S = v.charCodeAt(x)),
								(_ +=
									'\\x' + (S < 16 ? '0' : '') + S.toString(16).toUpperCase()))
						return _
					}),
					(e.delay = function (v, _, S) {
						setImmediate(function () {
							v.apply(S || null, _ || [])
						})
					}),
					(e.inherits = function (v, _) {
						var S = function () {}
						;((S.prototype = _.prototype), (v.prototype = new S()))
					}),
					(e.extend = function () {
						var v = {},
							_,
							S
						for (_ = 0; _ < arguments.length; _++)
							for (S in arguments[_])
								Object.prototype.hasOwnProperty.call(arguments[_], S) &&
									typeof v[S] > 'u' &&
									(v[S] = arguments[_][S])
						return v
					}),
					(e.prepareContent = function (v, _, S, x, R) {
						var b = i.Promise.resolve(_).then(function (A) {
							var L =
								t.blob &&
								(A instanceof Blob ||
									['[object File]', '[object Blob]'].indexOf(
										Object.prototype.toString.call(A),
									) !== -1)
							return L && typeof FileReader < 'u'
								? new i.Promise(function (N, U) {
										var ee = new FileReader()
										;((ee.onload = function (X) {
											N(X.target.result)
										}),
											(ee.onerror = function (X) {
												U(X.target.error)
											}),
											ee.readAsArrayBuffer(A))
									})
								: A
						})
						return b.then(function (A) {
							var L = e.getTypeOf(A)
							return L
								? (L === 'arraybuffer'
										? (A = e.transformTo('uint8array', A))
										: L === 'string' &&
											(R ? (A = r.decode(A)) : S && x !== !0 && (A = s(A))),
									A)
								: i.Promise.reject(
										new Error(
											"Can't read the data of '" +
												v +
												"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?",
										),
									)
						})
					}))
			})(Zu)),
		Zu
	)
}
var hf, Qh
function gn() {
	if (Qh) return hf
	Qh = 1
	function e(t) {
		;((this.name = t || 'default'),
			(this.streamInfo = {}),
			(this.generatedError = null),
			(this.extraStreamInfo = {}),
			(this.isPaused = !0),
			(this.isFinished = !1),
			(this.isLocked = !1),
			(this._listeners = {data: [], end: [], error: []}),
			(this.previous = null))
	}
	return (
		(e.prototype = {
			push: function (t) {
				this.emit('data', t)
			},
			end: function () {
				if (this.isFinished) return !1
				this.flush()
				try {
					;(this.emit('end'), this.cleanUp(), (this.isFinished = !0))
				} catch (t) {
					this.emit('error', t)
				}
				return !0
			},
			error: function (t) {
				return this.isFinished
					? !1
					: (this.isPaused
							? (this.generatedError = t)
							: ((this.isFinished = !0),
								this.emit('error', t),
								this.previous && this.previous.error(t),
								this.cleanUp()),
						!0)
			},
			on: function (t, r) {
				return (this._listeners[t].push(r), this)
			},
			cleanUp: function () {
				;((this.streamInfo = this.generatedError = this.extraStreamInfo = null),
					(this._listeners = []))
			},
			emit: function (t, r) {
				if (this._listeners[t])
					for (var n = 0; n < this._listeners[t].length; n++)
						this._listeners[t][n].call(this, r)
			},
			pipe: function (t) {
				return t.registerPrevious(this)
			},
			registerPrevious: function (t) {
				if (this.isLocked)
					throw new Error("The stream '" + this + "' has already been used.")
				;((this.streamInfo = t.streamInfo),
					this.mergeStreamInfo(),
					(this.previous = t))
				var r = this
				return (
					t.on('data', function (n) {
						r.processChunk(n)
					}),
					t.on('end', function () {
						r.end()
					}),
					t.on('error', function (n) {
						r.error(n)
					}),
					this
				)
			},
			pause: function () {
				return this.isPaused || this.isFinished
					? !1
					: ((this.isPaused = !0), this.previous && this.previous.pause(), !0)
			},
			resume: function () {
				if (!this.isPaused || this.isFinished) return !1
				this.isPaused = !1
				var t = !1
				return (
					this.generatedError && (this.error(this.generatedError), (t = !0)),
					this.previous && this.previous.resume(),
					!t
				)
			},
			flush: function () {},
			processChunk: function (t) {
				this.push(t)
			},
			withStreamInfo: function (t, r) {
				return ((this.extraStreamInfo[t] = r), this.mergeStreamInfo(), this)
			},
			mergeStreamInfo: function () {
				for (var t in this.extraStreamInfo)
					Object.prototype.hasOwnProperty.call(this.extraStreamInfo, t) &&
						(this.streamInfo[t] = this.extraStreamInfo[t])
			},
			lock: function () {
				if (this.isLocked)
					throw new Error("The stream '" + this + "' has already been used.")
				;((this.isLocked = !0), this.previous && this.previous.lock())
			},
			toString: function () {
				var t = 'Worker ' + this.name
				return this.previous ? this.previous + ' -> ' + t : t
			},
		}),
		(hf = e),
		hf
	)
}
var Jh
function _s() {
	return (
		Jh ||
			((Jh = 1),
			(function (e) {
				for (
					var t = Zt(), r = Oi(), n = Yl(), i = gn(), s = new Array(256), l = 0;
					l < 256;
					l++
				)
					s[l] =
						l >= 252
							? 6
							: l >= 248
								? 5
								: l >= 240
									? 4
									: l >= 224
										? 3
										: l >= 192
											? 2
											: 1
				s[254] = s[254] = 1
				var f = function (v) {
						var _,
							S,
							x,
							R,
							b,
							A = v.length,
							L = 0
						for (R = 0; R < A; R++)
							((S = v.charCodeAt(R)),
								(S & 64512) === 55296 &&
									R + 1 < A &&
									((x = v.charCodeAt(R + 1)),
									(x & 64512) === 56320 &&
										((S = 65536 + ((S - 55296) << 10) + (x - 56320)), R++)),
								(L += S < 128 ? 1 : S < 2048 ? 2 : S < 65536 ? 3 : 4))
						for (
							r.uint8array ? (_ = new Uint8Array(L)) : (_ = new Array(L)),
								b = 0,
								R = 0;
							b < L;
							R++
						)
							((S = v.charCodeAt(R)),
								(S & 64512) === 55296 &&
									R + 1 < A &&
									((x = v.charCodeAt(R + 1)),
									(x & 64512) === 56320 &&
										((S = 65536 + ((S - 55296) << 10) + (x - 56320)), R++)),
								S < 128
									? (_[b++] = S)
									: S < 2048
										? ((_[b++] = 192 | (S >>> 6)), (_[b++] = 128 | (S & 63)))
										: S < 65536
											? ((_[b++] = 224 | (S >>> 12)),
												(_[b++] = 128 | ((S >>> 6) & 63)),
												(_[b++] = 128 | (S & 63)))
											: ((_[b++] = 240 | (S >>> 18)),
												(_[b++] = 128 | ((S >>> 12) & 63)),
												(_[b++] = 128 | ((S >>> 6) & 63)),
												(_[b++] = 128 | (S & 63))))
						return _
					},
					c = function (v, _) {
						var S
						for (
							_ = _ || v.length, _ > v.length && (_ = v.length), S = _ - 1;
							S >= 0 && (v[S] & 192) === 128;
						)
							S--
						return S < 0 || S === 0 ? _ : S + s[v[S]] > _ ? S : _
					},
					m = function (v) {
						var _,
							S,
							x,
							R,
							b = v.length,
							A = new Array(b * 2)
						for (S = 0, _ = 0; _ < b;) {
							if (((x = v[_++]), x < 128)) {
								A[S++] = x
								continue
							}
							if (((R = s[x]), R > 4)) {
								;((A[S++] = 65533), (_ += R - 1))
								continue
							}
							for (x &= R === 2 ? 31 : R === 3 ? 15 : 7; R > 1 && _ < b;)
								((x = (x << 6) | (v[_++] & 63)), R--)
							if (R > 1) {
								A[S++] = 65533
								continue
							}
							x < 65536
								? (A[S++] = x)
								: ((x -= 65536),
									(A[S++] = 55296 | ((x >> 10) & 1023)),
									(A[S++] = 56320 | (x & 1023)))
						}
						return (
							A.length !== S &&
								(A.subarray ? (A = A.subarray(0, S)) : (A.length = S)),
							t.applyFromCharCode(A)
						)
					}
				;((e.utf8encode = function (_) {
					return r.nodebuffer ? n.newBufferFrom(_, 'utf-8') : f(_)
				}),
					(e.utf8decode = function (_) {
						return r.nodebuffer
							? t.transformTo('nodebuffer', _).toString('utf-8')
							: ((_ = t.transformTo(r.uint8array ? 'uint8array' : 'array', _)),
								m(_))
					}))
				function y() {
					;(i.call(this, 'utf-8 decode'), (this.leftOver = null))
				}
				;(t.inherits(y, i),
					(y.prototype.processChunk = function (v) {
						var _ = t.transformTo(r.uint8array ? 'uint8array' : 'array', v.data)
						if (this.leftOver && this.leftOver.length) {
							if (r.uint8array) {
								var S = _
								;((_ = new Uint8Array(S.length + this.leftOver.length)),
									_.set(this.leftOver, 0),
									_.set(S, this.leftOver.length))
							} else _ = this.leftOver.concat(_)
							this.leftOver = null
						}
						var x = c(_),
							R = _
						;(x !== _.length &&
							(r.uint8array
								? ((R = _.subarray(0, x)),
									(this.leftOver = _.subarray(x, _.length)))
								: ((R = _.slice(0, x)),
									(this.leftOver = _.slice(x, _.length)))),
							this.push({data: e.utf8decode(R), meta: v.meta}))
					}),
					(y.prototype.flush = function () {
						this.leftOver &&
							this.leftOver.length &&
							(this.push({data: e.utf8decode(this.leftOver), meta: {}}),
							(this.leftOver = null))
					}),
					(e.Utf8DecodeWorker = y))
				function g() {
					i.call(this, 'utf-8 encode')
				}
				;(t.inherits(g, i),
					(g.prototype.processChunk = function (v) {
						this.push({data: e.utf8encode(v.data), meta: v.meta})
					}),
					(e.Utf8EncodeWorker = g))
			})(Vu)),
		Vu
	)
}
var vf, ev
function F1() {
	if (ev) return vf
	ev = 1
	var e = gn(),
		t = Zt()
	function r(n) {
		;(e.call(this, 'ConvertWorker to ' + n), (this.destType = n))
	}
	return (
		t.inherits(r, e),
		(r.prototype.processChunk = function (n) {
			this.push({data: t.transformTo(this.destType, n.data), meta: n.meta})
		}),
		(vf = r),
		vf
	)
}
var pf, tv
function j1() {
	if (tv) return pf
	tv = 1
	var e = o_().Readable,
		t = Zt()
	t.inherits(r, e)
	function r(n, i, s) {
		;(e.call(this, i), (this._helper = n))
		var l = this
		n.on('data', function (f, c) {
			;(l.push(f) || l._helper.pause(), s && s(c))
		})
			.on('error', function (f) {
				l.emit('error', f)
			})
			.on('end', function () {
				l.push(null)
			})
	}
	return (
		(r.prototype._read = function () {
			this._helper.resume()
		}),
		(pf = r),
		pf
	)
}
var gf, rv
function l_() {
	if (rv) return gf
	rv = 1
	var e = Zt(),
		t = F1(),
		r = gn(),
		n = s_(),
		i = Oi(),
		s = gs(),
		l = null
	if (i.nodestream)
		try {
			l = j1()
		} catch {}
	function f(g, v, _) {
		switch (g) {
			case 'blob':
				return e.newBlob(e.transformTo('arraybuffer', v), _)
			case 'base64':
				return n.encode(v)
			default:
				return e.transformTo(g, v)
		}
	}
	function c(g, v) {
		var _,
			S = 0,
			x = null,
			R = 0
		for (_ = 0; _ < v.length; _++) R += v[_].length
		switch (g) {
			case 'string':
				return v.join('')
			case 'array':
				return Array.prototype.concat.apply([], v)
			case 'uint8array':
				for (x = new Uint8Array(R), _ = 0; _ < v.length; _++)
					(x.set(v[_], S), (S += v[_].length))
				return x
			case 'nodebuffer':
				return Buffer.concat(v)
			default:
				throw new Error("concat : unsupported type '" + g + "'")
		}
	}
	function m(g, v) {
		return new s.Promise(function (_, S) {
			var x = [],
				R = g._internalType,
				b = g._outputType,
				A = g._mimeType
			g.on('data', function (L, N) {
				;(x.push(L), v && v(N))
			})
				.on('error', function (L) {
					;((x = []), S(L))
				})
				.on('end', function () {
					try {
						var L = f(b, c(R, x), A)
						_(L)
					} catch (N) {
						S(N)
					}
					x = []
				})
				.resume()
		})
	}
	function y(g, v, _) {
		var S = v
		switch (v) {
			case 'blob':
			case 'arraybuffer':
				S = 'uint8array'
				break
			case 'base64':
				S = 'string'
				break
		}
		try {
			;((this._internalType = S),
				(this._outputType = v),
				(this._mimeType = _),
				e.checkSupport(S),
				(this._worker = g.pipe(new t(S))),
				g.lock())
		} catch (x) {
			;((this._worker = new r('error')), this._worker.error(x))
		}
	}
	return (
		(y.prototype = {
			accumulate: function (g) {
				return m(this, g)
			},
			on: function (g, v) {
				var _ = this
				return (
					g === 'data'
						? this._worker.on(g, function (S) {
								v.call(_, S.data, S.meta)
							})
						: this._worker.on(g, function () {
								e.delay(v, arguments, _)
							}),
					this
				)
			},
			resume: function () {
				return (e.delay(this._worker.resume, [], this._worker), this)
			},
			pause: function () {
				return (this._worker.pause(), this)
			},
			toNodejsStream: function (g) {
				if ((e.checkSupport('nodestream'), this._outputType !== 'nodebuffer'))
					throw new Error(this._outputType + ' is not supported by this method')
				return new l(this, {objectMode: this._outputType !== 'nodebuffer'}, g)
			},
		}),
		(gf = y),
		gf
	)
}
var on = {},
	nv
function u_() {
	return (
		nv ||
			((nv = 1),
			(on.base64 = !1),
			(on.binary = !1),
			(on.dir = !1),
			(on.createFolders = !0),
			(on.date = null),
			(on.compression = null),
			(on.compressionOptions = null),
			(on.comment = null),
			(on.unixPermissions = null),
			(on.dosPermissions = null)),
		on
	)
}
var _f, iv
function f_() {
	if (iv) return _f
	iv = 1
	var e = Zt(),
		t = gn(),
		r = 16 * 1024
	function n(i) {
		t.call(this, 'DataWorker')
		var s = this
		;((this.dataIsReady = !1),
			(this.index = 0),
			(this.max = 0),
			(this.data = null),
			(this.type = ''),
			(this._tickScheduled = !1),
			i.then(
				function (l) {
					;((s.dataIsReady = !0),
						(s.data = l),
						(s.max = (l && l.length) || 0),
						(s.type = e.getTypeOf(l)),
						s.isPaused || s._tickAndRepeat())
				},
				function (l) {
					s.error(l)
				},
			))
	}
	return (
		e.inherits(n, t),
		(n.prototype.cleanUp = function () {
			;(t.prototype.cleanUp.call(this), (this.data = null))
		}),
		(n.prototype.resume = function () {
			return t.prototype.resume.call(this)
				? (!this._tickScheduled &&
						this.dataIsReady &&
						((this._tickScheduled = !0),
						e.delay(this._tickAndRepeat, [], this)),
					!0)
				: !1
		}),
		(n.prototype._tickAndRepeat = function () {
			;((this._tickScheduled = !1),
				!(this.isPaused || this.isFinished) &&
					(this._tick(),
					this.isFinished ||
						(e.delay(this._tickAndRepeat, [], this),
						(this._tickScheduled = !0))))
		}),
		(n.prototype._tick = function () {
			if (this.isPaused || this.isFinished) return !1
			var i = r,
				s = null,
				l = Math.min(this.max, this.index + i)
			if (this.index >= this.max) return this.end()
			switch (this.type) {
				case 'string':
					s = this.data.substring(this.index, l)
					break
				case 'uint8array':
					s = this.data.subarray(this.index, l)
					break
				case 'array':
				case 'nodebuffer':
					s = this.data.slice(this.index, l)
					break
			}
			return (
				(this.index = l),
				this.push({
					data: s,
					meta: {percent: this.max ? (this.index / this.max) * 100 : 0},
				})
			)
		}),
		(_f = n),
		_f
	)
}
var mf, av
function Uc() {
	if (av) return mf
	av = 1
	var e = Zt()
	function t() {
		for (var s, l = [], f = 0; f < 256; f++) {
			s = f
			for (var c = 0; c < 8; c++) s = s & 1 ? 3988292384 ^ (s >>> 1) : s >>> 1
			l[f] = s
		}
		return l
	}
	var r = t()
	function n(s, l, f, c) {
		var m = r,
			y = c + f
		s = s ^ -1
		for (var g = c; g < y; g++) s = (s >>> 8) ^ m[(s ^ l[g]) & 255]
		return s ^ -1
	}
	function i(s, l, f, c) {
		var m = r,
			y = c + f
		s = s ^ -1
		for (var g = c; g < y; g++) s = (s >>> 8) ^ m[(s ^ l.charCodeAt(g)) & 255]
		return s ^ -1
	}
	return (
		(mf = function (l, f) {
			if (typeof l > 'u' || !l.length) return 0
			var c = e.getTypeOf(l) !== 'string'
			return c ? n(f | 0, l, l.length, 0) : i(f | 0, l, l.length, 0)
		}),
		mf
	)
}
var yf, ov
function c_() {
	if (ov) return yf
	ov = 1
	var e = gn(),
		t = Uc(),
		r = Zt()
	function n() {
		;(e.call(this, 'Crc32Probe'), this.withStreamInfo('crc32', 0))
	}
	return (
		r.inherits(n, e),
		(n.prototype.processChunk = function (i) {
			;((this.streamInfo.crc32 = t(i.data, this.streamInfo.crc32 || 0)),
				this.push(i))
		}),
		(yf = n),
		yf
	)
}
var bf, sv
function U1() {
	if (sv) return bf
	sv = 1
	var e = Zt(),
		t = gn()
	function r(n) {
		;(t.call(this, 'DataLengthProbe for ' + n),
			(this.propName = n),
			this.withStreamInfo(n, 0))
	}
	return (
		e.inherits(r, t),
		(r.prototype.processChunk = function (n) {
			if (n) {
				var i = this.streamInfo[this.propName] || 0
				this.streamInfo[this.propName] = i + n.data.length
			}
			t.prototype.processChunk.call(this, n)
		}),
		(bf = r),
		bf
	)
}
var wf, lv
function zc() {
	if (lv) return wf
	lv = 1
	var e = gs(),
		t = f_(),
		r = c_(),
		n = U1()
	function i(s, l, f, c, m) {
		;((this.compressedSize = s),
			(this.uncompressedSize = l),
			(this.crc32 = f),
			(this.compression = c),
			(this.compressedContent = m))
	}
	return (
		(i.prototype = {
			getContentWorker: function () {
				var s = new t(e.Promise.resolve(this.compressedContent))
						.pipe(this.compression.uncompressWorker())
						.pipe(new n('data_length')),
					l = this
				return (
					s.on('end', function () {
						if (this.streamInfo.data_length !== l.uncompressedSize)
							throw new Error('Bug : uncompressed data size mismatch')
					}),
					s
				)
			},
			getCompressedWorker: function () {
				return new t(e.Promise.resolve(this.compressedContent))
					.withStreamInfo('compressedSize', this.compressedSize)
					.withStreamInfo('uncompressedSize', this.uncompressedSize)
					.withStreamInfo('crc32', this.crc32)
					.withStreamInfo('compression', this.compression)
			},
		}),
		(i.createWorkerFrom = function (s, l, f) {
			return s
				.pipe(new r())
				.pipe(new n('uncompressedSize'))
				.pipe(l.compressWorker(f))
				.pipe(new n('compressedSize'))
				.withStreamInfo('compression', l)
		}),
		(wf = i),
		wf
	)
}
var Sf, uv
function z1() {
	if (uv) return Sf
	uv = 1
	var e = l_(),
		t = f_(),
		r = _s(),
		n = zc(),
		i = gn(),
		s = function (m, y, g) {
			;((this.name = m),
				(this.dir = g.dir),
				(this.date = g.date),
				(this.comment = g.comment),
				(this.unixPermissions = g.unixPermissions),
				(this.dosPermissions = g.dosPermissions),
				(this._data = y),
				(this._dataBinary = g.binary),
				(this.options = {
					compression: g.compression,
					compressionOptions: g.compressionOptions,
				}))
		}
	s.prototype = {
		internalStream: function (m) {
			var y = null,
				g = 'string'
			try {
				if (!m) throw new Error('No output type specified.')
				g = m.toLowerCase()
				var v = g === 'string' || g === 'text'
				;((g === 'binarystring' || g === 'text') && (g = 'string'),
					(y = this._decompressWorker()))
				var _ = !this._dataBinary
				;(_ && !v && (y = y.pipe(new r.Utf8EncodeWorker())),
					!_ && v && (y = y.pipe(new r.Utf8DecodeWorker())))
			} catch (S) {
				;((y = new i('error')), y.error(S))
			}
			return new e(y, g, '')
		},
		async: function (m, y) {
			return this.internalStream(m).accumulate(y)
		},
		nodeStream: function (m, y) {
			return this.internalStream(m || 'nodebuffer').toNodejsStream(y)
		},
		_compressWorker: function (m, y) {
			if (this._data instanceof n && this._data.compression.magic === m.magic)
				return this._data.getCompressedWorker()
			var g = this._decompressWorker()
			return (
				this._dataBinary || (g = g.pipe(new r.Utf8EncodeWorker())),
				n.createWorkerFrom(g, m, y)
			)
		},
		_decompressWorker: function () {
			return this._data instanceof n
				? this._data.getContentWorker()
				: this._data instanceof i
					? this._data
					: new t(this._data)
		},
	}
	for (
		var l = [
				'asText',
				'asBinary',
				'asNodeBuffer',
				'asUint8Array',
				'asArrayBuffer',
			],
			f = function () {
				throw new Error(
					'This method has been removed in JSZip 3.0, please check the upgrade guide.',
				)
			},
			c = 0;
		c < l.length;
		c++
	)
		s.prototype[l[c]] = f
	return ((Sf = s), Sf)
}
var Ef = {},
	Qs = {},
	To = {},
	kf = {},
	fv
function Di() {
	return (
		fv ||
			((fv = 1),
			(function (e) {
				var t =
					typeof Uint8Array < 'u' &&
					typeof Uint16Array < 'u' &&
					typeof Int32Array < 'u'
				function r(s, l) {
					return Object.prototype.hasOwnProperty.call(s, l)
				}
				;((e.assign = function (s) {
					for (var l = Array.prototype.slice.call(arguments, 1); l.length;) {
						var f = l.shift()
						if (f) {
							if (typeof f != 'object')
								throw new TypeError(f + 'must be non-object')
							for (var c in f) r(f, c) && (s[c] = f[c])
						}
					}
					return s
				}),
					(e.shrinkBuf = function (s, l) {
						return s.length === l
							? s
							: s.subarray
								? s.subarray(0, l)
								: ((s.length = l), s)
					}))
				var n = {
						arraySet: function (s, l, f, c, m) {
							if (l.subarray && s.subarray) {
								s.set(l.subarray(f, f + c), m)
								return
							}
							for (var y = 0; y < c; y++) s[m + y] = l[f + y]
						},
						flattenChunks: function (s) {
							var l, f, c, m, y, g
							for (c = 0, l = 0, f = s.length; l < f; l++) c += s[l].length
							for (
								g = new Uint8Array(c), m = 0, l = 0, f = s.length;
								l < f;
								l++
							)
								((y = s[l]), g.set(y, m), (m += y.length))
							return g
						},
					},
					i = {
						arraySet: function (s, l, f, c, m) {
							for (var y = 0; y < c; y++) s[m + y] = l[f + y]
						},
						flattenChunks: function (s) {
							return [].concat.apply([], s)
						},
					}
				;((e.setTyped = function (s) {
					s
						? ((e.Buf8 = Uint8Array),
							(e.Buf16 = Uint16Array),
							(e.Buf32 = Int32Array),
							e.assign(e, n))
						: ((e.Buf8 = Array),
							(e.Buf16 = Array),
							(e.Buf32 = Array),
							e.assign(e, i))
				}),
					e.setTyped(t))
			})(kf)),
		kf
	)
}
var Oa = {},
	En = {},
	Zi = {},
	cv
function q1() {
	if (cv) return Zi
	cv = 1
	var e = Di(),
		t = 4,
		r = 0,
		n = 1,
		i = 2
	function s(C) {
		for (var se = C.length; --se >= 0;) C[se] = 0
	}
	var l = 0,
		f = 1,
		c = 2,
		m = 3,
		y = 258,
		g = 29,
		v = 256,
		_ = v + 1 + g,
		S = 30,
		x = 19,
		R = 2 * _ + 1,
		b = 15,
		A = 16,
		L = 7,
		N = 256,
		U = 16,
		ee = 17,
		X = 18,
		ve = [
			0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
			5, 5, 5, 0,
		],
		ge = [
			0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
			11, 11, 12, 12, 13, 13,
		],
		ye = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
		Ne = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
		je = 512,
		Ee = new Array((_ + 2) * 2)
	s(Ee)
	var Me = new Array(S * 2)
	s(Me)
	var Qe = new Array(je)
	s(Qe)
	var pt = new Array(y - m + 1)
	s(pt)
	var j = new Array(g)
	s(j)
	var G = new Array(S)
	s(G)
	function $(C, se, we, Pe, z) {
		;((this.static_tree = C),
			(this.extra_bits = se),
			(this.extra_base = we),
			(this.elems = Pe),
			(this.max_length = z),
			(this.has_stree = C && C.length))
	}
	var _e, Ie, xe
	function ze(C, se) {
		;((this.dyn_tree = C), (this.max_code = 0), (this.stat_desc = se))
	}
	function ft(C) {
		return C < 256 ? Qe[C] : Qe[256 + (C >>> 7)]
	}
	function it(C, se) {
		;((C.pending_buf[C.pending++] = se & 255),
			(C.pending_buf[C.pending++] = (se >>> 8) & 255))
	}
	function Je(C, se, we) {
		C.bi_valid > A - we
			? ((C.bi_buf |= (se << C.bi_valid) & 65535),
				it(C, C.bi_buf),
				(C.bi_buf = se >> (A - C.bi_valid)),
				(C.bi_valid += we - A))
			: ((C.bi_buf |= (se << C.bi_valid) & 65535), (C.bi_valid += we))
	}
	function P(C, se, we) {
		Je(C, we[se * 2], we[se * 2 + 1])
	}
	function M(C, se) {
		var we = 0
		do ((we |= C & 1), (C >>>= 1), (we <<= 1))
		while (--se > 0)
		return we >>> 1
	}
	function ue(C) {
		C.bi_valid === 16
			? (it(C, C.bi_buf), (C.bi_buf = 0), (C.bi_valid = 0))
			: C.bi_valid >= 8 &&
				((C.pending_buf[C.pending++] = C.bi_buf & 255),
				(C.bi_buf >>= 8),
				(C.bi_valid -= 8))
	}
	function me(C, se) {
		var we = se.dyn_tree,
			Pe = se.max_code,
			z = se.stat_desc.static_tree,
			re = se.stat_desc.has_stree,
			E = se.stat_desc.extra_bits,
			he = se.stat_desc.extra_base,
			Ve = se.stat_desc.max_length,
			d,
			Y,
			Q,
			T,
			F,
			Z,
			Ue = 0
		for (T = 0; T <= b; T++) C.bl_count[T] = 0
		for (we[C.heap[C.heap_max] * 2 + 1] = 0, d = C.heap_max + 1; d < R; d++)
			((Y = C.heap[d]),
				(T = we[we[Y * 2 + 1] * 2 + 1] + 1),
				T > Ve && ((T = Ve), Ue++),
				(we[Y * 2 + 1] = T),
				!(Y > Pe) &&
					(C.bl_count[T]++,
					(F = 0),
					Y >= he && (F = E[Y - he]),
					(Z = we[Y * 2]),
					(C.opt_len += Z * (T + F)),
					re && (C.static_len += Z * (z[Y * 2 + 1] + F))))
		if (Ue !== 0) {
			do {
				for (T = Ve - 1; C.bl_count[T] === 0;) T--
				;(C.bl_count[T]--,
					(C.bl_count[T + 1] += 2),
					C.bl_count[Ve]--,
					(Ue -= 2))
			} while (Ue > 0)
			for (T = Ve; T !== 0; T--)
				for (Y = C.bl_count[T]; Y !== 0;)
					((Q = C.heap[--d]),
						!(Q > Pe) &&
							(we[Q * 2 + 1] !== T &&
								((C.opt_len += (T - we[Q * 2 + 1]) * we[Q * 2]),
								(we[Q * 2 + 1] = T)),
							Y--))
		}
	}
	function Ge(C, se, we) {
		var Pe = new Array(b + 1),
			z = 0,
			re,
			E
		for (re = 1; re <= b; re++) Pe[re] = z = (z + we[re - 1]) << 1
		for (E = 0; E <= se; E++) {
			var he = C[E * 2 + 1]
			he !== 0 && (C[E * 2] = M(Pe[he]++, he))
		}
	}
	function be() {
		var C,
			se,
			we,
			Pe,
			z,
			re = new Array(b + 1)
		for (we = 0, Pe = 0; Pe < g - 1; Pe++)
			for (j[Pe] = we, C = 0; C < 1 << ve[Pe]; C++) pt[we++] = Pe
		for (pt[we - 1] = Pe, z = 0, Pe = 0; Pe < 16; Pe++)
			for (G[Pe] = z, C = 0; C < 1 << ge[Pe]; C++) Qe[z++] = Pe
		for (z >>= 7; Pe < S; Pe++)
			for (G[Pe] = z << 7, C = 0; C < 1 << (ge[Pe] - 7); C++) Qe[256 + z++] = Pe
		for (se = 0; se <= b; se++) re[se] = 0
		for (C = 0; C <= 143;) ((Ee[C * 2 + 1] = 8), C++, re[8]++)
		for (; C <= 255;) ((Ee[C * 2 + 1] = 9), C++, re[9]++)
		for (; C <= 279;) ((Ee[C * 2 + 1] = 7), C++, re[7]++)
		for (; C <= 287;) ((Ee[C * 2 + 1] = 8), C++, re[8]++)
		for (Ge(Ee, _ + 1, re), C = 0; C < S; C++)
			((Me[C * 2 + 1] = 5), (Me[C * 2] = M(C, 5)))
		;((_e = new $(Ee, ve, v + 1, _, b)),
			(Ie = new $(Me, ge, 0, S, b)),
			(xe = new $(new Array(0), ye, 0, x, L)))
	}
	function Te(C) {
		var se
		for (se = 0; se < _; se++) C.dyn_ltree[se * 2] = 0
		for (se = 0; se < S; se++) C.dyn_dtree[se * 2] = 0
		for (se = 0; se < x; se++) C.bl_tree[se * 2] = 0
		;((C.dyn_ltree[N * 2] = 1),
			(C.opt_len = C.static_len = 0),
			(C.last_lit = C.matches = 0))
	}
	function Rt(C) {
		;(C.bi_valid > 8
			? it(C, C.bi_buf)
			: C.bi_valid > 0 && (C.pending_buf[C.pending++] = C.bi_buf),
			(C.bi_buf = 0),
			(C.bi_valid = 0))
	}
	function Ct(C, se, we, Pe) {
		;(Rt(C),
			it(C, we),
			it(C, ~we),
			e.arraySet(C.pending_buf, C.window, se, we, C.pending),
			(C.pending += we))
	}
	function kt(C, se, we, Pe) {
		var z = se * 2,
			re = we * 2
		return C[z] < C[re] || (C[z] === C[re] && Pe[se] <= Pe[we])
	}
	function _t(C, se, we) {
		for (
			var Pe = C.heap[we], z = we << 1;
			z <= C.heap_len &&
			(z < C.heap_len && kt(se, C.heap[z + 1], C.heap[z], C.depth) && z++,
			!kt(se, Pe, C.heap[z], C.depth));
		)
			((C.heap[we] = C.heap[z]), (we = z), (z <<= 1))
		C.heap[we] = Pe
	}
	function tt(C, se, we) {
		var Pe,
			z,
			re = 0,
			E,
			he
		if (C.last_lit !== 0)
			do
				((Pe =
					(C.pending_buf[C.d_buf + re * 2] << 8) |
					C.pending_buf[C.d_buf + re * 2 + 1]),
					(z = C.pending_buf[C.l_buf + re]),
					re++,
					Pe === 0
						? P(C, z, se)
						: ((E = pt[z]),
							P(C, E + v + 1, se),
							(he = ve[E]),
							he !== 0 && ((z -= j[E]), Je(C, z, he)),
							Pe--,
							(E = ft(Pe)),
							P(C, E, we),
							(he = ge[E]),
							he !== 0 && ((Pe -= G[E]), Je(C, Pe, he))))
			while (re < C.last_lit)
		P(C, N, se)
	}
	function Oe(C, se) {
		var we = se.dyn_tree,
			Pe = se.stat_desc.static_tree,
			z = se.stat_desc.has_stree,
			re = se.stat_desc.elems,
			E,
			he,
			Ve = -1,
			d
		for (C.heap_len = 0, C.heap_max = R, E = 0; E < re; E++)
			we[E * 2] !== 0
				? ((C.heap[++C.heap_len] = Ve = E), (C.depth[E] = 0))
				: (we[E * 2 + 1] = 0)
		for (; C.heap_len < 2;)
			((d = C.heap[++C.heap_len] = Ve < 2 ? ++Ve : 0),
				(we[d * 2] = 1),
				(C.depth[d] = 0),
				C.opt_len--,
				z && (C.static_len -= Pe[d * 2 + 1]))
		for (se.max_code = Ve, E = C.heap_len >> 1; E >= 1; E--) _t(C, we, E)
		d = re
		do
			((E = C.heap[1]),
				(C.heap[1] = C.heap[C.heap_len--]),
				_t(C, we, 1),
				(he = C.heap[1]),
				(C.heap[--C.heap_max] = E),
				(C.heap[--C.heap_max] = he),
				(we[d * 2] = we[E * 2] + we[he * 2]),
				(C.depth[d] =
					(C.depth[E] >= C.depth[he] ? C.depth[E] : C.depth[he]) + 1),
				(we[E * 2 + 1] = we[he * 2 + 1] = d),
				(C.heap[1] = d++),
				_t(C, we, 1))
		while (C.heap_len >= 2)
		;((C.heap[--C.heap_max] = C.heap[1]), me(C, se), Ge(we, Ve, C.bl_count))
	}
	function er(C, se, we) {
		var Pe,
			z = -1,
			re,
			E = se[1],
			he = 0,
			Ve = 7,
			d = 4
		for (
			E === 0 && ((Ve = 138), (d = 3)), se[(we + 1) * 2 + 1] = 65535, Pe = 0;
			Pe <= we;
			Pe++
		)
			((re = E),
				(E = se[(Pe + 1) * 2 + 1]),
				!(++he < Ve && re === E) &&
					(he < d
						? (C.bl_tree[re * 2] += he)
						: re !== 0
							? (re !== z && C.bl_tree[re * 2]++, C.bl_tree[U * 2]++)
							: he <= 10
								? C.bl_tree[ee * 2]++
								: C.bl_tree[X * 2]++,
					(he = 0),
					(z = re),
					E === 0
						? ((Ve = 138), (d = 3))
						: re === E
							? ((Ve = 6), (d = 3))
							: ((Ve = 7), (d = 4))))
	}
	function fr(C, se, we) {
		var Pe,
			z = -1,
			re,
			E = se[1],
			he = 0,
			Ve = 7,
			d = 4
		for (E === 0 && ((Ve = 138), (d = 3)), Pe = 0; Pe <= we; Pe++)
			if (((re = E), (E = se[(Pe + 1) * 2 + 1]), !(++he < Ve && re === E))) {
				if (he < d)
					do P(C, re, C.bl_tree)
					while (--he !== 0)
				else
					re !== 0
						? (re !== z && (P(C, re, C.bl_tree), he--),
							P(C, U, C.bl_tree),
							Je(C, he - 3, 2))
						: he <= 10
							? (P(C, ee, C.bl_tree), Je(C, he - 3, 3))
							: (P(C, X, C.bl_tree), Je(C, he - 11, 7))
				;((he = 0),
					(z = re),
					E === 0
						? ((Ve = 138), (d = 3))
						: re === E
							? ((Ve = 6), (d = 3))
							: ((Ve = 7), (d = 4)))
			}
	}
	function Pt(C) {
		var se
		for (
			er(C, C.dyn_ltree, C.l_desc.max_code),
				er(C, C.dyn_dtree, C.d_desc.max_code),
				Oe(C, C.bl_desc),
				se = x - 1;
			se >= 3 && C.bl_tree[Ne[se] * 2 + 1] === 0;
			se--
		);
		return ((C.opt_len += 3 * (se + 1) + 5 + 5 + 4), se)
	}
	function st(C, se, we, Pe) {
		var z
		for (
			Je(C, se - 257, 5), Je(C, we - 1, 5), Je(C, Pe - 4, 4), z = 0;
			z < Pe;
			z++
		)
			Je(C, C.bl_tree[Ne[z] * 2 + 1], 3)
		;(fr(C, C.dyn_ltree, se - 1), fr(C, C.dyn_dtree, we - 1))
	}
	function Ft(C) {
		var se = 4093624447,
			we
		for (we = 0; we <= 31; we++, se >>>= 1)
			if (se & 1 && C.dyn_ltree[we * 2] !== 0) return r
		if (C.dyn_ltree[18] !== 0 || C.dyn_ltree[20] !== 0 || C.dyn_ltree[26] !== 0)
			return n
		for (we = 32; we < v; we++) if (C.dyn_ltree[we * 2] !== 0) return n
		return r
	}
	var jt = !1
	function cr(C) {
		;(jt || (be(), (jt = !0)),
			(C.l_desc = new ze(C.dyn_ltree, _e)),
			(C.d_desc = new ze(C.dyn_dtree, Ie)),
			(C.bl_desc = new ze(C.bl_tree, xe)),
			(C.bi_buf = 0),
			(C.bi_valid = 0),
			Te(C))
	}
	function zr(C, se, we, Pe) {
		;(Je(C, (l << 1) + (Pe ? 1 : 0), 3), Ct(C, se, we))
	}
	function Lt(C) {
		;(Je(C, f << 1, 3), P(C, N, Ee), ue(C))
	}
	function dr(C, se, we, Pe) {
		var z,
			re,
			E = 0
		;(C.level > 0
			? (C.strm.data_type === i && (C.strm.data_type = Ft(C)),
				Oe(C, C.l_desc),
				Oe(C, C.d_desc),
				(E = Pt(C)),
				(z = (C.opt_len + 3 + 7) >>> 3),
				(re = (C.static_len + 3 + 7) >>> 3),
				re <= z && (z = re))
			: (z = re = we + 5),
			we + 4 <= z && se !== -1
				? zr(C, se, we, Pe)
				: C.strategy === t || re === z
					? (Je(C, (f << 1) + (Pe ? 1 : 0), 3), tt(C, Ee, Me))
					: (Je(C, (c << 1) + (Pe ? 1 : 0), 3),
						st(C, C.l_desc.max_code + 1, C.d_desc.max_code + 1, E + 1),
						tt(C, C.dyn_ltree, C.dyn_dtree)),
			Te(C),
			Pe && Rt(C))
	}
	function Dn(C, se, we) {
		return (
			(C.pending_buf[C.d_buf + C.last_lit * 2] = (se >>> 8) & 255),
			(C.pending_buf[C.d_buf + C.last_lit * 2 + 1] = se & 255),
			(C.pending_buf[C.l_buf + C.last_lit] = we & 255),
			C.last_lit++,
			se === 0
				? C.dyn_ltree[we * 2]++
				: (C.matches++,
					se--,
					C.dyn_ltree[(pt[we] + v + 1) * 2]++,
					C.dyn_dtree[ft(se) * 2]++),
			C.last_lit === C.lit_bufsize - 1
		)
	}
	return (
		(Zi._tr_init = cr),
		(Zi._tr_stored_block = zr),
		(Zi._tr_flush_block = dr),
		(Zi._tr_tally = Dn),
		(Zi._tr_align = Lt),
		Zi
	)
}
var xf, dv
function d_() {
	if (dv) return xf
	dv = 1
	function e(t, r, n, i) {
		for (
			var s = (t & 65535) | 0, l = ((t >>> 16) & 65535) | 0, f = 0;
			n !== 0;
		) {
			;((f = n > 2e3 ? 2e3 : n), (n -= f))
			do ((s = (s + r[i++]) | 0), (l = (l + s) | 0))
			while (--f)
			;((s %= 65521), (l %= 65521))
		}
		return s | (l << 16) | 0
	}
	return ((xf = e), xf)
}
var Af, hv
function h_() {
	if (hv) return Af
	hv = 1
	function e() {
		for (var n, i = [], s = 0; s < 256; s++) {
			n = s
			for (var l = 0; l < 8; l++) n = n & 1 ? 3988292384 ^ (n >>> 1) : n >>> 1
			i[s] = n
		}
		return i
	}
	var t = e()
	function r(n, i, s, l) {
		var f = t,
			c = l + s
		n ^= -1
		for (var m = l; m < c; m++) n = (n >>> 8) ^ f[(n ^ i[m]) & 255]
		return n ^ -1
	}
	return ((Af = r), Af)
}
var Tf, vv
function qc() {
	return (
		vv ||
			((vv = 1),
			(Tf = {
				2: 'need dictionary',
				1: 'stream end',
				0: '',
				'-1': 'file error',
				'-2': 'stream error',
				'-3': 'data error',
				'-4': 'insufficient memory',
				'-5': 'buffer error',
				'-6': 'incompatible version',
			})),
		Tf
	)
}
var pv
function K1() {
	if (pv) return En
	pv = 1
	var e = Di(),
		t = q1(),
		r = d_(),
		n = h_(),
		i = qc(),
		s = 0,
		l = 1,
		f = 3,
		c = 4,
		m = 5,
		y = 0,
		g = 1,
		v = -2,
		_ = -3,
		S = -5,
		x = -1,
		R = 1,
		b = 2,
		A = 3,
		L = 4,
		N = 0,
		U = 2,
		ee = 8,
		X = 9,
		ve = 15,
		ge = 8,
		ye = 29,
		Ne = 256,
		je = Ne + 1 + ye,
		Ee = 30,
		Me = 19,
		Qe = 2 * je + 1,
		pt = 15,
		j = 3,
		G = 258,
		$ = G + j + 1,
		_e = 32,
		Ie = 42,
		xe = 69,
		ze = 73,
		ft = 91,
		it = 103,
		Je = 113,
		P = 666,
		M = 1,
		ue = 2,
		me = 3,
		Ge = 4,
		be = 3
	function Te(d, Y) {
		return ((d.msg = i[Y]), Y)
	}
	function Rt(d) {
		return (d << 1) - (d > 4 ? 9 : 0)
	}
	function Ct(d) {
		for (var Y = d.length; --Y >= 0;) d[Y] = 0
	}
	function kt(d) {
		var Y = d.state,
			Q = Y.pending
		;(Q > d.avail_out && (Q = d.avail_out),
			Q !== 0 &&
				(e.arraySet(d.output, Y.pending_buf, Y.pending_out, Q, d.next_out),
				(d.next_out += Q),
				(Y.pending_out += Q),
				(d.total_out += Q),
				(d.avail_out -= Q),
				(Y.pending -= Q),
				Y.pending === 0 && (Y.pending_out = 0)))
	}
	function _t(d, Y) {
		;(t._tr_flush_block(
			d,
			d.block_start >= 0 ? d.block_start : -1,
			d.strstart - d.block_start,
			Y,
		),
			(d.block_start = d.strstart),
			kt(d.strm))
	}
	function tt(d, Y) {
		d.pending_buf[d.pending++] = Y
	}
	function Oe(d, Y) {
		;((d.pending_buf[d.pending++] = (Y >>> 8) & 255),
			(d.pending_buf[d.pending++] = Y & 255))
	}
	function er(d, Y, Q, T) {
		var F = d.avail_in
		return (
			F > T && (F = T),
			F === 0
				? 0
				: ((d.avail_in -= F),
					e.arraySet(Y, d.input, d.next_in, F, Q),
					d.state.wrap === 1
						? (d.adler = r(d.adler, Y, F, Q))
						: d.state.wrap === 2 && (d.adler = n(d.adler, Y, F, Q)),
					(d.next_in += F),
					(d.total_in += F),
					F)
		)
	}
	function fr(d, Y) {
		var Q = d.max_chain_length,
			T = d.strstart,
			F,
			Z,
			Ue = d.prev_length,
			Ae = d.nice_match,
			Le = d.strstart > d.w_size - $ ? d.strstart - (d.w_size - $) : 0,
			vt = d.window,
			Yt = d.w_mask,
			ke = d.prev,
			ht = d.strstart + G,
			xt = vt[T + Ue - 1],
			Kt = vt[T + Ue]
		;(d.prev_length >= d.good_match && (Q >>= 2),
			Ae > d.lookahead && (Ae = d.lookahead))
		do
			if (
				((F = Y),
				!(
					vt[F + Ue] !== Kt ||
					vt[F + Ue - 1] !== xt ||
					vt[F] !== vt[T] ||
					vt[++F] !== vt[T + 1]
				))
			) {
				;((T += 2), F++)
				do;
				while (
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					vt[++T] === vt[++F] &&
					T < ht
				)
				if (((Z = G - (ht - T)), (T = ht - G), Z > Ue)) {
					if (((d.match_start = Y), (Ue = Z), Z >= Ae)) break
					;((xt = vt[T + Ue - 1]), (Kt = vt[T + Ue]))
				}
			}
		while ((Y = ke[Y & Yt]) > Le && --Q !== 0)
		return Ue <= d.lookahead ? Ue : d.lookahead
	}
	function Pt(d) {
		var Y = d.w_size,
			Q,
			T,
			F,
			Z,
			Ue
		do {
			if (
				((Z = d.window_size - d.lookahead - d.strstart),
				d.strstart >= Y + (Y - $))
			) {
				;(e.arraySet(d.window, d.window, Y, Y, 0),
					(d.match_start -= Y),
					(d.strstart -= Y),
					(d.block_start -= Y),
					(T = d.hash_size),
					(Q = T))
				do ((F = d.head[--Q]), (d.head[Q] = F >= Y ? F - Y : 0))
				while (--T)
				;((T = Y), (Q = T))
				do ((F = d.prev[--Q]), (d.prev[Q] = F >= Y ? F - Y : 0))
				while (--T)
				Z += Y
			}
			if (d.strm.avail_in === 0) break
			if (
				((T = er(d.strm, d.window, d.strstart + d.lookahead, Z)),
				(d.lookahead += T),
				d.lookahead + d.insert >= j)
			)
				for (
					Ue = d.strstart - d.insert,
						d.ins_h = d.window[Ue],
						d.ins_h =
							((d.ins_h << d.hash_shift) ^ d.window[Ue + 1]) & d.hash_mask;
					d.insert &&
					((d.ins_h =
						((d.ins_h << d.hash_shift) ^ d.window[Ue + j - 1]) & d.hash_mask),
					(d.prev[Ue & d.w_mask] = d.head[d.ins_h]),
					(d.head[d.ins_h] = Ue),
					Ue++,
					d.insert--,
					!(d.lookahead + d.insert < j));
				);
		} while (d.lookahead < $ && d.strm.avail_in !== 0)
	}
	function st(d, Y) {
		var Q = 65535
		for (Q > d.pending_buf_size - 5 && (Q = d.pending_buf_size - 5); ;) {
			if (d.lookahead <= 1) {
				if ((Pt(d), d.lookahead === 0 && Y === s)) return M
				if (d.lookahead === 0) break
			}
			;((d.strstart += d.lookahead), (d.lookahead = 0))
			var T = d.block_start + Q
			if (
				((d.strstart === 0 || d.strstart >= T) &&
					((d.lookahead = d.strstart - T),
					(d.strstart = T),
					_t(d, !1),
					d.strm.avail_out === 0)) ||
				(d.strstart - d.block_start >= d.w_size - $ &&
					(_t(d, !1), d.strm.avail_out === 0))
			)
				return M
		}
		return (
			(d.insert = 0),
			Y === c
				? (_t(d, !0), d.strm.avail_out === 0 ? me : Ge)
				: (d.strstart > d.block_start && (_t(d, !1), d.strm.avail_out === 0), M)
		)
	}
	function Ft(d, Y) {
		for (var Q, T; ;) {
			if (d.lookahead < $) {
				if ((Pt(d), d.lookahead < $ && Y === s)) return M
				if (d.lookahead === 0) break
			}
			if (
				((Q = 0),
				d.lookahead >= j &&
					((d.ins_h =
						((d.ins_h << d.hash_shift) ^ d.window[d.strstart + j - 1]) &
						d.hash_mask),
					(Q = d.prev[d.strstart & d.w_mask] = d.head[d.ins_h]),
					(d.head[d.ins_h] = d.strstart)),
				Q !== 0 &&
					d.strstart - Q <= d.w_size - $ &&
					(d.match_length = fr(d, Q)),
				d.match_length >= j)
			)
				if (
					((T = t._tr_tally(d, d.strstart - d.match_start, d.match_length - j)),
					(d.lookahead -= d.match_length),
					d.match_length <= d.max_lazy_match && d.lookahead >= j)
				) {
					d.match_length--
					do
						(d.strstart++,
							(d.ins_h =
								((d.ins_h << d.hash_shift) ^ d.window[d.strstart + j - 1]) &
								d.hash_mask),
							(Q = d.prev[d.strstart & d.w_mask] = d.head[d.ins_h]),
							(d.head[d.ins_h] = d.strstart))
					while (--d.match_length !== 0)
					d.strstart++
				} else
					((d.strstart += d.match_length),
						(d.match_length = 0),
						(d.ins_h = d.window[d.strstart]),
						(d.ins_h =
							((d.ins_h << d.hash_shift) ^ d.window[d.strstart + 1]) &
							d.hash_mask))
			else
				((T = t._tr_tally(d, 0, d.window[d.strstart])),
					d.lookahead--,
					d.strstart++)
			if (T && (_t(d, !1), d.strm.avail_out === 0)) return M
		}
		return (
			(d.insert = d.strstart < j - 1 ? d.strstart : j - 1),
			Y === c
				? (_t(d, !0), d.strm.avail_out === 0 ? me : Ge)
				: d.last_lit && (_t(d, !1), d.strm.avail_out === 0)
					? M
					: ue
		)
	}
	function jt(d, Y) {
		for (var Q, T, F; ;) {
			if (d.lookahead < $) {
				if ((Pt(d), d.lookahead < $ && Y === s)) return M
				if (d.lookahead === 0) break
			}
			if (
				((Q = 0),
				d.lookahead >= j &&
					((d.ins_h =
						((d.ins_h << d.hash_shift) ^ d.window[d.strstart + j - 1]) &
						d.hash_mask),
					(Q = d.prev[d.strstart & d.w_mask] = d.head[d.ins_h]),
					(d.head[d.ins_h] = d.strstart)),
				(d.prev_length = d.match_length),
				(d.prev_match = d.match_start),
				(d.match_length = j - 1),
				Q !== 0 &&
					d.prev_length < d.max_lazy_match &&
					d.strstart - Q <= d.w_size - $ &&
					((d.match_length = fr(d, Q)),
					d.match_length <= 5 &&
						(d.strategy === R ||
							(d.match_length === j && d.strstart - d.match_start > 4096)) &&
						(d.match_length = j - 1)),
				d.prev_length >= j && d.match_length <= d.prev_length)
			) {
				;((F = d.strstart + d.lookahead - j),
					(T = t._tr_tally(
						d,
						d.strstart - 1 - d.prev_match,
						d.prev_length - j,
					)),
					(d.lookahead -= d.prev_length - 1),
					(d.prev_length -= 2))
				do
					++d.strstart <= F &&
						((d.ins_h =
							((d.ins_h << d.hash_shift) ^ d.window[d.strstart + j - 1]) &
							d.hash_mask),
						(Q = d.prev[d.strstart & d.w_mask] = d.head[d.ins_h]),
						(d.head[d.ins_h] = d.strstart))
				while (--d.prev_length !== 0)
				if (
					((d.match_available = 0),
					(d.match_length = j - 1),
					d.strstart++,
					T && (_t(d, !1), d.strm.avail_out === 0))
				)
					return M
			} else if (d.match_available) {
				if (
					((T = t._tr_tally(d, 0, d.window[d.strstart - 1])),
					T && _t(d, !1),
					d.strstart++,
					d.lookahead--,
					d.strm.avail_out === 0)
				)
					return M
			} else ((d.match_available = 1), d.strstart++, d.lookahead--)
		}
		return (
			d.match_available &&
				((T = t._tr_tally(d, 0, d.window[d.strstart - 1])),
				(d.match_available = 0)),
			(d.insert = d.strstart < j - 1 ? d.strstart : j - 1),
			Y === c
				? (_t(d, !0), d.strm.avail_out === 0 ? me : Ge)
				: d.last_lit && (_t(d, !1), d.strm.avail_out === 0)
					? M
					: ue
		)
	}
	function cr(d, Y) {
		for (var Q, T, F, Z, Ue = d.window; ;) {
			if (d.lookahead <= G) {
				if ((Pt(d), d.lookahead <= G && Y === s)) return M
				if (d.lookahead === 0) break
			}
			if (
				((d.match_length = 0),
				d.lookahead >= j &&
					d.strstart > 0 &&
					((F = d.strstart - 1),
					(T = Ue[F]),
					T === Ue[++F] && T === Ue[++F] && T === Ue[++F]))
			) {
				Z = d.strstart + G
				do;
				while (
					T === Ue[++F] &&
					T === Ue[++F] &&
					T === Ue[++F] &&
					T === Ue[++F] &&
					T === Ue[++F] &&
					T === Ue[++F] &&
					T === Ue[++F] &&
					T === Ue[++F] &&
					F < Z
				)
				;((d.match_length = G - (Z - F)),
					d.match_length > d.lookahead && (d.match_length = d.lookahead))
			}
			if (
				(d.match_length >= j
					? ((Q = t._tr_tally(d, 1, d.match_length - j)),
						(d.lookahead -= d.match_length),
						(d.strstart += d.match_length),
						(d.match_length = 0))
					: ((Q = t._tr_tally(d, 0, d.window[d.strstart])),
						d.lookahead--,
						d.strstart++),
				Q && (_t(d, !1), d.strm.avail_out === 0))
			)
				return M
		}
		return (
			(d.insert = 0),
			Y === c
				? (_t(d, !0), d.strm.avail_out === 0 ? me : Ge)
				: d.last_lit && (_t(d, !1), d.strm.avail_out === 0)
					? M
					: ue
		)
	}
	function zr(d, Y) {
		for (var Q; ;) {
			if (d.lookahead === 0 && (Pt(d), d.lookahead === 0)) {
				if (Y === s) return M
				break
			}
			if (
				((d.match_length = 0),
				(Q = t._tr_tally(d, 0, d.window[d.strstart])),
				d.lookahead--,
				d.strstart++,
				Q && (_t(d, !1), d.strm.avail_out === 0))
			)
				return M
		}
		return (
			(d.insert = 0),
			Y === c
				? (_t(d, !0), d.strm.avail_out === 0 ? me : Ge)
				: d.last_lit && (_t(d, !1), d.strm.avail_out === 0)
					? M
					: ue
		)
	}
	function Lt(d, Y, Q, T, F) {
		;((this.good_length = d),
			(this.max_lazy = Y),
			(this.nice_length = Q),
			(this.max_chain = T),
			(this.func = F))
	}
	var dr
	dr = [
		new Lt(0, 0, 0, 0, st),
		new Lt(4, 4, 8, 4, Ft),
		new Lt(4, 5, 16, 8, Ft),
		new Lt(4, 6, 32, 32, Ft),
		new Lt(4, 4, 16, 16, jt),
		new Lt(8, 16, 32, 32, jt),
		new Lt(8, 16, 128, 128, jt),
		new Lt(8, 32, 128, 256, jt),
		new Lt(32, 128, 258, 1024, jt),
		new Lt(32, 258, 258, 4096, jt),
	]
	function Dn(d) {
		;((d.window_size = 2 * d.w_size),
			Ct(d.head),
			(d.max_lazy_match = dr[d.level].max_lazy),
			(d.good_match = dr[d.level].good_length),
			(d.nice_match = dr[d.level].nice_length),
			(d.max_chain_length = dr[d.level].max_chain),
			(d.strstart = 0),
			(d.block_start = 0),
			(d.lookahead = 0),
			(d.insert = 0),
			(d.match_length = d.prev_length = j - 1),
			(d.match_available = 0),
			(d.ins_h = 0))
	}
	function C() {
		;((this.strm = null),
			(this.status = 0),
			(this.pending_buf = null),
			(this.pending_buf_size = 0),
			(this.pending_out = 0),
			(this.pending = 0),
			(this.wrap = 0),
			(this.gzhead = null),
			(this.gzindex = 0),
			(this.method = ee),
			(this.last_flush = -1),
			(this.w_size = 0),
			(this.w_bits = 0),
			(this.w_mask = 0),
			(this.window = null),
			(this.window_size = 0),
			(this.prev = null),
			(this.head = null),
			(this.ins_h = 0),
			(this.hash_size = 0),
			(this.hash_bits = 0),
			(this.hash_mask = 0),
			(this.hash_shift = 0),
			(this.block_start = 0),
			(this.match_length = 0),
			(this.prev_match = 0),
			(this.match_available = 0),
			(this.strstart = 0),
			(this.match_start = 0),
			(this.lookahead = 0),
			(this.prev_length = 0),
			(this.max_chain_length = 0),
			(this.max_lazy_match = 0),
			(this.level = 0),
			(this.strategy = 0),
			(this.good_match = 0),
			(this.nice_match = 0),
			(this.dyn_ltree = new e.Buf16(Qe * 2)),
			(this.dyn_dtree = new e.Buf16((2 * Ee + 1) * 2)),
			(this.bl_tree = new e.Buf16((2 * Me + 1) * 2)),
			Ct(this.dyn_ltree),
			Ct(this.dyn_dtree),
			Ct(this.bl_tree),
			(this.l_desc = null),
			(this.d_desc = null),
			(this.bl_desc = null),
			(this.bl_count = new e.Buf16(pt + 1)),
			(this.heap = new e.Buf16(2 * je + 1)),
			Ct(this.heap),
			(this.heap_len = 0),
			(this.heap_max = 0),
			(this.depth = new e.Buf16(2 * je + 1)),
			Ct(this.depth),
			(this.l_buf = 0),
			(this.lit_bufsize = 0),
			(this.last_lit = 0),
			(this.d_buf = 0),
			(this.opt_len = 0),
			(this.static_len = 0),
			(this.matches = 0),
			(this.insert = 0),
			(this.bi_buf = 0),
			(this.bi_valid = 0))
	}
	function se(d) {
		var Y
		return !d || !d.state
			? Te(d, v)
			: ((d.total_in = d.total_out = 0),
				(d.data_type = U),
				(Y = d.state),
				(Y.pending = 0),
				(Y.pending_out = 0),
				Y.wrap < 0 && (Y.wrap = -Y.wrap),
				(Y.status = Y.wrap ? Ie : Je),
				(d.adler = Y.wrap === 2 ? 0 : 1),
				(Y.last_flush = s),
				t._tr_init(Y),
				y)
	}
	function we(d) {
		var Y = se(d)
		return (Y === y && Dn(d.state), Y)
	}
	function Pe(d, Y) {
		return !d || !d.state || d.state.wrap !== 2 ? v : ((d.state.gzhead = Y), y)
	}
	function z(d, Y, Q, T, F, Z) {
		if (!d) return v
		var Ue = 1
		if (
			(Y === x && (Y = 6),
			T < 0 ? ((Ue = 0), (T = -T)) : T > 15 && ((Ue = 2), (T -= 16)),
			F < 1 ||
				F > X ||
				Q !== ee ||
				T < 8 ||
				T > 15 ||
				Y < 0 ||
				Y > 9 ||
				Z < 0 ||
				Z > L)
		)
			return Te(d, v)
		T === 8 && (T = 9)
		var Ae = new C()
		return (
			(d.state = Ae),
			(Ae.strm = d),
			(Ae.wrap = Ue),
			(Ae.gzhead = null),
			(Ae.w_bits = T),
			(Ae.w_size = 1 << Ae.w_bits),
			(Ae.w_mask = Ae.w_size - 1),
			(Ae.hash_bits = F + 7),
			(Ae.hash_size = 1 << Ae.hash_bits),
			(Ae.hash_mask = Ae.hash_size - 1),
			(Ae.hash_shift = ~~((Ae.hash_bits + j - 1) / j)),
			(Ae.window = new e.Buf8(Ae.w_size * 2)),
			(Ae.head = new e.Buf16(Ae.hash_size)),
			(Ae.prev = new e.Buf16(Ae.w_size)),
			(Ae.lit_bufsize = 1 << (F + 6)),
			(Ae.pending_buf_size = Ae.lit_bufsize * 4),
			(Ae.pending_buf = new e.Buf8(Ae.pending_buf_size)),
			(Ae.d_buf = 1 * Ae.lit_bufsize),
			(Ae.l_buf = 3 * Ae.lit_bufsize),
			(Ae.level = Y),
			(Ae.strategy = Z),
			(Ae.method = Q),
			we(d)
		)
	}
	function re(d, Y) {
		return z(d, Y, ee, ve, ge, N)
	}
	function E(d, Y) {
		var Q, T, F, Z
		if (!d || !d.state || Y > m || Y < 0) return d ? Te(d, v) : v
		if (
			((T = d.state),
			!d.output ||
				(!d.input && d.avail_in !== 0) ||
				(T.status === P && Y !== c))
		)
			return Te(d, d.avail_out === 0 ? S : v)
		if (((T.strm = d), (Q = T.last_flush), (T.last_flush = Y), T.status === Ie))
			if (T.wrap === 2)
				((d.adler = 0),
					tt(T, 31),
					tt(T, 139),
					tt(T, 8),
					T.gzhead
						? (tt(
								T,
								(T.gzhead.text ? 1 : 0) +
									(T.gzhead.hcrc ? 2 : 0) +
									(T.gzhead.extra ? 4 : 0) +
									(T.gzhead.name ? 8 : 0) +
									(T.gzhead.comment ? 16 : 0),
							),
							tt(T, T.gzhead.time & 255),
							tt(T, (T.gzhead.time >> 8) & 255),
							tt(T, (T.gzhead.time >> 16) & 255),
							tt(T, (T.gzhead.time >> 24) & 255),
							tt(T, T.level === 9 ? 2 : T.strategy >= b || T.level < 2 ? 4 : 0),
							tt(T, T.gzhead.os & 255),
							T.gzhead.extra &&
								T.gzhead.extra.length &&
								(tt(T, T.gzhead.extra.length & 255),
								tt(T, (T.gzhead.extra.length >> 8) & 255)),
							T.gzhead.hcrc &&
								(d.adler = n(d.adler, T.pending_buf, T.pending, 0)),
							(T.gzindex = 0),
							(T.status = xe))
						: (tt(T, 0),
							tt(T, 0),
							tt(T, 0),
							tt(T, 0),
							tt(T, 0),
							tt(T, T.level === 9 ? 2 : T.strategy >= b || T.level < 2 ? 4 : 0),
							tt(T, be),
							(T.status = Je)))
			else {
				var Ue = (ee + ((T.w_bits - 8) << 4)) << 8,
					Ae = -1
				;(T.strategy >= b || T.level < 2
					? (Ae = 0)
					: T.level < 6
						? (Ae = 1)
						: T.level === 6
							? (Ae = 2)
							: (Ae = 3),
					(Ue |= Ae << 6),
					T.strstart !== 0 && (Ue |= _e),
					(Ue += 31 - (Ue % 31)),
					(T.status = Je),
					Oe(T, Ue),
					T.strstart !== 0 && (Oe(T, d.adler >>> 16), Oe(T, d.adler & 65535)),
					(d.adler = 1))
			}
		if (T.status === xe)
			if (T.gzhead.extra) {
				for (
					F = T.pending;
					T.gzindex < (T.gzhead.extra.length & 65535) &&
					!(
						T.pending === T.pending_buf_size &&
						(T.gzhead.hcrc &&
							T.pending > F &&
							(d.adler = n(d.adler, T.pending_buf, T.pending - F, F)),
						kt(d),
						(F = T.pending),
						T.pending === T.pending_buf_size)
					);
				)
					(tt(T, T.gzhead.extra[T.gzindex] & 255), T.gzindex++)
				;(T.gzhead.hcrc &&
					T.pending > F &&
					(d.adler = n(d.adler, T.pending_buf, T.pending - F, F)),
					T.gzindex === T.gzhead.extra.length &&
						((T.gzindex = 0), (T.status = ze)))
			} else T.status = ze
		if (T.status === ze)
			if (T.gzhead.name) {
				F = T.pending
				do {
					if (
						T.pending === T.pending_buf_size &&
						(T.gzhead.hcrc &&
							T.pending > F &&
							(d.adler = n(d.adler, T.pending_buf, T.pending - F, F)),
						kt(d),
						(F = T.pending),
						T.pending === T.pending_buf_size)
					) {
						Z = 1
						break
					}
					;(T.gzindex < T.gzhead.name.length
						? (Z = T.gzhead.name.charCodeAt(T.gzindex++) & 255)
						: (Z = 0),
						tt(T, Z))
				} while (Z !== 0)
				;(T.gzhead.hcrc &&
					T.pending > F &&
					(d.adler = n(d.adler, T.pending_buf, T.pending - F, F)),
					Z === 0 && ((T.gzindex = 0), (T.status = ft)))
			} else T.status = ft
		if (T.status === ft)
			if (T.gzhead.comment) {
				F = T.pending
				do {
					if (
						T.pending === T.pending_buf_size &&
						(T.gzhead.hcrc &&
							T.pending > F &&
							(d.adler = n(d.adler, T.pending_buf, T.pending - F, F)),
						kt(d),
						(F = T.pending),
						T.pending === T.pending_buf_size)
					) {
						Z = 1
						break
					}
					;(T.gzindex < T.gzhead.comment.length
						? (Z = T.gzhead.comment.charCodeAt(T.gzindex++) & 255)
						: (Z = 0),
						tt(T, Z))
				} while (Z !== 0)
				;(T.gzhead.hcrc &&
					T.pending > F &&
					(d.adler = n(d.adler, T.pending_buf, T.pending - F, F)),
					Z === 0 && (T.status = it))
			} else T.status = it
		if (
			(T.status === it &&
				(T.gzhead.hcrc
					? (T.pending + 2 > T.pending_buf_size && kt(d),
						T.pending + 2 <= T.pending_buf_size &&
							(tt(T, d.adler & 255),
							tt(T, (d.adler >> 8) & 255),
							(d.adler = 0),
							(T.status = Je)))
					: (T.status = Je)),
			T.pending !== 0)
		) {
			if ((kt(d), d.avail_out === 0)) return ((T.last_flush = -1), y)
		} else if (d.avail_in === 0 && Rt(Y) <= Rt(Q) && Y !== c) return Te(d, S)
		if (T.status === P && d.avail_in !== 0) return Te(d, S)
		if (d.avail_in !== 0 || T.lookahead !== 0 || (Y !== s && T.status !== P)) {
			var Le =
				T.strategy === b
					? zr(T, Y)
					: T.strategy === A
						? cr(T, Y)
						: dr[T.level].func(T, Y)
			if (((Le === me || Le === Ge) && (T.status = P), Le === M || Le === me))
				return (d.avail_out === 0 && (T.last_flush = -1), y)
			if (
				Le === ue &&
				(Y === l
					? t._tr_align(T)
					: Y !== m &&
						(t._tr_stored_block(T, 0, 0, !1),
						Y === f &&
							(Ct(T.head),
							T.lookahead === 0 &&
								((T.strstart = 0), (T.block_start = 0), (T.insert = 0)))),
				kt(d),
				d.avail_out === 0)
			)
				return ((T.last_flush = -1), y)
		}
		return Y !== c
			? y
			: T.wrap <= 0
				? g
				: (T.wrap === 2
						? (tt(T, d.adler & 255),
							tt(T, (d.adler >> 8) & 255),
							tt(T, (d.adler >> 16) & 255),
							tt(T, (d.adler >> 24) & 255),
							tt(T, d.total_in & 255),
							tt(T, (d.total_in >> 8) & 255),
							tt(T, (d.total_in >> 16) & 255),
							tt(T, (d.total_in >> 24) & 255))
						: (Oe(T, d.adler >>> 16), Oe(T, d.adler & 65535)),
					kt(d),
					T.wrap > 0 && (T.wrap = -T.wrap),
					T.pending !== 0 ? y : g)
	}
	function he(d) {
		var Y
		return !d || !d.state
			? v
			: ((Y = d.state.status),
				Y !== Ie &&
				Y !== xe &&
				Y !== ze &&
				Y !== ft &&
				Y !== it &&
				Y !== Je &&
				Y !== P
					? Te(d, v)
					: ((d.state = null), Y === Je ? Te(d, _) : y))
	}
	function Ve(d, Y) {
		var Q = Y.length,
			T,
			F,
			Z,
			Ue,
			Ae,
			Le,
			vt,
			Yt
		if (
			!d ||
			!d.state ||
			((T = d.state),
			(Ue = T.wrap),
			Ue === 2 || (Ue === 1 && T.status !== Ie) || T.lookahead)
		)
			return v
		for (
			Ue === 1 && (d.adler = r(d.adler, Y, Q, 0)),
				T.wrap = 0,
				Q >= T.w_size &&
					(Ue === 0 &&
						(Ct(T.head), (T.strstart = 0), (T.block_start = 0), (T.insert = 0)),
					(Yt = new e.Buf8(T.w_size)),
					e.arraySet(Yt, Y, Q - T.w_size, T.w_size, 0),
					(Y = Yt),
					(Q = T.w_size)),
				Ae = d.avail_in,
				Le = d.next_in,
				vt = d.input,
				d.avail_in = Q,
				d.next_in = 0,
				d.input = Y,
				Pt(T);
			T.lookahead >= j;
		) {
			;((F = T.strstart), (Z = T.lookahead - (j - 1)))
			do
				((T.ins_h =
					((T.ins_h << T.hash_shift) ^ T.window[F + j - 1]) & T.hash_mask),
					(T.prev[F & T.w_mask] = T.head[T.ins_h]),
					(T.head[T.ins_h] = F),
					F++)
			while (--Z)
			;((T.strstart = F), (T.lookahead = j - 1), Pt(T))
		}
		return (
			(T.strstart += T.lookahead),
			(T.block_start = T.strstart),
			(T.insert = T.lookahead),
			(T.lookahead = 0),
			(T.match_length = T.prev_length = j - 1),
			(T.match_available = 0),
			(d.next_in = Le),
			(d.input = vt),
			(d.avail_in = Ae),
			(T.wrap = Ue),
			y
		)
	}
	return (
		(En.deflateInit = re),
		(En.deflateInit2 = z),
		(En.deflateReset = we),
		(En.deflateResetKeep = se),
		(En.deflateSetHeader = Pe),
		(En.deflate = E),
		(En.deflateEnd = he),
		(En.deflateSetDictionary = Ve),
		(En.deflateInfo = 'pako deflate (from Nodeca project)'),
		En
	)
}
var Yi = {},
	gv
function v_() {
	if (gv) return Yi
	gv = 1
	var e = Di(),
		t = !0,
		r = !0
	try {
		String.fromCharCode.apply(null, [0])
	} catch {
		t = !1
	}
	try {
		String.fromCharCode.apply(null, new Uint8Array(1))
	} catch {
		r = !1
	}
	for (var n = new e.Buf8(256), i = 0; i < 256; i++)
		n[i] =
			i >= 252
				? 6
				: i >= 248
					? 5
					: i >= 240
						? 4
						: i >= 224
							? 3
							: i >= 192
								? 2
								: 1
	;((n[254] = n[254] = 1),
		(Yi.string2buf = function (l) {
			var f,
				c,
				m,
				y,
				g,
				v = l.length,
				_ = 0
			for (y = 0; y < v; y++)
				((c = l.charCodeAt(y)),
					(c & 64512) === 55296 &&
						y + 1 < v &&
						((m = l.charCodeAt(y + 1)),
						(m & 64512) === 56320 &&
							((c = 65536 + ((c - 55296) << 10) + (m - 56320)), y++)),
					(_ += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4))
			for (f = new e.Buf8(_), g = 0, y = 0; g < _; y++)
				((c = l.charCodeAt(y)),
					(c & 64512) === 55296 &&
						y + 1 < v &&
						((m = l.charCodeAt(y + 1)),
						(m & 64512) === 56320 &&
							((c = 65536 + ((c - 55296) << 10) + (m - 56320)), y++)),
					c < 128
						? (f[g++] = c)
						: c < 2048
							? ((f[g++] = 192 | (c >>> 6)), (f[g++] = 128 | (c & 63)))
							: c < 65536
								? ((f[g++] = 224 | (c >>> 12)),
									(f[g++] = 128 | ((c >>> 6) & 63)),
									(f[g++] = 128 | (c & 63)))
								: ((f[g++] = 240 | (c >>> 18)),
									(f[g++] = 128 | ((c >>> 12) & 63)),
									(f[g++] = 128 | ((c >>> 6) & 63)),
									(f[g++] = 128 | (c & 63))))
			return f
		}))
	function s(l, f) {
		if (f < 65534 && ((l.subarray && r) || (!l.subarray && t)))
			return String.fromCharCode.apply(null, e.shrinkBuf(l, f))
		for (var c = '', m = 0; m < f; m++) c += String.fromCharCode(l[m])
		return c
	}
	return (
		(Yi.buf2binstring = function (l) {
			return s(l, l.length)
		}),
		(Yi.binstring2buf = function (l) {
			for (var f = new e.Buf8(l.length), c = 0, m = f.length; c < m; c++)
				f[c] = l.charCodeAt(c)
			return f
		}),
		(Yi.buf2string = function (l, f) {
			var c,
				m,
				y,
				g,
				v = f || l.length,
				_ = new Array(v * 2)
			for (m = 0, c = 0; c < v;) {
				if (((y = l[c++]), y < 128)) {
					_[m++] = y
					continue
				}
				if (((g = n[y]), g > 4)) {
					;((_[m++] = 65533), (c += g - 1))
					continue
				}
				for (y &= g === 2 ? 31 : g === 3 ? 15 : 7; g > 1 && c < v;)
					((y = (y << 6) | (l[c++] & 63)), g--)
				if (g > 1) {
					_[m++] = 65533
					continue
				}
				y < 65536
					? (_[m++] = y)
					: ((y -= 65536),
						(_[m++] = 55296 | ((y >> 10) & 1023)),
						(_[m++] = 56320 | (y & 1023)))
			}
			return s(_, m)
		}),
		(Yi.utf8border = function (l, f) {
			var c
			for (
				f = f || l.length, f > l.length && (f = l.length), c = f - 1;
				c >= 0 && (l[c] & 192) === 128;
			)
				c--
			return c < 0 || c === 0 ? f : c + n[l[c]] > f ? c : f
		}),
		Yi
	)
}
var If, _v
function p_() {
	if (_v) return If
	_v = 1
	function e() {
		;((this.input = null),
			(this.next_in = 0),
			(this.avail_in = 0),
			(this.total_in = 0),
			(this.output = null),
			(this.next_out = 0),
			(this.avail_out = 0),
			(this.total_out = 0),
			(this.msg = ''),
			(this.state = null),
			(this.data_type = 2),
			(this.adler = 0))
	}
	return ((If = e), If)
}
var mv
function W1() {
	if (mv) return Oa
	mv = 1
	var e = K1(),
		t = Di(),
		r = v_(),
		n = qc(),
		i = p_(),
		s = Object.prototype.toString,
		l = 0,
		f = 4,
		c = 0,
		m = 1,
		y = 2,
		g = -1,
		v = 0,
		_ = 8
	function S(A) {
		if (!(this instanceof S)) return new S(A)
		this.options = t.assign(
			{
				level: g,
				method: _,
				chunkSize: 16384,
				windowBits: 15,
				memLevel: 8,
				strategy: v,
				to: '',
			},
			A || {},
		)
		var L = this.options
		;(L.raw && L.windowBits > 0
			? (L.windowBits = -L.windowBits)
			: L.gzip && L.windowBits > 0 && L.windowBits < 16 && (L.windowBits += 16),
			(this.err = 0),
			(this.msg = ''),
			(this.ended = !1),
			(this.chunks = []),
			(this.strm = new i()),
			(this.strm.avail_out = 0))
		var N = e.deflateInit2(
			this.strm,
			L.level,
			L.method,
			L.windowBits,
			L.memLevel,
			L.strategy,
		)
		if (N !== c) throw new Error(n[N])
		if ((L.header && e.deflateSetHeader(this.strm, L.header), L.dictionary)) {
			var U
			if (
				(typeof L.dictionary == 'string'
					? (U = r.string2buf(L.dictionary))
					: s.call(L.dictionary) === '[object ArrayBuffer]'
						? (U = new Uint8Array(L.dictionary))
						: (U = L.dictionary),
				(N = e.deflateSetDictionary(this.strm, U)),
				N !== c)
			)
				throw new Error(n[N])
			this._dict_set = !0
		}
	}
	;((S.prototype.push = function (A, L) {
		var N = this.strm,
			U = this.options.chunkSize,
			ee,
			X
		if (this.ended) return !1
		;((X = L === ~~L ? L : L === !0 ? f : l),
			typeof A == 'string'
				? (N.input = r.string2buf(A))
				: s.call(A) === '[object ArrayBuffer]'
					? (N.input = new Uint8Array(A))
					: (N.input = A),
			(N.next_in = 0),
			(N.avail_in = N.input.length))
		do {
			if (
				(N.avail_out === 0 &&
					((N.output = new t.Buf8(U)), (N.next_out = 0), (N.avail_out = U)),
				(ee = e.deflate(N, X)),
				ee !== m && ee !== c)
			)
				return (this.onEnd(ee), (this.ended = !0), !1)
			;(N.avail_out === 0 || (N.avail_in === 0 && (X === f || X === y))) &&
				(this.options.to === 'string'
					? this.onData(r.buf2binstring(t.shrinkBuf(N.output, N.next_out)))
					: this.onData(t.shrinkBuf(N.output, N.next_out)))
		} while ((N.avail_in > 0 || N.avail_out === 0) && ee !== m)
		return X === f
			? ((ee = e.deflateEnd(this.strm)),
				this.onEnd(ee),
				(this.ended = !0),
				ee === c)
			: (X === y && (this.onEnd(c), (N.avail_out = 0)), !0)
	}),
		(S.prototype.onData = function (A) {
			this.chunks.push(A)
		}),
		(S.prototype.onEnd = function (A) {
			;(A === c &&
				(this.options.to === 'string'
					? (this.result = this.chunks.join(''))
					: (this.result = t.flattenChunks(this.chunks))),
				(this.chunks = []),
				(this.err = A),
				(this.msg = this.strm.msg))
		}))
	function x(A, L) {
		var N = new S(L)
		if ((N.push(A, !0), N.err)) throw N.msg || n[N.err]
		return N.result
	}
	function R(A, L) {
		return ((L = L || {}), (L.raw = !0), x(A, L))
	}
	function b(A, L) {
		return ((L = L || {}), (L.gzip = !0), x(A, L))
	}
	return (
		(Oa.Deflate = S),
		(Oa.deflate = x),
		(Oa.deflateRaw = R),
		(Oa.gzip = b),
		Oa
	)
}
var Da = {},
	sn = {},
	Rf,
	yv
function G1() {
	if (yv) return Rf
	yv = 1
	var e = 30,
		t = 12
	return (
		(Rf = function (n, i) {
			var s,
				l,
				f,
				c,
				m,
				y,
				g,
				v,
				_,
				S,
				x,
				R,
				b,
				A,
				L,
				N,
				U,
				ee,
				X,
				ve,
				ge,
				ye,
				Ne,
				je,
				Ee
			;((s = n.state),
				(l = n.next_in),
				(je = n.input),
				(f = l + (n.avail_in - 5)),
				(c = n.next_out),
				(Ee = n.output),
				(m = c - (i - n.avail_out)),
				(y = c + (n.avail_out - 257)),
				(g = s.dmax),
				(v = s.wsize),
				(_ = s.whave),
				(S = s.wnext),
				(x = s.window),
				(R = s.hold),
				(b = s.bits),
				(A = s.lencode),
				(L = s.distcode),
				(N = (1 << s.lenbits) - 1),
				(U = (1 << s.distbits) - 1))
			e: do {
				;(b < 15 &&
					((R += je[l++] << b), (b += 8), (R += je[l++] << b), (b += 8)),
					(ee = A[R & N]))
				t: for (;;) {
					if (
						((X = ee >>> 24),
						(R >>>= X),
						(b -= X),
						(X = (ee >>> 16) & 255),
						X === 0)
					)
						Ee[c++] = ee & 65535
					else if (X & 16) {
						;((ve = ee & 65535),
							(X &= 15),
							X &&
								(b < X && ((R += je[l++] << b), (b += 8)),
								(ve += R & ((1 << X) - 1)),
								(R >>>= X),
								(b -= X)),
							b < 15 &&
								((R += je[l++] << b), (b += 8), (R += je[l++] << b), (b += 8)),
							(ee = L[R & U]))
						r: for (;;) {
							if (
								((X = ee >>> 24),
								(R >>>= X),
								(b -= X),
								(X = (ee >>> 16) & 255),
								X & 16)
							) {
								if (
									((ge = ee & 65535),
									(X &= 15),
									b < X &&
										((R += je[l++] << b),
										(b += 8),
										b < X && ((R += je[l++] << b), (b += 8))),
									(ge += R & ((1 << X) - 1)),
									ge > g)
								) {
									;((n.msg = 'invalid distance too far back'), (s.mode = e))
									break e
								}
								if (((R >>>= X), (b -= X), (X = c - m), ge > X)) {
									if (((X = ge - X), X > _ && s.sane)) {
										;((n.msg = 'invalid distance too far back'), (s.mode = e))
										break e
									}
									if (((ye = 0), (Ne = x), S === 0)) {
										if (((ye += v - X), X < ve)) {
											ve -= X
											do Ee[c++] = x[ye++]
											while (--X)
											;((ye = c - ge), (Ne = Ee))
										}
									} else if (S < X) {
										if (((ye += v + S - X), (X -= S), X < ve)) {
											ve -= X
											do Ee[c++] = x[ye++]
											while (--X)
											if (((ye = 0), S < ve)) {
												;((X = S), (ve -= X))
												do Ee[c++] = x[ye++]
												while (--X)
												;((ye = c - ge), (Ne = Ee))
											}
										}
									} else if (((ye += S - X), X < ve)) {
										ve -= X
										do Ee[c++] = x[ye++]
										while (--X)
										;((ye = c - ge), (Ne = Ee))
									}
									for (; ve > 2;)
										((Ee[c++] = Ne[ye++]),
											(Ee[c++] = Ne[ye++]),
											(Ee[c++] = Ne[ye++]),
											(ve -= 3))
									ve && ((Ee[c++] = Ne[ye++]), ve > 1 && (Ee[c++] = Ne[ye++]))
								} else {
									ye = c - ge
									do
										((Ee[c++] = Ee[ye++]),
											(Ee[c++] = Ee[ye++]),
											(Ee[c++] = Ee[ye++]),
											(ve -= 3))
									while (ve > 2)
									ve && ((Ee[c++] = Ee[ye++]), ve > 1 && (Ee[c++] = Ee[ye++]))
								}
							} else if ((X & 64) === 0) {
								ee = L[(ee & 65535) + (R & ((1 << X) - 1))]
								continue r
							} else {
								;((n.msg = 'invalid distance code'), (s.mode = e))
								break e
							}
							break
						}
					} else if ((X & 64) === 0) {
						ee = A[(ee & 65535) + (R & ((1 << X) - 1))]
						continue t
					} else if (X & 32) {
						s.mode = t
						break e
					} else {
						;((n.msg = 'invalid literal/length code'), (s.mode = e))
						break e
					}
					break
				}
			} while (l < f && c < y)
			;((ve = b >> 3),
				(l -= ve),
				(b -= ve << 3),
				(R &= (1 << b) - 1),
				(n.next_in = l),
				(n.next_out = c),
				(n.avail_in = l < f ? 5 + (f - l) : 5 - (l - f)),
				(n.avail_out = c < y ? 257 + (y - c) : 257 - (c - y)),
				(s.hold = R),
				(s.bits = b))
		}),
		Rf
	)
}
var Cf, bv
function H1() {
	if (bv) return Cf
	bv = 1
	var e = Di(),
		t = 15,
		r = 852,
		n = 592,
		i = 0,
		s = 1,
		l = 2,
		f = [
			3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59,
			67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
		],
		c = [
			16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19,
			19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
		],
		m = [
			1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513,
			769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
		],
		y = [
			16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23,
			24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
		]
	return (
		(Cf = function (v, _, S, x, R, b, A, L) {
			var N = L.bits,
				U = 0,
				ee = 0,
				X = 0,
				ve = 0,
				ge = 0,
				ye = 0,
				Ne = 0,
				je = 0,
				Ee = 0,
				Me = 0,
				Qe,
				pt,
				j,
				G,
				$,
				_e = null,
				Ie = 0,
				xe,
				ze = new e.Buf16(t + 1),
				ft = new e.Buf16(t + 1),
				it = null,
				Je = 0,
				P,
				M,
				ue
			for (U = 0; U <= t; U++) ze[U] = 0
			for (ee = 0; ee < x; ee++) ze[_[S + ee]]++
			for (ge = N, ve = t; ve >= 1 && ze[ve] === 0; ve--);
			if ((ge > ve && (ge = ve), ve === 0))
				return (
					(R[b++] = (1 << 24) | (64 << 16) | 0),
					(R[b++] = (1 << 24) | (64 << 16) | 0),
					(L.bits = 1),
					0
				)
			for (X = 1; X < ve && ze[X] === 0; X++);
			for (ge < X && (ge = X), je = 1, U = 1; U <= t; U++)
				if (((je <<= 1), (je -= ze[U]), je < 0)) return -1
			if (je > 0 && (v === i || ve !== 1)) return -1
			for (ft[1] = 0, U = 1; U < t; U++) ft[U + 1] = ft[U] + ze[U]
			for (ee = 0; ee < x; ee++) _[S + ee] !== 0 && (A[ft[_[S + ee]]++] = ee)
			if (
				(v === i
					? ((_e = it = A), (xe = 19))
					: v === s
						? ((_e = f), (Ie -= 257), (it = c), (Je -= 257), (xe = 256))
						: ((_e = m), (it = y), (xe = -1)),
				(Me = 0),
				(ee = 0),
				(U = X),
				($ = b),
				(ye = ge),
				(Ne = 0),
				(j = -1),
				(Ee = 1 << ge),
				(G = Ee - 1),
				(v === s && Ee > r) || (v === l && Ee > n))
			)
				return 1
			for (;;) {
				;((P = U - Ne),
					A[ee] < xe
						? ((M = 0), (ue = A[ee]))
						: A[ee] > xe
							? ((M = it[Je + A[ee]]), (ue = _e[Ie + A[ee]]))
							: ((M = 96), (ue = 0)),
					(Qe = 1 << (U - Ne)),
					(pt = 1 << ye),
					(X = pt))
				do
					((pt -= Qe),
						(R[$ + (Me >> Ne) + pt] = (P << 24) | (M << 16) | ue | 0))
				while (pt !== 0)
				for (Qe = 1 << (U - 1); Me & Qe;) Qe >>= 1
				if (
					(Qe !== 0 ? ((Me &= Qe - 1), (Me += Qe)) : (Me = 0),
					ee++,
					--ze[U] === 0)
				) {
					if (U === ve) break
					U = _[S + A[ee]]
				}
				if (U > ge && (Me & G) !== j) {
					for (
						Ne === 0 && (Ne = ge), $ += X, ye = U - Ne, je = 1 << ye;
						ye + Ne < ve && ((je -= ze[ye + Ne]), !(je <= 0));
					)
						(ye++, (je <<= 1))
					if (((Ee += 1 << ye), (v === s && Ee > r) || (v === l && Ee > n)))
						return 1
					;((j = Me & G), (R[j] = (ge << 24) | (ye << 16) | ($ - b) | 0))
				}
			}
			return (
				Me !== 0 && (R[$ + Me] = ((U - Ne) << 24) | (64 << 16) | 0),
				(L.bits = ge),
				0
			)
		}),
		Cf
	)
}
var wv
function $1() {
	if (wv) return sn
	wv = 1
	var e = Di(),
		t = d_(),
		r = h_(),
		n = G1(),
		i = H1(),
		s = 0,
		l = 1,
		f = 2,
		c = 4,
		m = 5,
		y = 6,
		g = 0,
		v = 1,
		_ = 2,
		S = -2,
		x = -3,
		R = -4,
		b = -5,
		A = 8,
		L = 1,
		N = 2,
		U = 3,
		ee = 4,
		X = 5,
		ve = 6,
		ge = 7,
		ye = 8,
		Ne = 9,
		je = 10,
		Ee = 11,
		Me = 12,
		Qe = 13,
		pt = 14,
		j = 15,
		G = 16,
		$ = 17,
		_e = 18,
		Ie = 19,
		xe = 20,
		ze = 21,
		ft = 22,
		it = 23,
		Je = 24,
		P = 25,
		M = 26,
		ue = 27,
		me = 28,
		Ge = 29,
		be = 30,
		Te = 31,
		Rt = 32,
		Ct = 852,
		kt = 592,
		_t = 15,
		tt = _t
	function Oe(z) {
		return (
			((z >>> 24) & 255) +
			((z >>> 8) & 65280) +
			((z & 65280) << 8) +
			((z & 255) << 24)
		)
	}
	function er() {
		;((this.mode = 0),
			(this.last = !1),
			(this.wrap = 0),
			(this.havedict = !1),
			(this.flags = 0),
			(this.dmax = 0),
			(this.check = 0),
			(this.total = 0),
			(this.head = null),
			(this.wbits = 0),
			(this.wsize = 0),
			(this.whave = 0),
			(this.wnext = 0),
			(this.window = null),
			(this.hold = 0),
			(this.bits = 0),
			(this.length = 0),
			(this.offset = 0),
			(this.extra = 0),
			(this.lencode = null),
			(this.distcode = null),
			(this.lenbits = 0),
			(this.distbits = 0),
			(this.ncode = 0),
			(this.nlen = 0),
			(this.ndist = 0),
			(this.have = 0),
			(this.next = null),
			(this.lens = new e.Buf16(320)),
			(this.work = new e.Buf16(288)),
			(this.lendyn = null),
			(this.distdyn = null),
			(this.sane = 0),
			(this.back = 0),
			(this.was = 0))
	}
	function fr(z) {
		var re
		return !z || !z.state
			? S
			: ((re = z.state),
				(z.total_in = z.total_out = re.total = 0),
				(z.msg = ''),
				re.wrap && (z.adler = re.wrap & 1),
				(re.mode = L),
				(re.last = 0),
				(re.havedict = 0),
				(re.dmax = 32768),
				(re.head = null),
				(re.hold = 0),
				(re.bits = 0),
				(re.lencode = re.lendyn = new e.Buf32(Ct)),
				(re.distcode = re.distdyn = new e.Buf32(kt)),
				(re.sane = 1),
				(re.back = -1),
				g)
	}
	function Pt(z) {
		var re
		return !z || !z.state
			? S
			: ((re = z.state), (re.wsize = 0), (re.whave = 0), (re.wnext = 0), fr(z))
	}
	function st(z, re) {
		var E, he
		return !z ||
			!z.state ||
			((he = z.state),
			re < 0
				? ((E = 0), (re = -re))
				: ((E = (re >> 4) + 1), re < 48 && (re &= 15)),
			re && (re < 8 || re > 15))
			? S
			: (he.window !== null && he.wbits !== re && (he.window = null),
				(he.wrap = E),
				(he.wbits = re),
				Pt(z))
	}
	function Ft(z, re) {
		var E, he
		return z
			? ((he = new er()),
				(z.state = he),
				(he.window = null),
				(E = st(z, re)),
				E !== g && (z.state = null),
				E)
			: S
	}
	function jt(z) {
		return Ft(z, tt)
	}
	var cr = !0,
		zr,
		Lt
	function dr(z) {
		if (cr) {
			var re
			for (zr = new e.Buf32(512), Lt = new e.Buf32(32), re = 0; re < 144;)
				z.lens[re++] = 8
			for (; re < 256;) z.lens[re++] = 9
			for (; re < 280;) z.lens[re++] = 7
			for (; re < 288;) z.lens[re++] = 8
			for (i(l, z.lens, 0, 288, zr, 0, z.work, {bits: 9}), re = 0; re < 32;)
				z.lens[re++] = 5
			;(i(f, z.lens, 0, 32, Lt, 0, z.work, {bits: 5}), (cr = !1))
		}
		;((z.lencode = zr), (z.lenbits = 9), (z.distcode = Lt), (z.distbits = 5))
	}
	function Dn(z, re, E, he) {
		var Ve,
			d = z.state
		return (
			d.window === null &&
				((d.wsize = 1 << d.wbits),
				(d.wnext = 0),
				(d.whave = 0),
				(d.window = new e.Buf8(d.wsize))),
			he >= d.wsize
				? (e.arraySet(d.window, re, E - d.wsize, d.wsize, 0),
					(d.wnext = 0),
					(d.whave = d.wsize))
				: ((Ve = d.wsize - d.wnext),
					Ve > he && (Ve = he),
					e.arraySet(d.window, re, E - he, Ve, d.wnext),
					(he -= Ve),
					he
						? (e.arraySet(d.window, re, E - he, he, 0),
							(d.wnext = he),
							(d.whave = d.wsize))
						: ((d.wnext += Ve),
							d.wnext === d.wsize && (d.wnext = 0),
							d.whave < d.wsize && (d.whave += Ve))),
			0
		)
	}
	function C(z, re) {
		var E,
			he,
			Ve,
			d,
			Y,
			Q,
			T,
			F,
			Z,
			Ue,
			Ae,
			Le,
			vt,
			Yt,
			ke = 0,
			ht,
			xt,
			Kt,
			Se,
			Pn,
			Ln,
			Mt,
			hr,
			Wt = new e.Buf8(4),
			xr,
			Ar,
			pa = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
		if (!z || !z.state || !z.output || (!z.input && z.avail_in !== 0)) return S
		;((E = z.state),
			E.mode === Me && (E.mode = Qe),
			(Y = z.next_out),
			(Ve = z.output),
			(T = z.avail_out),
			(d = z.next_in),
			(he = z.input),
			(Q = z.avail_in),
			(F = E.hold),
			(Z = E.bits),
			(Ue = Q),
			(Ae = T),
			(hr = g))
		e: for (;;)
			switch (E.mode) {
				case L:
					if (E.wrap === 0) {
						E.mode = Qe
						break
					}
					for (; Z < 16;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					if (E.wrap & 2 && F === 35615) {
						;((E.check = 0),
							(Wt[0] = F & 255),
							(Wt[1] = (F >>> 8) & 255),
							(E.check = r(E.check, Wt, 2, 0)),
							(F = 0),
							(Z = 0),
							(E.mode = N))
						break
					}
					if (
						((E.flags = 0),
						E.head && (E.head.done = !1),
						!(E.wrap & 1) || (((F & 255) << 8) + (F >> 8)) % 31)
					) {
						;((z.msg = 'incorrect header check'), (E.mode = be))
						break
					}
					if ((F & 15) !== A) {
						;((z.msg = 'unknown compression method'), (E.mode = be))
						break
					}
					if (((F >>>= 4), (Z -= 4), (Mt = (F & 15) + 8), E.wbits === 0))
						E.wbits = Mt
					else if (Mt > E.wbits) {
						;((z.msg = 'invalid window size'), (E.mode = be))
						break
					}
					;((E.dmax = 1 << Mt),
						(z.adler = E.check = 1),
						(E.mode = F & 512 ? je : Me),
						(F = 0),
						(Z = 0))
					break
				case N:
					for (; Z < 16;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					if (((E.flags = F), (E.flags & 255) !== A)) {
						;((z.msg = 'unknown compression method'), (E.mode = be))
						break
					}
					if (E.flags & 57344) {
						;((z.msg = 'unknown header flags set'), (E.mode = be))
						break
					}
					;(E.head && (E.head.text = (F >> 8) & 1),
						E.flags & 512 &&
							((Wt[0] = F & 255),
							(Wt[1] = (F >>> 8) & 255),
							(E.check = r(E.check, Wt, 2, 0))),
						(F = 0),
						(Z = 0),
						(E.mode = U))
				case U:
					for (; Z < 32;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					;(E.head && (E.head.time = F),
						E.flags & 512 &&
							((Wt[0] = F & 255),
							(Wt[1] = (F >>> 8) & 255),
							(Wt[2] = (F >>> 16) & 255),
							(Wt[3] = (F >>> 24) & 255),
							(E.check = r(E.check, Wt, 4, 0))),
						(F = 0),
						(Z = 0),
						(E.mode = ee))
				case ee:
					for (; Z < 16;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					;(E.head && ((E.head.xflags = F & 255), (E.head.os = F >> 8)),
						E.flags & 512 &&
							((Wt[0] = F & 255),
							(Wt[1] = (F >>> 8) & 255),
							(E.check = r(E.check, Wt, 2, 0))),
						(F = 0),
						(Z = 0),
						(E.mode = X))
				case X:
					if (E.flags & 1024) {
						for (; Z < 16;) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						;((E.length = F),
							E.head && (E.head.extra_len = F),
							E.flags & 512 &&
								((Wt[0] = F & 255),
								(Wt[1] = (F >>> 8) & 255),
								(E.check = r(E.check, Wt, 2, 0))),
							(F = 0),
							(Z = 0))
					} else E.head && (E.head.extra = null)
					E.mode = ve
				case ve:
					if (
						E.flags & 1024 &&
						((Le = E.length),
						Le > Q && (Le = Q),
						Le &&
							(E.head &&
								((Mt = E.head.extra_len - E.length),
								E.head.extra || (E.head.extra = new Array(E.head.extra_len)),
								e.arraySet(E.head.extra, he, d, Le, Mt)),
							E.flags & 512 && (E.check = r(E.check, he, Le, d)),
							(Q -= Le),
							(d += Le),
							(E.length -= Le)),
						E.length)
					)
						break e
					;((E.length = 0), (E.mode = ge))
				case ge:
					if (E.flags & 2048) {
						if (Q === 0) break e
						Le = 0
						do
							((Mt = he[d + Le++]),
								E.head &&
									Mt &&
									E.length < 65536 &&
									(E.head.name += String.fromCharCode(Mt)))
						while (Mt && Le < Q)
						if (
							(E.flags & 512 && (E.check = r(E.check, he, Le, d)),
							(Q -= Le),
							(d += Le),
							Mt)
						)
							break e
					} else E.head && (E.head.name = null)
					;((E.length = 0), (E.mode = ye))
				case ye:
					if (E.flags & 4096) {
						if (Q === 0) break e
						Le = 0
						do
							((Mt = he[d + Le++]),
								E.head &&
									Mt &&
									E.length < 65536 &&
									(E.head.comment += String.fromCharCode(Mt)))
						while (Mt && Le < Q)
						if (
							(E.flags & 512 && (E.check = r(E.check, he, Le, d)),
							(Q -= Le),
							(d += Le),
							Mt)
						)
							break e
					} else E.head && (E.head.comment = null)
					E.mode = Ne
				case Ne:
					if (E.flags & 512) {
						for (; Z < 16;) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						if (F !== (E.check & 65535)) {
							;((z.msg = 'header crc mismatch'), (E.mode = be))
							break
						}
						;((F = 0), (Z = 0))
					}
					;(E.head && ((E.head.hcrc = (E.flags >> 9) & 1), (E.head.done = !0)),
						(z.adler = E.check = 0),
						(E.mode = Me))
					break
				case je:
					for (; Z < 32;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					;((z.adler = E.check = Oe(F)), (F = 0), (Z = 0), (E.mode = Ee))
				case Ee:
					if (E.havedict === 0)
						return (
							(z.next_out = Y),
							(z.avail_out = T),
							(z.next_in = d),
							(z.avail_in = Q),
							(E.hold = F),
							(E.bits = Z),
							_
						)
					;((z.adler = E.check = 1), (E.mode = Me))
				case Me:
					if (re === m || re === y) break e
				case Qe:
					if (E.last) {
						;((F >>>= Z & 7), (Z -= Z & 7), (E.mode = ue))
						break
					}
					for (; Z < 3;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					switch (((E.last = F & 1), (F >>>= 1), (Z -= 1), F & 3)) {
						case 0:
							E.mode = pt
							break
						case 1:
							if ((dr(E), (E.mode = xe), re === y)) {
								;((F >>>= 2), (Z -= 2))
								break e
							}
							break
						case 2:
							E.mode = $
							break
						case 3:
							;((z.msg = 'invalid block type'), (E.mode = be))
					}
					;((F >>>= 2), (Z -= 2))
					break
				case pt:
					for (F >>>= Z & 7, Z -= Z & 7; Z < 32;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					if ((F & 65535) !== ((F >>> 16) ^ 65535)) {
						;((z.msg = 'invalid stored block lengths'), (E.mode = be))
						break
					}
					if (
						((E.length = F & 65535), (F = 0), (Z = 0), (E.mode = j), re === y)
					)
						break e
				case j:
					E.mode = G
				case G:
					if (((Le = E.length), Le)) {
						if ((Le > Q && (Le = Q), Le > T && (Le = T), Le === 0)) break e
						;(e.arraySet(Ve, he, d, Le, Y),
							(Q -= Le),
							(d += Le),
							(T -= Le),
							(Y += Le),
							(E.length -= Le))
						break
					}
					E.mode = Me
					break
				case $:
					for (; Z < 14;) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					if (
						((E.nlen = (F & 31) + 257),
						(F >>>= 5),
						(Z -= 5),
						(E.ndist = (F & 31) + 1),
						(F >>>= 5),
						(Z -= 5),
						(E.ncode = (F & 15) + 4),
						(F >>>= 4),
						(Z -= 4),
						E.nlen > 286 || E.ndist > 30)
					) {
						;((z.msg = 'too many length or distance symbols'), (E.mode = be))
						break
					}
					;((E.have = 0), (E.mode = _e))
				case _e:
					for (; E.have < E.ncode;) {
						for (; Z < 3;) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						;((E.lens[pa[E.have++]] = F & 7), (F >>>= 3), (Z -= 3))
					}
					for (; E.have < 19;) E.lens[pa[E.have++]] = 0
					if (
						((E.lencode = E.lendyn),
						(E.lenbits = 7),
						(xr = {bits: E.lenbits}),
						(hr = i(s, E.lens, 0, 19, E.lencode, 0, E.work, xr)),
						(E.lenbits = xr.bits),
						hr)
					) {
						;((z.msg = 'invalid code lengths set'), (E.mode = be))
						break
					}
					;((E.have = 0), (E.mode = Ie))
				case Ie:
					for (; E.have < E.nlen + E.ndist;) {
						for (
							;
							(ke = E.lencode[F & ((1 << E.lenbits) - 1)]),
								(ht = ke >>> 24),
								(xt = (ke >>> 16) & 255),
								(Kt = ke & 65535),
								!(ht <= Z);
						) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						if (Kt < 16) ((F >>>= ht), (Z -= ht), (E.lens[E.have++] = Kt))
						else {
							if (Kt === 16) {
								for (Ar = ht + 2; Z < Ar;) {
									if (Q === 0) break e
									;(Q--, (F += he[d++] << Z), (Z += 8))
								}
								if (((F >>>= ht), (Z -= ht), E.have === 0)) {
									;((z.msg = 'invalid bit length repeat'), (E.mode = be))
									break
								}
								;((Mt = E.lens[E.have - 1]),
									(Le = 3 + (F & 3)),
									(F >>>= 2),
									(Z -= 2))
							} else if (Kt === 17) {
								for (Ar = ht + 3; Z < Ar;) {
									if (Q === 0) break e
									;(Q--, (F += he[d++] << Z), (Z += 8))
								}
								;((F >>>= ht),
									(Z -= ht),
									(Mt = 0),
									(Le = 3 + (F & 7)),
									(F >>>= 3),
									(Z -= 3))
							} else {
								for (Ar = ht + 7; Z < Ar;) {
									if (Q === 0) break e
									;(Q--, (F += he[d++] << Z), (Z += 8))
								}
								;((F >>>= ht),
									(Z -= ht),
									(Mt = 0),
									(Le = 11 + (F & 127)),
									(F >>>= 7),
									(Z -= 7))
							}
							if (E.have + Le > E.nlen + E.ndist) {
								;((z.msg = 'invalid bit length repeat'), (E.mode = be))
								break
							}
							for (; Le--;) E.lens[E.have++] = Mt
						}
					}
					if (E.mode === be) break
					if (E.lens[256] === 0) {
						;((z.msg = 'invalid code -- missing end-of-block'), (E.mode = be))
						break
					}
					if (
						((E.lenbits = 9),
						(xr = {bits: E.lenbits}),
						(hr = i(l, E.lens, 0, E.nlen, E.lencode, 0, E.work, xr)),
						(E.lenbits = xr.bits),
						hr)
					) {
						;((z.msg = 'invalid literal/lengths set'), (E.mode = be))
						break
					}
					if (
						((E.distbits = 6),
						(E.distcode = E.distdyn),
						(xr = {bits: E.distbits}),
						(hr = i(f, E.lens, E.nlen, E.ndist, E.distcode, 0, E.work, xr)),
						(E.distbits = xr.bits),
						hr)
					) {
						;((z.msg = 'invalid distances set'), (E.mode = be))
						break
					}
					if (((E.mode = xe), re === y)) break e
				case xe:
					E.mode = ze
				case ze:
					if (Q >= 6 && T >= 258) {
						;((z.next_out = Y),
							(z.avail_out = T),
							(z.next_in = d),
							(z.avail_in = Q),
							(E.hold = F),
							(E.bits = Z),
							n(z, Ae),
							(Y = z.next_out),
							(Ve = z.output),
							(T = z.avail_out),
							(d = z.next_in),
							(he = z.input),
							(Q = z.avail_in),
							(F = E.hold),
							(Z = E.bits),
							E.mode === Me && (E.back = -1))
						break
					}
					for (
						E.back = 0;
						(ke = E.lencode[F & ((1 << E.lenbits) - 1)]),
							(ht = ke >>> 24),
							(xt = (ke >>> 16) & 255),
							(Kt = ke & 65535),
							!(ht <= Z);
					) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					if (xt && (xt & 240) === 0) {
						for (
							Se = ht, Pn = xt, Ln = Kt;
							(ke = E.lencode[Ln + ((F & ((1 << (Se + Pn)) - 1)) >> Se)]),
								(ht = ke >>> 24),
								(xt = (ke >>> 16) & 255),
								(Kt = ke & 65535),
								!(Se + ht <= Z);
						) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						;((F >>>= Se), (Z -= Se), (E.back += Se))
					}
					if (
						((F >>>= ht), (Z -= ht), (E.back += ht), (E.length = Kt), xt === 0)
					) {
						E.mode = M
						break
					}
					if (xt & 32) {
						;((E.back = -1), (E.mode = Me))
						break
					}
					if (xt & 64) {
						;((z.msg = 'invalid literal/length code'), (E.mode = be))
						break
					}
					;((E.extra = xt & 15), (E.mode = ft))
				case ft:
					if (E.extra) {
						for (Ar = E.extra; Z < Ar;) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						;((E.length += F & ((1 << E.extra) - 1)),
							(F >>>= E.extra),
							(Z -= E.extra),
							(E.back += E.extra))
					}
					;((E.was = E.length), (E.mode = it))
				case it:
					for (
						;
						(ke = E.distcode[F & ((1 << E.distbits) - 1)]),
							(ht = ke >>> 24),
							(xt = (ke >>> 16) & 255),
							(Kt = ke & 65535),
							!(ht <= Z);
					) {
						if (Q === 0) break e
						;(Q--, (F += he[d++] << Z), (Z += 8))
					}
					if ((xt & 240) === 0) {
						for (
							Se = ht, Pn = xt, Ln = Kt;
							(ke = E.distcode[Ln + ((F & ((1 << (Se + Pn)) - 1)) >> Se)]),
								(ht = ke >>> 24),
								(xt = (ke >>> 16) & 255),
								(Kt = ke & 65535),
								!(Se + ht <= Z);
						) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						;((F >>>= Se), (Z -= Se), (E.back += Se))
					}
					if (((F >>>= ht), (Z -= ht), (E.back += ht), xt & 64)) {
						;((z.msg = 'invalid distance code'), (E.mode = be))
						break
					}
					;((E.offset = Kt), (E.extra = xt & 15), (E.mode = Je))
				case Je:
					if (E.extra) {
						for (Ar = E.extra; Z < Ar;) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						;((E.offset += F & ((1 << E.extra) - 1)),
							(F >>>= E.extra),
							(Z -= E.extra),
							(E.back += E.extra))
					}
					if (E.offset > E.dmax) {
						;((z.msg = 'invalid distance too far back'), (E.mode = be))
						break
					}
					E.mode = P
				case P:
					if (T === 0) break e
					if (((Le = Ae - T), E.offset > Le)) {
						if (((Le = E.offset - Le), Le > E.whave && E.sane)) {
							;((z.msg = 'invalid distance too far back'), (E.mode = be))
							break
						}
						;(Le > E.wnext
							? ((Le -= E.wnext), (vt = E.wsize - Le))
							: (vt = E.wnext - Le),
							Le > E.length && (Le = E.length),
							(Yt = E.window))
					} else ((Yt = Ve), (vt = Y - E.offset), (Le = E.length))
					;(Le > T && (Le = T), (T -= Le), (E.length -= Le))
					do Ve[Y++] = Yt[vt++]
					while (--Le)
					E.length === 0 && (E.mode = ze)
					break
				case M:
					if (T === 0) break e
					;((Ve[Y++] = E.length), T--, (E.mode = ze))
					break
				case ue:
					if (E.wrap) {
						for (; Z < 32;) {
							if (Q === 0) break e
							;(Q--, (F |= he[d++] << Z), (Z += 8))
						}
						if (
							((Ae -= T),
							(z.total_out += Ae),
							(E.total += Ae),
							Ae &&
								(z.adler = E.check =
									E.flags
										? r(E.check, Ve, Ae, Y - Ae)
										: t(E.check, Ve, Ae, Y - Ae)),
							(Ae = T),
							(E.flags ? F : Oe(F)) !== E.check)
						) {
							;((z.msg = 'incorrect data check'), (E.mode = be))
							break
						}
						;((F = 0), (Z = 0))
					}
					E.mode = me
				case me:
					if (E.wrap && E.flags) {
						for (; Z < 32;) {
							if (Q === 0) break e
							;(Q--, (F += he[d++] << Z), (Z += 8))
						}
						if (F !== (E.total & 4294967295)) {
							;((z.msg = 'incorrect length check'), (E.mode = be))
							break
						}
						;((F = 0), (Z = 0))
					}
					E.mode = Ge
				case Ge:
					hr = v
					break e
				case be:
					hr = x
					break e
				case Te:
					return R
				case Rt:
				default:
					return S
			}
		return (
			(z.next_out = Y),
			(z.avail_out = T),
			(z.next_in = d),
			(z.avail_in = Q),
			(E.hold = F),
			(E.bits = Z),
			(E.wsize ||
				(Ae !== z.avail_out && E.mode < be && (E.mode < ue || re !== c))) &&
				Dn(z, z.output, z.next_out, Ae - z.avail_out),
			(Ue -= z.avail_in),
			(Ae -= z.avail_out),
			(z.total_in += Ue),
			(z.total_out += Ae),
			(E.total += Ae),
			E.wrap &&
				Ae &&
				(z.adler = E.check =
					E.flags
						? r(E.check, Ve, Ae, z.next_out - Ae)
						: t(E.check, Ve, Ae, z.next_out - Ae)),
			(z.data_type =
				E.bits +
				(E.last ? 64 : 0) +
				(E.mode === Me ? 128 : 0) +
				(E.mode === xe || E.mode === j ? 256 : 0)),
			((Ue === 0 && Ae === 0) || re === c) && hr === g && (hr = b),
			hr
		)
	}
	function se(z) {
		if (!z || !z.state) return S
		var re = z.state
		return (re.window && (re.window = null), (z.state = null), g)
	}
	function we(z, re) {
		var E
		return !z || !z.state || ((E = z.state), (E.wrap & 2) === 0)
			? S
			: ((E.head = re), (re.done = !1), g)
	}
	function Pe(z, re) {
		var E = re.length,
			he,
			Ve,
			d
		return !z || !z.state || ((he = z.state), he.wrap !== 0 && he.mode !== Ee)
			? S
			: he.mode === Ee && ((Ve = 1), (Ve = t(Ve, re, E, 0)), Ve !== he.check)
				? x
				: ((d = Dn(z, re, E, E)),
					d ? ((he.mode = Te), R) : ((he.havedict = 1), g))
	}
	return (
		(sn.inflateReset = Pt),
		(sn.inflateReset2 = st),
		(sn.inflateResetKeep = fr),
		(sn.inflateInit = jt),
		(sn.inflateInit2 = Ft),
		(sn.inflate = C),
		(sn.inflateEnd = se),
		(sn.inflateGetHeader = we),
		(sn.inflateSetDictionary = Pe),
		(sn.inflateInfo = 'pako inflate (from Nodeca project)'),
		sn
	)
}
var Of, Sv
function g_() {
	return (
		Sv ||
			((Sv = 1),
			(Of = {
				Z_NO_FLUSH: 0,
				Z_PARTIAL_FLUSH: 1,
				Z_SYNC_FLUSH: 2,
				Z_FULL_FLUSH: 3,
				Z_FINISH: 4,
				Z_BLOCK: 5,
				Z_TREES: 6,
				Z_OK: 0,
				Z_STREAM_END: 1,
				Z_NEED_DICT: 2,
				Z_ERRNO: -1,
				Z_STREAM_ERROR: -2,
				Z_DATA_ERROR: -3,
				Z_BUF_ERROR: -5,
				Z_NO_COMPRESSION: 0,
				Z_BEST_SPEED: 1,
				Z_BEST_COMPRESSION: 9,
				Z_DEFAULT_COMPRESSION: -1,
				Z_FILTERED: 1,
				Z_HUFFMAN_ONLY: 2,
				Z_RLE: 3,
				Z_FIXED: 4,
				Z_DEFAULT_STRATEGY: 0,
				Z_BINARY: 0,
				Z_TEXT: 1,
				Z_UNKNOWN: 2,
				Z_DEFLATED: 8,
			})),
		Of
	)
}
var Df, Ev
function V1() {
	if (Ev) return Df
	Ev = 1
	function e() {
		;((this.text = 0),
			(this.time = 0),
			(this.xflags = 0),
			(this.os = 0),
			(this.extra = null),
			(this.extra_len = 0),
			(this.name = ''),
			(this.comment = ''),
			(this.hcrc = 0),
			(this.done = !1))
	}
	return ((Df = e), Df)
}
var kv
function Z1() {
	if (kv) return Da
	kv = 1
	var e = $1(),
		t = Di(),
		r = v_(),
		n = g_(),
		i = qc(),
		s = p_(),
		l = V1(),
		f = Object.prototype.toString
	function c(g) {
		if (!(this instanceof c)) return new c(g)
		this.options = t.assign({chunkSize: 16384, windowBits: 0, to: ''}, g || {})
		var v = this.options
		;(v.raw &&
			v.windowBits >= 0 &&
			v.windowBits < 16 &&
			((v.windowBits = -v.windowBits),
			v.windowBits === 0 && (v.windowBits = -15)),
			v.windowBits >= 0 &&
				v.windowBits < 16 &&
				!(g && g.windowBits) &&
				(v.windowBits += 32),
			v.windowBits > 15 &&
				v.windowBits < 48 &&
				(v.windowBits & 15) === 0 &&
				(v.windowBits |= 15),
			(this.err = 0),
			(this.msg = ''),
			(this.ended = !1),
			(this.chunks = []),
			(this.strm = new s()),
			(this.strm.avail_out = 0))
		var _ = e.inflateInit2(this.strm, v.windowBits)
		if (_ !== n.Z_OK) throw new Error(i[_])
		if (
			((this.header = new l()),
			e.inflateGetHeader(this.strm, this.header),
			v.dictionary &&
				(typeof v.dictionary == 'string'
					? (v.dictionary = r.string2buf(v.dictionary))
					: f.call(v.dictionary) === '[object ArrayBuffer]' &&
						(v.dictionary = new Uint8Array(v.dictionary)),
				v.raw &&
					((_ = e.inflateSetDictionary(this.strm, v.dictionary)),
					_ !== n.Z_OK)))
		)
			throw new Error(i[_])
	}
	;((c.prototype.push = function (g, v) {
		var _ = this.strm,
			S = this.options.chunkSize,
			x = this.options.dictionary,
			R,
			b,
			A,
			L,
			N,
			U = !1
		if (this.ended) return !1
		;((b = v === ~~v ? v : v === !0 ? n.Z_FINISH : n.Z_NO_FLUSH),
			typeof g == 'string'
				? (_.input = r.binstring2buf(g))
				: f.call(g) === '[object ArrayBuffer]'
					? (_.input = new Uint8Array(g))
					: (_.input = g),
			(_.next_in = 0),
			(_.avail_in = _.input.length))
		do {
			if (
				(_.avail_out === 0 &&
					((_.output = new t.Buf8(S)), (_.next_out = 0), (_.avail_out = S)),
				(R = e.inflate(_, n.Z_NO_FLUSH)),
				R === n.Z_NEED_DICT && x && (R = e.inflateSetDictionary(this.strm, x)),
				R === n.Z_BUF_ERROR && U === !0 && ((R = n.Z_OK), (U = !1)),
				R !== n.Z_STREAM_END && R !== n.Z_OK)
			)
				return (this.onEnd(R), (this.ended = !0), !1)
			;(_.next_out &&
				(_.avail_out === 0 ||
					R === n.Z_STREAM_END ||
					(_.avail_in === 0 && (b === n.Z_FINISH || b === n.Z_SYNC_FLUSH))) &&
				(this.options.to === 'string'
					? ((A = r.utf8border(_.output, _.next_out)),
						(L = _.next_out - A),
						(N = r.buf2string(_.output, A)),
						(_.next_out = L),
						(_.avail_out = S - L),
						L && t.arraySet(_.output, _.output, A, L, 0),
						this.onData(N))
					: this.onData(t.shrinkBuf(_.output, _.next_out))),
				_.avail_in === 0 && _.avail_out === 0 && (U = !0))
		} while ((_.avail_in > 0 || _.avail_out === 0) && R !== n.Z_STREAM_END)
		return (
			R === n.Z_STREAM_END && (b = n.Z_FINISH),
			b === n.Z_FINISH
				? ((R = e.inflateEnd(this.strm)),
					this.onEnd(R),
					(this.ended = !0),
					R === n.Z_OK)
				: (b === n.Z_SYNC_FLUSH && (this.onEnd(n.Z_OK), (_.avail_out = 0)), !0)
		)
	}),
		(c.prototype.onData = function (g) {
			this.chunks.push(g)
		}),
		(c.prototype.onEnd = function (g) {
			;(g === n.Z_OK &&
				(this.options.to === 'string'
					? (this.result = this.chunks.join(''))
					: (this.result = t.flattenChunks(this.chunks))),
				(this.chunks = []),
				(this.err = g),
				(this.msg = this.strm.msg))
		}))
	function m(g, v) {
		var _ = new c(v)
		if ((_.push(g, !0), _.err)) throw _.msg || i[_.err]
		return _.result
	}
	function y(g, v) {
		return ((v = v || {}), (v.raw = !0), m(g, v))
	}
	return (
		(Da.Inflate = c),
		(Da.inflate = m),
		(Da.inflateRaw = y),
		(Da.ungzip = m),
		Da
	)
}
var Pf, xv
function Y1() {
	if (xv) return Pf
	xv = 1
	var e = Di().assign,
		t = W1(),
		r = Z1(),
		n = g_(),
		i = {}
	return (e(i, t, r, n), (Pf = i), Pf)
}
var Av
function X1() {
	if (Av) return To
	Av = 1
	var e =
			typeof Uint8Array < 'u' &&
			typeof Uint16Array < 'u' &&
			typeof Uint32Array < 'u',
		t = Y1(),
		r = Zt(),
		n = gn(),
		i = e ? 'uint8array' : 'array'
	To.magic = '\b\0'
	function s(l, f) {
		;(n.call(this, 'FlateWorker/' + l),
			(this._pako = null),
			(this._pakoAction = l),
			(this._pakoOptions = f),
			(this.meta = {}))
	}
	return (
		r.inherits(s, n),
		(s.prototype.processChunk = function (l) {
			;((this.meta = l.meta),
				this._pako === null && this._createPako(),
				this._pako.push(r.transformTo(i, l.data), !1))
		}),
		(s.prototype.flush = function () {
			;(n.prototype.flush.call(this),
				this._pako === null && this._createPako(),
				this._pako.push([], !0))
		}),
		(s.prototype.cleanUp = function () {
			;(n.prototype.cleanUp.call(this), (this._pako = null))
		}),
		(s.prototype._createPako = function () {
			this._pako = new t[this._pakoAction]({
				raw: !0,
				level: this._pakoOptions.level || -1,
			})
			var l = this
			this._pako.onData = function (f) {
				l.push({data: f, meta: l.meta})
			}
		}),
		(To.compressWorker = function (l) {
			return new s('Deflate', l)
		}),
		(To.uncompressWorker = function () {
			return new s('Inflate', {})
		}),
		To
	)
}
var Tv
function __() {
	if (Tv) return Qs
	Tv = 1
	var e = gn()
	return (
		(Qs.STORE = {
			magic: '\0\0',
			compressWorker: function () {
				return new e('STORE compression')
			},
			uncompressWorker: function () {
				return new e('STORE decompression')
			},
		}),
		(Qs.DEFLATE = X1()),
		Qs
	)
}
var mi = {},
	Iv
function m_() {
	return (
		Iv ||
			((Iv = 1),
			(mi.LOCAL_FILE_HEADER = 'PK'),
			(mi.CENTRAL_FILE_HEADER = 'PK'),
			(mi.CENTRAL_DIRECTORY_END = 'PK'),
			(mi.ZIP64_CENTRAL_DIRECTORY_LOCATOR = 'PK\x07'),
			(mi.ZIP64_CENTRAL_DIRECTORY_END = 'PK'),
			(mi.DATA_DESCRIPTOR = 'PK\x07\b')),
		mi
	)
}
var Lf, Rv
function Q1() {
	if (Rv) return Lf
	Rv = 1
	var e = Zt(),
		t = gn(),
		r = _s(),
		n = Uc(),
		i = m_(),
		s = function (v, _) {
			var S = '',
				x
			for (x = 0; x < _; x++)
				((S += String.fromCharCode(v & 255)), (v = v >>> 8))
			return S
		},
		l = function (v, _) {
			var S = v
			return (v || (S = _ ? 16893 : 33204), (S & 65535) << 16)
		},
		f = function (v) {
			return (v || 0) & 63
		},
		c = function (v, _, S, x, R, b) {
			var A = v.file,
				L = v.compression,
				N = b !== r.utf8encode,
				U = e.transformTo('string', b(A.name)),
				ee = e.transformTo('string', r.utf8encode(A.name)),
				X = A.comment,
				ve = e.transformTo('string', b(X)),
				ge = e.transformTo('string', r.utf8encode(X)),
				ye = ee.length !== A.name.length,
				Ne = ge.length !== X.length,
				je,
				Ee,
				Me = '',
				Qe = '',
				pt = '',
				j = A.dir,
				G = A.date,
				$ = {crc32: 0, compressedSize: 0, uncompressedSize: 0}
			;(!_ || S) &&
				(($.crc32 = v.crc32),
				($.compressedSize = v.compressedSize),
				($.uncompressedSize = v.uncompressedSize))
			var _e = 0
			;(_ && (_e |= 8), !N && (ye || Ne) && (_e |= 2048))
			var Ie = 0,
				xe = 0
			;(j && (Ie |= 16),
				R === 'UNIX'
					? ((xe = 798), (Ie |= l(A.unixPermissions, j)))
					: ((xe = 20), (Ie |= f(A.dosPermissions))),
				(je = G.getUTCHours()),
				(je = je << 6),
				(je = je | G.getUTCMinutes()),
				(je = je << 5),
				(je = je | (G.getUTCSeconds() / 2)),
				(Ee = G.getUTCFullYear() - 1980),
				(Ee = Ee << 4),
				(Ee = Ee | (G.getUTCMonth() + 1)),
				(Ee = Ee << 5),
				(Ee = Ee | G.getUTCDate()),
				ye &&
					((Qe = s(1, 1) + s(n(U), 4) + ee),
					(Me += 'up' + s(Qe.length, 2) + Qe)),
				Ne &&
					((pt = s(1, 1) + s(n(ve), 4) + ge),
					(Me += 'uc' + s(pt.length, 2) + pt)))
			var ze = ''
			;((ze += `
\0`),
				(ze += s(_e, 2)),
				(ze += L.magic),
				(ze += s(je, 2)),
				(ze += s(Ee, 2)),
				(ze += s($.crc32, 4)),
				(ze += s($.compressedSize, 4)),
				(ze += s($.uncompressedSize, 4)),
				(ze += s(U.length, 2)),
				(ze += s(Me.length, 2)))
			var ft = i.LOCAL_FILE_HEADER + ze + U + Me,
				it =
					i.CENTRAL_FILE_HEADER +
					s(xe, 2) +
					ze +
					s(ve.length, 2) +
					'\0\0\0\0' +
					s(Ie, 4) +
					s(x, 4) +
					U +
					Me +
					ve
			return {fileRecord: ft, dirRecord: it}
		},
		m = function (v, _, S, x, R) {
			var b = '',
				A = e.transformTo('string', R(x))
			return (
				(b =
					i.CENTRAL_DIRECTORY_END +
					'\0\0\0\0' +
					s(v, 2) +
					s(v, 2) +
					s(_, 4) +
					s(S, 4) +
					s(A.length, 2) +
					A),
				b
			)
		},
		y = function (v) {
			var _ = ''
			return (
				(_ =
					i.DATA_DESCRIPTOR +
					s(v.crc32, 4) +
					s(v.compressedSize, 4) +
					s(v.uncompressedSize, 4)),
				_
			)
		}
	function g(v, _, S, x) {
		;(t.call(this, 'ZipFileWorker'),
			(this.bytesWritten = 0),
			(this.zipComment = _),
			(this.zipPlatform = S),
			(this.encodeFileName = x),
			(this.streamFiles = v),
			(this.accumulate = !1),
			(this.contentBuffer = []),
			(this.dirRecords = []),
			(this.currentSourceOffset = 0),
			(this.entriesCount = 0),
			(this.currentFile = null),
			(this._sources = []))
	}
	return (
		e.inherits(g, t),
		(g.prototype.push = function (v) {
			var _ = v.meta.percent || 0,
				S = this.entriesCount,
				x = this._sources.length
			this.accumulate
				? this.contentBuffer.push(v)
				: ((this.bytesWritten += v.data.length),
					t.prototype.push.call(this, {
						data: v.data,
						meta: {
							currentFile: this.currentFile,
							percent: S ? (_ + 100 * (S - x - 1)) / S : 100,
						},
					}))
		}),
		(g.prototype.openedSource = function (v) {
			;((this.currentSourceOffset = this.bytesWritten),
				(this.currentFile = v.file.name))
			var _ = this.streamFiles && !v.file.dir
			if (_) {
				var S = c(
					v,
					_,
					!1,
					this.currentSourceOffset,
					this.zipPlatform,
					this.encodeFileName,
				)
				this.push({data: S.fileRecord, meta: {percent: 0}})
			} else this.accumulate = !0
		}),
		(g.prototype.closedSource = function (v) {
			this.accumulate = !1
			var _ = this.streamFiles && !v.file.dir,
				S = c(
					v,
					_,
					!0,
					this.currentSourceOffset,
					this.zipPlatform,
					this.encodeFileName,
				)
			if ((this.dirRecords.push(S.dirRecord), _))
				this.push({data: y(v), meta: {percent: 100}})
			else
				for (
					this.push({data: S.fileRecord, meta: {percent: 0}});
					this.contentBuffer.length;
				)
					this.push(this.contentBuffer.shift())
			this.currentFile = null
		}),
		(g.prototype.flush = function () {
			for (var v = this.bytesWritten, _ = 0; _ < this.dirRecords.length; _++)
				this.push({data: this.dirRecords[_], meta: {percent: 100}})
			var S = this.bytesWritten - v,
				x = m(
					this.dirRecords.length,
					S,
					v,
					this.zipComment,
					this.encodeFileName,
				)
			this.push({data: x, meta: {percent: 100}})
		}),
		(g.prototype.prepareNextSource = function () {
			;((this.previous = this._sources.shift()),
				this.openedSource(this.previous.streamInfo),
				this.isPaused ? this.previous.pause() : this.previous.resume())
		}),
		(g.prototype.registerPrevious = function (v) {
			this._sources.push(v)
			var _ = this
			return (
				v.on('data', function (S) {
					_.processChunk(S)
				}),
				v.on('end', function () {
					;(_.closedSource(_.previous.streamInfo),
						_._sources.length ? _.prepareNextSource() : _.end())
				}),
				v.on('error', function (S) {
					_.error(S)
				}),
				this
			)
		}),
		(g.prototype.resume = function () {
			if (!t.prototype.resume.call(this)) return !1
			if (!this.previous && this._sources.length)
				return (this.prepareNextSource(), !0)
			if (!this.previous && !this._sources.length && !this.generatedError)
				return (this.end(), !0)
		}),
		(g.prototype.error = function (v) {
			var _ = this._sources
			if (!t.prototype.error.call(this, v)) return !1
			for (var S = 0; S < _.length; S++)
				try {
					_[S].error(v)
				} catch {}
			return !0
		}),
		(g.prototype.lock = function () {
			t.prototype.lock.call(this)
			for (var v = this._sources, _ = 0; _ < v.length; _++) v[_].lock()
		}),
		(Lf = g),
		Lf
	)
}
var Cv
function J1() {
	if (Cv) return Ef
	Cv = 1
	var e = __(),
		t = Q1(),
		r = function (n, i) {
			var s = n || i,
				l = e[s]
			if (!l) throw new Error(s + ' is not a valid compression method !')
			return l
		}
	return (
		(Ef.generateWorker = function (n, i, s) {
			var l = new t(i.streamFiles, s, i.platform, i.encodeFileName),
				f = 0
			try {
				;(n.forEach(function (c, m) {
					f++
					var y = r(m.options.compression, i.compression),
						g = m.options.compressionOptions || i.compressionOptions || {},
						v = m.dir,
						_ = m.date
					m._compressWorker(y, g)
						.withStreamInfo('file', {
							name: c,
							dir: v,
							date: _,
							comment: m.comment || '',
							unixPermissions: m.unixPermissions,
							dosPermissions: m.dosPermissions,
						})
						.pipe(l)
				}),
					(l.entriesCount = f))
			} catch (c) {
				l.error(c)
			}
			return l
		}),
		Ef
	)
}
var Mf, Ov
function eS() {
	if (Ov) return Mf
	Ov = 1
	var e = Zt(),
		t = gn()
	function r(n, i) {
		;(t.call(this, 'Nodejs stream input adapter for ' + n),
			(this._upstreamEnded = !1),
			this._bindStream(i))
	}
	return (
		e.inherits(r, t),
		(r.prototype._bindStream = function (n) {
			var i = this
			;((this._stream = n),
				n.pause(),
				n
					.on('data', function (s) {
						i.push({data: s, meta: {percent: 0}})
					})
					.on('error', function (s) {
						i.isPaused ? (this.generatedError = s) : i.error(s)
					})
					.on('end', function () {
						i.isPaused ? (i._upstreamEnded = !0) : i.end()
					}))
		}),
		(r.prototype.pause = function () {
			return t.prototype.pause.call(this) ? (this._stream.pause(), !0) : !1
		}),
		(r.prototype.resume = function () {
			return t.prototype.resume.call(this)
				? (this._upstreamEnded ? this.end() : this._stream.resume(), !0)
				: !1
		}),
		(Mf = r),
		Mf
	)
}
var Nf, Dv
function tS() {
	if (Dv) return Nf
	Dv = 1
	var e = _s(),
		t = Zt(),
		r = gn(),
		n = l_(),
		i = u_(),
		s = zc(),
		l = z1(),
		f = J1(),
		c = Yl(),
		m = eS(),
		y = function (R, b, A) {
			var L = t.getTypeOf(b),
				N,
				U = t.extend(A || {}, i)
			;((U.date = U.date || new Date()),
				U.compression !== null && (U.compression = U.compression.toUpperCase()),
				typeof U.unixPermissions == 'string' &&
					(U.unixPermissions = parseInt(U.unixPermissions, 8)),
				U.unixPermissions && U.unixPermissions & 16384 && (U.dir = !0),
				U.dosPermissions && U.dosPermissions & 16 && (U.dir = !0),
				U.dir && (R = v(R)),
				U.createFolders && (N = g(R)) && _.call(this, N, !0))
			var ee = L === 'string' && U.binary === !1 && U.base64 === !1
			;(!A || typeof A.binary > 'u') && (U.binary = !ee)
			var X = b instanceof s && b.uncompressedSize === 0
			;(X || U.dir || !b || b.length === 0) &&
				((U.base64 = !1),
				(U.binary = !0),
				(b = ''),
				(U.compression = 'STORE'),
				(L = 'string'))
			var ve = null
			b instanceof s || b instanceof r
				? (ve = b)
				: c.isNode && c.isStream(b)
					? (ve = new m(R, b))
					: (ve = t.prepareContent(
							R,
							b,
							U.binary,
							U.optimizedBinaryString,
							U.base64,
						))
			var ge = new l(R, ve, U)
			this.files[R] = ge
		},
		g = function (R) {
			R.slice(-1) === '/' && (R = R.substring(0, R.length - 1))
			var b = R.lastIndexOf('/')
			return b > 0 ? R.substring(0, b) : ''
		},
		v = function (R) {
			return (R.slice(-1) !== '/' && (R += '/'), R)
		},
		_ = function (R, b) {
			return (
				(b = typeof b < 'u' ? b : i.createFolders),
				(R = v(R)),
				this.files[R] || y.call(this, R, null, {dir: !0, createFolders: b}),
				this.files[R]
			)
		}
	function S(R) {
		return Object.prototype.toString.call(R) === '[object RegExp]'
	}
	var x = {
		load: function () {
			throw new Error(
				'This method has been removed in JSZip 3.0, please check the upgrade guide.',
			)
		},
		forEach: function (R) {
			var b, A, L
			for (b in this.files)
				((L = this.files[b]),
					(A = b.slice(this.root.length, b.length)),
					A && b.slice(0, this.root.length) === this.root && R(A, L))
		},
		filter: function (R) {
			var b = []
			return (
				this.forEach(function (A, L) {
					R(A, L) && b.push(L)
				}),
				b
			)
		},
		file: function (R, b, A) {
			if (arguments.length === 1)
				if (S(R)) {
					var L = R
					return this.filter(function (U, ee) {
						return !ee.dir && L.test(U)
					})
				} else {
					var N = this.files[this.root + R]
					return N && !N.dir ? N : null
				}
			else ((R = this.root + R), y.call(this, R, b, A))
			return this
		},
		folder: function (R) {
			if (!R) return this
			if (S(R))
				return this.filter(function (N, U) {
					return U.dir && R.test(N)
				})
			var b = this.root + R,
				A = _.call(this, b),
				L = this.clone()
			return ((L.root = A.name), L)
		},
		remove: function (R) {
			R = this.root + R
			var b = this.files[R]
			if (
				(b || (R.slice(-1) !== '/' && (R += '/'), (b = this.files[R])),
				b && !b.dir)
			)
				delete this.files[R]
			else
				for (
					var A = this.filter(function (N, U) {
							return U.name.slice(0, R.length) === R
						}),
						L = 0;
					L < A.length;
					L++
				)
					delete this.files[A[L].name]
			return this
		},
		generate: function () {
			throw new Error(
				'This method has been removed in JSZip 3.0, please check the upgrade guide.',
			)
		},
		generateInternalStream: function (R) {
			var b,
				A = {}
			try {
				if (
					((A = t.extend(R || {}, {
						streamFiles: !1,
						compression: 'STORE',
						compressionOptions: null,
						type: '',
						platform: 'DOS',
						comment: null,
						mimeType: 'application/zip',
						encodeFileName: e.utf8encode,
					})),
					(A.type = A.type.toLowerCase()),
					(A.compression = A.compression.toUpperCase()),
					A.type === 'binarystring' && (A.type = 'string'),
					!A.type)
				)
					throw new Error('No output type specified.')
				;(t.checkSupport(A.type),
					(A.platform === 'darwin' ||
						A.platform === 'freebsd' ||
						A.platform === 'linux' ||
						A.platform === 'sunos') &&
						(A.platform = 'UNIX'),
					A.platform === 'win32' && (A.platform = 'DOS'))
				var L = A.comment || this.comment || ''
				b = f.generateWorker(this, A, L)
			} catch (N) {
				;((b = new r('error')), b.error(N))
			}
			return new n(b, A.type || 'string', A.mimeType)
		},
		generateAsync: function (R, b) {
			return this.generateInternalStream(R).accumulate(b)
		},
		generateNodeStream: function (R, b) {
			return (
				(R = R || {}),
				R.type || (R.type = 'nodebuffer'),
				this.generateInternalStream(R).toNodejsStream(b)
			)
		},
	}
	return ((Nf = x), Nf)
}
var Bf, Pv
function y_() {
	if (Pv) return Bf
	Pv = 1
	var e = Zt()
	function t(r) {
		;((this.data = r),
			(this.length = r.length),
			(this.index = 0),
			(this.zero = 0))
	}
	return (
		(t.prototype = {
			checkOffset: function (r) {
				this.checkIndex(this.index + r)
			},
			checkIndex: function (r) {
				if (this.length < this.zero + r || r < 0)
					throw new Error(
						'End of data reached (data length = ' +
							this.length +
							', asked index = ' +
							r +
							'). Corrupted zip ?',
					)
			},
			setIndex: function (r) {
				;(this.checkIndex(r), (this.index = r))
			},
			skip: function (r) {
				this.setIndex(this.index + r)
			},
			byteAt: function () {},
			readInt: function (r) {
				var n = 0,
					i
				for (this.checkOffset(r), i = this.index + r - 1; i >= this.index; i--)
					n = (n << 8) + this.byteAt(i)
				return ((this.index += r), n)
			},
			readString: function (r) {
				return e.transformTo('string', this.readData(r))
			},
			readData: function () {},
			lastIndexOfSignature: function () {},
			readAndCheckSignature: function () {},
			readDate: function () {
				var r = this.readInt(4)
				return new Date(
					Date.UTC(
						((r >> 25) & 127) + 1980,
						((r >> 21) & 15) - 1,
						(r >> 16) & 31,
						(r >> 11) & 31,
						(r >> 5) & 63,
						(r & 31) << 1,
					),
				)
			},
		}),
		(Bf = t),
		Bf
	)
}
var Ff, Lv
function b_() {
	if (Lv) return Ff
	Lv = 1
	var e = y_(),
		t = Zt()
	function r(n) {
		e.call(this, n)
		for (var i = 0; i < this.data.length; i++) n[i] = n[i] & 255
	}
	return (
		t.inherits(r, e),
		(r.prototype.byteAt = function (n) {
			return this.data[this.zero + n]
		}),
		(r.prototype.lastIndexOfSignature = function (n) {
			for (
				var i = n.charCodeAt(0),
					s = n.charCodeAt(1),
					l = n.charCodeAt(2),
					f = n.charCodeAt(3),
					c = this.length - 4;
				c >= 0;
				--c
			)
				if (
					this.data[c] === i &&
					this.data[c + 1] === s &&
					this.data[c + 2] === l &&
					this.data[c + 3] === f
				)
					return c - this.zero
			return -1
		}),
		(r.prototype.readAndCheckSignature = function (n) {
			var i = n.charCodeAt(0),
				s = n.charCodeAt(1),
				l = n.charCodeAt(2),
				f = n.charCodeAt(3),
				c = this.readData(4)
			return i === c[0] && s === c[1] && l === c[2] && f === c[3]
		}),
		(r.prototype.readData = function (n) {
			if ((this.checkOffset(n), n === 0)) return []
			var i = this.data.slice(
				this.zero + this.index,
				this.zero + this.index + n,
			)
			return ((this.index += n), i)
		}),
		(Ff = r),
		Ff
	)
}
var jf, Mv
function rS() {
	if (Mv) return jf
	Mv = 1
	var e = y_(),
		t = Zt()
	function r(n) {
		e.call(this, n)
	}
	return (
		t.inherits(r, e),
		(r.prototype.byteAt = function (n) {
			return this.data.charCodeAt(this.zero + n)
		}),
		(r.prototype.lastIndexOfSignature = function (n) {
			return this.data.lastIndexOf(n) - this.zero
		}),
		(r.prototype.readAndCheckSignature = function (n) {
			var i = this.readData(4)
			return n === i
		}),
		(r.prototype.readData = function (n) {
			this.checkOffset(n)
			var i = this.data.slice(
				this.zero + this.index,
				this.zero + this.index + n,
			)
			return ((this.index += n), i)
		}),
		(jf = r),
		jf
	)
}
var Uf, Nv
function w_() {
	if (Nv) return Uf
	Nv = 1
	var e = b_(),
		t = Zt()
	function r(n) {
		e.call(this, n)
	}
	return (
		t.inherits(r, e),
		(r.prototype.readData = function (n) {
			if ((this.checkOffset(n), n === 0)) return new Uint8Array(0)
			var i = this.data.subarray(
				this.zero + this.index,
				this.zero + this.index + n,
			)
			return ((this.index += n), i)
		}),
		(Uf = r),
		Uf
	)
}
var zf, Bv
function nS() {
	if (Bv) return zf
	Bv = 1
	var e = w_(),
		t = Zt()
	function r(n) {
		e.call(this, n)
	}
	return (
		t.inherits(r, e),
		(r.prototype.readData = function (n) {
			this.checkOffset(n)
			var i = this.data.slice(
				this.zero + this.index,
				this.zero + this.index + n,
			)
			return ((this.index += n), i)
		}),
		(zf = r),
		zf
	)
}
var qf, Fv
function S_() {
	if (Fv) return qf
	Fv = 1
	var e = Zt(),
		t = Oi(),
		r = b_(),
		n = rS(),
		i = nS(),
		s = w_()
	return (
		(qf = function (l) {
			var f = e.getTypeOf(l)
			return (
				e.checkSupport(f),
				f === 'string' && !t.uint8array
					? new n(l)
					: f === 'nodebuffer'
						? new i(l)
						: t.uint8array
							? new s(e.transformTo('uint8array', l))
							: new r(e.transformTo('array', l))
			)
		}),
		qf
	)
}
var Kf, jv
function iS() {
	if (jv) return Kf
	jv = 1
	var e = S_(),
		t = Zt(),
		r = zc(),
		n = Uc(),
		i = _s(),
		s = __(),
		l = Oi(),
		f = 0,
		c = 3,
		m = function (g) {
			for (var v in s)
				if (Object.prototype.hasOwnProperty.call(s, v) && s[v].magic === g)
					return s[v]
			return null
		}
	function y(g, v) {
		;((this.options = g), (this.loadOptions = v))
	}
	return (
		(y.prototype = {
			isEncrypted: function () {
				return (this.bitFlag & 1) === 1
			},
			useUTF8: function () {
				return (this.bitFlag & 2048) === 2048
			},
			readLocalPart: function (g) {
				var v, _
				if (
					(g.skip(22),
					(this.fileNameLength = g.readInt(2)),
					(_ = g.readInt(2)),
					(this.fileName = g.readData(this.fileNameLength)),
					g.skip(_),
					this.compressedSize === -1 || this.uncompressedSize === -1)
				)
					throw new Error(
						"Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)",
					)
				if (((v = m(this.compressionMethod)), v === null))
					throw new Error(
						'Corrupted zip : compression ' +
							t.pretty(this.compressionMethod) +
							' unknown (inner file : ' +
							t.transformTo('string', this.fileName) +
							')',
					)
				this.decompressed = new r(
					this.compressedSize,
					this.uncompressedSize,
					this.crc32,
					v,
					g.readData(this.compressedSize),
				)
			},
			readCentralPart: function (g) {
				;((this.versionMadeBy = g.readInt(2)),
					g.skip(2),
					(this.bitFlag = g.readInt(2)),
					(this.compressionMethod = g.readString(2)),
					(this.date = g.readDate()),
					(this.crc32 = g.readInt(4)),
					(this.compressedSize = g.readInt(4)),
					(this.uncompressedSize = g.readInt(4)))
				var v = g.readInt(2)
				if (
					((this.extraFieldsLength = g.readInt(2)),
					(this.fileCommentLength = g.readInt(2)),
					(this.diskNumberStart = g.readInt(2)),
					(this.internalFileAttributes = g.readInt(2)),
					(this.externalFileAttributes = g.readInt(4)),
					(this.localHeaderOffset = g.readInt(4)),
					this.isEncrypted())
				)
					throw new Error('Encrypted zip are not supported')
				;(g.skip(v),
					this.readExtraFields(g),
					this.parseZIP64ExtraField(g),
					(this.fileComment = g.readData(this.fileCommentLength)))
			},
			processAttributes: function () {
				;((this.unixPermissions = null), (this.dosPermissions = null))
				var g = this.versionMadeBy >> 8
				;((this.dir = !!(this.externalFileAttributes & 16)),
					g === f && (this.dosPermissions = this.externalFileAttributes & 63),
					g === c &&
						(this.unixPermissions =
							(this.externalFileAttributes >> 16) & 65535),
					!this.dir && this.fileNameStr.slice(-1) === '/' && (this.dir = !0))
			},
			parseZIP64ExtraField: function () {
				if (this.extraFields[1]) {
					var g = e(this.extraFields[1].value)
					;(this.uncompressedSize === t.MAX_VALUE_32BITS &&
						(this.uncompressedSize = g.readInt(8)),
						this.compressedSize === t.MAX_VALUE_32BITS &&
							(this.compressedSize = g.readInt(8)),
						this.localHeaderOffset === t.MAX_VALUE_32BITS &&
							(this.localHeaderOffset = g.readInt(8)),
						this.diskNumberStart === t.MAX_VALUE_32BITS &&
							(this.diskNumberStart = g.readInt(4)))
				}
			},
			readExtraFields: function (g) {
				var v = g.index + this.extraFieldsLength,
					_,
					S,
					x
				for (this.extraFields || (this.extraFields = {}); g.index + 4 < v;)
					((_ = g.readInt(2)),
						(S = g.readInt(2)),
						(x = g.readData(S)),
						(this.extraFields[_] = {id: _, length: S, value: x}))
				g.setIndex(v)
			},
			handleUTF8: function () {
				var g = l.uint8array ? 'uint8array' : 'array'
				if (this.useUTF8())
					((this.fileNameStr = i.utf8decode(this.fileName)),
						(this.fileCommentStr = i.utf8decode(this.fileComment)))
				else {
					var v = this.findExtraFieldUnicodePath()
					if (v !== null) this.fileNameStr = v
					else {
						var _ = t.transformTo(g, this.fileName)
						this.fileNameStr = this.loadOptions.decodeFileName(_)
					}
					var S = this.findExtraFieldUnicodeComment()
					if (S !== null) this.fileCommentStr = S
					else {
						var x = t.transformTo(g, this.fileComment)
						this.fileCommentStr = this.loadOptions.decodeFileName(x)
					}
				}
			},
			findExtraFieldUnicodePath: function () {
				var g = this.extraFields[28789]
				if (g) {
					var v = e(g.value)
					return v.readInt(1) !== 1 || n(this.fileName) !== v.readInt(4)
						? null
						: i.utf8decode(v.readData(g.length - 5))
				}
				return null
			},
			findExtraFieldUnicodeComment: function () {
				var g = this.extraFields[25461]
				if (g) {
					var v = e(g.value)
					return v.readInt(1) !== 1 || n(this.fileComment) !== v.readInt(4)
						? null
						: i.utf8decode(v.readData(g.length - 5))
				}
				return null
			},
		}),
		(Kf = y),
		Kf
	)
}
var Wf, Uv
function aS() {
	if (Uv) return Wf
	Uv = 1
	var e = S_(),
		t = Zt(),
		r = m_(),
		n = iS(),
		i = Oi()
	function s(l) {
		;((this.files = []), (this.loadOptions = l))
	}
	return (
		(s.prototype = {
			checkSignature: function (l) {
				if (!this.reader.readAndCheckSignature(l)) {
					this.reader.index -= 4
					var f = this.reader.readString(4)
					throw new Error(
						'Corrupted zip or bug: unexpected signature (' +
							t.pretty(f) +
							', expected ' +
							t.pretty(l) +
							')',
					)
				}
			},
			isSignature: function (l, f) {
				var c = this.reader.index
				this.reader.setIndex(l)
				var m = this.reader.readString(4),
					y = m === f
				return (this.reader.setIndex(c), y)
			},
			readBlockEndOfCentral: function () {
				;((this.diskNumber = this.reader.readInt(2)),
					(this.diskWithCentralDirStart = this.reader.readInt(2)),
					(this.centralDirRecordsOnThisDisk = this.reader.readInt(2)),
					(this.centralDirRecords = this.reader.readInt(2)),
					(this.centralDirSize = this.reader.readInt(4)),
					(this.centralDirOffset = this.reader.readInt(4)),
					(this.zipCommentLength = this.reader.readInt(2)))
				var l = this.reader.readData(this.zipCommentLength),
					f = i.uint8array ? 'uint8array' : 'array',
					c = t.transformTo(f, l)
				this.zipComment = this.loadOptions.decodeFileName(c)
			},
			readBlockZip64EndOfCentral: function () {
				;((this.zip64EndOfCentralSize = this.reader.readInt(8)),
					this.reader.skip(4),
					(this.diskNumber = this.reader.readInt(4)),
					(this.diskWithCentralDirStart = this.reader.readInt(4)),
					(this.centralDirRecordsOnThisDisk = this.reader.readInt(8)),
					(this.centralDirRecords = this.reader.readInt(8)),
					(this.centralDirSize = this.reader.readInt(8)),
					(this.centralDirOffset = this.reader.readInt(8)),
					(this.zip64ExtensibleData = {}))
				for (var l = this.zip64EndOfCentralSize - 44, f = 0, c, m, y; f < l;)
					((c = this.reader.readInt(2)),
						(m = this.reader.readInt(4)),
						(y = this.reader.readData(m)),
						(this.zip64ExtensibleData[c] = {id: c, length: m, value: y}))
			},
			readBlockZip64EndOfCentralLocator: function () {
				if (
					((this.diskWithZip64CentralDirStart = this.reader.readInt(4)),
					(this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8)),
					(this.disksCount = this.reader.readInt(4)),
					this.disksCount > 1)
				)
					throw new Error('Multi-volumes zip are not supported')
			},
			readLocalFiles: function () {
				var l, f
				for (l = 0; l < this.files.length; l++)
					((f = this.files[l]),
						this.reader.setIndex(f.localHeaderOffset),
						this.checkSignature(r.LOCAL_FILE_HEADER),
						f.readLocalPart(this.reader),
						f.handleUTF8(),
						f.processAttributes())
			},
			readCentralDir: function () {
				var l
				for (
					this.reader.setIndex(this.centralDirOffset);
					this.reader.readAndCheckSignature(r.CENTRAL_FILE_HEADER);
				)
					((l = new n({zip64: this.zip64}, this.loadOptions)),
						l.readCentralPart(this.reader),
						this.files.push(l))
				if (
					this.centralDirRecords !== this.files.length &&
					this.centralDirRecords !== 0 &&
					this.files.length === 0
				)
					throw new Error(
						'Corrupted zip or bug: expected ' +
							this.centralDirRecords +
							' records in central dir, got ' +
							this.files.length,
					)
			},
			readEndOfCentral: function () {
				var l = this.reader.lastIndexOfSignature(r.CENTRAL_DIRECTORY_END)
				if (l < 0) {
					var f = !this.isSignature(0, r.LOCAL_FILE_HEADER)
					throw f
						? new Error(
								"Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html",
							)
						: new Error("Corrupted zip: can't find end of central directory")
				}
				this.reader.setIndex(l)
				var c = l
				if (
					(this.checkSignature(r.CENTRAL_DIRECTORY_END),
					this.readBlockEndOfCentral(),
					this.diskNumber === t.MAX_VALUE_16BITS ||
						this.diskWithCentralDirStart === t.MAX_VALUE_16BITS ||
						this.centralDirRecordsOnThisDisk === t.MAX_VALUE_16BITS ||
						this.centralDirRecords === t.MAX_VALUE_16BITS ||
						this.centralDirSize === t.MAX_VALUE_32BITS ||
						this.centralDirOffset === t.MAX_VALUE_32BITS)
				) {
					if (
						((this.zip64 = !0),
						(l = this.reader.lastIndexOfSignature(
							r.ZIP64_CENTRAL_DIRECTORY_LOCATOR,
						)),
						l < 0)
					)
						throw new Error(
							"Corrupted zip: can't find the ZIP64 end of central directory locator",
						)
					if (
						(this.reader.setIndex(l),
						this.checkSignature(r.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
						this.readBlockZip64EndOfCentralLocator(),
						!this.isSignature(
							this.relativeOffsetEndOfZip64CentralDir,
							r.ZIP64_CENTRAL_DIRECTORY_END,
						) &&
							((this.relativeOffsetEndOfZip64CentralDir =
								this.reader.lastIndexOfSignature(
									r.ZIP64_CENTRAL_DIRECTORY_END,
								)),
							this.relativeOffsetEndOfZip64CentralDir < 0))
					)
						throw new Error(
							"Corrupted zip: can't find the ZIP64 end of central directory",
						)
					;(this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),
						this.checkSignature(r.ZIP64_CENTRAL_DIRECTORY_END),
						this.readBlockZip64EndOfCentral())
				}
				var m = this.centralDirOffset + this.centralDirSize
				this.zip64 && ((m += 20), (m += 12 + this.zip64EndOfCentralSize))
				var y = c - m
				if (y > 0)
					this.isSignature(c, r.CENTRAL_FILE_HEADER) || (this.reader.zero = y)
				else if (y < 0)
					throw new Error('Corrupted zip: missing ' + Math.abs(y) + ' bytes.')
			},
			prepareReader: function (l) {
				this.reader = e(l)
			},
			load: function (l) {
				;(this.prepareReader(l),
					this.readEndOfCentral(),
					this.readCentralDir(),
					this.readLocalFiles())
			},
		}),
		(Wf = s),
		Wf
	)
}
var Gf, zv
function oS() {
	if (zv) return Gf
	zv = 1
	var e = Zt(),
		t = gs(),
		r = _s(),
		n = aS(),
		i = c_(),
		s = Yl()
	function l(f) {
		return new t.Promise(function (c, m) {
			var y = f.decompressed.getContentWorker().pipe(new i())
			y.on('error', function (g) {
				m(g)
			})
				.on('end', function () {
					y.streamInfo.crc32 !== f.decompressed.crc32
						? m(new Error('Corrupted zip : CRC32 mismatch'))
						: c()
				})
				.resume()
		})
	}
	return (
		(Gf = function (f, c) {
			var m = this
			return (
				(c = e.extend(c || {}, {
					base64: !1,
					checkCRC32: !1,
					optimizedBinaryString: !1,
					createFolders: !1,
					decodeFileName: r.utf8decode,
				})),
				s.isNode && s.isStream(f)
					? t.Promise.reject(
							new Error("JSZip can't accept a stream when loading a zip file."),
						)
					: e
							.prepareContent(
								'the loaded zip file',
								f,
								!0,
								c.optimizedBinaryString,
								c.base64,
							)
							.then(function (y) {
								var g = new n(c)
								return (g.load(y), g)
							})
							.then(function (g) {
								var v = [t.Promise.resolve(g)],
									_ = g.files
								if (c.checkCRC32)
									for (var S = 0; S < _.length; S++) v.push(l(_[S]))
								return t.Promise.all(v)
							})
							.then(function (g) {
								for (var v = g.shift(), _ = v.files, S = 0; S < _.length; S++) {
									var x = _[S],
										R = x.fileNameStr,
										b = e.resolve(x.fileNameStr)
									;(m.file(b, x.decompressed, {
										binary: !0,
										optimizedBinaryString: !0,
										date: x.date,
										dir: x.dir,
										comment: x.fileCommentStr.length ? x.fileCommentStr : null,
										unixPermissions: x.unixPermissions,
										dosPermissions: x.dosPermissions,
										createFolders: c.createFolders,
									}),
										x.dir || (m.file(b).unsafeOriginalName = R))
								}
								return (v.zipComment.length && (m.comment = v.zipComment), m)
							})
			)
		}),
		Gf
	)
}
var Hf, qv
function sS() {
	if (qv) return Hf
	qv = 1
	function e() {
		if (!(this instanceof e)) return new e()
		if (arguments.length)
			throw new Error(
				'The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.',
			)
		;((this.files = Object.create(null)),
			(this.comment = null),
			(this.root = ''),
			(this.clone = function () {
				var t = new e()
				for (var r in this) typeof this[r] != 'function' && (t[r] = this[r])
				return t
			}))
	}
	return (
		(e.prototype = tS()),
		(e.prototype.loadAsync = oS()),
		(e.support = Oi()),
		(e.defaults = u_()),
		(e.version = '3.10.1'),
		(e.loadAsync = function (t, r) {
			return new e().loadAsync(t, r)
		}),
		(e.external = gs()),
		(Hf = e),
		Hf
	)
}
var E_ = sS()
const lS = Wp(E_),
	uS = fm({__proto__: null, default: lS}, [E_])
