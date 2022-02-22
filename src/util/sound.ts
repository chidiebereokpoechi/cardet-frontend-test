import { Howl, Howler } from "howler";
import { action, autorun, observable } from "mobx";
import { LocalStorageUtil } from "./storage";

const SOUND_MUTED_KEY = "CARDET:SOUND_MUTED";

class SoundManager {
  private card_select: Howl;
  private pick_cards: Howl;
  private game_over: Howl;
  private background_music: Howl;

  @observable
  public muted: boolean;

  constructor() {
    const muted = LocalStorageUtil.extract<boolean>(SOUND_MUTED_KEY);
    this.muted = !!muted;

    this.card_select = new Howl({
      src: "/audio/card-select.wav",
      format: ["wav"],
      preload: true,
      html5: true,
    });

    this.pick_cards = new Howl({
      src: "/audio/pick-cards.wav",
      format: ["wav"],
      preload: true,
      html5: true,
    });

    this.game_over = new Howl({
      src: "/audio/game-over.wav",
      format: ["wav"],
      preload: true,
      html5: true,
    });

    this.background_music = new Howl({
      src: "/audio/game-background.mp3",
      format: ["mp3"],
      volume: 0.1,
      loop: true,
      preload: true,
    });
  }

  @action
  public mute() {
    this.muted = true;
  }

  @action
  public unMute() {
    this.muted = false;
  }

  public selectCard() {
    this.card_select.play();
  }

  public pickCards() {
    this.pick_cards.play();
  }

  public startGameOver() {
    this.game_over.play();
  }

  public stopGameOver() {
    this.game_over.stop();
  }

  public startBackgroundMusic() {
    this.background_music.play();
  }

  public stopBackgroundMusic() {
    this.background_music.stop();
  }

  public punch() {
    const punch = new Howl({
      src: "/audio/punch.wav",
      format: ["wav"],
      preload: true,
    });

    punch.play();
  }
}

export const sound_manager = new SoundManager();

autorun(() => {
  Howler.mute(sound_manager.muted);
  LocalStorageUtil.save(SOUND_MUTED_KEY, sound_manager.muted);
});
