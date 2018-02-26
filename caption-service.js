// The exported functions in this module makes a call to Microsoft Cognitive Service Computer Vision API and return caption
// description if found. Note: you can do more advanced functionalities like checking
// the confidence score of the caption. For more info checkout the API documentation:
// https://www.microsoft.com/cognitive-services/en-us/Computer-Vision-API/documentation/AnalyzeImage

var request = require('request').defaults({
    encoding: null
});

/**
 *  Gets the caption of the image from an image stream
 * @param {stream} stream The stream to an image.
 * @return {Promise} Promise with caption string if succeeded, error otherwise
 */
exports.getCaptionFromStream = function (stream) {
    var apiUrl = process.env.MICROSOFT_VISION_API_ENDPOINT + '/analyze?visualFeatures=Description'
    return new Promise(
        function (resolve, reject) {
            var requestData = {
                url: apiUrl,
                encoding: 'binary',
                json: true,
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.MICROSOFT_VISION_API_KEY,
                    'content-type': 'application/octet-stream'
                }
            };

            stream.pipe(request.post(requestData, function (error, response, body) {
                if (error) {
                    reject(error);
                } else if (response.statusCode !== 200) {
                    reject(body);
                } else {
                    resolve(extractCaption(body));
                }
            }));
        }
    );
};

exports.getFaceFromStream = function (stream) {
    var apiUrl = process.env.MICROSOFT_VISION_API_ENDPOINT + '/analyze?visualFeatures=Faces'
    return new Promise(
        function (resolve, reject) {
            var requestData = {
                url: apiUrl,
                encoding: 'binary',
                json: true,
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.MICROSOFT_VISION_API_KEY,
                    'content-type': 'application/octet-stream'
                }
            };

            stream.pipe(request.post(requestData, function (error, response, body) {
                if (error) {
                    reject(error);
                } else if (response.statusCode !== 200) {
                    reject(body);
                } else {
                    resolve(extractFace(body));
                }
            }));
        }
    );
};

/**
 * Extracts the caption description from the response of the Vision API
 * @param {Object} body Response of the Vision API
 * @return {string} Description if caption found, null otherwise.
 */
function extractCaption(body) {

    if (body && body.description && body.description.captions && body.description.captions.length) {
        return body.description.captions[0].text;
    }

    return null;
};

/**
 * Extracts the face description from the response of the Vision API
 * @param {Object} body Response of the Vision API
 * @return {string} Description if caption found, null otherwise.
 */
function extractFace(body) {
    console.log(body);
    if (body && body.faces && body.faces.length) {
        var msg = "";
        body.faces.forEach(face => {
            msg += "年紀：" + face.age + "，性別：" + face.gender + "\n\n";
        });
        return msg;
    }

    return null;
};