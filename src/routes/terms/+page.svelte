<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact } from '$lib/config';
</script>

<Seo title="Terms" description="Terms of use for the Lytebuy marketing site." noindex />

<Section tone="surface" space="md">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-display leading-[1.05]">Terms</h1>
		<div class="prose-lytebuy mt-8">
			<p>
				<strong>This is a placeholder and not legal advice.</strong> Replace it with reviewed terms
				before launch.
			</p>
			<h2>This site</h2>
			<p>
				These pages describe the Lytebuy platform. Nothing here is an offer, a contract, or a
				guarantee of any particular result for a business that lists with us.
			</p>
			<h2>Using the platform</h2>
			<p>
				Selling on Lytebuy, buying through it, and vendor payouts are governed by the terms you
				accept inside the app, not by this page.
			</p>
			<h2>Content</h2>
			<p>
				Words, images and marks on this site belong to Lytebuy unless stated otherwise. Press may
				use material from the press page for coverage.
			</p>
			<h2>Contact</h2>
			<p><a href="mailto:{contact.email}">{contact.email}</a></p>
		</div>
	</div>
</Section>
