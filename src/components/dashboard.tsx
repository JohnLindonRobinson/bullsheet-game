import { XpBar } from "@/components/ui/xp-bar"
import { OrderTicket } from "@/components/trading/order-ticket"
import { PositionsTable } from "@/components/trading/positions-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Header with XP Bar */}
      <header className="sticky top-0 z-50 border-b border-grid-blue bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold font-handwrite text-paper-blue">
                📊 BullSheet
              </h1>
              <span className="text-sm text-muted-foreground bg-muted-lilac/20 px-2 py-1 rounded-full">
                v0.1 MVP
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                💾 Save Portfolio
              </Button>
              <Button variant="ghost" size="sm">
                ⚙️ Settings
              </Button>
            </div>
          </div>
          
          <XpBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Order Ticket */}
          <div className="lg:col-span-3">
            <OrderTicket />
          </div>

          {/* Center - Chart Area (Placeholder) */}
          <div className="lg:col-span-6">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle className="text-lg font-handwrite">📈 Price Chart</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium mb-2">Chart Coming Soon!</h3>
                  <p className="text-sm">
                    TradingView Lightweight Charts integration will go here
                  </p>
                  <Button variant="outline" className="mt-4">
                    🔌 Connect Data Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - News & Levels */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Challenge */}
            <Card sticky>
              <CardHeader>
                <CardTitle className="text-lg font-handwrite">🎯 Current Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🍎</div>
                    <h4 className="font-medium">Apple Trader</h4>
                    <p className="text-sm text-muted-foreground">
                      Make 3 trades in AAPL stock
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>0/3 trades</span>
                    </div>
                    <div className="w-full bg-grid-blue rounded-full h-2">
                      <div className="bg-finance-green h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    🏆 Reward: 100 XP + Apple Badge
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-handwrite">📰 Market News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-grid-blue rounded-lg bg-paper/50">
                    <div className="flex items-start gap-2">
                      <span className="text-finance-green">📈</span>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">Apple hits new highs</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Strong iPhone sales drive record quarter...
                        </p>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-grid-blue rounded-lg bg-paper/50">
                    <div className="flex items-start gap-2">
                      <span className="text-coral-red">📉</span>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">Tech selloff continues</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          Rising rates pressure growth stocks...
                        </p>
                        <span className="text-xs text-muted-foreground">4 hours ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    📑 View All News
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Positions */}
        <div className="mt-8">
          <PositionsTable />
        </div>
      </main>
    </div>
  )
}