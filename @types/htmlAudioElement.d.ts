export const _ = '';

declare global {
    interface HTMLAudioElement {
        setSinkId(deviceId: string): Promise;
    }
}