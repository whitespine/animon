
// Converts any format of style into a svelte style hash
export function fixStyle(...styles: Array<string | object>): string {
    let all_styles = "";
    for(let s of styles) {
        if (typeof s == "string") {
            s = s.trim();
            if(!s.endsWith(";")) {
                s += ";";
            }
            all_styles += s;
        } else if (typeof s == "object" && Array.isArray(s)) {
            throw new TypeError("Style cannot be an array");
        } else if (typeof s == "object") {
            for(let [k, v] of Object.entries(s)) {
                all_styles += `${k}: ${v}`;
            }
        } else {
            continue;
        }
    }
    return all_styles;
}

// Converts any format of classes into a svelte style hash
type fixClassesArg = string | Record<string, any> | Array<fixClassesArg> | null | undefined;
export function fixClasses(...classes: fixClassesArg[]): Record<string, boolean> {
    let all_classes: Record<string, boolean> = {};
    for (let c of classes) {
        if (typeof c == "string") {
            let segments = c.split(/\s+/);
            segments.forEach(element => {
                all_classes[element] = true;
            });
        } else if (typeof c == "object" && Array.isArray(c)) {
            let sub_results = fixClasses(...c);
            Object.assign(all_classes, sub_results);
        } else if (typeof c == "object") {
            Object.assign(all_classes, c);
        } else {
            continue;
        }
    }
    return all_classes;
}