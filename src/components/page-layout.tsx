import { AiDisclaimer } from "@/components/ai-disclaimer";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function PageLayout({ title, description, children, footer }: PageLayoutProps) {
  return (
    <div className="flex min-h-0 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="flex-1">{children}</div>

      <AiDisclaimer />
      {footer && <div className="mt-auto">{footer}</div>}
    </div>
  );
}
