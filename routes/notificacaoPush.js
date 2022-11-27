const express = require('express');
const router = express.Router();
const pushNotification  = require('../controllers/notification-controller')

const tokens = ["ExponentPushToken[A5KQQwEGE2OfSFUhG7yc6N]"];

router.get('', async (req, res)=>{
    pushNotification.handleNotification(tokens, {
        sound:"default",
        body:"mensagem de teste",
        data:{
            id:2
        }
    })
    return res.status(200).send();
})

module.exports = router;