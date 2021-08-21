const router = require('express').Router();
const APIroutes = require('./APIroutes/');

router.use('/APIroutes', APIroutes);

router.use((req, res) => {
    res.status(404).send('404 Error!');
})

module.exports = router;