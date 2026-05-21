/**
 * Svelte utilities for tracking the currently targeted tokens.
 * `targeted_tokens` is ordered based on order of targeting
 */

// Use this in components to track targeted tokens
let targeted_tokens = $state([]);
export function targetedTokens() {
    return targeted_tokens;
}

Hooks.on("targetToken", (user, token, targeted) => {
    if(game.user == user) {
        if(targeted) {
            targeted_tokens.push(token);
        } else {
            targeted_tokens.splice(targeted_tokens.indexOf(token), 1);
        }
    }
});