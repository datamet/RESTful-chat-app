
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function createAuth() {
        const token = localStorage.getItem('auth') ? localStorage.getItem('auth') : '';
    	const { subscribe, set, update } = writable(token);

    	return {
    		subscribe,
    		set: (value) => {
                set(value);
                localStorage.setItem('auth', value);
            }
    	};
    }

    const auth$1 = createAuth();

    function createUser() {
        const token = localStorage.getItem('user') ? localStorage.getItem('user') : '';
    	const { subscribe, set, update } = writable(token);

    	return {
    		subscribe,
    		set: (value) => {
                set(value);
                localStorage.setItem('user', value);
            }
    	};
    }

    const user = createUser();

    const room = writable(null);

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.37.0 */

    function create_fragment$j(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.37.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 532) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.37.0 */
    const file$h = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$h(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$h, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("to" in $$props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8320) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 23553) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * API endpoints
     */

    const routes = server => { return {
        // User routes
        register: (username, password) => server.post('/api/users', { body: { username, password }}),
        registerBot: (username, password) => server.post('/api/users', { body: { username, password, bot: true }}),
        getUsers: () => server.get('/api/users'),
        getUser: (userID) => server.get(`/api/user/${userID}`),
        deleteUser: (userID) => server.delete(`/api/user/${userID}`),

        // // Token routes
        login: (username, password) => server.post('/api/tokens', { body: { username, password }}),
        getTokens: () => server.get('/api/tokens'),
        extendToken: (tokenID) => server.post(`/api/token/${tokenID}`),
        logout: (tokenID) => server.delete(`/api/token/${tokenID}`),

        // // Chatroom routes
        createRoom: (name) => server.post('/api/rooms', { body: { name }}),
        getRooms: () => server.get('/api/rooms'),
        getRoom: (roomID) => server.get(`/api/room/${roomID}`),
        deleteRoom: (roomID) => server.delete(`/api/room/${roomID}`),

        joinRoom: (roomID, user) => server.post(`/api/room/${roomID}/users`, { body: { user } }),
        getUsersInRoom: (roomID) => server.get(`/api/room/${roomID}/users`),

        getMessages: (roomID) => server.get(`/api/room/${roomID}/messages`),
        postMessage: (roomID, userID, message) => server.post(`/api/room/${roomID}/${userID}/messages`, { body: { message } }),
        getMessagesFromUser: (roomID, userID) => server.get(`/room/${roomID}/${userID}/messages`),
        checkPush: () => server.get('/api/push')
    }};

    var endpoints = (interactor) => {
        return routes(interactor)
    };

    /**
     * Api handler
     */

    const createRequest = middleware => (request) => {
        const req = {
            path: request.path || '/',
            method: request.method || 'GET',
            headers: request.headers || {},
            body: request.body || {}
        };
        const tasks = [...middleware];
        const promise = new Promise((resolve, reject) => {
            const res = {
                status: 200,
                body: {},
                err: (reason) => {
                    reject(reason);
                },
                end: () => {
                    resolve({ status: res.status, body: res.body });
                }
            };
            
            const next = (err) => {
                if (!err) {
                    const task = tasks.shift();
                    if (task) task(req, res, next);
                }
            };

            next();
        });

        return promise
    };

    var api = () => {
        const middleware = [];
        const request = createRequest(middleware);

        return {
            use: (func) => middleware.push(func),
            post: (path, obj) => request({path, method: 'POST', ...obj}),
            get: (path, obj) => request({path, method: 'GET', ...obj}),
            put: (path, obj) => request({path, method: 'PUT', ...obj}),
            delete: (path, obj) => request({path, method: 'DELETE', ...obj})
        }
    };

    /**
     * Config file
     */

    let env;

    if(typeof process === 'object') env = 'node';
    else env = 'browser';

    const config$1 = {
        env,
        push: env === 'node' ? process.env.PUSH || true : true,
        host: env === 'node' ? process.env.HOST || 'localhost' : 'localhost',
        port: env === 'node' ? process.env.PORT || 5000 : 5000,
        wsport: env === 'node' ? process.env.WS_PORT || 5050 : 5050
    };

    // let state = {}
    // let subscribers = []

    class State {
        state
        subscribers

        constructor() {
            this.state = {};
            this.subscribers = [];
        }

        get() {
            return {...this.state}
        }

        update(newState) {
            this.state = { ...this.state, ...newState };
            for (const subscriber of this.subscribers) {
                subscriber({...this.state});
            }
        }

        subscribe(subscriber) { 
            this.subscribers.push(subscriber);
            return () => this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
        }

    }

    var createState = () => new State();

    // export default {
    //     get: () => {return {...state}},
    //     update: (newState) => {
    //         state = { ...state, ...newState }
    //         for (const subscriber of subscribers) {
    //             subscriber({...state})
    //         }
    //     },
    //     subscribe: (subscriber) => { 
    //         subscribers.push(subscriber)
    //         return () => subscribers.splice(subscribers.indexOf(subscriber), 1)
    //     }
    // }

    /**
     * Module that performs an async operation multiple times with a given interval
     * or whenever a push notification is recieved from the server.
     * Mostly used to fetch messages or other information on loop
     */

    // Fetches changes and does callback
    const fetchBackend = async (func, callback, stop) => {
        try {
            const res = await func();
            callback(res);
        }
        catch(err) {
            console.log("Error while fetching. Stopping");
            console.log(err);
            if (errCallback) errCallback();
            stop();
        }
    };

    class Fresh {
        subs
        started

        constructor() {
            this.subs = new Map();
            this.started = false;

            this.createStopper = id => () => {
                this.subs.delete(id);
                clearInterval(id);
            };
        
            this.add = (interval, func, callback, errCallback) => {
        
                const id = setInterval(() => {
                    if (this.started) fetchBackend(func, callback, this.createStopper(id));
                }, interval);
        
                this.subs.set(id, { interval, func, callback, errCallback });
                return this.createStopper(id)  
            };
        
            this.update = () => {
                for (const [id, { func, callback, errCallback }] of this.subs) {
                    fetchBackend(func, callback, this.createStopper(id));
                }
            };
        }

    }

    // const subs = new Map()

    // let started = false

    // // Fetches changes and does callback
    // const fetchBackend = async (func, callback, stop) => {
    //     try {
    //         const res = await func()
    //         callback(res)
    //     }
    //     catch(err) {
    //         console.log("Error while fetching. Stopping")
    //         for (const [id, sub] of subs) console.log(sub.func, sub.callback, sub.interval)
    //         console.log(err)
    //         stop()
    //     }
    // }

    // const createStopper = id => () => {
    //     subs.delete(id)
    //     clearInterval(id)
    // }

    // const add = (interval, func, callback) => {

    //     const id = setInterval(() => {
    //         if (started) fetchBackend(func, callback, createStopper(id))
    //     }, interval)

    //     subs.set(id, { interval, func, callback })
    //     return createStopper(id)  
    // }

    // const update = () => {
    //     for (const [id, { func, callback }] of subs) {
    //         fetchBackend(func, callback, createStopper(id))
    //     }
    // }

    var createFresh = () => new Fresh();

    const browserWS = (url, { update, state }) => {
        let ws;
        let notify = update;

        const createWebsocket = (url) => {
            const ws = new WebSocket(url);

            ws.onerror = (event) => {
                console.log(event);
                ws.close();
            };

            return ws
        };

        const handleMessage = (event) => {
            notify();
        };

        state.subscribe(({ token }) => {
            if (token && !ws) {
                ws = createWebsocket(url);
                ws.onopen = () => ws.send(token);
                ws.onmessage = (event) => handleMessage();
            }
            else if (!token && ws) {
                ws.close();
                ws = null;
            }
        });
    };

    const nodeWS = (url, { SocketModule, update, state }) => {
        let ws;
        let notify = update;

        const createWebsocket = (url, SocketModule) => {
            const ws = new SocketModule(url);

            ws.on('error', (event) => {
                console.log(event);
                ws.close();
            });

            return ws
        };

        const handleMessage = (event) => {
            notify();
        };

        state.subscribe(({ token }) => {
            if (token && !ws) {
                ws = createWebsocket(url, SocketModule);
                ws.on('open', () => ws.send(token));
                ws.on('message', (event) => handleMessage());
            }
            else if (!token && ws) {
                ws.close();
                ws = null;
            }
        });
    };

    var ws = config$1.env === 'browser' ? browserWS : nodeWS;

    /**
     * Authenticator
     * 
     * Responsible for adding token to header
     */

    var auth = state => (req, res, next) => {
        // Exception for create user and login route
        if ((req.path === '/api/users' || req.path === '/api/tokens') && req.method === 'POST') {
            next();
            return
        }

        const { token } = state.get();
        if (token && typeof token === 'string') req.headers['Token'] = token;

        next();
    };

    /**
     * Content Type
     * 
     * Responsible for adding content type to header
     */

    var contentType = (req, res, next) => {
        if (req.method === 'POST' || req.method === 'PUT') req.headers['Content-Type'] = 'application/json';
        next();
    };

    /**
     * Fetching from server
     */

    let config, http;

    // Uses the browsers built in fetch api
    const browserFetch = async (req, res, next) => {
        try {
            const { path, method, headers, body } = req;
            const response = await fetch(`http://${config.host}:${config.port}${path}`, {
                method, 
                headers, 
                body: method === 'POST' || method == 'PUT' ? JSON.stringify(body) : null
            });
            
            if (response.headers.get('Content-Type') === 'application/json; charset=utf-8') {
                const data = await response.json();
                res.status = response.status;
                res.body = data;
            }
            else {
                console.log(await response.text());
            }
            next();
        }
        catch(err) {
            res.status = 408;
            res.body = { error: "Could not connect to the server" };
            next();
        }
    };

    // Uses the http module from the node api.
    const nodeFetch = async (req, res, next) => {
        try {
            const { path, method, headers, body } = req;
            const data = JSON.stringify(body);
            
            const options = {
                hostname: config.host,
                port: config.port,
                path,
                method,
                headers: {
                    ...headers,
                    'Content-Length': data.length
                }
            };
            
            const request = http.request(options, respons => {
                res.status = respons.statusCode;
                
                let data = '';
                respons.on('data', d => {
                    data += d;
                });

                respons.on('end', () => {
                    const body = JSON.parse(data);
                    res.body = body;
                
                    next();
                });
            });
            
            request.on('error', error => {
                console.error(error);
            });
            
            request.write(data);
            request.end();
        }
        catch (err) {
            res.status = 408;
            res.body = { error: "Could not connect to the server" };
            next();
        }
    }; 

    // Returns function that uses the browsers built in fetch module if running in the browser,
    // otherwise returns a function that takes node's http module as an argument to
    // be able to send http requests via node's api.
    // This had to be done because dynamic imports, still are under development
    var fetch$1 = config$1.env === 'browser' ? (options) => { config = options ; return browserFetch} : (options, httpModule) => { 
        http = httpModule;
        config = options;
        return nodeFetch 
    };

    /**
     * Respons handler
     * 
     * Responsible for handeling responses
     */

    var responseHandler = state => (req, res, next) => {
        if (res.body.token && typeof res.body.token === 'string') state.update({ token: res.body.token });
        if (res.body.message && res.body.message === 'Logged out') state.update({ token: null, userID: null });
        if (res.body.message && res.body.message === 'User deleted') state.update({ token: null, userID: null });
        if (res.body.error && res.body.error === 'Session not found') state.update({ token: null, userID: null });
        if (res.body.userID && typeof res.body.userID === 'string') state.update({ userID: res.body.userID });

        res.end();
    };

    /**
     * Client application
     * 
     * This application is created to be able run in both the browser and in nodejs
     */

    const checkPush = async (client) => {
        // Check if server has push notifications enabled
        const res = await client.checkPush();

        // Starting refetch sycle if push notifications are disabled
        // by client or server
        if (res.body.push === 'disabled' || !config$1.push) client.fresh.start();
    };

    var connection = (options, httpModule, SocketModule) => {
        // Throws error if http module not specified and running in node
        if (!httpModule && config$1.env === 'node') throw new Error("Http module is required as input when running in node")
        
        // Adding passed in config options to config file
        if (typeof options === 'object') Object.assign(config$1, options);

        // Creating rest interactor
        const rest = api();

        // Creating state instance
        const state = createState();

        // Telling what the rest interactor should use each time a request is sent
        rest.use(auth(state));
        rest.use(contentType);
        rest.use(fetch$1(config$1, httpModule));
        rest.use(responseHandler(state));

        // Setting up server connecion with rest interactor
        const client = endpoints(rest);
        
        // Appending modules to client
        client.state = state;
        client.fresh = createFresh();

        // Setup websocket connection
        ws(`ws://${config$1.host}:${config$1.wsport}`, { SocketModule, update: client.fresh.update, state });

        // Check if push notifications is enabled on server
        checkPush(client);

        return client
    };

    /* src/assets/chat.svelte generated by Svelte v3.37.0 */

    const file$g = "src/assets/chat.svelte";

    function create_fragment$g(ctx) {
    	let svg;
    	let use;
    	let t;
    	let symbol;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			t = space();
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			xlink_attr(use, "xlink:href", "#icon-bubbles");
    			add_location(use, file$g, 0, 31, 31);
    			attr_dev(svg, "class", "icon icon-bubbles svelte-1m14we6");
    			add_location(svg, file$g, 0, 0, 0);
    			attr_dev(path, "d", "M34 28.161c0 1.422 0.813 2.653 2 3.256v0.498c-0.332 0.045-0.671 0.070-1.016 0.070-2.125 0-4.042-0.892-5.398-2.321-0.819 0.218-1.688 0.336-2.587 0.336-4.971 0-9-3.582-9-8s4.029-8 9-8c4.971 0 9 3.582 9 8 0 1.73-0.618 3.331-1.667 4.64-0.213 0.463-0.333 0.979-0.333 1.522zM16 0c8.702 0 15.781 5.644 15.995 12.672-1.537-0.685-3.237-1.047-4.995-1.047-2.986 0-5.807 1.045-7.942 2.943-2.214 1.968-3.433 4.607-3.433 7.432 0 1.396 0.298 2.747 0.867 3.993-0.163 0.004-0.327 0.007-0.492 0.007-0.849 0-1.682-0.054-2.495-0.158-3.437 3.437-7.539 4.053-11.505 4.144v-0.841c2.142-1.049 4-2.961 4-5.145 0-0.305-0.024-0.604-0.068-0.897-3.619-2.383-5.932-6.024-5.932-10.103 0-7.18 7.163-13 16-13z");
    			add_location(path, file$g, 3, 4, 128);
    			attr_dev(symbol, "id", "icon-bubbles");
    			attr_dev(symbol, "viewBox", "0 0 36 32");
    			add_location(symbol, file$g, 2, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    			insert_dev(target, t, anchor);
    			insert_dev(target, symbol, anchor);
    			append_dev(symbol, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(symbol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chat", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chat> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Chat$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/assets/cross.svelte generated by Svelte v3.37.0 */

    const file$f = "src/assets/cross.svelte";

    function create_fragment$f(ctx) {
    	let svg;
    	let use;
    	let t;
    	let symbol;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			t = space();
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			xlink_attr(use, "xlink:href", "#icon-cross");
    			add_location(use, file$f, 0, 29, 29);
    			attr_dev(svg, "class", "icon icon-cross svelte-1qil70w");
    			add_location(svg, file$f, 0, 0, 0);
    			attr_dev(path, "d", "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z");
    			add_location(path, file$f, 3, 4, 122);
    			attr_dev(symbol, "id", "icon-cross");
    			attr_dev(symbol, "viewBox", "0 0 20 20");
    			add_location(symbol, file$f, 2, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    			insert_dev(target, t, anchor);
    			insert_dev(target, symbol, anchor);
    			append_dev(symbol, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(symbol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cross", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cross> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Cross extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cross",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.37.0 */

    const file$e = "src/components/Button.svelte";

    function create_fragment$e(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*color*/ ctx[1]) + " svelte-1llkmww"));
    			add_location(button, file$e, 4, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*action*/ ctx[0])) /*action*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*color*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*color*/ ctx[1]) + " svelte-1llkmww"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);

    	let { action = () => {
    			
    		} } = $$props,
    		{ color = "blue" } = $$props;

    	const writable_props = ["action", "color"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("action" in $$props) $$invalidate(0, action = $$props.action);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ action, color });

    	$$self.$inject_state = $$props => {
    		if ("action" in $$props) $$invalidate(0, action = $$props.action);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [action, color, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { action: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get action() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DropdownForm.svelte generated by Svelte v3.37.0 */
    const file$d = "src/components/DropdownForm.svelte";

    // (38:4) <Button action={() => open = true}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*action*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*action*/ 1) set_data_dev(t, /*action*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(38:4) <Button action={() => open = true}>",
    		ctx
    	});

    	return block;
    }

    // (39:4) {#if open}
    function create_if_block$6(ctx) {
    	let div4;
    	let div3;
    	let button0;
    	let cross;
    	let t0;
    	let h3;
    	let t1;
    	let t2;
    	let form;
    	let div0;
    	let label0;
    	let t4;
    	let input0;
    	let t5;
    	let div1;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let div2;
    	let p;
    	let t9;
    	let t10;
    	let button1;
    	let div4_intro;
    	let div4_outro;
    	let current;
    	let mounted;
    	let dispose;
    	cross = new Cross({ $$inline: true });

    	button1 = new Button({
    			props: {
    				action: /*submit*/ ctx[5],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			create_component(cross.$$.fragment);
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(/*action*/ ctx[0]);
    			t2 = space();
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username:";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password:";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			p = element("p");
    			t9 = text(/*error*/ ctx[2]);
    			t10 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(button0, "class", "cross svelte-bjlt99");
    			add_location(button0, file$d, 41, 16, 1214);
    			add_location(h3, file$d, 42, 16, 1301);
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$d, 45, 24, 1449);
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$d, 46, 24, 1513);
    			attr_dev(div0, "class", "form-group");
    			add_location(div0, file$d, 44, 20, 1400);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$d, 49, 24, 1665);
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "type", "password");
    			add_location(input1, file$d, 50, 24, 1729);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$d, 48, 20, 1616);
    			add_location(p, file$d, 53, 24, 1880);
    			attr_dev(div2, "class", "error svelte-bjlt99");
    			add_location(div2, file$d, 52, 20, 1836);
    			attr_dev(form, "class", "form svelte-bjlt99");
    			add_location(form, file$d, 43, 16, 1335);
    			attr_dev(div3, "class", "modal svelte-bjlt99");
    			add_location(div3, file$d, 40, 12, 1153);
    			attr_dev(div4, "class", "background svelte-bjlt99");
    			add_location(div4, file$d, 39, 8, 1035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			mount_component(cross, button0, null);
    			append_dev(div3, t0);
    			append_dev(div3, h3);
    			append_dev(h3, t1);
    			append_dev(div3, t2);
    			append_dev(div3, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t4);
    			append_dev(div0, input0);
    			set_input_value(input0, /*username*/ ctx[3]);
    			append_dev(form, t5);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			set_input_value(input1, /*password*/ ctx[4]);
    			append_dev(form, t8);
    			append_dev(form, div2);
    			append_dev(div2, p);
    			append_dev(p, t9);
    			append_dev(form, t10);
    			mount_component(button1, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[11]),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[7]), false, true, false),
    					listen_dev(div3, "click", stop_propagation(/*click_handler*/ ctx[6]), false, false, true),
    					listen_dev(div4, "click", /*click_handler_2*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*action*/ 1) set_data_dev(t1, /*action*/ ctx[0]);

    			if (dirty & /*username*/ 8 && input0.value !== /*username*/ ctx[3]) {
    				set_input_value(input0, /*username*/ ctx[3]);
    			}

    			if (dirty & /*password*/ 16 && input1.value !== /*password*/ ctx[4]) {
    				set_input_value(input1, /*password*/ ctx[4]);
    			}

    			if (!current || dirty & /*error*/ 4) set_data_dev(t9, /*error*/ ctx[2]);
    			const button1_changes = {};

    			if (dirty & /*$$scope, action*/ 65537) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cross.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);

    			add_render_callback(() => {
    				if (div4_outro) div4_outro.end(1);
    				if (!div4_intro) div4_intro = create_in_transition(div4, fade, { duration: 200 });
    				div4_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cross.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			if (div4_intro) div4_intro.invalidate();
    			div4_outro = create_out_transition(div4, fade, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(cross);
    			destroy_component(button1);
    			if (detaching && div4_outro) div4_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(39:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (56:20) <Button action={submit}>
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*action*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*action*/ 1) set_data_dev(t, /*action*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(56:20) <Button action={submit}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let button;
    	let t;
    	let current;

    	button = new Button({
    			props: {
    				action: /*func*/ ctx[8],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*open*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "dropdown svelte-bjlt99");
    			add_location(div, file$d, 36, 0, 932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};
    			if (dirty & /*open*/ 2) button_changes.action = /*func*/ ctx[8];

    			if (dirty & /*$$scope, action*/ 65537) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*open*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DropdownForm", slots, []);
    	let { action = "Register" } = $$props;
    	let open = false, error = "";
    	let username, password;
    	let client = getContext("client");

    	const login = async () => {
    		const res = await client.login(username, password);
    		return res;
    	};

    	const register = async () => {
    		const res = await client.register(username, password);
    		if (res.body.message) login();
    		return res;
    	};

    	const submit = async () => {
    		const func = action === "Register" ? register : login;
    		let res = await func();
    		if (res.body.error) $$invalidate(2, error = res.body.error);

    		if (res.body.message) {
    			$$invalidate(1, open = false);
    			$$invalidate(2, error = "");
    			$$invalidate(3, username = "");
    			$$invalidate(4, password = "");
    		}
    	};

    	const writable_props = ["action"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DropdownForm> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	const func = () => $$invalidate(1, open = true);
    	const click_handler_1 = () => $$invalidate(1, open = false);

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(3, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(4, password);
    	}

    	const click_handler_2 = () => $$invalidate(1, open = false);

    	$$self.$$set = $$props => {
    		if ("action" in $$props) $$invalidate(0, action = $$props.action);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		fade,
    		Cross,
    		Button,
    		action,
    		open,
    		error,
    		username,
    		password,
    		client,
    		login,
    		register,
    		submit
    	});

    	$$self.$inject_state = $$props => {
    		if ("action" in $$props) $$invalidate(0, action = $$props.action);
    		if ("open" in $$props) $$invalidate(1, open = $$props.open);
    		if ("error" in $$props) $$invalidate(2, error = $$props.error);
    		if ("username" in $$props) $$invalidate(3, username = $$props.username);
    		if ("password" in $$props) $$invalidate(4, password = $$props.password);
    		if ("client" in $$props) client = $$props.client;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		action,
    		open,
    		error,
    		username,
    		password,
    		submit,
    		click_handler,
    		submit_handler,
    		func,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler_2
    	];
    }

    class DropdownForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { action: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownForm",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get action() {
    		throw new Error("<DropdownForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<DropdownForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Userinfo.svelte generated by Svelte v3.37.0 */
    const file$c = "src/components/Userinfo.svelte";

    function create_fragment$c(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("You are logged in as ");
    			t1 = text(/*username*/ ctx[0]);
    			attr_dev(p, "class", "svelte-12r322e");
    			add_location(p, file$c, 15, 0, 333);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*username*/ 1) set_data_dev(t1, /*username*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Userinfo", slots, []);
    	const client = getContext("client");
    	let username = "";

    	const getUser = async () => {
    		const res = await client.getUser($user);
    		if (res.body.user) $$invalidate(0, username = res.body.user.username);
    	};

    	getUser();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Userinfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		user,
    		getContext,
    		client,
    		username,
    		getUser,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ("username" in $$props) $$invalidate(0, username = $$props.username);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username];
    }

    class Userinfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Userinfo",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.37.0 */
    const file$b = "src/components/Header.svelte";

    // (34:12) {:else}
    function create_else_block$4(ctx) {
    	let li0;
    	let userinfo;
    	let t;
    	let li1;
    	let button;
    	let current;
    	userinfo = new Userinfo({ $$inline: true });

    	button = new Button({
    			props: {
    				action: /*logout*/ ctx[2],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			create_component(userinfo.$$.fragment);
    			t = space();
    			li1 = element("li");
    			create_component(button.$$.fragment);
    			add_location(li0, file$b, 34, 16, 847);
    			add_location(li1, file$b, 35, 16, 885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			mount_component(userinfo, li0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, li1, anchor);
    			mount_component(button, li1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userinfo.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userinfo.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			destroy_component(userinfo);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(li1);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(34:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#if !$auth}
    function create_if_block$5(ctx) {
    	let li0;
    	let dropdownform0;
    	let t;
    	let li1;
    	let dropdownform1;
    	let current;

    	dropdownform0 = new DropdownForm({
    			props: { action: "Login" },
    			$$inline: true
    		});

    	dropdownform1 = new DropdownForm({
    			props: { action: "Register" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			create_component(dropdownform0.$$.fragment);
    			t = space();
    			li1 = element("li");
    			create_component(dropdownform1.$$.fragment);
    			add_location(li0, file$b, 31, 16, 711);
    			add_location(li1, file$b, 32, 16, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			mount_component(dropdownform0, li0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, li1, anchor);
    			mount_component(dropdownform1, li1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownform0.$$.fragment, local);
    			transition_in(dropdownform1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownform0.$$.fragment, local);
    			transition_out(dropdownform1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			destroy_component(dropdownform0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(li1);
    			destroy_component(dropdownform1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(31:12) {#if !$auth}",
    		ctx
    	});

    	return block;
    }

    // (36:20) <Button action={logout}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Logout");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(36:20) <Button action={logout}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let header;
    	let div0;
    	let chaticon;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let h2;
    	let t3_value = (/*$room*/ ctx[1] ? /*$room*/ ctx[1].name : "") + "";
    	let t3;
    	let t4;
    	let nav;
    	let ul;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	chaticon = new Chat$1({ $$inline: true });
    	const if_block_creators = [create_if_block$5, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$auth*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			create_component(chaticon.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "ChatApp";
    			t2 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t3 = text(t3_value);
    			t4 = space();
    			nav = element("nav");
    			ul = element("ul");
    			if_block.c();
    			attr_dev(h1, "class", "svelte-g75w2");
    			add_location(h1, file$b, 21, 8, 532);
    			attr_dev(div0, "class", "logo svelte-g75w2");
    			add_location(div0, file$b, 19, 4, 484);
    			attr_dev(h2, "class", "svelte-g75w2");
    			add_location(h2, file$b, 25, 8, 598);
    			attr_dev(div1, "class", "room-title");
    			add_location(div1, file$b, 24, 4, 565);
    			attr_dev(ul, "class", "svelte-g75w2");
    			add_location(ul, file$b, 29, 8, 665);
    			add_location(nav, file$b, 28, 4, 651);
    			attr_dev(header, "class", "svelte-g75w2");
    			add_location(header, file$b, 17, 0, 470);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			mount_component(chaticon, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(header, t2);
    			append_dev(header, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(header, t4);
    			append_dev(header, nav);
    			append_dev(nav, ul);
    			if_blocks[current_block_type_index].m(ul, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$room*/ 2) && t3_value !== (t3_value = (/*$room*/ ctx[1] ? /*$room*/ ctx[1].name : "") + "")) set_data_dev(t3, t3_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(ul, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chaticon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chaticon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(chaticon);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $auth;
    	let $room;
    	validate_store(auth$1, "auth");
    	component_subscribe($$self, auth$1, $$value => $$invalidate(0, $auth = $$value));
    	validate_store(room, "room");
    	component_subscribe($$self, room, $$value => $$invalidate(1, $room = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const client = getContext("client");

    	const logout = async () => {
    		await client.logout($auth);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		room,
    		ChatIcon: Chat$1,
    		DropdownForm,
    		auth: auth$1,
    		getContext,
    		Button,
    		Userinfo,
    		client,
    		logout,
    		$auth,
    		$room
    	});

    	return [$auth, $room, logout];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/assets/home.svelte generated by Svelte v3.37.0 */

    const file$a = "src/assets/home.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let use;
    	let t;
    	let symbol;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			t = space();
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			xlink_attr(use, "xlink:href", "#icon-home");
    			add_location(use, file$a, 0, 28, 28);
    			attr_dev(svg, "class", "icon icon-home svelte-8idrmo");
    			add_location(svg, file$a, 0, 0, 0);
    			attr_dev(path, "d", "M18.672 11h-1.672v6c0 0.445-0.194 1-1 1h-4v-6h-4v6h-4c-0.806 0-1-0.555-1-1v-6h-1.672c-0.598 0-0.47-0.324-0.060-0.748l8.024-8.032c0.195-0.202 0.451-0.302 0.708-0.312 0.257 0.010 0.513 0.109 0.708 0.312l8.023 8.031c0.411 0.425 0.539 0.749-0.059 0.749z");
    			add_location(path, file$a, 3, 4, 119);
    			attr_dev(symbol, "id", "icon-home");
    			attr_dev(symbol, "viewBox", "0 0 20 20");
    			add_location(symbol, file$a, 2, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    			insert_dev(target, t, anchor);
    			insert_dev(target, symbol, anchor);
    			append_dev(symbol, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(symbol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/RoomsList.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file$9 = "src/components/RoomsList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (85:4) {:else}
    function create_else_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "You haven't joined any rooms";
    			attr_dev(p, "class", "placeholder svelte-13qkdxs");
    			add_location(p, file$9, 85, 8, 2507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(85:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:4) {#if joinedRooms.length > 0}
    function create_if_block_1$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*joinedRooms*/ ctx[0];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*room*/ ctx[16].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*viewRoom, joinedRooms, selected*/ 261) {
    				each_value_1 = /*joinedRooms*/ ctx[0];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(74:4) {#if joinedRooms.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (75:8) {#each joinedRooms as room (room.id)}
    function create_each_block_1(key_1, ctx) {
    	let button;
    	let div1;
    	let div0;
    	let homeicon;
    	let t0;
    	let h3;
    	let t1_value = /*room*/ ctx[16].name + "";
    	let t1;
    	let div1_class_value;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	homeicon = new Home({ $$inline: true });

    	function click_handler() {
    		return /*click_handler*/ ctx[9](/*room*/ ctx[16]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			button = element("button");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(homeicon.$$.fragment);
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(h3, "class", "room-name svelte-13qkdxs");
    			add_location(h3, file$9, 79, 24, 2360);
    			attr_dev(div0, "class", "room-title svelte-13qkdxs");
    			add_location(div0, file$9, 77, 20, 2274);

    			attr_dev(div1, "class", div1_class_value = "room " + (/*room*/ ctx[16].id === /*selected*/ ctx[2]
    			? "selected"
    			: "") + " svelte-13qkdxs");

    			add_location(div1, file$9, 76, 16, 2194);
    			attr_dev(button, "class", "room-button svelte-13qkdxs");
    			add_location(button, file$9, 75, 12, 2114);
    			this.first = button;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div1);
    			append_dev(div1, div0);
    			mount_component(homeicon, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(button, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*joinedRooms*/ 1) && t1_value !== (t1_value = /*room*/ ctx[16].name + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*joinedRooms, selected*/ 5 && div1_class_value !== (div1_class_value = "room " + (/*room*/ ctx[16].id === /*selected*/ ctx[2]
    			? "selected"
    			: "") + " svelte-13qkdxs")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(homeicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(75:8) {#each joinedRooms as room (room.id)}",
    		ctx
    	});

    	return block;
    }

    // (101:4) {:else}
    function create_else_block$3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "There are no rooms you haven't joined";
    			attr_dev(p, "class", "placeholder svelte-13qkdxs");
    			add_location(p, file$9, 101, 8, 3062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(101:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:4) {#if otherRooms.length > 0}
    function create_if_block$4(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*otherRooms*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*room*/ ctx[16].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*joinRoom, otherRooms, $user*/ 98) {
    				each_value = /*otherRooms*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(91:4) {#if otherRooms.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (92:8) {#each otherRooms as room (room.id)}
    function create_each_block$2(key_1, ctx) {
    	let div1;
    	let div0;
    	let homeicon;
    	let t0;
    	let h3;
    	let t1_value = /*room*/ ctx[16].name + "";
    	let t1;
    	let t2;
    	let button;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	homeicon = new Home({ $$inline: true });

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*room*/ ctx[16]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(homeicon.$$.fragment);
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			button.textContent = "Join";
    			t4 = space();
    			attr_dev(h3, "class", "room-name svelte-13qkdxs");
    			add_location(h3, file$9, 95, 20, 2845);
    			attr_dev(div0, "class", "room-title svelte-13qkdxs");
    			add_location(div0, file$9, 93, 16, 2767);
    			attr_dev(button, "class", "room-action svelte-13qkdxs");
    			add_location(button, file$9, 97, 16, 2923);
    			attr_dev(div1, "class", "room svelte-13qkdxs");
    			add_location(div1, file$9, 92, 12, 2732);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(homeicon, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			append_dev(div1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*otherRooms*/ 2) && t1_value !== (t1_value = /*room*/ ctx[16].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homeicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homeicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(homeicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(92:8) {#each otherRooms as room (room.id)}",
    		ctx
    	});

    	return block;
    }

    // (111:4) <Button action={createRoom}>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Create Room +");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(111:4) <Button action={createRoom}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div0;
    	let p0;
    	let t1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let div1;
    	let p1;
    	let t4;
    	let current_block_type_index_1;
    	let if_block1;
    	let t5;
    	let div3;
    	let div2;
    	let label;
    	let t7;
    	let input;
    	let t8;
    	let p2;
    	let t9;
    	let t10;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*joinedRooms*/ ctx[0].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block$4, create_else_block$3];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*otherRooms*/ ctx[1].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	button = new Button({
    			props: {
    				action: /*createRoom*/ ctx[7],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Joined rooms:";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "Other rooms:";
    			t4 = space();
    			if_block1.c();
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label = element("label");
    			label.textContent = "New room name:";
    			t7 = space();
    			input = element("input");
    			t8 = space();
    			p2 = element("p");
    			t9 = text(/*createRoomError*/ ctx[4]);
    			t10 = space();
    			create_component(button.$$.fragment);
    			attr_dev(p0, "class", "title");
    			add_location(p0, file$9, 72, 4, 1988);
    			attr_dev(div0, "class", "joined-rooms");
    			add_location(div0, file$9, 71, 0, 1957);
    			attr_dev(p1, "class", "title");
    			add_location(p1, file$9, 89, 4, 2609);
    			attr_dev(div1, "class", "otherRooms");
    			add_location(div1, file$9, 88, 0, 2580);
    			attr_dev(label, "for", "room-name");
    			add_location(label, file$9, 106, 8, 3185);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "room-name");
    			add_location(input, file$9, 107, 8, 3239);
    			attr_dev(p2, "class", "error svelte-13qkdxs");
    			add_location(p2, file$9, 108, 8, 3307);
    			add_location(div2, file$9, 105, 4, 3171);
    			attr_dev(div3, "class", "new-room svelte-13qkdxs");
    			add_location(div3, file$9, 104, 0, 3144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p1);
    			append_dev(div1, t4);
    			if_blocks_1[current_block_type_index_1].m(div1, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, label);
    			append_dev(div2, t7);
    			append_dev(div2, input);
    			set_input_value(input, /*newRoomName*/ ctx[3]);
    			append_dev(div2, t8);
    			append_dev(div2, p2);
    			append_dev(p2, t9);
    			append_dev(div3, t10);
    			mount_component(button, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, null);
    			}

    			if (dirty & /*newRoomName*/ 8 && input.value !== /*newRoomName*/ ctx[3]) {
    				set_input_value(input, /*newRoomName*/ ctx[3]);
    			}

    			if (!current || dirty & /*createRoomError*/ 16) set_data_dev(t9, /*createRoomError*/ ctx[4]);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if_blocks_1[current_block_type_index_1].d();
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div3);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("RoomsList", slots, []);
    	const client = getContext("client");
    	let joinedRooms = [];
    	let otherRooms = [];
    	let selected = "";
    	let newRoomName;
    	let createRoomError = "";

    	const joinRoom = async (roomID, userID) => {
    		const res = await client.joinRoom(roomID, userID);
    		if (res.body.message) getRooms();
    	};

    	const createRoom = async () => {
    		const res = await client.createRoom(newRoomName);

    		if (res.body.message) {
    			$$invalidate(4, createRoomError = "");
    			$$invalidate(3, newRoomName = "");
    		} else $$invalidate(4, createRoomError = res.body.error);
    	};

    	const viewRoom = async roomID => {
    		$$invalidate(2, selected = roomID);
    		const res = await client.getRoom(roomID);
    		if (res.body.room) room.set(res.body.room); else room.set(null);
    	};

    	const updateRooms = res => {
    		if (res.body.rooms) {
    			const joined = [];
    			const other = [];

    			for (const room of res.body.rooms) {
    				if (room.joined) joined.push(room); else other.push(room);
    				console.log(room.id, selected);
    			}

    			$$invalidate(0, joinedRooms = joined);
    			$$invalidate(1, otherRooms = other);
    		}
    	};

    	const getRooms = async () => {
    		const res = await client.getRooms();
    		updateRooms(res);
    	}; // if (selected) {
    	//     const res = await client.getRoom(roomID)
    	//     if (res.body.room) room.set(res.body.room)
    	//     else room.set(null)

    	// }
    	let stopUpdate;

    	onMount(() => {
    		stopUpdate = client.fresh.add(3000, () => client.getRooms(), updateRooms);
    	});

    	onDestroy(() => {
    		stopUpdate();
    	});

    	room.subscribe(() => getRooms());
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<RoomsList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = room => viewRoom(room.id);
    	const click_handler_1 = room => joinRoom(room.id, $user);

    	function input_input_handler() {
    		newRoomName = this.value;
    		$$invalidate(3, newRoomName);
    	}

    	$$self.$capture_state = () => ({
    		room,
    		getContext,
    		onMount,
    		onDestroy,
    		user,
    		Button,
    		HomeIcon: Home,
    		client,
    		joinedRooms,
    		otherRooms,
    		selected,
    		newRoomName,
    		createRoomError,
    		joinRoom,
    		createRoom,
    		viewRoom,
    		updateRooms,
    		getRooms,
    		stopUpdate,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ("joinedRooms" in $$props) $$invalidate(0, joinedRooms = $$props.joinedRooms);
    		if ("otherRooms" in $$props) $$invalidate(1, otherRooms = $$props.otherRooms);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    		if ("newRoomName" in $$props) $$invalidate(3, newRoomName = $$props.newRoomName);
    		if ("createRoomError" in $$props) $$invalidate(4, createRoomError = $$props.createRoomError);
    		if ("stopUpdate" in $$props) stopUpdate = $$props.stopUpdate;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		joinedRooms,
    		otherRooms,
    		selected,
    		newRoomName,
    		createRoomError,
    		$user,
    		joinRoom,
    		createRoom,
    		viewRoom,
    		click_handler,
    		click_handler_1,
    		input_input_handler
    	];
    }

    class RoomsList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RoomsList",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/Sidepanel.svelte generated by Svelte v3.37.0 */
    const file$8 = "src/components/Sidepanel.svelte";

    // (10:4) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Log in to view rooms...";
    			add_location(p, file$8, 11, 12, 223);
    			attr_dev(div, "class", "login-message svelte-16rt11w");
    			add_location(div, file$8, 10, 8, 183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(10:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#if $auth}
    function create_if_block$3(ctx) {
    	let roomslist;
    	let current;
    	roomslist = new RoomsList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(roomslist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(roomslist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(roomslist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(roomslist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(roomslist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(8:4) {#if $auth}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let aside;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$auth*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			if_block.c();
    			attr_dev(aside, "class", "svelte-16rt11w");
    			add_location(aside, file$8, 6, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			if_blocks[current_block_type_index].m(aside, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(aside, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $auth;
    	validate_store(auth$1, "auth");
    	component_subscribe($$self, auth$1, $$value => $$invalidate(0, $auth = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidepanel", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidepanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ auth: auth$1, RoomsList, $auth });
    	return [$auth];
    }

    class Sidepanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidepanel",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/assets/send.svelte generated by Svelte v3.37.0 */

    const file$7 = "src/assets/send.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let use;
    	let t;
    	let symbol;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			t = space();
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			xlink_attr(use, "xlink:href", "#icon-paper-plane");
    			add_location(use, file$7, 0, 35, 35);
    			attr_dev(svg, "class", "icon icon-paper-plane svelte-1dywkow");
    			add_location(svg, file$7, 0, 0, 0);
    			attr_dev(path, "d", "M27.563 0.172c0.328 0.234 0.484 0.609 0.422 1l-4 24c-0.047 0.297-0.234 0.547-0.5 0.703-0.141 0.078-0.313 0.125-0.484 0.125-0.125 0-0.25-0.031-0.375-0.078l-7.078-2.891-3.781 4.609c-0.187 0.234-0.469 0.359-0.766 0.359-0.109 0-0.234-0.016-0.344-0.063-0.391-0.141-0.656-0.516-0.656-0.938v-5.453l13.5-16.547-16.703 14.453-6.172-2.531c-0.359-0.141-0.594-0.469-0.625-0.859-0.016-0.375 0.172-0.734 0.5-0.922l26-15c0.156-0.094 0.328-0.141 0.5-0.141 0.203 0 0.406 0.063 0.562 0.172z");
    			add_location(path, file$7, 3, 4, 140);
    			attr_dev(symbol, "id", "icon-paper-plane");
    			attr_dev(symbol, "viewBox", "0 0 28 28");
    			add_location(symbol, file$7, 2, 0, 85);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    			insert_dev(target, t, anchor);
    			insert_dev(target, symbol, anchor);
    			append_dev(symbol, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(symbol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Send", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Send> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Send extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Send",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const botnames = ["Olav", "Iselin", "Magnus", "Mari", "Oliver", "Tobias"];
    const password = ["Olav1234", "Iselin1234", "Magnus1234", "Mari1234", "Oliver1234", "Tobias1234"];

    var randomebot = () => {
        const i = Math.floor(Math.random() * botnames.length);
        return {
            username: botnames[i],
            password: password[i]
        };
    };

    const activate = [
        ["hello", "hi", "hey"],
        ["how are you", "how are things"],
        ["what is going on", "what is up"],
        ["happy", "good", "well", "fantastic", "cool"],
        ["bad", "bored", "tired", "sad"],
        ["tell me story", "tell me joke"],
        ["thanks", "thank you"],
        ["bye", "good bye", "goodbye"]
    ];

    const reply = [
        ["Hello!", "Hey!", "Hi!", "Hello there!"],
        ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
        ["Nothing much", "Exciting things!"],
        ["Glad to hear!"],
        ["Why?", "Cheer up buddy"],
        ["What about?", "Once upon a time...", "Don't have time, sorry!"],
        ["You're welcome", "You owe me one!", "No problem"],
        ["Goodbye", "See you later", "See you soon"],
    ];

    const alternative = [
        "I'm listening...",
        "Go on...",
        "Continue",
        "Haha",
        "Same",
        "Try again",
        "I dont understand",
        "Omg!",
        "Bro..."
    ];

    const starters = [
        "Anyone here?",
        "Hello",
        "Who is here?",
        "How are you doing",
        "I am here!",
        "Am I alone here?"
    ];

    const enders = ["I have to leave!",
        "I will be back soon",
        "Have a nice day, bye!",
        "I have to go"
    ];

    const robot = [
        "How do you do, fellow human",
        "I am not a bot"
    ];

    const compare = text => {
        let item;
        for (let i = 0; i < activate.length; i++) {
            for (let j = 0; j < reply.length; j++) {
                if (activate[i][j] === text) {
                    let items = reply[i];
                    item = items[Math.floor(Math.random() * items.length)];
                }
            }
        }
        return item;
    };

    const starter = () => {
        return starters[Math.floor(Math.random() * starters.length)];
    };

    const ender = () => {
        return enders[Math.floor(Math.random() * starters.length)];
    };

    var mastermind = (input, end) => {
        if (end) {
            return ender();
        }
        if (!input) {
            return starter();
        }

        let text = input.message.toLowerCase().replace(/[^\w\s\d]/gi, "");
        text = text
            .replace(/ a /g, " ")
            .replace(/i feel /g, "")
            .replace(/whats/g, "what is")
            .replace(/please /g, "")
            .replace(/ please/g, "");

        if (compare(activate)) {
            return compare(text);
        } else if (text.match(/robot/gi)) {
            return robot[Math.floor(Math.random() * robot.length)];
        } else {
            return alternative[Math.floor(Math.random() * alternative.length)];
        }
    };

    class Bot$1 {
        client
        options
        username
        password
        roomID
        userID
        loopID

        unresponsive = 0
        messages = [{ sender: "", message: "" }]
        messageSentCounter = 0
        numberOfMessages
        lastMessage = { sender: "", message: "" }
        lastMessageTime

        constructor(client, options) {
            let { username, password } = randomebot();
            if (options.name) username = options.name;
            this.client = client;
            this.options = options ? options : {};
            this.username = username;
            this.password = password;
            this.numberOfMessages = Math.floor(Math.random() * (100 - 20 + 1) + 20);
        }

        async start() {
            let res = await this.client.registerBot(this.username, this.password);
            if (res.body.message === 'User created') {
                res = await this.client.login(this.username, this.password);
                if (res.body.message === 'Logged in') {
                    this.userID = this.client.state.get().userID;
                    try {
                        await this.joinRoom();
                    }
                    catch (err) {
                        this.shutdown();
                        return
                    }
                    this.loop();
                    return
                }
            }
            this.shutdown();
        }

        async joinRoom() {
            const roomToJoin = this.options.room ? this.options.room : "Botroom";

            let res = await this.client.getRooms();
            for (const room of res.body.rooms) {
                if (room.name === roomToJoin) {
                    await this.client.joinRoom(room.id, this.userID);
                    this.roomID = room.id;
                    return;
                }
            }

            await this.client.createRoom(roomToJoin);
            res = await this.client.getRooms();

            for (const room of res.body.rooms) {
                if (room.name === roomToJoin) {
                    this.roomID = room.id;
                    this.admin = true;
                    return;
                }
            }
        }

        loop() {
            const stop = this.client.fresh.add(1000, () => this.client.getMessages(this.roomID), this.updateMessages, this.shutdown);
            this.lastMessageTime = Date.now();

            this.sendDelay(mastermind());
            const id = setInterval(() => {
                const lastMessageInRoom = this.messages[this.messages.length - 1] || { sender: "", message: "" };
                // Checking for new message
                if (this.lastMessage.message !== lastMessageInRoom.message && lastMessageInRoom.sender !== this.username) {

                    // Checking if bot has been alive too long
                    if (this.messageSentCounter === this.numberOfMessages) {
                        this.shutdown(stop, id);
                        return
                    }

                    // Updating last message
                    this.lastMessageTime = Date.now();
                    this.lastMessage = lastMessageInRoom;

                    // Sending response
                    this.sendDelay(mastermind(lastMessageInRoom, false));
                } else {
                    // Checkin time since last message
                    if (Date.now() - this.lastMessageTime > 30_000) {
                        // Sending conversation starter
                        this.unresponsive += 1;
                        if (this.unresponsive === 2) {
                            this.shutdown(); 
                            return
                        }
                        this.sendDelay(mastermind("", false));
                        this.lastMessageTime = Date.now();
                    }
                }
            }, 500);
            this.stopFresh = stop;
            this.loopID = id;
        }

        shutdown = async (reason) => {
            if (this.loopID) clearInterval(this.loopID);
            if (this.stopFresh) this.stopFresh();
            if (reason !== 'server down') {
                if (this.roomID) this.send(mastermind("", true));
                if (!this.admin) this.deregister();
                else this.logout();
            }
        }

        updateMessages = (messages) => {
            this.messages = messages;
        }

        send(message) {
            this.messageSentCounter += 1;
            const postMessage = async () => {
                const res = await this.client.postMessage(this.roomID, this.userID, message);
                if (res.body.error) this.shutdown("server down");
            };
            postMessage();
        }

        sendDelay(message) {
            let timeout = Math.floor(Math.random() * (10 - 3 + 1) + 3);
            setTimeout(() => {
                this.send(message);
            }, timeout);
        }

        async deregister() {
            await this.client.deleteUser(this.userID);
        }

        async logout() {
            await this.client.logout(this.client.state.get().token);
        }
    }

    var createBot = (client, options) => {
        return new Bot$1(client, options)
    };

    /* src/components/AddBot.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/components/AddBot.svelte";

    // (44:4) <Button action={addBot}>
    function create_default_slot$2(ctx) {
    	let t0;
    	let t1_value = (/*name*/ ctx[0] ? /*name*/ ctx[0] : "bot") + "";
    	let t1;
    	let t2;
    	let t3_value = /*$activeRoom*/ ctx[2].name + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			t0 = text("Add ");
    			t1 = text(t1_value);
    			t2 = text(" to ");
    			t3 = text(t3_value);
    			t4 = text(" +");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1 && t1_value !== (t1_value = (/*name*/ ctx[0] ? /*name*/ ctx[0] : "bot") + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$activeRoom*/ 4 && t3_value !== (t3_value = /*$activeRoom*/ ctx[2].name + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(44:4) <Button action={addBot}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let label;
    	let t1;
    	let input;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				action: /*addBot*/ ctx[3],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "New bot name:";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			p = element("p");
    			t3 = text(/*createBotError*/ ctx[1]);
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(label, "for", "room-name");
    			add_location(label, file$6, 39, 8, 1187);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "room-name");
    			add_location(input, file$6, 40, 8, 1240);
    			attr_dev(p, "class", "error svelte-9qzgh7");
    			add_location(p, file$6, 41, 8, 1301);
    			add_location(div0, file$6, 38, 4, 1173);
    			attr_dev(div1, "class", "add-bot svelte-9qzgh7");
    			add_location(div1, file$6, 37, 0, 1147);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			set_input_value(input, /*name*/ ctx[0]);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(p, t3);
    			append_dev(div1, t4);
    			mount_component(button, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}

    			if (!current || dirty & /*createBotError*/ 2) set_data_dev(t3, /*createBotError*/ ctx[1]);
    			const button_changes = {};

    			if (dirty & /*$$scope, $activeRoom, name*/ 517) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $activeRoom;
    	validate_store(room, "activeRoom");
    	component_subscribe($$self, room, $$value => $$invalidate(2, $activeRoom = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AddBot", slots, []);
    	let { room: room$1 } = $$props;
    	const host = getContext("host");
    	const port = getContext("port");
    	const client = getContext("client");
    	let name = "";
    	let createBotError = "";

    	const addBot = async () => {
    		const res = await client.getUsers();

    		if (res.body.users) {
    			if (!name || name.length < 3) {
    				$$invalidate(1, createBotError = "Name must be 3 characters or longer");
    				return;
    			}

    			for (const user of res.body.users) {
    				if (user.username === name) {
    					$$invalidate(1, createBotError = "A bot or user with that name allready exists");
    					return;
    				}
    			}
    		}

    		const botClient = connection({ host, port });
    		const bot = createBot(botClient, { room: room$1, name });
    		bot.start();
    		$$invalidate(1, createBotError = "");
    		$$invalidate(0, name = "");
    	};

    	const writable_props = ["room"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddBot> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$$set = $$props => {
    		if ("room" in $$props) $$invalidate(4, room$1 = $$props.room);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		getContext,
    		createBot,
    		connection,
    		activeRoom: room,
    		room: room$1,
    		host,
    		port,
    		client,
    		name,
    		createBotError,
    		addBot,
    		$activeRoom
    	});

    	$$self.$inject_state = $$props => {
    		if ("room" in $$props) $$invalidate(4, room$1 = $$props.room);
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("createBotError" in $$props) $$invalidate(1, createBotError = $$props.createBotError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, createBotError, $activeRoom, addBot, room$1, input_input_handler];
    }

    class AddBot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { room: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddBot",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*room*/ ctx[4] === undefined && !("room" in props)) {
    			console.warn("<AddBot> was created without expected prop 'room'");
    		}
    	}

    	get room() {
    		throw new Error("<AddBot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set room(value) {
    		throw new Error("<AddBot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/assets/person.svelte generated by Svelte v3.37.0 */

    const file$5 = "src/assets/person.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let use;
    	let t;
    	let symbol;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			t = space();
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			xlink_attr(use, "xlink:href", "#icon-user");
    			add_location(use, file$5, 0, 28, 28);
    			attr_dev(svg, "class", "icon icon-user svelte-8idrmo");
    			add_location(svg, file$5, 0, 0, 0);
    			attr_dev(path, "d", "M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z");
    			add_location(path, file$5, 3, 4, 119);
    			attr_dev(symbol, "id", "icon-user");
    			attr_dev(symbol, "viewBox", "0 0 32 32");
    			add_location(symbol, file$5, 2, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    			insert_dev(target, t, anchor);
    			insert_dev(target, symbol, anchor);
    			append_dev(symbol, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(symbol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Person", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Person> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Person extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Person",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/assets/bot.svelte generated by Svelte v3.37.0 */

    const file$4 = "src/assets/bot.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let use;
    	let t;
    	let symbol;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			t = space();
    			symbol = svg_element("symbol");
    			path = svg_element("path");
    			xlink_attr(use, "xlink:href", "#icon-f-droid");
    			add_location(use, file$4, 0, 31, 31);
    			attr_dev(svg, "class", "icon icon-f-droid svelte-8idrmo");
    			add_location(svg, file$4, 0, 0, 0);
    			attr_dev(path, "d", "M27.296 13.441h-22.592c-1.169 0-2.119 0.948-2.119 2.119v14.12c0 1.169 0.948 2.119 2.119 2.119h22.592c1.169 0 2.119-0.948 2.119-2.119v-14.12c0-1.171-0.949-2.119-2.119-2.119zM16 30.033c-4.088 0-7.413-3.325-7.413-7.413s3.325-7.413 7.413-7.413 7.413 3.325 7.413 7.413-3.325 7.413-7.413 7.413zM16 16.548c-3.348 0-6.072 2.724-6.072 6.072s2.724 6.072 6.072 6.072 6.072-2.724 6.072-6.072-2.724-6.072-6.072-6.072zM16 27.032c-2.084 0-3.841-1.471-4.295-3.424h2.227c0.367 0.775 1.145 1.305 2.068 1.305 1.28 0 2.295-1.015 2.295-2.295s-1.015-2.295-2.295-2.295c-0.865 0-1.6 0.469-1.991 1.165h-2.269c0.504-1.883 2.225-3.283 4.26-3.283 2.424 0 4.412 1.988 4.412 4.412 0 2.425-1.988 4.413-4.412 4.413zM31.799 0.528c-0.001 0.001-0.003 0.003-0.003 0.004-0.003-0.003-0.005-0.004-0.008-0.007 0.001-0.001 0.003-0.004 0.005-0.005-0.155-0.183-0.372-0.308-0.692-0.317-0.269 0.007-0.521 0.129-0.683 0.345l-2.424 3.137c-0.219-0.077-0.452-0.127-0.697-0.127h-22.593c-0.245 0-0.477 0.051-0.697 0.127l-2.424-3.139c-0.161-0.216-0.413-0.337-0.683-0.345-0.32 0.008-0.537 0.133-0.692 0.317 0.001 0.001 0.003 0.004 0.005 0.005-0.004 0.003-0.007 0.005-0.009 0.008 0-0.001-0.001-0.003-0.003-0.004-0.088 0.104-0.396 0.568-0.016 1.099l2.545 3.295c-0.089 0.235-0.144 0.488-0.144 0.755v4.943c0 1.169 0.948 2.119 2.119 2.119h22.592c1.169 0 2.119-0.948 2.119-2.119v-4.943c0-0.267-0.055-0.52-0.145-0.755l2.545-3.295c0.379-0.531 0.071-0.995-0.017-1.099zM9.205 10.971c-1.316 0-2.383-1.067-2.383-2.383s1.067-2.383 2.383-2.383 2.383 1.067 2.383 2.383-1.067 2.383-2.383 2.383zM22.972 10.971c-1.316 0-2.383-1.067-2.383-2.383s1.067-2.383 2.383-2.383 2.383 1.067 2.383 2.383-1.067 2.383-2.383 2.383z");
    			add_location(path, file$4, 3, 4, 128);
    			attr_dev(symbol, "id", "icon-f-droid");
    			attr_dev(symbol, "viewBox", "0 0 32 32");
    			add_location(symbol, file$4, 2, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    			insert_dev(target, t, anchor);
    			insert_dev(target, symbol, anchor);
    			append_dev(symbol, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(symbol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Bot", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Bot> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Bot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bot",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/UserList.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/components/UserList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (46:16) {:else}
    function create_else_block$1(ctx) {
    	let personicon;
    	let current;
    	personicon = new Person({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(personicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(personicon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(personicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(personicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(personicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(46:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:16) {#if user.bot}
    function create_if_block_3(ctx) {
    	let boticon;
    	let current;
    	boticon = new Bot({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(boticon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(boticon, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boticon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boticon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(boticon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(44:16) {#if user.bot}",
    		ctx
    	});

    	return block;
    }

    // (55:60) 
    function create_if_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "(you)";
    			attr_dev(p, "class", "admin svelte-1chyo9m");
    			add_location(p, file$3, 55, 16, 1487);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(55:60) ",
    		ctx
    	});

    	return block;
    }

    // (53:46) 
    function create_if_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "(admin)";
    			attr_dev(p, "class", "admin svelte-1chyo9m");
    			add_location(p, file$3, 53, 16, 1381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(53:46) ",
    		ctx
    	});

    	return block;
    }

    // (51:12) {#if user.id === $room.admin && user.id === client.state.get().userID}
    function create_if_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "(admin/you)";
    			attr_dev(p, "class", "admin svelte-1chyo9m");
    			add_location(p, file$3, 51, 16, 1285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(51:12) {#if user.id === $room.admin && user.id === client.state.get().userID}",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#each users as user (user.id)}
    function create_each_block$1(key_1, ctx) {
    	let li;
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let p;
    	let t1_value = /*user*/ ctx[8].username + "";
    	let t1;
    	let t2;
    	let show_if;
    	let show_if_1;
    	let t3;
    	let current;
    	const if_block_creators = [create_if_block_3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*user*/ ctx[8].bot) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty & /*users, $room*/ 3) show_if = !!(/*user*/ ctx[8].id === /*$room*/ ctx[1].admin && /*user*/ ctx[8].id === /*client*/ ctx[2].state.get().userID);
    		if (show_if) return create_if_block$2;
    		if (/*user*/ ctx[8].id === /*$room*/ ctx[1].admin) return create_if_block_1;
    		if (show_if_1 == null || dirty & /*users*/ 1) show_if_1 = !!(/*user*/ ctx[8].id === /*client*/ ctx[2].state.get().userID);
    		if (show_if_1) return create_if_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			if_block0.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			add_location(p, file$3, 48, 16, 1144);
    			attr_dev(div, "class", "user-name svelte-1chyo9m");
    			add_location(div, file$3, 42, 12, 960);
    			attr_dev(li, "class", "svelte-1chyo9m");
    			add_location(li, file$3, 41, 8, 943);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			append_dev(li, t2);
    			if (if_block1) if_block1.m(li, null);
    			append_dev(li, t3);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t0);
    			}

    			if ((!current || dirty & /*users*/ 1) && t1_value !== (t1_value = /*user*/ ctx[8].username + "")) set_data_dev(t1, t1_value);

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx, dirty))) {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(li, t3);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();

    			if (if_block1) {
    				if_block1.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(41:4) {#each users as user (user.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*users*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*user*/ ctx[8].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1chyo9m");
    			add_location(ul, file$3, 39, 0, 894);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*users, $room, client*/ 7) {
    				each_value = /*users*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $room;
    	validate_store(room, "room");
    	component_subscribe($$self, room, $$value => $$invalidate(1, $room = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("UserList", slots, []);
    	const client = getContext("client");
    	let users = [];
    	let stopFetch;

    	const updateUsers = res => {
    		if (res.body.users) $$invalidate(0, users = res.body.users);
    	};

    	const getUsers = async () => {
    		if ($room) {
    			const res = await client.getUsersInRoom($room.id);
    			updateUsers(res);
    		}
    	};

    	const freshUsers = async () => {
    		stopFetch = client.fresh.add(3000, () => client.getUsersInRoom($room.id), updateUsers);
    	};

    	onMount(() => {
    		getUsers();
    		freshUsers();
    	});

    	const unsub = room.subscribe(room => getUsers());

    	onDestroy(() => {
    		stopFetch();
    		unsub();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<UserList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		room,
    		onMount,
    		getContext,
    		onDestroy,
    		PersonIcon: Person,
    		BotIcon: Bot,
    		client,
    		users,
    		stopFetch,
    		updateUsers,
    		getUsers,
    		freshUsers,
    		unsub,
    		$room
    	});

    	$$self.$inject_state = $$props => {
    		if ("users" in $$props) $$invalidate(0, users = $$props.users);
    		if ("stopFetch" in $$props) stopFetch = $$props.stopFetch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [users, $room, client];
    }

    class UserList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Feed.svelte generated by Svelte v3.37.0 */
    const file$2 = "src/components/Feed.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (69:12) {#each messages as message}
    function create_each_block(ctx) {
    	let div1;
    	let p0;
    	let t0_value = /*message*/ ctx[16].sender + "";
    	let t0;
    	let t1;
    	let t2;
    	let div0;
    	let p1;
    	let t3_value = /*message*/ ctx[16].message + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			div0 = element("div");
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(p0, "class", "author svelte-82a05y");
    			add_location(p0, file$2, 70, 20, 1847);
    			attr_dev(p1, "class", "message-text svelte-82a05y");
    			add_location(p1, file$2, 72, 24, 1960);
    			attr_dev(div0, "class", "message-bubble svelte-82a05y");
    			add_location(div0, file$2, 71, 20, 1907);
    			attr_dev(div1, "class", "message svelte-82a05y");
    			add_location(div1, file$2, 69, 16, 1805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, p1);
    			append_dev(p1, t3);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t0_value !== (t0_value = /*message*/ ctx[16].sender + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*messages*/ 1 && t3_value !== (t3_value = /*message*/ ctx[16].message + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(69:12) {#each messages as message}",
    		ctx
    	});

    	return block;
    }

    // (84:8) {#if $room.admin === $user}
    function create_if_block$1(ctx) {
    	let div;
    	let p;
    	let t1;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "red",
    				action: /*deleteRoom*/ ctx[6],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Admin actions:";
    			t1 = space();
    			create_component(button.$$.fragment);
    			add_location(p, file$2, 85, 16, 2564);
    			attr_dev(div, "class", "admin-actions svelte-82a05y");
    			add_location(div, file$2, 84, 12, 2520);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t1);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(84:8) {#if $room.admin === $user}",
    		ctx
    	});

    	return block;
    }

    // (87:16) <Button color="red" action={deleteRoom}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete room");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(87:16) <Button color=\\\"red\\\" action={deleteRoom}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div5;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let input;
    	let t1;
    	let button;
    	let sendicon;
    	let button_disabled_value;
    	let t2;
    	let div4;
    	let t3;
    	let div3;
    	let p;
    	let t5;
    	let userlist;
    	let t6;
    	let addbot;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*messages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	sendicon = new Send({ $$inline: true });
    	let if_block = /*$room*/ ctx[3].admin === /*$user*/ ctx[4] && create_if_block$1(ctx);
    	userlist = new UserList({ $$inline: true });

    	addbot = new AddBot({
    			props: { room: /*$room*/ ctx[3].name },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			create_component(sendicon.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			if (if_block) if_block.c();
    			t3 = space();
    			div3 = element("div");
    			p = element("p");
    			p.textContent = "Users in room:";
    			t5 = space();
    			create_component(userlist.$$.fragment);
    			t6 = space();
    			create_component(addbot.$$.fragment);
    			attr_dev(div0, "class", "feed svelte-82a05y");
    			add_location(div0, file$2, 67, 8, 1713);
    			attr_dev(input, "class", "input-box svelte-82a05y");
    			attr_dev(input, "placeholder", "type message...");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "rows", "3");
    			add_location(input, file$2, 78, 12, 2139);
    			button.disabled = button_disabled_value = /*newMessage*/ ctx[1].length === 0;
    			attr_dev(button, "class", "send-button svelte-82a05y");
    			add_location(button, file$2, 79, 12, 2311);
    			attr_dev(div1, "class", "message-input svelte-82a05y");
    			add_location(div1, file$2, 77, 8, 2099);
    			attr_dev(div2, "class", "chat svelte-82a05y");
    			add_location(div2, file$2, 66, 4, 1686);
    			add_location(p, file$2, 90, 12, 2722);
    			add_location(div3, file$2, 89, 8, 2704);
    			attr_dev(div4, "class", "metadata svelte-82a05y");
    			add_location(div4, file$2, 82, 4, 2449);
    			attr_dev(div5, "class", "room svelte-82a05y");
    			add_location(div5, file$2, 65, 0, 1663);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[7](div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*newMessage*/ ctx[1]);
    			append_dev(div1, t1);
    			append_dev(div1, button);
    			mount_component(sendicon, button, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			if (if_block) if_block.m(div4, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, p);
    			append_dev(div3, t5);
    			mount_component(userlist, div3, null);
    			append_dev(div4, t6);
    			mount_component(addbot, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[8], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
    					listen_dev(button, "click", /*sendMessage*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*messages*/ 1) {
    				each_value = /*messages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*newMessage*/ 2 && input.value !== /*newMessage*/ ctx[1]) {
    				set_input_value(input, /*newMessage*/ ctx[1]);
    			}

    			if (!current || dirty & /*newMessage*/ 2 && button_disabled_value !== (button_disabled_value = /*newMessage*/ ctx[1].length === 0)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (/*$room*/ ctx[3].admin === /*$user*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$room, $user*/ 24) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div4, t3);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const addbot_changes = {};
    			if (dirty & /*$room*/ 8) addbot_changes.room = /*$room*/ ctx[3].name;
    			addbot.$set(addbot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sendicon.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(userlist.$$.fragment, local);
    			transition_in(addbot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sendicon.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(userlist.$$.fragment, local);
    			transition_out(addbot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			/*div0_binding*/ ctx[7](null);
    			destroy_component(sendicon);
    			if (if_block) if_block.d();
    			destroy_component(userlist);
    			destroy_component(addbot);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $room;
    	let $user;
    	validate_store(room, "room");
    	component_subscribe($$self, room, $$value => $$invalidate(3, $room = $$value));
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(4, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Feed", slots, []);
    	let messages = [];
    	let newMessage = "";
    	let client = getContext("client");
    	let stopFresh;
    	let feed;

    	const updateFeed = res => {
    		if (res.body.messages) $$invalidate(0, messages = res.body.messages);
    		let height = 20;

    		for (const message of feed.children) {
    			height += message.clientHeight;
    			height += 20;
    		}

    		setTimeout(() => $$invalidate(2, feed.scrollTop = height, feed), 50);
    	};

    	const getMessages = async () => {
    		if ($room) {
    			const res = await client.getMessages($room.id);
    			updateFeed(res);
    		}
    	};

    	const freshMessages = async () => {
    		stopFresh = client.fresh.add(3000, () => client.getMessages($room.id), updateFeed);
    	};

    	const sendMessage = async () => {
    		if (!newMessage) return;
    		const res = await client.postMessage($room.id, $user, newMessage);

    		if (res.body.message) {
    			$$invalidate(1, newMessage = "");
    		}
    	};

    	const deleteRoom = async () => {
    		const res = await client.deleteRoom($room.id);
    		if (res.body.message) set_store_value(room, $room = null, $room);
    	};

    	onMount(() => {
    		getMessages();
    		freshMessages();
    	});

    	const unsubRoom = room.subscribe(room => {
    		getMessages();
    	});

    	onDestroy(() => {
    		stopFresh();
    		unsubRoom();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Feed> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			feed = $$value;
    			$$invalidate(2, feed);
    		});
    	}

    	const keydown_handler = e => {
    		if (e.keyCode === 13) sendMessage();
    	};

    	function input_input_handler() {
    		newMessage = this.value;
    		$$invalidate(1, newMessage);
    	}

    	$$self.$capture_state = () => ({
    		SendIcon: Send,
    		user,
    		getContext,
    		onMount,
    		onDestroy,
    		room,
    		AddBot,
    		UserList,
    		Button,
    		messages,
    		newMessage,
    		client,
    		stopFresh,
    		feed,
    		updateFeed,
    		getMessages,
    		freshMessages,
    		sendMessage,
    		deleteRoom,
    		unsubRoom,
    		$room,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
    		if ("newMessage" in $$props) $$invalidate(1, newMessage = $$props.newMessage);
    		if ("client" in $$props) client = $$props.client;
    		if ("stopFresh" in $$props) stopFresh = $$props.stopFresh;
    		if ("feed" in $$props) $$invalidate(2, feed = $$props.feed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		messages,
    		newMessage,
    		feed,
    		$room,
    		$user,
    		sendMessage,
    		deleteRoom,
    		div0_binding,
    		keydown_handler,
    		input_input_handler
    	];
    }

    class Feed extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Feed",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Chat.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/components/Chat.svelte";

    // (9:0) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let p0;
    	let t3;
    	let p1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Welcome!";
    			t1 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "This is a chat room for humans and bots :)";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Register or login to access the chat rooms.";
    			add_location(h1, file$1, 10, 8, 180);
    			attr_dev(p0, "class", "sub svelte-9n71tp");
    			add_location(p0, file$1, 12, 12, 224);
    			attr_dev(p1, "class", "sub svelte-9n71tp");
    			add_location(p1, file$1, 13, 12, 298);
    			add_location(div0, file$1, 11, 8, 206);
    			attr_dev(div1, "class", "welcome-box svelte-9n71tp");
    			add_location(div1, file$1, 9, 4, 146);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:0) {#if $room}
    function create_if_block(ctx) {
    	let feed;
    	let current;
    	feed = new Feed({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(feed.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(feed, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(feed.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(feed.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(feed, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(7:0) {#if $room}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$room*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $room;
    	validate_store(room, "room");
    	component_subscribe($$self, room, $$value => $$invalidate(0, $room = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chat", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chat> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ room, Feed, $room });
    	return [$room];
    }

    class Chat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */
    const file = "src/App.svelte";

    // (44:0) <Router {url}>
    function create_default_slot(ctx) {
    	let header;
    	let t0;
    	let div;
    	let sidepanel;
    	let t1;
    	let main;
    	let chat;
    	let current;
    	header = new Header({ $$inline: true });
    	sidepanel = new Sidepanel({ $$inline: true });
    	chat = new Chat({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(sidepanel.$$.fragment);
    			t1 = space();
    			main = element("main");
    			create_component(chat.$$.fragment);
    			attr_dev(main, "class", "svelte-1tdyujj");
    			add_location(main, file, 49, 2, 1216);
    			attr_dev(div, "class", "content svelte-1tdyujj");
    			add_location(div, file, 46, 1, 1175);
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(sidepanel, div, null);
    			append_dev(div, t1);
    			append_dev(div, main);
    			mount_component(chat, main, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(sidepanel.$$.fragment, local);
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(sidepanel.$$.fragment, local);
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(sidepanel);
    			destroy_component(chat);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(44:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 128) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $auth;
    	let $user;
    	validate_store(auth$1, "auth");
    	component_subscribe($$self, auth$1, $$value => $$invalidate(4, $auth = $$value));
    	validate_store(user, "user");
    	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { url = "" } = $$props;

    	let { host = window.location.hostname } = $$props,
    		{ port = window.location.port } = $$props;

    	const client = connection({ host, port });
    	setContext("client", client);
    	setContext("host", host);
    	setContext("port", port);
    	let unsubscribe;
    	if ($auth) client.state.update({ token: $auth });
    	if ($user) client.state.update({ userID: $user });

    	onMount(() => {
    		unsubscribe = client.state.subscribe(state => {
    			if (state.token && typeof state.token === "string") auth$1.set(state.token); else {
    				auth$1.set("");
    				room.set(null);
    			}

    			if (state.userID && typeof state.userID === "string") user.set(state.userID); else user.set("");
    		});
    	});

    	onDestroy(() => {
    		unsubscribe();
    	});

    	const writable_props = ["url", "host", "port"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    		if ("host" in $$props) $$invalidate(1, host = $$props.host);
    		if ("port" in $$props) $$invalidate(2, port = $$props.port);
    	};

    	$$self.$capture_state = () => ({
    		auth: auth$1,
    		user,
    		room,
    		onDestroy,
    		onMount,
    		Router,
    		Route,
    		Link,
    		setContext,
    		connection,
    		Header,
    		Sidepanel,
    		Chat,
    		url,
    		host,
    		port,
    		client,
    		unsubscribe,
    		$auth,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    		if ("host" in $$props) $$invalidate(1, host = $$props.host);
    		if ("port" in $$props) $$invalidate(2, port = $$props.port);
    		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, host, port];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0, host: 1, port: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get host() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set host(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get port() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set port(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		host: 'localhost',
    		port: '5000'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
