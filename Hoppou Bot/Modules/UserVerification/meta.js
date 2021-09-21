module.exports = {
    name: 'User Verification',
    events: [
        'NewcomerSystemJoinHandler',
        'NewcomerSystemLeaveHandler',
        'NewcomerSystemManualHandler',
        'Startup',
    ],
    buttons: [
        'NewcomerButtonHandler',
    ],
};