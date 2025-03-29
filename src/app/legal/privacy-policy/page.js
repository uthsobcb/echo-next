
const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-10">Effective Date: 10 March 2025</p>

            {/* Section 1: Encryption */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">1. Your Journal is Private and Encrypted</h2>
                <p className="mb-2">
                    Every journal entry you create is <strong>end-to-end encrypted</strong>. This means your data is encrypted
                    before it even leaves your device, and only you have the key to unlock it. Even our servers cannot access the
                    contents of your entries. Your thoughts, reflections, and personal stories remain strictly private and fully secure.
                </p>
                <p>
                    Encryption is applied both in transit and at rest, following modern best practices to ensure your mental
                    health data is never exposed or accessible to unauthorized parties.
                </p>
            </section>

            {/* Section 2: Mood Data */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">2. Mood Data for Research (Anonymously)</h2>
                <p className="mb-2">
                    We may collect non-identifiable mood-related metadata, such as selected moods, emotional tags, or
                    engagement patterns (e.g., journaling frequency), to support mental health research.
                </p>
                <p>
                    <strong>We never access, store, or analyze the written content</strong> of your journal for research. Mood data is fully
                    anonymized and aggregated, ensuring no individual can ever be identified. Our aim is to better understand
                    how emotional patterns shift over time — and help improve mental wellness tools for everyone.
                </p>
            </section>

            {/* Section 3: AI Processing */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">3. AI-Powered Features</h2>
                <p className="mb-2">
                    Our app uses artificial intelligence (AI) to enhance your journaling experience — for example, by offering
                    mood-based prompts, reflective questions, inspirational quotes, or summaries.
                </p>
                <p>
                    Any data sent to the AI for processing is used solely to provide you with personalized, real-time support.
                    We do not retain this data, and we do not use it for training AI models. Your journal content remains
                    encrypted and is not used for AI unless you explicitly opt in.
                </p>
            </section>

            {/* Section 4: No Selling or Sharing */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">4. We Don’t Sell or Share Your Data</h2>
                <p className="mb-2">
                    Your privacy is our promise. We do <strong>not</strong> sell, rent, or share your personal data with advertisers,
                    marketers, or third-party companies. Period.
                </p>
                <p>
                    Any data used to improve the app is either encrypted or anonymized and is never used for commercial gain.
                    Our business model is centered on offering a secure and ethical mental wellness platform — not exploiting
                    your data.
                </p>
            </section>

            {/* Section 5: Your Control */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">5. You Control Your Data</h2>
                <p className="mb-2">
                    We believe your journal is your space. You can view, edit, export, or permanently delete your entries at any
                    time through your account settings.
                </p>
                <p>
                    You can also manage your mood tracking and AI feature preferences with full transparency. We strive to give
                    you the tools and settings to use the app in a way that feels safe and respectful of your mental space.
                </p>
            </section>

            {/* Contact */}
            <p className="text-sm text-gray-500 mt-12">
                If you have questions, feedback, or privacy concerns, please reach out to us at <a href="mailto:echo.space25@gmail.com">echo.space25@gmail.com</a>.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
