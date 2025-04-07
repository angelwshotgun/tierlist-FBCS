<script setup>
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <DashboardStatsWidget />

        <div class="col-span-12 xl:col-span-6">
            <DashboardRecentSalesWidget />
            <DashboardBestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <DashboardRevenueStreamWidget />
            <DashboardNotificationsWidget />
        </div>
    </div>
</template>
