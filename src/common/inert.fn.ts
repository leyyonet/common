// noinspection JSUnusedGlobalSymbols

import {Fnc, InertBuildOpt, InertEagerOpt, InertItem, InertLazyOpt, InertRepo,} from "../index.types";
import {isFilledArr, isFilledObj, isObj, isText} from "../function";
import {FQN} from "../internal";
import {DeveloperError} from "../error";
import {newRepoSet} from "./set.fn";
import {newRepoMap} from "./map.fn";
import {testCase} from "./test.fn";
import {getFqn, onFqnSet, setFqn} from "./fqn.fn";
import {setAnonymousName} from "./name.fn";

// region properties
const where = `${FQN}.LazyFn`;

const _repo = newRepoMap<string, InertRepo<InertItem<unknown>, unknown>>(`${where}.repo`);
// endregion properties

// noinspection JSUnusedGlobalSymbols
export function buildInert<L extends InertItem<T>, T>(options: InertBuildOpt<L, T>): void {
    if ( !isObj(options)) {
        throw new DeveloperError('Invalid build options', testCase(FQN, 'XXX'), where);
    }
    if ( !isText(options.cluster)) {
        throw new DeveloperError('Invalid cluster name', testCase(FQN, 'XXX'), where);
    }
    if (typeof options.validateLambda !== 'function') {
        throw new DeveloperError('Invalid validate lambda', testCase(FQN, 'XXX'), where);
    }
    if (typeof options.getNameLambda !== 'function') {
        throw new DeveloperError('Invalid get name lambda', testCase(FQN, 'XXX'), where);
    }
    if (options.setNameLambda && typeof options.setNameLambda !== 'function') {
        throw new DeveloperError('Invalid set name lambda', testCase(FQN, 'XXX'), where);
    }
    if (options.stampLambda && typeof options.stampLambda !== 'function') {
        throw new DeveloperError('Invalid stamp lambda', testCase(FQN, 'XXX'), where);
    }
    if (options.nextLoadLambda && typeof options.nextLoadLambda !== 'function') {
        throw new DeveloperError('Invalid next load lambda', testCase(FQN, 'XXX'), where);
    }
    if (options.anonymousName && !isText(options.anonymousName)) {
        throw new DeveloperError('Invalid anonymous name', testCase(FQN, 'XXX'), where);
    }

    if (_repo.has(options.cluster)) {
        throw new DeveloperError(`Duplicated cluster [${options.cluster}]`, testCase(FQN, 'XXX'), where);
    }
    const repoItem: InertRepo<L, T> = {
        ...options,
        uniqueLoaded: newRepoSet<T>(`${where}.${options.cluster}.uniqueLoaded`),
        fullNames: newRepoMap<string, L>(`${where}.${options.cluster}.fullNames`),
        basicNames: newRepoMap<string, L>(`${where}.${options.cluster}.basicNames`),
        aliases: newRepoMap<string, string>(`${where}.${options.cluster}.aliases`),
        pendingFqn: newRepoMap<string, L>(`${where}.${options.cluster}.pendingFqn`),
        pendingLazy: newRepoMap<string, L>(`${where}.${options.cluster}.pendingLazy`),
    };
    _repo.set(options.cluster, repoItem);
}

function _getRepo<L extends InertItem<T>, T>(cluster: string): InertRepo<L, T> {
    return _repo.get(cluster) as InertRepo<L, T>;
}

/**
 * Define an inert as eager
 *
 * @param {string} cluster - cluster name
 * @param {any} target - target of cluster
 * @param {InertEagerOpt} options - options
 * */
export function defineInertEager<L extends InertItem<T>, T>(cluster: string, target: T, options: InertEagerOpt): void {
    const {uniqueLoaded, validateLambda, getNameLambda, anonymousName, stampLambda} = _getRepo<L, T>(cluster);
    if ( !validateLambda(target)) {
        throw new DeveloperError('Invalid target', testCase(FQN, 220), where);
    }
    // already defined
    if (uniqueLoaded.has(target)) {
        return;
    }

    let basicName = getNameLambda(target);
    if ( !basicName && anonymousName) {
        basicName = setAnonymousName(target as Fnc, anonymousName);
    }
    if ( !basicName) {
        throw new DeveloperError('Empty name', testCase(FQN, 220), where);
    }
    const item = {...options, target, name: basicName, stage: undefined, mode: 'eager'} as L;

    if (_inFqnStage(cluster, item)) {
        return;
    }
    item.stage = 'persistent';
    _relateIt(cluster, item);
    if (stampLambda) {
        stampLambda(item);
    }
}


