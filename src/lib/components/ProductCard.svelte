<script lang="ts">
	interface Props {
		name: string;
		vendor: string;
		price: string;
		deal?: string;
		image?: string;
	}

	let { name, vendor, price, deal, image }: Props = $props();
</script>

<article class="group flex flex-col">
	<div class="relative aspect-square overflow-hidden bg-canvas">
		{#if image}
			<img
				src={image}
				alt=""
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-dust" aria-hidden="true">
				<svg
					viewBox="0 0 24 24"
					class="h-8 w-8 text-granite"
					fill="none"
					stroke="currentColor"
					stroke-width="1.25"
				>
					<rect x="3" y="3" width="18" height="18" rx="1" />
					<path d="m3 16 5-5 4 4 3-3 6 6" />
					<circle cx="8.5" cy="8.5" r="1.5" />
				</svg>
			</div>
		{/if}

		{#if deal}
			<span
				class="absolute top-3 left-3 bg-accent px-2.5 py-1 text-xs font-medium tracking-wide text-white"
			>
				{deal}
			</span>
		{/if}
	</div>

	<div class="pt-3.5">
		<p class="text-xs tracking-wide text-granite uppercase">{vendor}</p>
		<p class="mt-1 leading-snug font-medium text-iron">{name}</p>
		<p class="mt-1 text-sm text-accent">{price}</p>
	</div>
</article>
