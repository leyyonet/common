try {
    if (globalThis) {
        globalThis.leyyo_is_testing = true;
    }
    else if (global) {
        global.leyyo_is_testing = true;
    }
} catch (e) {

}
