def on_sound_loud():
    if dtc_on:
        dected_("Microphone:" + str(music.volume()))
input.on_sound(DetectedSound.LOUD, on_sound_loud)

# start
def dtc_reset():
    global light_OK, dist_OK, dtc_on, Sonerie_Active
    light_OK = pins.analog_read_pin(AnalogPin.P3)
    dist_OK = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)
    dtc_on = True
    Sonerie_Active = ["Sonar", "IR", "Light", "Microphone", "Secoue", "Force"]
def dected_(val: str):
    global dtc
    bluetooth.uart_write_line("INTRUSION " + val)
    dtc = val.split(":")[0]
    basic.pause(500)
def Au_sercours_(Ahhh: str):
    dected_(Ahhh)
    music.play(music.create_sound_expression(WaveShape.SQUARE,
            2779,
            5000,
            255,
            255,
            500,
            SoundExpressionEffect.WARBLE,
            InterpolationCurve.LINEAR),
        music.PlaybackMode.UNTIL_DONE)
    music.ring_tone(2000)
    music.play(music.create_sound_expression(WaveShape.NOISE,
            2779,
            5000,
            255,
            255,
            5000,
            SoundExpressionEffect.WARBLE,
            InterpolationCurve.LOGARITHMIC),
        music.PlaybackMode.UNTIL_DONE)
    music.stop_all_sounds()

def on_button_pressed_ab():
    global dtc_on, dist_OK
    music.stop_all_sounds()
    dtc_on = False
    basic.pause(10000)
    music.play(music.builtin_playable_sound_effect(soundExpression.hello),
        music.PlaybackMode.UNTIL_DONE)
    dist_OK = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)
    dtc_on = True
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_gesture_shake():
    Au_sercours_("Secoue")
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def on_logo_pressed():
    global dtc_on
    dtc_on = False
    music.play(music.string_playable("A C - - - - - - ", 200),
        music.PlaybackMode.UNTIL_DONE)
    basic.pause(10000)
    dtc_reset()
    music.play(music.string_playable("C A - - - - - - ", 200),
        music.PlaybackMode.UNTIL_DONE)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

def on_mes_dpad_controller_id_microbit_evt():
    if control.event_value() == EventBusValue.MES_DPAD_BUTTON_1_DOWN:
        # N
        pins.digital_write_pin(DigitalPin.P6, 1)
        pins.digital_write_pin(DigitalPin.P7, 1)
        pins.digital_write_pin(DigitalPin.P8, 0)
        pins.digital_write_pin(DigitalPin.P9, 0)
    elif control.event_value() == EventBusValue.MES_DPAD_BUTTON_2_DOWN:
        # S
        pins.digital_write_pin(DigitalPin.P6, 0)
        pins.digital_write_pin(DigitalPin.P7, 0)
        pins.digital_write_pin(DigitalPin.P8, 1)
        pins.digital_write_pin(DigitalPin.P9, 1)
    elif control.event_value() == EventBusValue.MES_DPAD_BUTTON_3_DOWN:
        # O
        pins.digital_write_pin(DigitalPin.P6, 1)
        pins.digital_write_pin(DigitalPin.P7, 1)
        pins.digital_write_pin(DigitalPin.P8, 1)
        pins.digital_write_pin(DigitalPin.P9, 1)
    elif control.event_value() == EventBusValue.MES_DPAD_BUTTON_4_DOWN:
        # E
        pins.digital_write_pin(DigitalPin.P6, 0)
        pins.digital_write_pin(DigitalPin.P7, 0)
        pins.digital_write_pin(DigitalPin.P8, 0)
        pins.digital_write_pin(DigitalPin.P9, 0)
    else:
        pins.digital_write_pin(DigitalPin.P6, 0)
        pins.digital_write_pin(DigitalPin.P7, 0)
        pins.digital_write_pin(DigitalPin.P8, 0)
        pins.digital_write_pin(DigitalPin.P9, 0)
control.on_event(EventBusSource.MES_DPAD_CONTROLLER_ID,
    EventBusValue.MICROBIT_EVT_ANY,
    on_mes_dpad_controller_id_microbit_evt)

def on_gesture_three_g():
    Au_sercours_("Force:3g")
input.on_gesture(Gesture.THREE_G, on_gesture_three_g)

