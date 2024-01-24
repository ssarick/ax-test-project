<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePosts } from '~/api'
import {type PostFilters, type Post} from "~/api/types";

const router = useRouter()

const { fetchPosts, posts, loading, error } = usePosts()

const sortItemsList = [
  {
    label: 'userId',
    value: 'userId'
  },
  {
    label: 'id',
    value: 'id'
  },
  {
    label: 'title',
    value: 'title'
  },
  {
    label: 'body',
    value: 'body'
  }
];

const search = ref<string>('');

const filteredPosts = ref<Post[]>([]);

// Так как по этому запросу всего 100 элементов, я подогнал входные данные для пагинации
const filters = ref<PostFilters>({
  page: 1,
  perPage: 5,
  total: 100,
  totalPages: 20,
  sort: null
});
function liveSearch (search: string | number){
  filteredPosts.value = posts.value.filter(item =>
      item.title?.toLowerCase().includes(search.toString()) ||
      item.body?.toLowerCase().includes(search.toString()) ||
      item.id == search
  );
}

onMounted(() => {
  fetchPosts({
    ...filters.value
  });
});

watch(
    () => filters.value,
    (params) => {
      filters.value.totalPages = Math.ceil(filters.value.total / filters.value.perPage)
      fetchPosts({
        ...params
      });
    },
    { deep: true }
);

watch(
    () => search.value,
    (val) => {
      if (val.length) liveSearch(val)
      else filteredPosts.value = []
    }
);
</script>

<template>
  <n-card>
    <n-flex vertical>
      <n-space justify="center" vertical>
        <n-input
            v-model:value="search"
            type="text"
            size="large"
            placeholder="Live Search..."
            clearable
        />
        <client-only placeholder="loading...">
          <n-select
              v-model:value="filters.sort"
              placeholder="Select filter"
              clearable
              size="large"
              :options="sortItemsList"
          />
        </client-only>
      </n-space>
      <n-space vertical style="margin-top: 24px;">
        <n-spin :show="loading" style="min-height: 432px;">
          <n-list hoverable bordered clickable >
            <n-list-item v-for="post in filteredPosts.length ? filteredPosts : posts" :key="post.id">
              <n-thing
                  :title="`${post.id}. ${post.title}`"
                  content-style="margin-top: 10px;"
                  @click.prevent="router.push({ path: `/post/${post.id}`})"
              >
                {{post.body}}
              </n-thing>
            </n-list-item>
          </n-list>
        </n-spin>
        <client-only placeholder="loading...">
          <n-pagination
              v-model:page="filters.page"
              v-model:page-size="filters.perPage"
              :page-count="filters.totalPages"
              size="large"
              show-size-picker
              :page-sizes="[5,10,20,50,100]"
          />
        </client-only>
      </n-space>
    </n-flex>
  </n-card>
</template>