/**
 * Define an inert as lazy (with path)
 *
 * @param {string} cluster - cluster name
 * @param {InertLazyOpt} opt - inert lazy options
 * */
export function defineInertLazy<L extends InertItem<T>, T = unknown>(cluster: string, opt: InertLazyOpt<T>): void {
    if ( !isText(opt.name)) {
        throw new DeveloperError('Invalid inert name', testCase(FQN, 'XXX'), where);
    }

    // it's already pending to be loaded
    const {pendingLazy} = _getRepo(cluster);
    if (pendingLazy.has(opt.name)) {
        return;
    }

    if ( !isFilledObj(opt)) {
        throw new DeveloperError('Invalid inert options', testCase(FQN, 222), where);
    }
    if ( !(opt.lazyTarget instanceof Promise)) {
        throw new DeveloperError(`Invalid inert path [${opt.name}]`, testCase(FQN, 224), where);
    }
    const item = {...opt, stage: 'loading-waiting', mode: 'lazy'} as L;
    pendingLazy.set(opt.name, item);
}

function _inFqnStage<L extends InertItem<T>, T = unknown>(cluster: string, item: L): boolean {
    item.full = getFqn(item.target);
    if ( !item.full.includes('.')) {
        if (isText(item.fqn)) {
            item.full = setFqn(item.target, item.fqn)
        }
        else {
            const {pendingFqn} = _getRepo<L, T>(cluster);
            pendingFqn.set(item.name, item);
            item.stage = 'fqn-waiting';
            onFqnSet(item.target, f => _afterFqnSet(cluster, f));
            return true;
        }
    }
    return false;
}

function _afterFqnSet<L extends InertItem<T>, T = unknown>(cluster: string, full: string): void {
    if ( !isText(full)) {
        return;
    }
    const {pendingFqn, stampLambda} = _getRepo<L, T>(cluster);
    const item = pendingFqn.get(full.split('.').pop());
    if (item) {
        pendingFqn.delete(item.name);
        item.full = full;
        item.stage = 'persistent';
        _relateIt(cluster, item);
        if (stampLambda) {
            stampLambda(item);
        }
    }
    else {
        new DeveloperError(`Inert could not be found after come back, [${full}]`, testCase(FQN, 'ZZZ'), where).log();
    }
}

function _relateIt<L extends InertItem<T>, T = unknown>(cluster: string, item: L): void {
    let ignore: boolean;
    const {fullNames, basicNames, aliases} = _getRepo<L, T>(cluster);
    if (item.full) {
        ignore = false;
        if (fullNames.has(item.full)) {
            const anotherItem = fullNames.get(item.full);
            if (anotherItem.target !== item.target) {
                ignore = true;
                new DeveloperError(`Duplicated full name [${item.full}]`, testCase(FQN, 'ZZZ'), where).log();
            }
        }
        if ( !ignore) {
            fullNames.set(item.full, item);
        }
    }

    ignore = false;
    if (basicNames.has(item.name)) {
        const anotherItem = basicNames.get(item.name);
        if (anotherItem.target !== item.target) {
            ignore = true;
            new DeveloperError(`Duplicated basic name [${item.name}]`, testCase(FQN, 'ZZZ'), where).log();
        }
    }
    if ( !ignore) {
        basicNames.set(item.name, item);
    }

    if (isFilledArr(item.aliases)) {
        item.aliases.forEach(alias => {
            ignore = false;
            if (aliases.has(alias)) {
                const anotherName = aliases.get(alias);
                if ( ![item.name, item.full].includes(anotherName)) {
                    ignore = true;
                    new DeveloperError(`Duplicated alias [${item.name}]`, testCase(FQN, 'ZZZ'), where).log();
                }
            }
            if ( !ignore) {
                aliases.set(alias, item.full ?? item.name);
            }
        });
    }
}

