<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            success: number,
            failed: number
        }>(),
        {success: 0, failed: 0}
    )
</script>


<template>
    <va-list class="stat">
        <va-list-item>
            <va-list-item-section>Попыток</va-list-item-section>
            <va-list-item-section icon>{{ props.success+props.failed }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>Правильно</va-list-item-section>
            <va-list-item-section icon>{{ props.success }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>Ошибок</va-list-item-section>
            <va-list-item-section icon>{{ props.failed }}</va-list-item-section>
        </va-list-item>
        <va-list-item>
            <va-list-item-section>Процент</va-list-item-section>
            <va-list-item-section icon>{{ Math.ceil((props.success+props.failed > 0 ? props.success / (props.success+props.failed) : 0)*100) }}%</va-list-item-section>
        </va-list-item>
    </va-list>
</template>

