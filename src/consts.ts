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
        example: "EXAMPLE_SOCKET_ACTION",
        suspense: "DICE_SUSPENSE_SYNC"
    },

    // Add whatever other constants you need
}