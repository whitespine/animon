
// Converts any format of style into a svelte style hash
export function fixStyle(...styles) {
    all_styles = {};
    for(let s of styles) {
        if (typeof s == "string") {
            let segments = s.split(";");
            let result = {};
            for (let seg of segments) {
                let [key, value] = seg.split(":");
                result[key] = value;
            }
        } else if (typeof s == "object" && Array.isArray(s)) {
            throw new TypeError("Style cannot be an array");
        } else if (typeof s == "object") {
            Object.assign(all_styles, s);
        } else {
            continue;
        }
    }
    return all_styles;
}

// Converts any format of classes into a svelte style hash
export function fixClasses(...classes) {
    let all_classes = {};
    for (let c of classes) {
        if (typeof c == "string") {
            let segments = c.split(/\s+/);
            segments.forEach(element => {
                all_classes[element] = true;
            });
        } else if (typeof c == "object" && Array.isArray(c)) {
            sub_results = fixClasses(...c);
            Object.assign(all_classes, ...sub_results);
        } else if (typeof c == "object") {
            Object.assign(all_classes, c);
        } else {
            continue;
        }
    }
    return all_classes;
}