def on_uart_data_received():
    global bt_reçu, dtc_on, Sonerie_Active, bt_capteur, bt_cache_idx
    bt_reçu = bluetooth.uart_read_until(serial.delimiters(Delimiters.NEW_LINE)).split(".")
    bluetooth.uart_write_line("CHECKED: " + bluetooth.uart_read_until(serial.delimiters(Delimiters.NEW_LINE)))
    if bt_reçu.index("mus") == 0:
        music.set_volume(255)
        music.set_tempo(100)
        music.play(music.tone_playable(262, music.beat(BeatFraction.DOUBLE)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(196, music.beat(BeatFraction.WHOLE)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(262, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(294, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(330, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(349, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(392, music.beat(BeatFraction.BREVE)),
            music.PlaybackMode.UNTIL_DONE)
    elif bt_reçu.index("dtc") == 0:
        if bt_reçu.index("on") == 1:
            dtc_reset()
        elif bt_reçu.index("off") == 1:
            dtc_on = False
        elif bt_reçu[1] == "lrt":
            if bt_reçu[2] == "on":
                dtc_reset()
            elif bt_reçu[2] == "off":
                Sonerie_Active = []
    elif bt_reçu.index("capt") == 0:
        if bt_reçu[1] == "log":
            bluetooth.uart_write_line("IR    : " + str(pins.digital_read_pin(DigitalPin.P12)))
            bluetooth.uart_write_line("Light : " + str(pins.analog_read_pin(AnalogPin.P3)))
            bluetooth.uart_write_line("L-OK  : " + str(light_OK))
            bluetooth.uart_write_line("Sonar : " + str(sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)))
            bluetooth.uart_write_line("S-OK  : " + str(dist_OK))
            bluetooth.uart_write_line("Volume: " + str(input.sound_level()))
        elif bt_reçu[1] == "Son":
            bt_capteur = bt_reçu[2]
            if bt_reçu.index(bt_capteur) == -1:
                Sonerie_Active.append(bt_capteur)
                bluetooth.uart_write_line("" + bt_capteur + " ajouté.")
            else:
                bluetooth.uart_write_line("" + bt_capteur + " déjà présent.")
        elif bt_reçu[1] == "Soff":
            bt_capteur = bt_reçu[2]
            bt_cache_idx = Sonerie_Active.index(bt_capteur)
            if bt_cache_idx == -1:
                bluetooth.uart_write_line("" + bt_capteur + " non présent.")
            else:
                Sonerie_Active.remove_at(bt_cache_idx)
                bluetooth.uart_write_line("" + bt_capteur + " retiré.")
    elif bt_reçu[0] == "pins":
        if bt_reçu[2] == "on":
            if bt_reçu[1] == "6":
                pins.digital_write_pin(DigitalPin.P6, 1)
            elif bt_reçu[1] == "7":
                pins.digital_write_pin(DigitalPin.P7, 1)
            elif bt_reçu[1] == "8":
                pins.digital_write_pin(DigitalPin.P8, 1)
            elif bt_reçu[1] == "9":
                pins.digital_write_pin(DigitalPin.P9, 1)
        elif bt_reçu[2] == "off":
            if bt_reçu[1] == "6":
                pins.digital_write_pin(DigitalPin.P6, 0)
            elif bt_reçu[1] == "7":
                pins.digital_write_pin(DigitalPin.P7, 0)
            elif bt_reçu[1] == "8":
                pins.digital_write_pin(DigitalPin.P8, 0)
            elif bt_reçu[1] == "9":
                pins.digital_write_pin(DigitalPin.P9, 0)
bluetooth.on_uart_data_received(serial.delimiters(Delimiters.NEW_LINE),
    on_uart_data_received)

# 1; 2 => Ultrasonic Module
# 3 => TEMT6000 Ambient Light Sensor
# 16=> PIR Motion Sensor
# 6~9 => Moteur
# 
dist = 0
bt_cache_idx = 0
bt_capteur = ""
bt_reçu: List[str] = []
dtc = ""
light_OK = 0
dist_OK = 0
dtc_on = False
Sonerie_Active: List[str] = []
led.enable(False)
pins.digital_write_pin(DigitalPin.P6, 0)
pins.digital_write_pin(DigitalPin.P7, 1)
pins.digital_write_pin(DigitalPin.P8, 0)
pins.digital_write_pin(DigitalPin.P9, 1)
input.set_sound_threshold(SoundThreshold.LOUD, 200)
Sonerie_Active = []
dtc_on = False
dist_OK = 0
light_OK = 0
bt_i = 0
dtc = ""
music.play(music.string_playable("E - E - - - - - ", 250),
    music.PlaybackMode.IN_BACKGROUND)
bluetooth.start_uart_service()
basic.pause(2000)
dtc_reset()
music.play(music.string_playable("E B - - - - - - ", 300),
    music.PlaybackMode.UNTIL_DONE)

def on_every_interval():
    global bt_i
    bt_i += 10
    bluetooth.uart_write_number(bt_i)
    bluetooth.uart_write_line("s started")
loops.every_interval(10000, on_every_interval)

def on_forever():
    global dist
    if dtc_on:
        if 1 == pins.digital_read_pin(DigitalPin.P12):
            dected_("IR")
        elif pins.analog_read_pin(AnalogPin.P3) < 5 != light_OK < 5:
            dected_("Light:" + str(pins.analog_read_pin(AnalogPin.P3)))
        else:
            dist = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)
            if dist > 10 and dist < 400 and 10 < abs(dist_OK - dist):
                dected_("Sonar")
basic.forever(on_forever)

def on_forever2():
    global dtc
    if Sonerie_Active.index(dtc) != -1:
        dtc = ""
        music.play(music.string_playable("C5 A E B E A F C5 ", 350),
            music.PlaybackMode.UNTIL_DONE)
        basic.pause(100)
        if music.volume() < 25:
            music.set_volume(music.volume() + 25)
    else:
        music.set_volume(105)
basic.forever(on_forever2)
