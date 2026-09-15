<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { contact } from '$lib/config';
</script>

<!-- Google Play's data-deletion policy requires a PUBLICLY reachable URL - not
     behind a login, and reachable by someone who has already uninstalled the
     app. That is the whole reason this page exists separately from the in-app
     control. It is indexed (no `noindex`) because the reviewer and the user both
     have to be able to find it. -->
<Seo
	title="Delete your Lytebuy account"
	description="How to delete your Lytebuy account and what happens to your data."
/>

<Section tone="surface" space="md">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-display leading-[1.05]">Delete your account</h1>
		<div class="prose-lytebuy mt-8">
			<p>
				You can delete your Lytebuy account at any time. The quickest way is from inside the
				app, and you can also ask us to do it for you.
			</p>

			<h2>In the app</h2>
			<ol>
				<li>Open Lytebuy and sign in.</li>
				<li>Go to <strong>Account</strong>.</li>
				<li>Scroll to the bottom and tap <strong>Delete my account</strong>.</li>
				<li>Confirm. Your account is closed straight away.</li>
			</ol>

			<h2>By email</h2>
			<p>
				If you have already uninstalled the app, or you cannot sign in, email
				<a href="mailto:{contact.email}?subject=Delete%20my%20account">{contact.email}</a>
				from the address on your account and ask us to delete it. We will confirm when it is
				done.
			</p>

			<h2>What is deleted</h2>
			<p>Your personal details are removed and your sign-in stops working:</p>
			<ul>
				<li>Your name, email address and phone number</li>
				<li>Your saved delivery addresses</li>
				<li>Your password, so the account can no longer be signed into</li>
				<li>Your saved items, followed shops and marketing preferences</li>
			</ul>

			<!-- Said plainly rather than buried. "Delete" that silently keeps your
			     order history would be a lie, and the stores expect the retention
			     to be disclosed. -->
			<h2>What we have to keep</h2>
			<p>
				Records of orders you placed are kept, with your personal details removed from them. We
				are required to keep them: Lytebuy collects and remits sales tax on those orders, and
				they are the record of what a seller was paid. They can no longer be traced back to you
				through your account.
			</p>
			<p>
				We keep them for as long as tax and accounting law requires, and no longer.
			</p>

			<h2>If you sell on Lytebuy</h2>
			<p>
				Before a seller account can be closed, please finish or refund any orders you still owe
				a buyer, and withdraw any money we are holding for you. The app will tell you if either
				applies. This protects buyers who have already paid you, and makes sure none of your
				earnings are left behind.
			</p>

			<h2>Questions</h2>
			<p>
				Anything at all: <a href="mailto:{contact.email}">{contact.email}</a>.
			</p>
		</div>
	</div>
</Section>
