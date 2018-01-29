require('dotenv').load()
const rp = require('request-promise')
const Controller = require('./Controller')('users')
const Model = require(`../models/faces.model`)
const encryption = require('../encryption')
const jwt = require('jsonwebtoken')

const getAndProcessImages = require('../static/getAndProcessImages')

class FaceController extends Controller {
    static async instagram(req, res, next){
        const username = req.params.username
        getAndProcessImages.getImages(username) //this function calls the model
        next({ status: 200, message: `Request submitted.  We're working on it!` })
    }

    static async google(req, res, next){ //&imgType=face
        const searchURL = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&searchType=image&cx=${process.env.GOOGLE_API_ID}&q=dancovill`
        const oneThrough10 = rp(`${searchURL}&start=1`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return JSON.parse(body)
             } 
        })
        // const elevenThrough20 = rp(`${searchURL}&start=1`, function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //         return JSON.parse(body)
        //      }
        // })
        // const twentyoneThrough30 = rp(`${searchURL}&start=1`, function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //         return JSON.parse(body)
        //      }
        // })
        Promise.all([oneThrough10]).then(searchResults => {
            let results = searchResults[0] //for some reason, cannot concat items arrays together
            res.send(results)
        })
        
    }
}

module.exports = FaceController

// {  example response for 'dancovill'
//  "kind": "customsearch#search",
//  "url": {
//   "type": "application/json",
//   "template": "https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"
//  },
//  "queries": {
//   "request": [
//    {
//     "title": "Google Custom Search - dancovill",
//     "totalResults": "6150",
//     "searchTerms": "dancovill",
//     "count": 10,
//     "startIndex": 1,
//     "inputEncoding": "utf8",
//     "outputEncoding": "utf8",
//     "safe": "off",
//     "cx": "002661409832768738308:guqyp6peuce",
//     "searchType": "image"
//    }
//   ],
//   "nextPage": [
//    {
//     "title": "Google Custom Search - dancovill",
//     "totalResults": "6150",
//     "searchTerms": "dancovill",
//     "count": 10,
//     "startIndex": 11,
//     "inputEncoding": "utf8",
//     "outputEncoding": "utf8",
//     "safe": "off",
//     "cx": "002661409832768738308:guqyp6peuce",
//     "searchType": "image"
//    }
//   ]
//  },
//  "context": {
//   "title": "StalkernetImages"
//  },
//  "searchInformation": {
//   "searchTime": 0.116549,
//   "formattedSearchTime": "0.12",
//   "totalResults": "6150",
//   "formattedTotalResults": "6,150"
//  },
//  "items": [
//   {
//    "kind": "customsearch#result",
//    "title": "Dan Covill (@DanCovill) | Twitter",
//    "htmlTitle": "\u003cb\u003eDan Covill\u003c/b\u003e (@\u003cb\u003eDanCovill\u003c/b\u003e) | Twitter",
//    "link": "https://pbs.twimg.com/media/C1vuOp9UQAAXYqn.jpg",
//    "displayLink": "twitter.com",
//    "snippet": "Dan Covill (@DanCovill) | Twitter",
//    "htmlSnippet": "\u003cb\u003eDan Covill\u003c/b\u003e (@\u003cb\u003eDanCovill\u003c/b\u003e) | Twitter",
//    "mime": "image/jpeg",
//    "image": {
//     "contextLink": "https://twitter.com/dancovill",
//     "height": 837,
//     "width": 1200,
//     "byteSize": 92098,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDO1jP-y9nzAPfP0cHwdnwZILiJHL3Tu8EZhliHII3n8w0IBP6g4bEBfMQ",
//     "thumbnailHeight": 105,
//     "thumbnailWidth": 150
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Crystal Covill - Google+",
//    "htmlTitle": "Crystal Covill - Google+",
//    "link": "https://lh3.googleusercontent.com/proxy/vujL6M9DphG38gJrWFVKz1rqusKo5iskvpf-lotM6-7LnlskX3JNbKxXpvl51n_LXiMS4MvJALKYzM7HEAdz0reKjA=w530-h297-n",
//    "displayLink": "plus.google.com",
//    "snippet": "Crystal Covill - Google+",
//    "htmlSnippet": "Crystal Covill - Google+",
//    "mime": "image/",
//    "image": {
//     "contextLink": "https://plus.google.com/105672423911449057733",
//     "height": 297,
//     "width": 530,
//     "byteSize": 19494,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCWeo9dX6i9gP685GZ1dob0K0JLoIVWyKHQ3EbZdrbwkbBVbHNMLQJ7Y4",
//     "thumbnailHeight": 74,
//     "thumbnailWidth": 132
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Dan Covill (@OutlawDan1) | Twitter",
//    "htmlTitle": "\u003cb\u003eDan Covill\u003c/b\u003e (@OutlawDan1) | Twitter",
//    "link": "https://pbs.twimg.com/profile_images/2702989367/d8090e6249611cb00424fa7fbef9214a_400x400.jpeg",
//    "displayLink": "twitter.com",
//    "snippet": "Dan Covill (@OutlawDan1) | Twitter",
//    "htmlSnippet": "\u003cb\u003eDan Covill\u003c/b\u003e (@OutlawDan1) | Twitter",
//    "mime": "image/jpeg",
//    "image": {
//     "contextLink": "https://twitter.com/outlawdan1",
//     "height": 400,
//     "width": 400,
//     "byteSize": 41430,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRljPshiB3wtcbfbNgWaALt5Lp6zEnqOc6Av9m2fPfCBFbzP6PuianlqQ",
//     "thumbnailHeight": 124,
//     "thumbnailWidth": 124
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Crystal Covill - Google+",
//    "htmlTitle": "Crystal Covill - Google+",
//    "link": "https://lh3.googleusercontent.com/proxy/BRY1StrqFySqrMy9Ro8_t4pI9wTosCj79sgSOy-t8cc2dtdB_UzoKQSaU0Nv29EKK2G54OiYIi_1kCXOgLLoLb63JQ=w530-h297-n",
//    "displayLink": "plus.google.com",
//    "snippet": "Crystal Covill - Google+",
//    "htmlSnippet": "Crystal Covill - Google+",
//    "mime": "image/",
//    "image": {
//     "contextLink": "https://plus.google.com/105672423911449057733",
//     "height": 297,
//     "width": 530,
//     "byteSize": 27379,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0axNEio8I5e-18c9CR0ci_RkhC37ZEUWWoB2f1LnVtjsey51OBPCAtqpy",
//     "thumbnailHeight": 74,
//     "thumbnailWidth": 132
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Winnie on Twitter: \"@DanCovill @TSA Duct tape will fix that right ...",
//    "htmlTitle": "Winnie on Twitter: &quot;@\u003cb\u003eDanCovill\u003c/b\u003e @TSA Duct tape will fix that right ...",
//    "link": "https://pbs.twimg.com/media/BwAp03UIIAA8Y8n.jpg",
//    "displayLink": "twitter.com",
//    "snippet": "Winnie on Twitter: \"@DanCovill @TSA Duct tape will fix that right ...",
//    "htmlSnippet": "Winnie on Twitter: &quot;@\u003cb\u003eDanCovill\u003c/b\u003e @TSA Duct tape will fix that right ...",
//    "mime": "image/jpeg",
//    "image": {
//     "contextLink": "https://twitter.com/deoxyribozyme/status/504449147265880064",
//     "height": 804,
//     "width": 600,
//     "byteSize": 63967,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMKh4zIDa0tr2YrqoiA-gej4tUSCeDS31RqPKRHpyhNi5SZ0tEPH34khw",
//     "thumbnailHeight": 143,
//     "thumbnailWidth": 107
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Crystal Covill - Google+",
//    "htmlTitle": "Crystal Covill - Google+",
//    "link": "https://lh3.googleusercontent.com/proxy/1VMF1533onwpcugcsdI7c1oX32UUwA52Gif2ln7B_GJ-iC5esZDvdBCcHkuHli-ITcJCxSCuDP6wyLyg7bkXMswIug=w530-h297-n",
//    "displayLink": "plus.google.com",
//    "snippet": "Crystal Covill - Google+",
//    "htmlSnippet": "Crystal Covill - Google+",
//    "mime": "image/",
//    "image": {
//     "contextLink": "https://plus.google.com/105672423911449057733",
//     "height": 297,
//     "width": 530,
//     "byteSize": 44717,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmcPoKqVYEY_NV3z49K4LspF4kFgVknIGBajDp3_gsPkuRllv3LF9kJAtP",
//     "thumbnailHeight": 74,
//     "thumbnailWidth": 132
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Dan Covill (@DanCovill) | Twitter",
//    "htmlTitle": "\u003cb\u003eDan Covill\u003c/b\u003e (@\u003cb\u003eDanCovill\u003c/b\u003e) | Twitter",
//    "link": "https://pbs.twimg.com/profile_images/378800000115474953/d382525f65f49d5f062bdcccb960a48d.jpeg",
//    "displayLink": "twitter.com",
//    "snippet": "Dan Covill (@DanCovill) | Twitter",
//    "htmlSnippet": "\u003cb\u003eDan Covill\u003c/b\u003e (@\u003cb\u003eDanCovill\u003c/b\u003e) | Twitter",
//    "mime": "image/jpeg",
//    "image": {
//     "contextLink": "https://twitter.com/dancovill",
//     "height": 375,
//     "width": 500,
//     "byteSize": 559959,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDcFxFTM0w-fVvcDefRXsQlRKrBWEZEQnITMeHKSyBWx8hKLi8LP9v9yI",
//     "thumbnailHeight": 98,
//     "thumbnailWidth": 130
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Crystal Covill - Google+",
//    "htmlTitle": "Crystal Covill - Google+",
//    "link": "https://lh3.googleusercontent.com/proxy/B7SzwOk0Gc8ZDfE_gNR9iqY-hX-9kH7JEgV9oZgnEukAp3YGaULVK99HODFl-9PzruiZhr-a2svAGsdCQ6nZStiqNQ=w530-h297-n",
//    "displayLink": "plus.google.com",
//    "snippet": "Crystal Covill - Google+",
//    "htmlSnippet": "Crystal Covill - Google+",
//    "mime": "image/",
//    "image": {
//     "contextLink": "https://plus.google.com/105672423911449057733",
//     "height": 297,
//     "width": 530,
//     "byteSize": 25719,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwSPU2kL5w3RcohgYCwSvhV5nk6YePZlHJZveLqPn1dwoWRU7YWjqEEJw",
//     "thumbnailHeight": 74,
//     "thumbnailWidth": 132
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Dan Covill (@d_covill) | Twitter",
//    "htmlTitle": "\u003cb\u003eDan Covill\u003c/b\u003e (@d_covill) | Twitter",
//    "link": "https://pbs.twimg.com/profile_images/416998236658741248/zHDJHBRs_400x400.jpeg",
//    "displayLink": "twitter.com",
//    "snippet": "Dan Covill (@d_covill) | Twitter",
//    "htmlSnippet": "\u003cb\u003eDan Covill\u003c/b\u003e (@d_covill) | Twitter",
//    "mime": "image/jpeg",
//    "image": {
//     "contextLink": "https://twitter.com/d_covill",
//     "height": 400,
//     "width": 400,
//     "byteSize": 26831,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy09ICJLr9h9-2_phi6dGMVXTIf96raBDBCbg8WwlvE-U9uVwIUpv6A",
//     "thumbnailHeight": 124,
//     "thumbnailWidth": 124
//    }
//   },
//   {
//    "kind": "customsearch#result",
//    "title": "Crystal Covill - Google+",
//    "htmlTitle": "Crystal Covill - Google+",
//    "link": "https://lh3.googleusercontent.com/proxy/V-nbgY4rSwqb1zfzZDf4ufoTX_0u363FBUdFzZAus9LGxds4akQ-MkByoGWli2RLSvSyFyWODXDFpeomueXVc_-zWA=w530-h297-n",
//    "displayLink": "plus.google.com",
//    "snippet": "Crystal Covill - Google+",
//    "htmlSnippet": "Crystal Covill - Google+",
//    "mime": "image/",
//    "image": {
//     "contextLink": "https://plus.google.com/105672423911449057733",
//     "height": 297,
//     "width": 530,
//     "byteSize": 43885,
//     "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTydyEcblIRpPL1XF9b9CPIef47-nL5QSQFRMJTLZnzt42RYvWTFOOqTD6g",
//     "thumbnailHeight": 74,
//     "thumbnailWidth": 132
//    }
//   }
//  ]
// }
