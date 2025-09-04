export default function registerSocketEvents() {
	game.socket.on(`system.${SYSTEM_ID}`, event => {
		if (event.type === "setCounter" && game.user.isGM) {
			ac2d20.apps.MomentumTrackerV2.setCounter(
				event.payload.value,
				event.payload.type
			);
		}

		if (event.type === "updateCounter") {
			ac2d20.apps.MomentumTrackerV2.instance.render({force: true});
		}
	});
}
