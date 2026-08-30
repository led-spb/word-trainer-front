<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { axiosInstance } from '@/api/config';
    import { UsersApiService, type User } from '@/api/users';
    import { useUsersStore } from '@/stores';

    import { NotificationManager } from '@/lib/Notification';
    import { useToast } from 'vuestic-ui';
    import Cropper from 'cropperjs'
    // @ts-ignore
    import AvatarCropper from "vue-avatar-cropper";


    const usersApiService = new UsersApiService(axiosInstance);
    const userStore = useUsersStore();
    const toastManager = useToast();

    const userData = ref(<User>{})
    const showCropper = ref(false)

    const computedField = <T>(field: string) => {
        return computed({
            get: () => {
                return <T>({...userStore.user, ...userData.value}[field])
            },
            set: (value: T) => {
                (<any>userData.value)[field] = value
            }
        })
    }
    const userName = computedField<string>('name')
    const userDailyGoal = computedField<number>('dailyGoal')

    const isLoading = ref(false)
    const notifyState = ref(false)

    const dataChanged = computed(() => {
        return userName.value != userStore.user?.name || userDailyGoal.value != userStore.user?.dailyGoal
    })

    onMounted(() => {
        NotificationManager.hasSubscription().then( (v) => notifyState.value = v)
    })

    const updateUserInfo = () => {
        isLoading.value = true
        usersApiService.updateUserInfo(userData.value)
            .then((data: User) => {
                userStore.setUserInfo(data)
                userData.value = <User>{}
            }
        ).finally( () => {
            isLoading.value = false
        })
    }

    const manageNotifications = computed({
        get: () => {
            return notifyState.value
        },
        set: async (value: any) => {
            isLoading.value = true
            try{
                if( value ){
                    if( await waitForNotifyPermissions() ){
                        const subscriptionInfo = await usersApiService.getSubscriptionKey()

                        const subscription = await NotificationManager.subscribe(subscriptionInfo.publicKey)
                        console.log(subscription.toJSON())

                        await usersApiService.registerWebPush(subscription.toJSON())
                        notifyState.value = !!subscription

                    }else{
                        toastManager.notify({
                            message: 'Не выданы разрешения на отображение уведомлений',
                            color: 'warning'
                        })
                    }
                }else{
                    const subscription = await NotificationManager.getSubscription()
                    if( subscription ){
                        await usersApiService.unregisterWebPush(subscription.toJSON())
                        await subscription.unsubscribe()
                    }

                    notifyState.value = await NotificationManager.hasSubscription()
                }
            }catch(e){
                console.error(e)
                toastManager.notify({
                    message: 'Не удалось включть нотификацию',
                    color: 'warning'
                })
            }finally{
                isLoading.value = false
            }
        }
    })
    const notifyIsSuppoted = computed( () => NotificationManager.isSupported() )
    const notifyPermissions = computed( () => Notification.permission )

    const waitForNotifyPermissions = async (): Promise<boolean> => {
        if( Notification.permission === 'default' ){
            const permission = await Notification.requestPermission();
            return permission === 'granted'
        }
        return Notification.permission === 'granted'
    }

    const uploadAvatar = (cropper: Cropper) => {
        cropper.getCroppedCanvas(
            { width: 512, height: 512 }
        ).toBlob(
            (blob :Blob|null) => {
                if( !!blob ){
                    usersApiService.updateUserAvatar(blob).then( user => {
                        userStore.setUserInfo(user)
                    })
                }
            },
            "image/jpeg"
        )
    }

</script>

<template>
    <va-card class="item" v-if="userStore.user">
        <va-inner-loading :loading="isLoading">
            <va-card-title><va-icon name="person" class="card-icon"/>Информация</va-card-title>
            <va-card-content>
                <va-input class="row input" label="Отображаемое имя" v-model="userName"></va-input>
                <va-divider/>
                <va-image class="mx-auto" :src="'uploads/'+userStore.user?.avatar" v-if="userStore.user?.avatar" :max-width="326"></va-image>
                <va-button class="mt-5" preset="primary" size="small" border-color="primary" @click="showCropper=true">Изменить фото</va-button>
                <avatar-cropper v-model="showCropper" 
                    :cropper-options="{ zoomable: false }"
                    :output-options="{ width: 512, height: 512 }"
                    :labels='{submit: "Ok", cancel: "Отмена"}'
                    :upload-handler="uploadAvatar"
                ></avatar-cropper>
            </va-card-content>
            <va-card-title><va-icon name="star" class="card-icon"/>Мои цели</va-card-title>
            <va-card-content>
                <va-slider label="Изучить слов в день" pins track-label-visible :min="20" :max="100" :step="10" class="row iput" v-model="userDailyGoal"></va-slider>
                <va-divider/>
            </va-card-content>
            <va-card-title><va-icon name="notifications_active" class="card-icon"/>Оповещения</va-card-title>
            <va-card-content>
                <va-alert v-if="notifyIsSuppoted && notifyPermissions == 'denied'" color="danger">Нотификации запрещены настройками</va-alert>
                <va-checkbox :disabled="!notifyIsSuppoted"
                    label="Напоминать о задании на день"
                    size="small"
                    v-model="manageNotifications"
                    v-else
                ></va-checkbox>
                <va-divider/>
            </va-card-content>
            <va-card-actions align="right">
                <va-button :disabled="!dataChanged" color="secondary" @click="userData = <User>{}">Отмена</va-button>
                <va-button :disabled="!dataChanged" color="primary" @click="updateUserInfo()">Сохранить</va-button>
            </va-card-actions>
        </va-inner-loading>
    </va-card>
</template>

<style>
    .input {
        margin-bottom: 0.5rem;
    }
</style>