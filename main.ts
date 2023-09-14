radio.onReceivedString(function (receivedString) {
    currentStrength = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    if (currentStrength > calibrationValue + 5) {
        isCloseEnough = true
    } else {
        isCloseEnough = false
    }
    if (receivedString == "Confirm3") {
        confirmed = true
    } else if (isCloseEnough) {
        radio.sendString("M3Found")
    } else {
        radio.sendString("M3Searching")
    }
})
let confirmed = false
let isCloseEnough = false
let currentStrength = 0
// Calibration Phase
let calibrationValue = 0
radio.setGroup(1)
for (let index = 0; index < 5; index++) {
    radio.sendString("Calibrate")
    calibrationValue += radio.receivedPacket(RadioPacketProperty.SignalStrength)
    basic.pause(100)
}
calibrationValue /= 5
basic.forever(function () {
    if (confirmed) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(500)
})