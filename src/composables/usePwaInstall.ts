import { ref, onMounted, onUnmounted } from "vue";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface PWAInstallResult {
	/** Whether the install prompt is available (beforeinstallprompt fired) */
	installAvailable: import("vue").Ref<boolean>;
	/** Whether the app was just installed in this session */
	justInstalled: import("vue").Ref<boolean>;
	/** Whether the app is already running in standalone/display-mode */
	isStandalone: boolean;
	/** Trigger the install prompt */
	install: () => Promise<void>;
}

/**
 * Composable for PWA install button (beforeinstallprompt flow).
 * Returns reactive state and an install() trigger.
 */
export function usePwaInstall(): PWAInstallResult {
	const installAvailable = ref(false);
	const justInstalled = ref(false);

	let deferredPrompt: BeforeInstallPromptEvent | null = null;

	const isStandalone =
		window.matchMedia("(display-mode: standalone)").matches ||
		(window.navigator as { standalone?: boolean }).standalone === true;

	function onBeforeInstallPrompt(e: Event) {
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		installAvailable.value = true;
	}

	function onAppInstalled() {
		installAvailable.value = false;
		deferredPrompt = null;
		justInstalled.value = true;
	}

	onMounted(() => {
		window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
		window.addEventListener("appinstalled", onAppInstalled);
	});

	onUnmounted(() => {
		window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
		window.removeEventListener("appinstalled", onAppInstalled);
	});

	async function install() {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();

		const result = await deferredPrompt.userChoice;
		if (result.outcome === "accepted") {
			installAvailable.value = false;
			justInstalled.value = true;
		}

		deferredPrompt = null;
	}

	return {
		installAvailable,
		justInstalled,
		isStandalone,
		install,
	};
}
