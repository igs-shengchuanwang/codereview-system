<script setup>
import DefaultTheme from 'vitepress/theme'
import SourceLink from './SourceLink.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <SourceLink />
    </template>
  </Layout>
</template>
