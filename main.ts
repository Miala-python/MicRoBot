function alert (str: string) {
    if (!(SilenceMode)) {
        music.stopAllSounds()
        music.setVolume(255)
        music.play(music.createSoundExpression(WaveShape.Square, 2739, 1, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    }
    LCD_center_show("ATTENTION:", str)
    bluetooth.uartWriteLine("ALERT: " + str)
}
input.onButtonPressed(Button.B, function () {
    AutoMove = false
    AutoStop = true
    pins.digitalWritePin(DigitalPin.P2, 0)
})
function echoTempi () {
    tempi_cache = pins.analogReadPin(AnalogPin.P10)
    bluetooth.uartWriteNumber(tempi_cache)
    bluetooth.uartWriteLine("°C detected.")
    LCD_center_show("Temperature:", "" + convertToText(tempi_cache) + "°C")
    return tempi_cache
}
function Move (P6: number, P7: number, P8: number, P9: number, dir: number) {
    dir = dir
    pins.digitalWritePin(DigitalPin.P6, P6)
    pins.digitalWritePin(DigitalPin.P7, P7)
    pins.digitalWritePin(DigitalPin.P8, P8)
    pins.digitalWritePin(DigitalPin.P9, P9)
    pins.digitalWritePin(DigitalPin.P2, 1)
}
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_1_DOWN) {
        Move(1, 1, 0, 0, 1)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_2_DOWN) {
        Move(0, 0, 1, 1, 2)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_3_DOWN) {
        Move(1, 1, 1, 1, 3)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_4_DOWN) {
        Move(0, 0, 0, 0, 4)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_A_DOWN) {
        AutoStop = !(AutoStop)
    } else if (control.eventValue() == EventBusValue.MES_DPAD_BUTTON_B_DOWN) {
        AutoMove = !(AutoMove)
        AutoStop = false
    } else {
        if (AutoStop) {
            pins.digitalWritePin(DigitalPin.P2, 0)
        }
    }
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    bt_reçu = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)).split(".")
    bluetooth.uartWriteLine("CHECKED: " + bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine)))
    if (bt_reçu[0] == "mus") {
        music.setVolume(255)
        music.setTempo(100)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Double)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(196, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(294, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(330, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(349, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(392, music.beat(BeatFraction.Breve)), music.PlaybackMode.UntilDone)
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
    } else if (bt_reçu[0] == "tempi") {
        echoTempi()
    } else if (bt_reçu[0] == "capt") {
        bluetooth.uartWriteNumber(pins.digitalReadPin(DigitalPin.P13))
        bluetooth.uartWriteLine(" |- Line track")
    }
})
function LCD_center_show (Y0: string, Y1: string) {
    lcd1602.clear()
    lcd1602.putString(
    Y0,
    Math.floor((16 - Y0.length) / 2),
    0
    )
    lcd1602.putString(
    Y1,
    Math.floor((16 - Y1.length) / 2),
    1
    )
}
// PINS:
// 0 => Libre
// 1 => Libre
// 2 => Relais on/off moteurs
// 3 => Capt. Crash
// 4 (Analog) => Capt. IR Mvmt
// (5 => Boutton)
// 6~9 => Relais moteurs
// 10 (Analog) => Capt. T°C
// (11 => Boutton)
// (12 => Accéssibilité)
// 13 => Capt. Suivi de ligne
// 14 => Sonar Trig.
// 15 => Sonar echo
// 16 => Capt. Obstacle
// 
// 
let bt_reçu: string[] = []
let tempi_cache = 0
let dir = 0
let SilenceMode = false
let AutoMove = false
let AutoStop = false
led.enable(false)
pins.digitalWritePin(DigitalPin.P2, 0)
lcd1602.setAddress(
lcd1602.I2C_ADDR.addr1
)
lcd1602.putString(
"Bienvenue...",
0,
0
)
lcd1602.set_LCD_Show(lcd1602.visibled.visible)
lcd1602.set_backlight(lcd1602.on_off.on)
AutoStop = true
AutoMove = false
SilenceMode = true
let bt_i = 0
dir = 0
bluetooth.startUartService()
basic.pause(1000)
echoTempi()
loops.everyInterval(1000, function () {
    if (pins.digitalReadPin(DigitalPin.P4) == 1) {
        if (!(SilenceMode) && !(music.isSoundPlaying())) {
            music.setVolume(255)
            music.setTempo(100)
            music.play(music.tonePlayable(440, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
        }
        bluetooth.uartWriteLine("Présence IR")
        LCD_center_show("ATTENTION à VOUS", "MicRoBot")
    }
})
loops.everyInterval(10000, function () {
    bt_i += 10
    bluetooth.uartWriteNumber(bt_i)
    bluetooth.uartWriteLine("s started")
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P3) == 1) {
        pins.digitalWritePin(DigitalPin.P2, 0)
        alert("Crash")
    }
    if (dir == 2) {
        if (pins.digitalReadPin(DigitalPin.P16) == 1) {
            pins.digitalWritePin(DigitalPin.P2, 0)
            dir = 0
            alert("Object detected")
        }
    }
})
