<script setup lang="ts">
import { navigateTo, useRoute } from '#imports'

const supportedLocales = new Set(['zh-cn', 'zh-tw', 'ja', 'ko', 'en'])
const route = useRoute()
const locale = String(route.params.locale || '').toLowerCase()

if (!supportedLocales.has(locale)) {
  navigateTo('/zh-cn', { redirectCode: 301 })
}
</script>

<template>
  <SiteHome />
</template>
