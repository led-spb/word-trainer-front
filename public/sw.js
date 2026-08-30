self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Новое сообщение', body: '...' };
    const options = {
        body: data.body,
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
