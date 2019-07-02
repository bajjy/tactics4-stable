function aiActivation(input) {
    var player = input.game.TurnMachine.who();
    var actions = input.game.getAvailableActions();
    if (!player.ai || input.events.save.aiActivation) return false

    actions.some(el => {
        if (el.title == 'aiActivation') {
            input.game.action({
                game: input.game,
                client: input.game.TurnMachine.who(),
                target: input.game.TurnMachine.who(),
                task: el,
                setup: {
                    origin: input
                }
            });
            //exit point
            input.view.purge();
            input.view.draw();
        };
    });
    return true
};


export {
    aiActivation
}