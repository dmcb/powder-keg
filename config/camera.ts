// Camera framing tunables for the game board view.

export const cameraTiltDistance = 4.3;
export const cameraMaxDistance = 17.0;
export const cameraMinDistance = 7;
export const defaultPlayerDistance = 1.3;

// Split-screen tunables. Every view (shared or split) uses a fixed
// `cellDistance` zoom, so joined and split views line up exactly. Players join
// a view below `joinDistance` and leave it above `splitDistance`.
export const cellDistance = 9;
export const joinDistance = 0.7;
export const splitDistance = 0.9;
// Divider width (aspect-corrected NDC) grows from 0 at `joinDistance` to
// `splitLineMaxWidth` once the two groups are `splitLineMaxDistance` apart.
export const splitLineMaxWidth = 0.012;
export const splitLineMaxDistance = 2;
export const splitLineColor = "#000000";
export const seedSmoothing = 8;
