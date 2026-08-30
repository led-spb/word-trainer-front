
function urlBase64ToUint8Array(base64String :string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
}


export class NotificationManager {

    public static isSupported(): boolean {
        return "Notification" in window
    }

    public static async getSubscription(): Promise<PushSubscription|null> {
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    }

    public static async hasSubscription(): Promise<boolean> {
        return !!(await NotificationManager.getSubscription())
    }

    public static async subscribe(publicKey :string): Promise<PushSubscription>{
        const registration = await navigator.serviceWorker.ready;

        let subscription = await registration.pushManager.getSubscription();
        if( !!subscription ) return subscription

        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        })
        return subscription 
    }
}
