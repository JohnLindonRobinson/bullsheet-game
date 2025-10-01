import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from '@/contexts/theme-context'
import { Theme, designTokens } from '@/lib/design-tokens'
import { Palette, Sun, Moon, Eye, Monitor, Download, Upload } from 'lucide-react'

interface ThemeCustomizerProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ThemeCustomizer({ isOpen = false, onClose }: ThemeCustomizerProps) {
  const { theme, setTheme, toggleTheme, isHighContrast } = useTheme()
  const [customColors, setCustomColors] = useState({
    primary: '#0891b2',
    success: '#4CAF50',
    danger: '#F44336',
    warning: '#f59e0b'
  })

  if (!isOpen) return null

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as Theme)
  }

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const exportTheme = () => {
    const themeData = {
      theme,
      customColors,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bullsheet-theme-${theme}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string)
        if (themeData.theme) {
          setTheme(themeData.theme)
        }
        if (themeData.customColors) {
          setCustomColors(themeData.customColors)
        }
      } catch (error) {
        console.error('Failed to import theme:', error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-handwrite flex items-center gap-2">
            <Palette className="h-5 w-5" />
            🎨 Theme Customizer
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Theme Selection</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('light')}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Sun className="h-5 w-5" />
                <span>Light</span>
              </Button>
              
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Moon className="h-5 w-5" />
                <span>Dark</span>
              </Button>
              
              <Button
                variant={theme === 'highContrast' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('highContrast')}
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Eye className="h-5 w-5" />
                <span>High Contrast</span>
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={toggleTheme} className="flex-1">
                <Monitor className="h-4 w-4 mr-2" />
                Quick Toggle
              </Button>
            </div>
          </div>

          {/* Color Customization */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Color Customization</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize">
                    {key} Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 rounded border border-input"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-input rounded"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Preview */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="p-4 border border-input rounded-lg space-y-3">
              <div className="flex gap-2">
                <Button size="sm">Primary Button</Button>
                <Button variant="outline" size="sm">Secondary</Button>
                <Button variant="destructive" size="sm">Danger</Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-success/10 text-success rounded">
                  🟢 Success: +$125.50
                </div>
                <div className="p-2 bg-destructive/10 text-destructive rounded">
                  🔴 Loss: -$45.20
                </div>
                <div className="p-2 bg-warning/10 text-warning rounded">
                  ⚠️ Warning Alert
                </div>
              </div>
              
              <div className="p-3 bg-muted rounded">
                <div className="text-sm text-muted-foreground">
                  Sample trading interface with {theme} theme
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Accessibility</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={isHighContrast ? 'default' : 'outline'}
                onClick={() => handleThemeChange('highContrast')}
                className="justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                High Contrast
              </Button>
              
              <Button variant="outline" className="justify-start">
                <span className="text-lg mr-2">A</span>
                Large Text
              </Button>
            </div>
          </div>

          {/* Import/Export */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Theme Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportTheme} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Theme
              </Button>
              
              <label className="flex-1">
                <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Theme
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importTheme}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Design Tokens Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Design System Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Color palette: {Object.keys(designTokens.colors).length} color groups</div>
              <div>• Typography: {Object.keys(designTokens.typography.fontSizes).length} font sizes</div>
              <div>• Spacing: {Object.keys(designTokens.spacing).length} spacing values</div>
              <div>• Current theme: <span className="font-medium capitalize">{theme}</span></div>
              <div>• WCAG compliance: AA level supported</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}