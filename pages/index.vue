<script setup lang="ts">
import { navigateTo, onMounted } from '#imports'

const browserLocalePath = () => {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  const normalized = languages.map((language) => language.toLowerCase())

  if (normalized.some((language) => language.startsWith('zh-tw') || language.startsWith('zh-hk') || language.startsWith('zh-mo') || language.includes('hant'))) {
    return '/zh-tw'
  }

  if (normalized.some((language) => language.startsWith('ja'))) {
    return '/ja'
  }

  if (normalized.some((language) => language.startsWith('ko'))) {
    return '/ko'
  }

  if (normalized.some((language) => language.startsWith('en'))) {
    return '/en'
  }

  return '/zh-cn'
}

onMounted(() => {
  navigateTo(browserLocalePath(), { replace: true })
})
</script>

<template>
  <SiteHome />
</template>
