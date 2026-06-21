import { mount, unmount } from 'svelte';
import SystemMessageComponent from '../components/rolls/SystemMessage.svelte'


export class SystemChatMessage extends ChatMessage {
    static TYPES = ["basic_check"]; // Not inferred from models

    // State
    _svelte_wrappers = {}; // For popout, popup, and 
    _svelte_components = {};

    // Populate this as the specified component. Cannot be changed once populated
    async populateAsComponent(mode) {
        if (!this._svelte_wrappers[mode]) {
            // Instantiate props
            let wrapper =  document.createElement("li")
            this._svelte_wrappers[mode] = wrapper;
            wrapper.classList.add("message"); // V14+
            wrapper.classList.add("chat-message"); // V13
            wrapper.dataset["messageId"] = this.id;
            this._svelte_components[mode] = mount(SystemMessageComponent, { props: {
                message: this
            }, target: wrapper });
        }

        return this._svelte_wrappers[mode];
    }

    // Override base functionality to 
    async renderHTML(options={}) {
        let popup = options.canDelete === false;
        let mode = popup ? "popup" : "message";
        let systemFlagType = this.flags[game.system.id]?.["type"]; 
        if(this.type != "base") {
            return this.populateAsComponent(mode);
        } else {
            return super.renderHTML();
        }
    }
}

// Disable inbuilt DSN roll display for animon messages. We do these manually
// TODO: Should this be default behavior for quicksilver?
/*
Hooks.on('diceSoNiceRollStart', (messageId, context) => {
    //Hide this roll
    if(game.messages.get(messageId)?.flags[game.system.id]?.["type"] == "roll") {
        context.blind=true;
    }
});
*/


// Create a cleanup hook to unmount messages as they're deleted
// Might be able to do this not as a hook
/*
Hooks.on("deleteChatMessage", (message) => {
    if(message._svelte_component) {
        for(let [k, v] of Object.entries(message._svelte_wrappers)) {
            unmount(message._svelte_components[k]);
            globalThis.$(v).remove();
    }
    if(message._svelte_wrapper) {
        message._svelte_wrapper.remove();
    }
});
*/