export const ANIMON = {
    // The system id
    id: "animon",

    // The keys for various settings. Nest as deeply as necessary
    settings: {
        // Useful for tracking initialization
        init: {
            welcome: "welcome" as const
        },
    },

    // Keys for socket actions
    socket: {
        suspense: "DICE_SUSPENSE_SYNC",
        gm_edit_message: "GM_EDIT_MESSAGE"
    },

    // Add whatever other constants you need
}