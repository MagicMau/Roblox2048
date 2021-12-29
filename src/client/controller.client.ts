import { ContextActionService, ReplicatedStorage } from "@rbxts/services";

const moveTilesEvent = ReplicatedStorage.WaitForChild("MoveTilesEvent") as RemoteEvent;

function move(dir: string, state: Enum.UserInputState) {
    if (state === Enum.UserInputState.End) {
        print(`moving ${dir}`);
        moveTilesEvent.FireServer(dir);
    }
}

ContextActionService.BindAction("up", (_, state) => move("up", state), true, Enum.KeyCode.Up);
ContextActionService.BindAction("down", (_, state) => move("down", state), true, Enum.KeyCode.Down);
ContextActionService.BindAction("left", (_, state) => move("left", state), true, Enum.KeyCode.Left);
ContextActionService.BindAction("right", (_, state) => move("right", state), true, Enum.KeyCode.Right);

export {};
