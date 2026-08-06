<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact } from '$lib/config';
</script>

<Seo title="Privacy" description="How Lytebuy handles your data on this marketing site." noindex />

<Section tone="surface" space="md">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-display leading-[1.05]">Privacy</h1>
		<div class="prose-lytebuy mt-8">
			<p>
				<strong>This is a placeholder and not legal advice.</strong> It describes only what this
				marketing site currently does. Replace it with reviewed policy text before launch.
			</p>
			<h2>What this site collects</h2>
			<p>
				If you submit the contact form we receive the name, email, business and message you type,
				and we use them only to reply. We do not add you to a mailing list and we do not sell or
				share the information.
			</p>
			<h2>Analytics</h2>
			<p>
				When analytics is enabled this site loads Google Analytics, which sets cookies and records
				pages visited, approximate location and device information. It is not loaded at all when
				no measurement ID is configured.
			</p>
			<h2>The Lytebuy app</h2>
			<p>
				The marketplace app handles accounts, orders and payments and is covered by its own policy,
				not this one.
			</p>
			<h2>Contact</h2>
			<p>
				Questions, corrections or a request to delete something you sent us:
				<a href="mailto:{contact.email}">{contact.email}</a>.
			</p>
		</div>
	</div>
</Section>
