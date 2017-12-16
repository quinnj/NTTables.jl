
function wh(c) {
    return c === '\t' || c === ' ' || c === '\n' || c === '\r'
}
function parse(s) {
    // "(`x`, `y`) -> `x` * `y` + 3"
    let st = 0
    let i = 0
    let args = []
    let backtickargs = []
    let c = ''
    while (i < s.length) {
        c = s[i]
        if (wh(c) || c === '(' || c === ',') {
            i += 1
            continue
        } else if (c === ')' || c === '-') {
            break
        } else if (c === '`') {
            // escaped column names
            i += 1
            st = i
            c = s[i]
            while (i < s.length && c !== '`') {
                i += 1
                c = s[i]
            }
            args.push(s.substring(st, i))
            backtickargs.push(s.substring(st, i))
            i += 1
        } else {
            st = i
            // normal symbol identifiers
            while (i < s.length && !wh(c) && c !== ',' && c !== ')' && c !== '-') {
                i += 1
                c = s[i]
            }
            args.push(s.substring(st, i))
        }
    }
    let a = 0
    let x = null
    for (x of backtickargs) {
        let sym = "_val" + a
        s = s.replace(new RegExp('`' + x + '`', 'g'), sym)
        a += 1
    }
    return { args: args, code: s }
}

function coalesce(x, y) {
    return x === undefined || x === null ? y : x
}

function cmp(x, y) {
    const xx = coalesce(x, Infinity)
    const yy = coalesce(y, Infinity)
    if (xx < yy) {
        return -1
    } else if (yy < xx) {
        return 1
    } else {
        return 0
    }
}

const Utils = {
    parse: parse,
    cmp: cmp,
}

export default Utils;