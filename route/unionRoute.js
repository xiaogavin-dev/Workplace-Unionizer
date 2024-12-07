const { getUnions, getUserUnions, joinUnion, getUnionPublicChats, leaveUnion, deleteUnion } = require('../controller/unionController')
const { getUnionById } = require('../controller/unionIdController')
const { createUnion } = require('../controller/createUnionController');
const { upload } = require('../controller/uploadController');
const { getWorkplacesByUnionId } = require("../controller/workplaceController");

const router = require('express').Router()

router.route('/getUnions').get(getUnions)

router.route('/getUnion/:id').get(getUnionById);

router.route('/getUserUnions').get(getUserUnions)

router.route('/getUnionPublicChats').get(getUnionPublicChats)

router.route('/joinUnion').post(joinUnion)

router.post('/create', upload.single('image'), createUnion);

router.post('/leaveUnion', leaveUnion)

router.post('/deleteUnion', deleteUnion)

module.exports = router