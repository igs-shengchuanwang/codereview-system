<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.github_url" class="source-link">
    <a :href="frontmatter.github_url" target="_blank" rel="noreferrer">
      📄 {{ frontmatter.file }}
    </a>
  </div>
  <div v-if="frontmatter.symptoms?.length" class="symptoms">
    <span class="symptoms-label">常見症狀</span>
    <span v-for="s in frontmatter.symptoms" :key="s" class="symptom-tag">{{ s }}</span>
  </div>
</template>

<style scoped>
.source-link {
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 0.9em;
}
.source-link a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.source-link a:hover {
  text-decoration: underline;
}
.symptoms {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}
.symptoms-label {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  margin-right: 0.25rem;
}
.symptom-tag {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 999px;
  font-size: 0.8em;
}
</style>
