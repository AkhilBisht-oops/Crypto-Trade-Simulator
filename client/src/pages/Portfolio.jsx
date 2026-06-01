import PortfolioSummary from '../components/PortfolioSummary';

export default function Portfolio() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">Your Portfolio</h1>
        <p className="text-textSecondary text-sm mt-1">Monitor your virtual assets, PnL performance, and holdings</p>
      </div>

      <PortfolioSummary />
    </div>
  );
}
