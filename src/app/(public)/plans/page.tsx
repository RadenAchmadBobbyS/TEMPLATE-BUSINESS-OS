import Link from 'next/link';
import { ArrowRight, Check, X, HelpCircle } from 'lucide-react';
import { PLAN_LIMITS } from '@/core/billing/plans.config';
import { GridBackdrop, CornerMarks } from '@/shared/ui/blueprint';
import { SubscriptionTier } from '@prisma/client';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${bytes} B`;
}
function formatNum(n: number): string {
  if (n >= 999999) return 'Unlimited';
  return n.toLocaleString();
}

// ─── Plan definitions (display metadata only) ─────────────────────────────────
const TIERS: { id: SubscriptionTier; name: string; price: string; monthly: string; highlight: boolean; badge?: string; description: string }[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: '$0',
    monthly: 'forever',
    highlight: false,
    description: 'Explore Business OS and build your first website at no cost.',
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: '$15',
    monthly: '/ month',
    highlight: false,
    description: 'For freelancers and small projects that need a custom domain.',
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: '$49',
    monthly: '/ month',
    highlight: true,
    badge: 'Most Popular',
    description: 'The complete toolkit for growing businesses and teams.',
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    price: '$199',
    monthly: '/ month',
    highlight: false,
    description: 'High-volume agencies managing multiple client websites.',
  },
];

// ─── Feature rows for comparison ─────────────────────────────────────────────
type FeatureDef = {
  label: string;
  key: keyof (typeof PLAN_LIMITS)[SubscriptionTier];
  type: 'bool' | 'string';
  getValue?: (tier: SubscriptionTier) => string;
};

const FEATURE_ROWS: FeatureDef[] = [
  { label: 'Websites', key: 'maxWebsites', type: 'string', getValue: (t) => formatNum(PLAN_LIMITS[t].maxWebsites) },
  { label: 'Pages per website', key: 'maxPagesPerWebsite', type: 'string', getValue: (t) => formatNum(PLAN_LIMITS[t].maxPagesPerWebsite) },
  { label: 'Storage', key: 'maxStorageBytes', type: 'string', getValue: (t) => formatBytes(PLAN_LIMITS[t].maxStorageBytes) },
  { label: 'Team members', key: 'maxTeamMembers', type: 'string', getValue: (t) => formatNum(PLAN_LIMITS[t].maxTeamMembers) },
  { label: 'Custom domains', key: 'maxCustomDomainsPerWebsite', type: 'string', getValue: (t) => formatNum(PLAN_LIMITS[t].maxCustomDomainsPerWebsite) },
  { label: 'Form builder', key: 'hasFormBuilder', type: 'bool' },
  { label: 'Advanced media', key: 'hasAdvancedMedia', type: 'bool' },
  { label: 'Role-based access', key: 'hasRoleBasedAccess', type: 'bool' },
  { label: 'Advanced SEO tools', key: 'hasAdvancedSeo', type: 'bool' },
  { label: 'Advanced analytics', key: 'hasAdvancedAnalytics', type: 'bool' },
  { label: 'White labeling', key: 'hasWhiteLabeling', type: 'bool' },
  { label: 'Dedicated support', key: 'hasDedicatedSupport', type: 'bool' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Can I start for free?',
    a: 'Yes. The Free plan lets you build one website with up to 5 pages and 100MB storage — no credit card required.',
  },
  {
    q: 'Can I upgrade or downgrade at any time?',
    a: 'Yes. You can change your plan at any time from your workspace billing settings. Changes take effect immediately.',
  },
  {
    q: 'What happens to my websites if I downgrade?',
    a: 'Your websites and data are always preserved. If you exceed the limits of your new plan, some features may become read-only until you upgrade again.',
  },
  {
    q: 'Do you offer annual pricing?',
    a: 'Yes. Annual billing is available and offers a discount compared to month-to-month pricing. You can switch billing cycles from your account settings.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <span
      className="mx-auto flex h-5 w-5 items-center justify-center"
      style={{ backgroundColor: 'color-mix(in srgb, var(--signal) 12%, transparent)' }}
    >
      <Check className="h-3 w-3" style={{ color: 'var(--signal)' }} />
    </span>
  ) : (
    <span
      className="mx-auto flex h-5 w-5 items-center justify-center"
      style={{ backgroundColor: 'color-mix(in srgb, var(--slate) 10%, transparent)' }}
    >
      <X className="h-3 w-3" style={{ color: 'var(--slate)' }} />
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlansPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2" style={{ borderColor: 'var(--ink)' }}>
        <GridBackdrop className="opacity-[0.3]" />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 text-center">
          <span
            className="font-data mb-4 inline-flex items-center gap-2 text-xs"
            style={{ color: 'var(--signal)' }}
          >
            <span className="h-1.5 w-1.5" style={{ backgroundColor: 'var(--amber)' }} />
            PRICING
          </span>
          <h1
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6"
            style={{ color: 'var(--ink)' }}
          >
            Plans that scale with you
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--slate)' }}>
            Transparent pricing — no hidden fees. Start free and upgrade as your business grows.
          </p>
        </div>
      </section>

      {/* ── Pricing cards ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => {
            const limits = PLAN_LIMITS[tier.id];
            return (
              <div
                key={tier.id}
                className="relative flex flex-col border-2"
                style={{
                  borderColor: tier.highlight ? 'var(--signal)' : 'var(--ink)',
                  backgroundColor: 'var(--paper)',
                  boxShadow: tier.highlight ? '4px 4px 0 var(--signal)' : '4px 4px 0 var(--ink)',
                }}
              >
                <CornerMarks />

                {tier.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold font-data whitespace-nowrap"
                    style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                  >
                    {tier.badge}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Plan name + price */}
                  <div className="mb-6">
                    <h2
                      className="font-display text-xl font-bold mb-1"
                      style={{ color: 'var(--ink)' }}
                    >
                      {tier.name}
                    </h2>
                    <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>
                      {tier.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-extrabold" style={{ color: 'var(--ink)' }}>
                        {tier.price}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--slate)' }}>
                        {tier.monthly}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/register"
                    className="mb-8 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border-2 transition-transform hover:-translate-y-0.5"
                    style={
                      tier.highlight
                        ? { backgroundColor: 'var(--signal)', borderColor: 'var(--signal)', color: '#fff' }
                        : { backgroundColor: 'transparent', borderColor: 'var(--ink)', color: 'var(--ink)' }
                    }
                  >
                    Get Started <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  {/* Key limits */}
                  <div className="space-y-3 text-sm border-t-2 pt-6 flex-1" style={{ borderColor: 'var(--line)' }}>
                    {[
                      { label: 'Websites', value: formatNum(limits.maxWebsites) },
                      { label: 'Pages / site', value: formatNum(limits.maxPagesPerWebsite) },
                      { label: 'Storage', value: formatBytes(limits.maxStorageBytes) },
                      { label: 'Team members', value: formatNum(limits.maxTeamMembers) },
                      { label: 'Custom domains', value: formatNum(limits.maxCustomDomainsPerWebsite) },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center"
                      >
                        <span style={{ color: 'var(--slate)' }}>{label}</span>
                        <span className="font-semibold" style={{ color: 'var(--ink)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Feature comparison table ──────────────────────────────────── */}
        <div className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-8" style={{ color: 'var(--ink)' }}>
            Full feature comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    className="py-3 px-4 text-left font-data text-xs uppercase border-b-2"
                    style={{ borderColor: 'var(--ink)', color: 'var(--slate)' }}
                  >
                    Feature
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.id}
                      className="py-3 px-4 text-center font-display font-bold border-b-2"
                      style={{
                        borderColor: 'var(--ink)',
                        color: t.highlight ? 'var(--signal)' : 'var(--ink)',
                      }}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, idx) => (
                  <tr
                    key={row.key}
                    style={{ backgroundColor: idx % 2 === 0 ? 'transparent' : 'color-mix(in srgb, var(--line) 30%, transparent)' }}
                  >
                    <td className="py-3 px-4 border-b" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
                      {row.label}
                    </td>
                    {TIERS.map((t) => {
                      const val = PLAN_LIMITS[t.id][row.key];
                      return (
                        <td
                          key={t.id}
                          className="py-3 px-4 text-center border-b"
                          style={{ borderColor: 'var(--line)' }}
                        >
                          {row.type === 'bool' ? (
                            <BoolCell value={val as boolean} />
                          ) : (
                            <span style={{ color: 'var(--ink)' }}>
                              {row.getValue?.(t.id) ?? String(val)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div className="mt-20">
          <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <HelpCircle className="h-6 w-6" style={{ color: 'var(--slate)' }} />
            Frequently asked questions
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="border-2 p-6"
                style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)' }}
              >
                <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--ink)' }}>
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="border-t-2 py-20"
        style={{ borderColor: 'var(--ink)', backgroundColor: 'var(--ink)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-display text-3xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--paper)' }}
          >
            Start building for free
          </h2>
          <p
            className="mb-8 text-base max-w-md mx-auto"
            style={{ color: 'color-mix(in srgb, var(--paper) 70%, transparent)' }}
          >
            No credit card required. Upgrade whenever you're ready.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium border-2 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'color-mix(in srgb, var(--paper) 30%, transparent)', color: 'color-mix(in srgb, var(--paper) 80%, transparent)' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
