import { ReplicatedStorage, ServerStorage, Workspace } from "@rbxts/services";
import { Direction, GameManager } from "./game_manager";

const gameManager = new GameManager();

function updateGrid() {
    Workspace.GetChildren()
        .filter((part) => part.Name === "Tile")
        .forEach((tile) => tile.Destroy());

    const prefab = ServerStorage.FindFirstChild("Tile") as Part;

    gameManager.grid.eachCell((x, y, tile) => {
        if (tile.value > 0) {
            const part = prefab.Clone();
            part.Parent = Workspace;
            part.Position = new Vector3(10 - x * 4, 2, 10 - y * 4);
            part.Orientation = Vector3.zero;
            const text = part.FindFirstChild("NumberText", true) as TextLabel;
            text.Text = "" + tile.value;
            print(`Adding tile on (${x},${y}) to (${part.Position.X},${part.Position.Y},${part.Position.Z})`);
        }
    });
}

export function move(player: Player, dir: Direction) {
    if (player && player.Parent && player.Character) {
        gameManager.move(dir);
        updateGrid();
    }
}

const moveTilesEvent = ReplicatedStorage.WaitForChild("MoveTilesEvent") as RemoteEvent;
moveTilesEvent.OnServerEvent.Connect((player, dir) => move(player, dir as Direction));

updateGrid();
