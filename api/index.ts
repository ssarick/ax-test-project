import {ref} from 'vue';
import type {Post, PostFilters, Comment, PostId, CommentFilters} from './types';
export function usePosts() {
    const posts = ref<Post[]>([]);
    const comments = ref<Comment[]>([]);
    const post = ref<Post>();
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const fetchPosts = async (args: PostFilters) => {
        loading.value = true;
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${args.page}&_limit=${args.perPage}&_sort=${args.sort}`
            );
            posts.value = await response.json();
        } catch (err) {
            error.value = 'Error fetching posts.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const fetchPost = async (id: PostId) => {
        loading.value = true;
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${id}`
            );
            post.value = await response.json();
        } catch (err) {
            error.value = 'Error fetching post.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const fetchComments = async (args: CommentFilters, id: PostId) => {
        loading.value = true;
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${id}/comments?_page=${args.page}&_limit=${args.perPage}`
            );
            comments.value = await response.json();
        } catch (err) {
            error.value = 'Error fetching comments.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        posts,
        post,
        comments,
        loading,
        error,
        fetchPosts,
        fetchPost,
        fetchComments
    };
}
