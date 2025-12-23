import { Howl, Howler } from 'howler'
import { action, autorun, observable } from 'mobx'
import { LocalStorageUtil } from './storage'

const SOUND_MUTED_KEY = 'CARDET:SOUND_MUTED'

class SoundManager {
    private card_select: Howl
    private pick_cards: Howl
    private game_over: Howl
    private background_music: Howl
    private new_message: Howl

    private stateChange: Howl
    private tickNormal: Howl
    private tickMed: Howl
    private tickFast: Howl

    @observable
    public muted: boolean

    constructor() {
        const muted = LocalStorageUtil.extract<boolean>(SOUND_MUTED_KEY)
        this.muted = !!muted

        this.card_select = new Howl({
            src: '/audio/card-select.wav',
            format: ['wav'],
            preload: true,
            html5: true,
        })

        this.pick_cards = new Howl({
            src: '/audio/pick-cards.wav',
            format: ['wav'],
            preload: true,
            html5: true,
        })

        this.game_over = new Howl({
            src: '/audio/game-over.wav',
            format: ['wav'],
            preload: true,
            html5: true,
        })

        this.background_music = new Howl({
            src: '/audio/game-background.mp3',
            format: ['mp3'],
            volume: 0.1,
            loop: true,
            preload: true,
        })

        this.new_message = new Howl({
            src: '/audio/new-message.wav',
            format: ['wav'],
            preload: true,
            html5: true,
        })

        this.stateChange = new Howl({
            src: '/audio/tick-ten/tick-ten-state-change.mp3',
            format: ['mp3'],
            preload: true,
        })

        this.tickNormal = new Howl({
            src: '/audio/tick-ten/tick-ten-tick-normal.mp3',
            format: ['mp3'],
            preload: true,
        })

        this.tickMed = new Howl({
            src: '/audio/tick-ten/tick-ten-tick-med.mp3',
            format: ['mp3'],
            preload: true,
        })

        this.tickFast = new Howl({
            src: '/audio/tick-ten/tick-ten-tick-fast.mp3',
            format: ['mp3'],
            preload: true,
        })
    }

    @action
    public mute() {
        this.muted = true
    }

    @action
    public unMute() {
        this.muted = false
    }

    public selectCard() {
        this.card_select.play()
    }

    public pickCards() {
        this.pick_cards.play()
    }

    public newMessage() {
        this.new_message.play()
    }

    public startGameOver() {
        this.game_over.play()
    }

    public stopGameOver() {
        this.game_over.stop()
    }

    public startBackgroundMusic() {
        this.background_music.play()
    }

    public stopBackgroundMusic() {
        this.background_music.stop()
    }

    public punch() {
        const punch = new Howl({
            src: '/audio/punch.wav',
            format: ['wav'],
            preload: true,
        })

        punch.play()
    }

    public playStateChange() {
        if (this.muted) {
            return
        }

        this.stateChange.play()
    }

    public playTickNormal() {
        if (this.muted) {
            return
        }

        this.tickNormal.play()
    }

    public playTickMed() {
        if (this.muted) {
            return
        }

        this.tickMed.play()
    }

    public playTickFast() {
        if (this.muted) {
            return
        }

        this.tickFast.play()
    }
}

export const sound_manager = new SoundManager()

autorun(() => {
    Howler.mute(sound_manager.muted)
    LocalStorageUtil.save(SOUND_MUTED_KEY, sound_manager.muted)
})
