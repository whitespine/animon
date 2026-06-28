

class _ControlState {
    user_actor = $state(null);
    selected_tokens = $state([]);
    selected_actors = $derived(this.selected_tokens.map(x => x.actor).filter(y => y));
    targeted_tokens = $state([]);
    targeted_actors = $derived(this.targeted_tokens.map(x => x.actor).filter(y => y));

    speaker = $derived.by(() => {
        if(this.selected_tokens.length) {
            let token = this.selected_tokens[0];
            return {
                scene: token.scene.id,
                token: token.id,
                actor: token.actor.id,
                alias: token.name
            };
        } else if(this.user_actor) {
            return {
                scene: null,
                token: null,
                actor: this.user_actor.id,
                alias: this.user_actor.name
            };
        } else {
            return {
                scene: null,
                token: null,
                actor: null,
                alias: game.user.name
            }
        }
    });

    speakerActor = $derived(ChatMessage.getSpeakerActor(this.speaker));
};

export const ControlState = new _ControlState();

Hooks.once("ready", () => {
    ControlState.user_actor = game.user.character;
});

Hooks.on("controlToken", (token, new_state) => {
    if(new_state) {
        if(!ControlState.selected_tokens.some(x => x == token)) {
            ControlState.selected_tokens.push(token);
        }
    } else {
        ControlState.selected_tokens = ControlState.selected_tokens.filter(x => x != token);
    }
});


Hooks.on("targetToken", (user, token, new_state) => {
    if(game.user.id != user.id) return;
    if(new_state) {
        if(!ControlState.targeted_tokens.some(x => x == token)) {
            ControlState.targeted_tokens.push(token);
        }
    } else {
        ControlState.targeted_tokens = ControlState.targeted_tokens.filter(x => x != token);
    }
    // Could eventually do this by user, maybe
});