/**
 * Check inert defined as lazy, by name
 * Note:
 * - Inert's mode will be shifted lazy to eager after loaded
 *
 * @param {string} cluster - cluster name
 * @param {string} name - target name
 * @return {boolean}
 * */
export function isInertLazy(cluster: string, name: string): boolean {
    return getInert(cluster, name)?.mode === 'lazy';
}

/**
 * Check inert failed or conflicted, by name
 *
 * @param {string} cluster - cluster name
 * @param {string} name - target name
 * @return {boolean}
 * */
export function isInertInvalid(cluster: string, name: string): boolean {
    return ['failed', 'conflicted'].includes(getInert(cluster, name)?.mode);
}

/**
 * Check inert defined as eager, by name
 *
 * @param {string} cluster - cluster name
 * @param {string} name - target name
 * @return {boolean}
 * */
export function isInertEager(cluster: string, name: string): boolean {
    return getInert(cluster, name)?.mode === 'eager';
}

/**
 * Check inert defined or not, by name
 *
 * @param {string} cluster - cluster name
 * @param {string} name - target name
 * @return {boolean}
 * */
export function isInertDefined(cluster: string, name: string): boolean {
    return !!getInert(cluster, name);
}

/**
 * Get inert by name
 *
 * @param {string} cluster - cluster name
 * @param {string} name - target name
 * @return {InertItem}
 * */
export function getInert<L extends InertItem<T>, T>(cluster: string, name: string): L {
    if ( !isText(name)) {
        return undefined;
    }
    const {fullNames, basicNames, pendingFqn, pendingLazy, aliases} = _getRepo<L, T>(cluster);

    if (name.includes('.')) {
        if (fullNames.has(name)) {
            return fullNames.get(name);
        }
        return getInert(cluster, name.split('.').pop());
    }
    // no dot

    if (pendingFqn.has(name)) {
        return pendingFqn.get(name);
    }
    if (pendingLazy.has(name)) {
        return pendingLazy.get(name);
    }
    if (aliases.has(name)) {
        return getInert(cluster, aliases.get(name));
    }
    return basicNames.get(name);
}


/**
 * Load lazy inert by name
 * Note:
 * - Target must be exported as `foretell`
 *
 * @param {string} cluster - cluster name
 * @param {string} name - target name
 * @return {Promise<EnumItem>}
 * */
export async function loadInertLazy<L extends InertItem<T>, T>(cluster: string, name: string): Promise<L> {
    if ( !isText(name)) {
        throw new DeveloperError(`Invalid lazy name`, testCase(FQN, 'ZZZ'), where);
    }
    const {
        validateLambda,
        pendingLazy,
        stampLambda,
        uniqueLoaded,
        getNameLambda,
        setNameLambda, nextLoadLambda
    } = _getRepo<L, T>(cluster);

    const item = getInert<L, T>(cluster, name);
    if ( !item) {
        throw new DeveloperError(`Lazy was not defined [${name}]`, testCase(FQN, 'ZZZ'), where);
    }
    // It was already loaded
    if (item.mode === 'eager') {
        return item;
    }
    try {
        item.target = await item.lazyTarget;
        if (validateLambda(item.target)) {

            item.mode = 'eager';
            delete item.lazyTarget;

            // remove from pending
            if (pendingLazy.has(name)) {
                pendingLazy.delete(name);
            }

            if (nextLoadLambda) {
                await nextLoadLambda(item);
            }
            // already loaded
            if (uniqueLoaded.has(item.target)) {
                return item;
            }
        }
        else {
            item.mode = 'conflicted';
        }
    } catch (e) {
        item.mode = 'failed';
        new DeveloperError(`Callback inert during loading lazy class [${name}]`, testCase(FQN, 227), where).log(e);
    }

    // file could not be loaded
    if ( !item.target) {
        return undefined
    }

    const realName = getNameLambda(item.target);
    if (item.name !== realName) {
        if ( !realName && setNameLambda) {
            setNameLambda(item.target, item.name)
        }
        else {
            new DeveloperError(`Conflict in names [${item.name} vs ${realName}]`, testCase(FQN, 'ZZZ'), where).log();
        }
    }

    if (_inFqnStage(cluster, item)) {
        return;
    }
    item.stage = 'persistent';
    _relateIt(cluster, item);
    if (stampLambda) {
        stampLambda(item);
    }

    return item;
}
