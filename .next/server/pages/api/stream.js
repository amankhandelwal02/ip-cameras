"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/stream";
exports.ids = ["pages/api/stream"];
exports.modules = {

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "(api)/./pages/api/stream.js":
/*!*****************************!*\
  !*** ./pages/api/stream.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction handler(req, res) {\n    const videoPath = \"/Users/ezeejain/Desktop/Lens_View/camera/ip-cameras/output/output.mp4\"; // Update with the path to your video file\n    const videoStat = fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(videoPath);\n    const fileSize = videoStat.size;\n    const range = req.headers.range;\n    if (range) {\n        const parts = range.replace(/bytes=/, \"\").split(\"-\");\n        const start = parseInt(parts[0], 10);\n        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;\n        const chunkSize = end - start + 1;\n        const file = fs__WEBPACK_IMPORTED_MODULE_0___default().createReadStream(videoPath, {\n            start,\n            end\n        });\n        const head = {\n            \"Content-Range\": `bytes ${start}-${end}/${fileSize}`,\n            \"Accept-Ranges\": \"bytes\",\n            \"Content-Length\": chunkSize,\n            \"Content-Type\": \"video/mp4\"\n        };\n        res.writeHead(206, head);\n        file.pipe(res);\n    } else {\n        const head1 = {\n            \"Content-Length\": fileSize,\n            \"Content-Type\": \"video/mp4\"\n        };\n        res.writeHead(200, head1);\n        fs__WEBPACK_IMPORTED_MODULE_0___default().createReadStream(videoPath).pipe(res);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvc3RyZWFtLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQW9CO0FBQ0k7QUFFVCxTQUFTRSxPQUFPLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQ3hDLE1BQU1DLFNBQVMsR0FBRyx1RUFBdUUsRUFBRSwwQ0FBMEM7SUFFckksTUFBTUMsU0FBUyxHQUFHTixrREFBVyxDQUFDSyxTQUFTLENBQUM7SUFDeEMsTUFBTUcsUUFBUSxHQUFHRixTQUFTLENBQUNHLElBQUk7SUFDL0IsTUFBTUMsS0FBSyxHQUFHUCxHQUFHLENBQUNRLE9BQU8sQ0FBQ0QsS0FBSztJQUUvQixJQUFJQSxLQUFLLEVBQUU7UUFDVCxNQUFNRSxLQUFLLEdBQUdGLEtBQUssQ0FBQ0csT0FBTyxXQUFXLEVBQUUsQ0FBQyxDQUFDQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3BELE1BQU1DLEtBQUssR0FBR0MsUUFBUSxDQUFDSixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BDLE1BQU1LLEdBQUcsR0FBR0wsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHSSxRQUFRLENBQUNKLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBR0osUUFBUSxHQUFHLENBQUM7UUFDNUQsTUFBTVUsU0FBUyxHQUFHRCxHQUFHLEdBQUdGLEtBQUssR0FBRyxDQUFDO1FBQ2pDLE1BQU1JLElBQUksR0FBR25CLDBEQUFtQixDQUFDSyxTQUFTLEVBQUU7WUFBRVUsS0FBSztZQUFFRSxHQUFHO1NBQUUsQ0FBQztRQUUzRCxNQUFNSSxJQUFJLEdBQUc7WUFDWCxlQUFlLEVBQUUsQ0FBQyxNQUFNLEVBQUVOLEtBQUssQ0FBQyxDQUFDLEVBQUVFLEdBQUcsQ0FBQyxDQUFDLEVBQUVULFFBQVEsQ0FBQyxDQUFDO1lBQ3BELGVBQWUsRUFBRSxPQUFPO1lBQ3hCLGdCQUFnQixFQUFFVSxTQUFTO1lBQzNCLGNBQWMsRUFBRSxXQUFXO1NBQzVCO1FBRURkLEdBQUcsQ0FBQ2tCLFNBQVMsQ0FBQyxHQUFHLEVBQUVELElBQUksQ0FBQyxDQUFDO1FBQ3pCRixJQUFJLENBQUNJLElBQUksQ0FBQ25CLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLE9BQU87UUFDTCxNQUFNaUIsS0FBSSxHQUFHO1lBQ1gsZ0JBQWdCLEVBQUViLFFBQVE7WUFDMUIsY0FBYyxFQUFFLFdBQVc7U0FDNUI7UUFFREosR0FBRyxDQUFDa0IsU0FBUyxDQUFDLEdBQUcsRUFBRUQsS0FBSSxDQUFDLENBQUM7UUFDekJyQiwwREFBbUIsQ0FBQ0ssU0FBUyxDQUFDLENBQUNrQixJQUFJLENBQUNuQixHQUFHLENBQUMsQ0FBQztJQUMzQyxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2lwLWNhbWVyYXMvLi9wYWdlcy9hcGkvc3RyZWFtLmpzPzZiYTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIGNvbnN0IHZpZGVvUGF0aCA9ICcvVXNlcnMvZXplZWphaW4vRGVza3RvcC9MZW5zX1ZpZXcvY2FtZXJhL2lwLWNhbWVyYXMvb3V0cHV0L291dHB1dC5tcDQnOyAvLyBVcGRhdGUgd2l0aCB0aGUgcGF0aCB0byB5b3VyIHZpZGVvIGZpbGVcblxuICBjb25zdCB2aWRlb1N0YXQgPSBmcy5zdGF0U3luYyh2aWRlb1BhdGgpO1xuICBjb25zdCBmaWxlU2l6ZSA9IHZpZGVvU3RhdC5zaXplO1xuICBjb25zdCByYW5nZSA9IHJlcS5oZWFkZXJzLnJhbmdlO1xuXG4gIGlmIChyYW5nZSkge1xuICAgIGNvbnN0IHBhcnRzID0gcmFuZ2UucmVwbGFjZSgvYnl0ZXM9LywgJycpLnNwbGl0KCctJyk7XG4gICAgY29uc3Qgc3RhcnQgPSBwYXJzZUludChwYXJ0c1swXSwgMTApO1xuICAgIGNvbnN0IGVuZCA9IHBhcnRzWzFdID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSA6IGZpbGVTaXplIC0gMTtcbiAgICBjb25zdCBjaHVua1NpemUgPSBlbmQgLSBzdGFydCArIDE7XG4gICAgY29uc3QgZmlsZSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odmlkZW9QYXRoLCB7IHN0YXJ0LCBlbmQgfSk7XG5cbiAgICBjb25zdCBoZWFkID0ge1xuICAgICAgJ0NvbnRlbnQtUmFuZ2UnOiBgYnl0ZXMgJHtzdGFydH0tJHtlbmR9LyR7ZmlsZVNpemV9YCxcbiAgICAgICdBY2NlcHQtUmFuZ2VzJzogJ2J5dGVzJyxcbiAgICAgICdDb250ZW50LUxlbmd0aCc6IGNodW5rU2l6ZSxcbiAgICAgICdDb250ZW50LVR5cGUnOiAndmlkZW8vbXA0JyxcbiAgICB9O1xuXG4gICAgcmVzLndyaXRlSGVhZCgyMDYsIGhlYWQpO1xuICAgIGZpbGUucGlwZShyZXMpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGhlYWQgPSB7XG4gICAgICAnQ29udGVudC1MZW5ndGgnOiBmaWxlU2l6ZSxcbiAgICAgICdDb250ZW50LVR5cGUnOiAndmlkZW8vbXA0JyxcbiAgICB9O1xuXG4gICAgcmVzLndyaXRlSGVhZCgyMDAsIGhlYWQpO1xuICAgIGZzLmNyZWF0ZVJlYWRTdHJlYW0odmlkZW9QYXRoKS5waXBlKHJlcyk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJmcyIsInBhdGgiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwidmlkZW9QYXRoIiwidmlkZW9TdGF0Iiwic3RhdFN5bmMiLCJmaWxlU2l6ZSIsInNpemUiLCJyYW5nZSIsImhlYWRlcnMiLCJwYXJ0cyIsInJlcGxhY2UiLCJzcGxpdCIsInN0YXJ0IiwicGFyc2VJbnQiLCJlbmQiLCJjaHVua1NpemUiLCJmaWxlIiwiY3JlYXRlUmVhZFN0cmVhbSIsImhlYWQiLCJ3cml0ZUhlYWQiLCJwaXBlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/stream.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/stream.js"));
module.exports = __webpack_exports__;

})();