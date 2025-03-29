import React from "react";

const TermsAndConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
            <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-sm text-gray-500 mb-10">Effective Date: 10 March 2025</p>

            {/* Section 1: Agreement */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p>
                    By using [App Name], you agree to be bound by these Terms & Conditions and our Privacy Policy.
                    If you do not agree with any part of these terms, you should discontinue use of the app immediately.
                </p>
            </section>

            {/* Section 2: Usage Guidelines */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">2. Use of the App</h2>
                <p className="mb-2">
                    [App Name] is designed to support journaling, self-reflection, and emotional wellbeing.
                    You agree to use the app only for lawful, personal, and non-commercial purposes.
                </p>
                <p>
                    You must not misuse the app, attempt to breach security, or use automated tools to extract data.
                </p>
            </section>

            {/* Section 3: Account Responsibility */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">3. Account Security</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account credentials.
                    Any activity that occurs under your account is your responsibility. Please notify us immediately if you suspect unauthorized access.
                </p>
            </section>

            {/* Section 4: Content Ownership */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">4. Your Content</h2>
                <p className="mb-2">
                    You retain full ownership of the content you create within the app. We do not claim any rights over your journal entries.
                </p>
                <p>
                    However, by using AI features or mood tracking, you grant us permission to process that specific input
                    temporarily for the purpose of delivering relevant insights or suggestions.
                </p>
            </section>

            {/* Section 5: AI & Data Usage */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">5. AI Features and Mood Data</h2>
                <p className="mb-2">
                    Some features may be powered by AI models. These features may process your inputs in real time but do not
                    retain your personal data or use it for training purposes.
                </p>
                <p>
                    We may use aggregated, anonymized mood data to improve the app or contribute to mental health research.
                </p>
            </section>

            {/* Section 6: Termination */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">6. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your access to the app at any time if we believe you have violated these terms.
                    You may also delete your account and data at any time through your settings.
                </p>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
                <p>
                    [App Name] is provided “as is” without warranties of any kind. We are not liable for any loss, emotional distress,
                    or damage arising from your use of the app. Always consult a mental health professional for clinical support.
                </p>
            </section>

            {/* Section 8: Changes */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">8. Changes to These Terms</h2>
                <p>
                    We may update these Terms & Conditions from time to time. Significant changes will be communicated via the app or email.
                    Continued use of the app after updates implies your acceptance of the new terms.
                </p>
            </section>

            {/* Contact */}
            <p className="text-sm text-gray-500 mt-12">
                If you have questions about these terms, please contact us at <a href="mailto:echo.space25@gmail.com">echo.space25@gmail.com</a>
            </p>
        </div>
    );
};

export default TermsAndConditions;
