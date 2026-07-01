import ContactForm from "@/components/site/ContactForm";
import LeadForm from "@/components/site/LeadForm";

export const metadata = { title: "Contact | Relationship Life Cycle™" };

export default function ContactPage() {
  return (
    <main className="bg-warm-ivory">
      {/* Hero */}
      <section className="px-6 pt-36 pb-12 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-[36px] font-semibold leading-[1.08] text-midnight-navy sm:text-[44px]">
            How can we help?
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] font-body text-[17px] leading-relaxed text-charcoal">
            Whether you have a question, want to explore the framework, or are ready to work together — you&apos;re in the right place.
          </p>
        </div>
      </section>

      {/* Category cards + form */}
      <section className="px-6 py-8">
        <ContactForm />
      </section>

      {/* Stay Connected */}
      <section className="bg-midnight-navy px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-white">Stay connected.</h2>
          <p className="mx-auto mt-3 max-w-md font-body text-white/85">
            Subscribe for framework updates, new resources, assessment improvements, and professional announcements.
          </p>
          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white p-6 text-left">
            <LeadForm source="newsletter" fields={["name", "email"]} submitLabel="Subscribe" successMessage="You're subscribed — thank you." />
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-body text-charcoal">
            Email: <a href="mailto:info@symmetricly.co" className="text-midnight-navy underline underline-offset-4">info@symmetricly.co</a>
          </p>
          <p className="mt-3 font-body text-sm text-charcoal/60">
            For assessment support, please include your session ID if applicable.
          </p>
        </div>
      </section>
    </main>
  );
}
