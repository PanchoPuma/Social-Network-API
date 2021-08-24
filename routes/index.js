const router = require('express').Router();
const APIroutes = require('./api');

router.use('/api', APIroutes);

router.use((req, res) => {
    res.status(404).send('404 Error!');
})

module.exports = router;