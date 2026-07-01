import LeadForm from "@/components/site/LeadForm";

export const metadata = { title: "Contact | Relationship Life Cycle™" };

export default function ContactPage() {
  return (
    <main className="bg-warm-ivory">
      <section className="px-6 pt-36 pb-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] font-body text-lg leading-relaxed text-charcoal">
            Whether you have a question about the framework, want to explore professional applications, or are interested in speaking and consulting, we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-xl">
          <LeadForm
            source="contact_form"
            fields={["name", "email", "message"]}
            inquiryTypeOptions={["General Question", "Speaking Inquiry", "Professional Resources", "Media", "Other"]}
            submitLabel="Send Message"
            successMessage="Thank you — your message has been received. We'll respond soon."
          />
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="rounded-xl border border-light-gray bg-white p-6">
            <p className="font-body text-charcoal">
              Email: <a href="mailto:info@symmetricly.co" className="text-midnight-navy underline underline-offset-4">info@symmetricly.co</a>
            </p>
            <p className="mt-2 font-body text-charcoal">
              Website: <a href="https://joinsymmetricly.com" target="_blank" rel="noopener noreferrer" className="text-midnight-navy underline underline-offset-4">joinsymmetricly.com</a>
            </p>
          </div>
          <p className="mt-4 font-body text-xs text-charcoal/50">
            For assessment support, please include your session ID if applicable.
          </p>
        </div>
      </section>
    </main>
  );
}
