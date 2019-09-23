var express = require('express');
var router = express.Router();

var moment = require('moment');
const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


// 코스 리뷰 등록, type = 1 
router.post('/course', authUtil.isLoggedin, async (req, res) => {
    const userSelectQuery = 'SELECT userIdx, nickname FROM user WHERE userIdx = ?';
    const courseSelectQuery = 'SELECT * FROM course WHERE courseIdx = ?';

    const userSelectResult = await db.queryParam_Arr(userSelectQuery, [req.decoded.userIdx]);   // 토큰 값 가져오기
    const courseSelectResult = await db.queryParam_Arr(courseSelectQuery, [req.body.courseIdx]);   // 토큰 값 가져오기

    const userIdx = userSelectResult[0].userIdx;
    const nickname = userSelectResult[0].nickname;
    // const courseIdx = courseSelectResult[0].courseIdx;

    if(!userSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
    }else{
        if(!courseSelectResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        } else {
            if(courseSelectResult[0] != null){     // courseIdx가 존재할 경우 INSERT 가능
                const reviewInsertQuery = 'INSERT INTO review (reviewType, userIdx, courseIdx, nickname, createdAt, comment, emotion) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const reviewInsertResult = await db.queryParam_Arr(reviewInsertQuery, 
                    [1, userIdx, courseSelectResult[0].courseIdx, nickname , moment().format('YYYY-MM-DD HH:mm:ss'), req.body.comment, req.body.emotion]);
                    
                    if(!reviewInsertResult){
                        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
                    }else{
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_REVIEW));  // 리뷰 등록 성공
                    }
            } else { // courseIdx가 존재하지 않을 경우
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_COURSE));    // 존재하지 않는 장소입니다
            }
        }
    }
});


// 장소 리뷰 등록, type = 2
router.post('/place', authUtil.isLoggedin, async (req, res) => {
    const userSelectQuery = 'SELECT * FROM user WHERE userIdx = ?';
    const placeSelectQuery = 'SELECT * FROM place WHERE placeIdx = ?';

    const userSelectResult = await db.queryParam_Arr(userSelectQuery, [req.decoded.userIdx]);   // 토큰 값 가져오기
    const placeSelectResult = await db.queryParam_Arr(placeSelectQuery, [req.body.placeIdx]);

    const userIdx = userSelectResult[0].userIdx;
    const nickname = userSelectResult[0].nickname;
    // const placeIdx = placeSelectResult[0].placeIdx;

    if(!userSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
    }else{
        if(!placeSelectResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        } else {
            if(placeSelectResult[0] != null){     // placeIdx가 존재할 경우 INSERT 가능
                const reviewInsertQuery = 'INSERT INTO review (reviewType, userIdx, placeIdx, nickname, createdAt, comment, emotion) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const reviewInsertResult = await db.queryParam_Arr(reviewInsertQuery, 
                    [2, userIdx, placeSelectResult[0].placeIdx, nickname , moment().format('YYYY-MM-DD HH:mm:ss'), req.body.comment, req.body.emotion]);
                    
                    if(!reviewInsertResult){
                        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
                    }else{
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_REVIEW));  // 리뷰 등록 성공
                    }
            } else { // placeIdx가 존재하지 않을 경우
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_PLACE));    // 존재하지 않는 장소입니다
            }
        }
    }
});


module.exports = router;