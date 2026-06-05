import PortfolioSummary from '../components/PortfolioSummary';

export default function Portfolio() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Your Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Monitor your virtual assets, PnL performance, and holdings</p>
      </div>

      <PortfolioSummary />
    </div>
  );
}
