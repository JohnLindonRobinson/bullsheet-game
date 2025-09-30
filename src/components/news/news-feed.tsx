import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { News } from "@/types"

export function NewsFeed() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(false)
  
  // Generate sample news data
  const generateSampleNews = (): News[] => {
    const sampleNews = [
      {
        id: '1',
        title: 'Apple announces record iPhone sales',
        summary: 'Strong Q4 performance driven by iPhone 15 series adoption worldwide...',
        url: '#',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        sentiment: 'positive' as const,
        symbols: ['AAPL']
      },
      {
        id: '2',
        title: 'Fed signals potential rate cuts',
        summary: 'Federal Reserve hints at dovish stance amid cooling inflation data...',
        url: '#',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        sentiment: 'positive' as const,
        symbols: ['SPY', 'QQQ']
      },
      {
        id: '3',
        title: 'Tech sector faces headwinds',
        summary: 'Rising bond yields pressure growth stocks as investors rotate to value...',
        url: '#',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        sentiment: 'negative' as const,
        symbols: ['AAPL', 'GOOGL', 'MSFT']
      },
      {
        id: '4',
        title: 'Tesla deliveries beat expectations',
        summary: 'Q4 vehicle deliveries surpass analyst estimates despite production challenges...',
        url: '#',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        sentiment: 'positive' as const,
        symbols: ['TSLA']
      },
      {
        id: '5',
        title: 'Oil prices surge on supply concerns',
        summary: 'Geopolitical tensions drive crude oil futures to multi-month highs...',
        url: '#',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        sentiment: 'neutral' as const,
        symbols: ['XLE', 'USO']
      },
      {
        id: '6',
        title: 'Crypto market shows resilience',
        summary: 'Bitcoin holds above key support levels as institutional adoption continues...',
        url: '#',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        sentiment: 'positive' as const,
        symbols: ['BTC', 'ETH']
      }
    ]
    
    // Randomly shuffle and return subset
    return sampleNews.sort(() => Math.random() - 0.5).slice(0, 4)
  }
  
  useEffect(() => {
    // Load initial news
    setNews(generateSampleNews())
    
    // Simulate new news updates every 30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new news
        const newArticle = generateSampleNews()[0]
        newArticle.id = `news-${Date.now()}`
        newArticle.timestamp = new Date()
        
        setNews(prev => [newArticle, ...prev.slice(0, 3)]) // Keep only 4 articles
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  const getSentimentEmoji = (sentiment: News['sentiment']) => {
    switch (sentiment) {
      case 'positive': return '📈'
      case 'negative': return '📉'
      case 'neutral': return '📊'
      default: return '📰'
    }
  }
  
  const getSentimentColor = (sentiment: News['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-finance-green'
      case 'negative': return 'text-coral-red'
      case 'neutral': return 'text-paper-blue'
      default: return 'text-muted-foreground'
    }
  }
  
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`
    } else {
      return 'Just now'
    }
  }
  
  const refreshNews = () => {
    setLoading(true)
    setTimeout(() => {
      setNews(generateSampleNews())
      setLoading(false)
    }, 1000)
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-handwrite">📰 Market News</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshNews}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.map((article) => (
            <div 
              key={article.id}
              className="p-3 border border-grid-blue rounded-lg bg-paper/50 hover:bg-grid-blue/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <span className={`text-lg ${getSentimentColor(article.sentiment)}`}>
                  {getSentimentEmoji(article.sentiment)}
                </span>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm leading-tight mb-1">
                    {article.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {article.symbols.slice(0, 3).map(symbol => (
                        <span 
                          key={symbol}
                          className="text-xs px-1.5 py-0.5 bg-paper-blue/10 text-paper-blue rounded font-mono"
                        >
                          {symbol}
                        </span>
                      ))}
                      {article.symbols.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{article.symbols.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(article.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full mt-4">
            📑 View All News
          </Button>
        </div>
        
        <div className="mt-4 pt-3 border-t border-grid-blue">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>🔄 Auto-updates every 30s</span>
            <span>📡 Live Demo Feed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}