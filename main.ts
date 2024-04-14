input.onSound(DetectedSound.Loud, function () {
    if (dtc_on) {
        dected_("Microphone:" + music.volume())
    }
})
// start
function dtc_reset () {
    light_OK = pins.analogReadPin(AnalogPin.P3)
    dist_OK = sonar.ping(
    DigitalPin.P2,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
    dtc_on = true
    Sonerie_Active = [
    "Sonar",
    "IR",
    "Light",
    "Microphone",
    "Secoue",
    "Force"
    ]
}
function dected_ (val: string) {
    bluetooth.uartWriteLine("INTRUSION " + val)
    dtc = val.split(":")[0]
    basic.pause(500)
}
function Au_sercours_ (Ahhh: string) {
    dected_(Ahhh)
    music.play(music.createSoundExpression(WaveShape.Square, 2779, 5000, 255, 255, 500, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    music.ringTone(2000)
    music.play(music.createSoundExpression(WaveShape.Noise, 2779, 5000, 255, 255, 5000, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
    music.stopAllSounds()
}
input.onButtonPressed(Button.AB, function () {
    music.stopAllSounds()
    dtc_on = false
    basic.pause(10000)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    dist_OK = sonar.ping(
    DigitalPin.P2,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
    dtc_on = true
})
input.onGesture(Gesture.Shake, function () {
    Au_sercours_("Secoue")
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    dtc_on = false
    music.play(music.stringPlayable("A C - - - - - - ", 200), music.PlaybackMode.UntilDone)
    basic.pause(10000)
    dtc_reset()
    music.play(music.stringPlayable("C A - - - - - - ", 200), music.PlaybackMode.UntilDone)
})
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_1_DOWN) {
        // N
        pins.digitalWritePin(DigitalPin.P6, 1)
        pins.digitalWritePin(DigitalPin.P7, 1)
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.digitalWritePin(DigitalPin.P9, 0)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_2_DOWN) {
        // S
        pins.digitalWritePin(DigitalPin.P6, 0)
        pins.digitalWritePin(DigitalPin.P7, 0)
        pins.digitalWritePin(DigitalPin.P8, 1)
        pins.digitalWritePin(DigitalPin.P9, 1)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_3_DOWN) {
        // O
        pins.digitalWritePin(DigitalPin.P6, 1)
        pins.digitalWritePin(DigitalPin.P7, 1)
        pins.digitalWritePin(DigitalPin.P8, 1)
        pins.digitalWritePin(DigitalPin.P9, 1)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_4_DOWN) {
        // E
        pins.digitalWritePin(DigitalPin.P6, 0)
        pins.digitalWritePin(DigitalPin.P7, 0)
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.digitalWritePin(DigitalPin.P9, 0)
    } else {
        pins.digitalWritePin(DigitalPin.P6, 0)
        pins.digitalWritePin(DigitalPin.P7, 0)
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.digitalWritePin(DigitalPin.P9, 0)
    }
})
input.onGesture(Gesture.ThreeG, function () {
    Au_sercours_("Force:3g")
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    bt_reçu = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)).split(".")
    bluetooth.uartWriteLine("CHECKED: " + bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)))
    if (bt_reçu.indexOf("mus") == 0) {
        music.setVolume(255)
        music.setTempo(100)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Double)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(196, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(294, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(330, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(349, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(392, music.beat(BeatFraction.Breve)), music.PlaybackMode.UntilDone)
    } else if (bt_reçu.indexOf("dtc") == 0) {
        if (bt_reçu.indexOf("on") == 1) {
            dtc_reset()
        } else if (bt_reçu.indexOf("off") == 1) {
            dtc_on = false
        } else if (bt_reçu[1] == "lrt") {
            if (bt_reçu[2] == "on") {
                dtc_reset()
            } else if (bt_reçu[2] == "off") {
                Sonerie_Active = []
            }
        }
    } else if (bt_reçu.indexOf("capt") == 0) {
        if (bt_reçu[1] == "log") {
            bluetooth.uartWriteLine("IR    : " + pins.digitalReadPin(DigitalPin.P12))
            bluetooth.uartWriteLine("Light : " + pins.analogReadPin(AnalogPin.P3))
            bluetooth.uartWriteLine("L-OK  : " + light_OK)
            bluetooth.uartWriteLine("Sonar : " + sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            ))
            bluetooth.uartWriteLine("S-OK  : " + dist_OK)
            bluetooth.uartWriteLine("Volume: " + input.soundLevel())
        } else if (bt_reçu[1] == "Son") {
            bt_capteur = bt_reçu[2]
            if (bt_reçu.indexOf(bt_capteur) == -1) {
                Sonerie_Active.push(bt_capteur)
                bluetooth.uartWriteLine("" + bt_capteur + " ajouté.")
            } else {
                bluetooth.uartWriteLine("" + bt_capteur + " déjà présent.")
            }
        } else if (bt_reçu[1] == "Soff") {
            bt_capteur = bt_reçu[2]
            bt_cache_idx = Sonerie_Active.indexOf(bt_capteur)
            if (bt_cache_idx == -1) {
                bluetooth.uartWriteLine("" + bt_capteur + " non présent.")
            } else {
                Sonerie_Active.removeAt(bt_cache_idx)
                bluetooth.uartWriteLine("" + bt_capteur + " retiré.")
            }
        }
    } else if (bt_reçu[0] == "pins") {
        if (bt_reçu[2] == "on") {
            if (bt_reçu[1] == "6") {
                pins.digitalWritePin(DigitalPin.P6, 1)
            } else if (bt_reçu[1] == "7") {
                pins.digitalWritePin(DigitalPin.P7, 1)
            } else if (bt_reçu[1] == "8") {
                pins.digitalWritePin(DigitalPin.P8, 1)
            } else if (bt_reçu[1] == "9") {
                pins.digitalWritePin(DigitalPin.P9, 1)
            }
        } else if (bt_reçu[2] == "off") {
            if (bt_reçu[1] == "6") {
                pins.digitalWritePin(DigitalPin.P6, 0)
            } else if (bt_reçu[1] == "7") {
                pins.digitalWritePin(DigitalPin.P7, 0)
            } else if (bt_reçu[1] == "8") {
                pins.digitalWritePin(DigitalPin.P8, 0)
            } else if (bt_reçu[1] == "9") {
                pins.digitalWritePin(DigitalPin.P9, 0)
            }
        }
    }
})
// 1; 2 => Ultrasonic Module
// 3 => TEMT6000 Ambient Light Sensor
// 16=> PIR Motion Sensor
// 6~9 => Moteur
// 
let dist = 0
let bt_cache_idx = 0
let bt_capteur = ""
let bt_reçu: string[] = []
let dtc = ""
let light_OK = 0
let dist_OK = 0
let dtc_on = false
let Sonerie_Active: string[] = []
led.enable(false)
pins.digitalWritePin(DigitalPin.P6, 0)
pins.digitalWritePin(DigitalPin.P7, 1)
pins.digitalWritePin(DigitalPin.P8, 0)
pins.digitalWritePin(DigitalPin.P9, 1)
input.setSoundThreshold(SoundThreshold.Loud, 200)
Sonerie_Active = []
dtc_on = false
dist_OK = 0
light_OK = 0
let bt_i = 0
dtc = ""
music.play(music.stringPlayable("E - E - - - - - ", 250), music.PlaybackMode.InBackground)
bluetooth.startUartService()
basic.pause(2000)
dtc_reset()
music.play(music.stringPlayable("E B - - - - - - ", 300), music.PlaybackMode.UntilDone)
loops.everyInterval(10000, function () {
    bt_i += 10
    bluetooth.uartWriteNumber(bt_i)
    bluetooth.uartWriteLine("s started")
})
basic.forever(function () {
    if (dtc_on) {
        if (1 == pins.digitalReadPin(DigitalPin.P12)) {
            dected_("IR")
        } else if (pins.analogReadPin(AnalogPin.P3) < 5 != light_OK < 5) {
            dected_("Light:" + pins.analogReadPin(AnalogPin.P3))
        } else {
            dist = sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            )
            if (dist > 10 && dist < 400 && 10 < Math.abs(dist_OK - dist)) {
                dected_("Sonar")
            }
        }
    }
})
basic.forever(function () {
    if (Sonerie_Active.indexOf(dtc) != -1) {
        dtc = ""
        music.play(music.stringPlayable("C5 A E B E A F C5 ", 350), music.PlaybackMode.UntilDone)
        basic.pause(100)
        if (music.volume() < 25) {
            music.setVolume(music.volume() + 25)
        }
    } else {
        music.setVolume(105)
    }
})
