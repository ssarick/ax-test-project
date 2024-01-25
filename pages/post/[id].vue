<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {usePosts} from "~/api";
import type {Comment, CommentFilters} from "~/api/types";
const route = useRoute()
const { id } = route.params
const { fetchPost, fetchComments, comments, post, loading, error } = usePosts()

const filteredComments = ref<Comment[]>([]);

const filters = ref<CommentFilters>({
  page: 1,
  perPage: 5
});

const search = ref<string>('');

const show = ref<boolean>(false)

function liveSearch (search: string | number){
  filteredComments.value = comments.value.filter(item =>
      item.email?.toLowerCase().includes(search.toString())
  );
}

function showComments () {
  fetchComments(filters.value, id).then(() => {
    show.value = true
  })
}

onMounted(() => {
  fetchPost(id)
})

watch(
    () => search.value,
    (val) => {
      if (val.length) liveSearch(val)
      else filteredComments.value = []
    }
);
</script>

<template>
  <n-spin :show="loading" style="min-height: 100px">
    <n-card v-if="post">
      <template #header>
        {{ post?.title }}
      </template>
      <template #default>
        {{ post?.body }}
      </template>
      <template #action>
        <n-button type="primary" @click="showComments">Show comments</n-button>
      </template>
    </n-card>
  </n-spin>
  <client-only>
    <n-card v-if="comments.length">
      <template #header>
        Comments
      </template>
      <template #default>
        <n-virtual-list
            style="min-height: 150px; max-height: 250px"
            :item-size="100"
            :items="filteredComments.length ? filteredComments : comments"
        >
          <template #default="{ item, index }">
            <div :key="index" class="item">
              <h4>{{item.email}}</h4>
              <span>{{ item.body }}</span>
            </div>
          </template>
        </n-virtual-list>
      </template>
      <template #action>
        <n-input
            v-model:value="search"
            type="text"
            placeholder="Live Search comments by username..."
            clearable
        />
      </template>
    </n-card>
  </client-only>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
}
</style>