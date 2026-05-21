import { mount, unmount } from 'svelte';
import CheckMessage from '../components/rolls/CheckMessage.svelte'
import ViewGearMessage from '../components/items/ViewGearMessage.svelte'


export class SystemChatMessage extends ChatMessage {
    // State
    custom = $state({});
    _svelte_wrappers = {};
    _svelte_components = {};

    // Populate this as the specified component. Cannot be changed once populated
    async populateAsComponent(component, mode) {
        this.custom = this.flags[game.system.id];

        if (!this._svelte_wrappers[mode]) {
            // Instantiate props
            let wrapper =  document.createElement("li")
            this._svelte_wrappers[mode] = wrapper;
            wrapper.classList.add("message"); // V14+
            wrapper.classList.add("chat-message"); // V13
            wrapper.dataset["messageId"] = this.id;
            this._svelte_components[mode] = mount(component, { props: {
                message: this
            }, target: wrapper });
        }

        return this._svelte_wrappers[mode];
    }

    async getCheckHTML(mode) {
        return this.populateAsComponent(CheckMessage, mode);
    }

    async getGearHTML(mode) {
        return this.populateAsComponent(ViewGearMessage, mode);
    }

    // Override base functionality to 
    async renderHTML(options={}) {
        let popup = options.canDelete === false;
        let mode = popup ? "popup" : "message";
        let systemFlagType = this.flags[game.system.id]?.["type"]; 
        if (systemFlagType == "roll_check") {
            return this.getCheckHTML(mode);
        } else if (systemFlagType == "show_gear") {
            return this.getGearHTML(mode);
        } else {
            // 
            return super.renderHTML();
        }
    }
}

// Disable inbuilt DSN roll display for MY_SYSTEM_ID messages. We do these manually
// TODO: Should this be default behavior for quicksilver?
Hooks.on('diceSoNiceRollStart', (messageId, context) => {
    //Hide this roll
    if(game.messages.get(messageId)?.flags[game.system.id]?.["type"] == "roll") {
        context.blind=true;
    }
});


// Create a cleanup hook to unmount messages as they're deleted
// TODO: determine if this is necessary in v14+
Hooks.on("deleteChatMessage", (message) => {
    if(message._svelte_component) {
        for(let [k, v] of Object.entries(message._svelte_wrappers)) {
            unmount(message._svelte_components[k]);
            globalThis.$(v).remove();
        }
    }
});