
interface QuickDialogOptions {
    title?: string,
}

interface QuickTextOptions extends QuickDialogOptions {
    label?: string;
    placeholder?: string;
}

export class QuickDialog extends foundry.applications.api.DialogV2 {
    static DEFAULT_OPTIONS = {
        classes: ["animon"],
    }

    static async promptText(options: QuickTextOptions): Promise<string | null> {
        let dialog = this.input({
            content: `<form class="row even">
            <label>${options.label}</label>
            <input name="value"> 
            </form>` as foundry.applications.api.DialogV2.Content<{ value: "string" }>
        });
        let result = await dialog;
        return result ? result.value : null;
    }
}