
// Converts any format of style into a svelte style hash
export function fixStyle(style) {
    if (typeof style == "string") {
        let segments = style.split(";");
        let result = {};
        for (let seg of segments) {
            let [key, value] = seg.split(":");
            result[key] = value;
        }
        return result;
    } else if (typeof style == "object" && Array.isArray(style)) {
        throw new TypeError("Style cannot be an array");
    } else if (typeof style == "object") {
        return style;
    } else {
        return {};
    }
}

// Converts any format of classes into a svelte style hash
export function fixClasses() {
    if (typeof style == "string") {
        let segments = style.split(/\S+/);
        let result = {};
        for (let seg of segments) {
            result[seg] = true;
        }
        return result;
    } else if (typeof style == "object" && Array.isArray(style)) {
        let result = {};
        for (let seg of style) {
            result[seg] = true;
        }
        return result;
    } else if (typeof style == "object") {
        return style;
    } else {
        return {};
    }
}