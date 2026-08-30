const registerSW = async () => {
    if( !('serviceWorker' in navigator) )
        return;

    try{
        const reg = await navigator.serviceWorker.register('/sw.js', {scope: '/'})
        console.log('Service worker regiter')

        return reg
    }catch(e){
        console.error('Service worker registration failed', e)
    }
}

registerSW();