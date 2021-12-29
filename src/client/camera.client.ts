import { Workspace, Players, RunService } from "@rbxts/services";

const CAMERA_POS = new Vector3(4, 50, 4);
const LOOK_AT = new Vector3(4, 0, 4);

// calculate the camera's CFrame now, because if we do it in the
// assignment, it kills the player... Also, this is more efficient.
const cframe = new CFrame(CAMERA_POS, LOOK_AT).mul(CFrame.Angles(0, 0, math.rad(-90)));

RunService.BindToRenderStep("IsometricCamera", Enum.RenderPriority.Camera.Value, () => {
    const player = Players.LocalPlayer;
    const camera = Workspace.CurrentCamera as Camera;
    if (player.Parent && player.Character) {
        camera.CameraType = Enum.CameraType.Scriptable;
        camera.FieldOfView = 22;
        camera.CFrame = cframe;
    }
});

export {};
