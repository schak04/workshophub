export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Built by <span className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors">Saptaparno Chakraborty</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    © 2025-2026 WorkshopHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
}