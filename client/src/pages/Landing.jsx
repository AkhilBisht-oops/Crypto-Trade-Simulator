import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import FeatureWebSocket from '../components/landing/FeatureWebSocket'
import FeatureTradingEngine from '../components/landing/FeatureTradingEngine'
import FeatureLeaderboard from '../components/landing/FeatureLeaderboard'
import FeatureStack from '../components/landing/FeatureStack'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="landing-page-wrapper">
      <Header />
      <main>
        <Hero />
        <FeatureWebSocket />
        <FeatureTradingEngine />
        <FeatureLeaderboard />
        <FeatureStack />
      </main>
      <Footer />
    </div>
  )
}
