interface DomainCardProps {
  name: string;
  description: string;
}

export default function DomainCard({ name, description }: DomainCardProps) {
  return (
    <div className="relative flex flex-col rounded-xl border border-light-gray bg-white p-6">
      <span className="absolute left-0 top-0 h-full w-1 rounded-l bg-midnight-navy" aria-hidden="true" />
      <h3 className="font-display text-xl font-semibold text-midnight-navy">{name}</h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-charcoal">{description}</p>
    </div>
  );
}
