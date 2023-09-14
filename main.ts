let confirmed = false
let isCloseEnough = false
let currentStrength = 0
let movingAverageStrength = 0 // for smoothing out readings
const NUM_READINGS = 10 // number of readings to average
let readings: number[] = []
for (let i = 0; i < NUM_READINGS; i++) {
    readings.push(0)
}
let readIndex = 0
let total = 0
let average = 0

// Calibration Phase
let calibrationValue = 0
const BUFFER = 10
radio.setGroup(1)

for (let index = 0; index < 5; index++) {
    radio.sendString("Calibrate")
    calibrationValue += radio.receivedPacket(RadioPacketProperty.SignalStrength)
    basic.pause(100)
}
calibrationValue /= 5
const SOME_THRESHOLD = calibrationValue + BUFFER

radio.onReceivedString(function (receivedString) {
    currentStrength = radio.receivedPacket(RadioPacketProperty.SignalStrength)

    // Compute moving average
    total -= readings[readIndex]
    readings[readIndex] = currentStrength
    total += readings[readIndex]
    readIndex++
    if (readIndex >= NUM_READINGS) {
        readIndex = 0
    }
    average = total / NUM_READINGS
    movingAverageStrength = average

    if (movingAverageStrength > SOME_THRESHOLD) {
        isCloseEnough = true
    } else {
        isCloseEnough = false
    }

    if (receivedString == "ConfirmM3") {
        confirmed = true
    } else if (receivedString == "Reset") {
        confirmed = false
        isCloseEnough = false
        basic.clearScreen()
    } else if (isCloseEnough) {
        radio.sendString("M3Found")
    } else {
        radio.sendString("M3Searching")
    }
})

basic.forever(function () {
    if (confirmed) {
        basic.showIcon(IconNames.Happy)
    } else if (isCloseEnough) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(500)
})
