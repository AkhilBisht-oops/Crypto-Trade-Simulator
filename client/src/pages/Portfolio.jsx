import PortfolioSummary from '../components/PortfolioSummary';

export default function Portfolio() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-white">Your Portfolio</h1>
        <p className="text-dark-400 text-sm mt-1">Monitor your virtual assets, PnL performance, and holdings</p>
      </div>

      <PortfolioSummary />
    </div>
  );
}
