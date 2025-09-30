import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { audioManager, type MusicTrack } from '@/lib/audioManager'

interface AudioControlsProps {
  isCompact?: boolean
  className?: string
}

export function AudioControls({ isCompact = false, className = '' }: AudioControlsProps) {
  const [settings, setSettings] = useState(audioManager.getSettings())
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Update settings when they change
    const updateSettings = () => {
      setSettings(audioManager.getSettings())
    }

    // Initialize audio on first user interaction
    const initializeAudio = async () => {
      if (!isInitialized) {
        await audioManager.initialize()
        setIsInitialized(true)
        updateSettings()
      }
    }

    // Auto-initialize on component mount
    initializeAudio()

    // Listen for settings changes (if we add event system)
    const interval = setInterval(updateSettings, 1000)
    
    return () => clearInterval(interval)
  }, [isInitialized])

  const handleMasterVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value)
    audioManager.setMasterVolume(volume)
    setSettings(audioManager.getSettings())
  }

  const handleMusicVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value)
    audioManager.setMusicVolume(volume)
    setSettings(audioManager.getSettings())
  }

  const handleSfxVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value)
    audioManager.setSfxVolume(volume)
    setSettings(audioManager.getSettings())
  }

  const handleToggleMusic = () => {
    audioManager.toggleMusic()
    setSettings(audioManager.getSettings())
  }

  const handleToggleSfx = () => {
    audioManager.toggleSfx()
    setSettings(audioManager.getSettings())
  }

  const handleTrackChange = (track: MusicTrack) => {
    audioManager.playMusic(track)
    setSettings(audioManager.getSettings())
  }

  const handleTestSound = () => {
    audioManager.playSound('ding')
  }

  const musicTracks: { id: MusicTrack; name: string; description: string }[] = [
    { id: 'lofi', name: '🎵 Lo-Fi', description: 'Chill beats for focused trading' },
    { id: 'tradingFloor', name: '📈 Trading Floor', description: 'Professional trading ambience' },
    { id: 'upbeat', name: '⚡ Upbeat', description: 'Energetic trading vibes' },
    { id: 'ambient', name: '🌊 Ambient', description: 'Calm background sounds' },
  ]

  if (isCompact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant={settings.musicEnabled ? 'default' : 'ghost'}
          size="sm"
          onClick={handleToggleMusic}
          className="text-xs"
        >
          {settings.musicEnabled ? '🎵' : '🔇'}
        </Button>
        <Button
          variant={settings.sfxEnabled ? 'default' : 'ghost'}
          size="sm"
          onClick={handleToggleSfx}
          className="text-xs"
        >
          {settings.sfxEnabled ? '🔊' : '🔇'}
        </Button>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-handwrite flex items-center gap-2">
          🎵 Audio Settings
          {!isInitialized && (
            <span className="text-xs text-muted-foreground">(Click to activate)</span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Master Volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">🔊 Master Volume</label>
            <span className="text-xs text-muted-foreground">
              {Math.round(settings.masterVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.masterVolume}
            onChange={handleMasterVolumeChange}
            className="w-full h-2 bg-grid-blue rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Music Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">🎵 Background Music</span>
            <Button
              variant={settings.musicEnabled ? 'default' : 'ghost'}
              size="sm"
              onClick={handleToggleMusic}
            >
              {settings.musicEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          {settings.musicEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground">Music Volume</label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(settings.musicVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.musicVolume}
                  onChange={handleMusicVolumeChange}
                  className="w-full h-2 bg-grid-blue rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Track Selection</label>
                <div className="grid grid-cols-2 gap-2">
                  {musicTracks.map((track) => (
                    <Button
                      key={track.id}
                      variant={settings.currentTrack === track.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTrackChange(track.id)}
                      className="text-xs p-2 h-auto flex flex-col items-start"
                      title={track.description}
                    >
                      <span className="font-medium">{track.name}</span>
                      <span className="text-xs opacity-70">{track.description}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sound Effects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">🔊 Sound Effects</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestSound}
                disabled={!settings.sfxEnabled}
                className="text-xs"
              >
                Test
              </Button>
              <Button
                variant={settings.sfxEnabled ? 'default' : 'ghost'}
                size="sm"
                onClick={handleToggleSfx}
              >
                {settings.sfxEnabled ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
          
          {settings.sfxEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">SFX Volume</label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sfxVolume}
                onChange={handleSfxVolumeChange}
                className="w-full h-2 bg-grid-blue rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
        </div>

        {/* Audio Context Info */}
        <div className="text-xs text-muted-foreground bg-muted-lilac/10 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <span>🎧 Audio Status:</span>
            <span className={isInitialized ? 'text-finance-green' : 'text-coral-red'}>
              {isInitialized ? 'Active' : 'Click anywhere to activate'}
            </span>
          </div>
          <p>
            BullSheet uses immersive audio to enhance your trading experience. 
            Background music helps maintain focus while sound effects provide 
            satisfying feedback for your actions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-grid-blue">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              audioManager.playSound('success')
              audioManager.playSound('cashRegister', 0.5)
            }}
            disabled={!settings.sfxEnabled}
            className="text-xs flex-1"
          >
            💰 Profit Sound
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              audioManager.playSound('trade')
              audioManager.playSound('ding', 0.3)
            }}
            disabled={!settings.sfxEnabled}
            className="text-xs flex-1"
          >
            📈 Trade Sound
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}