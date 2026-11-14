<script lang="ts">
	import LegalPage from '$lib/components/LegalPage.svelte';

	let { data } = $props();
</script>

<LegalPage title={data.title} description={data.description} html={data.html} />
